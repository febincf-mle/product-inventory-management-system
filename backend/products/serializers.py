from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from products.models import Category, Products, Variant, VariantOption, ProductVariantCombination


class ProductListSerializer(ModelSerializer):

    ProductImage = serializers.ImageField(use_url=True)
    Category = serializers.SerializerMethodField()

    class Meta:
        model = Products
        fields = ['id', 'ProductID', 'ProductCode', 'ProductName', 'ProductImage', 'CreatedDate', 
                  'UpdatedDate', 'TotalStock', 'Category', 'is_new', 'in_stock', 'rating', 'discount', 
                  'review_count', 'old_price', 'price']
    
    def get_Category(self, obj):
        if obj.Category:
            return obj.Category.name
        return None

class ProductVariantCombinationSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    options = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariantCombination
        fields = ['id', 'name', 'sku', 'image', 'price', 'options', 'stock', 'created_date']

    def get_name(self, obj):
        return obj.product.ProductName

    def get_price(self, obj):
        return obj.product.price

    def get_image(self, obj):
        request = self.context.get('request')
        image_url = obj.product.ProductImage.url if obj.product.ProductImage else None
        return image_url

    def get_options(self, obj):
        return [
            {
                "name": option.variant.name,
                "value": option.value
            }
            for option in obj.options.select_related('variant').all()
        ]


class VariantInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    options = serializers.ListField(child=serializers.CharField())


class CombinationInputSerializer(serializers.Serializer):
    sku = serializers.CharField()
    stock = serializers.DecimalField(max_digits=20, decimal_places=8)
    options = serializers.ListField(child=serializers.CharField())
    description = serializers.CharField()


class ProductCreateSerializer(serializers.ModelSerializer):

    Category = serializers.CharField()
    variants = serializers.JSONField()
    combinations = serializers.JSONField()

    class Meta:
        model = Products
        fields = ['ProductName', 'ProductID', 'ProductImage', 'ProductCode', 'TotalStock', 'Category',
                  'is_new', 'in_stock', 'rating', 'review_count', 'discount', 'old_price',
                   'price', 'variants', 'combinations']
        
    def validate(self, attrs):
        
        variants_data = attrs.get('variants', [])
        combinations_data = attrs.get('combinations', [])

        if not variants_data:
            raise serializers.ValidationError({"variants": "At least one variant is required."})

        if not combinations_data:
            raise serializers.ValidationError({"combinations": "At least one combination is required."})
        
        # Validate variants
        variant_serializer = VariantInputSerializer(data=variants_data, many=True)
        variant_serializer.is_valid(raise_exception=True)

        # Validate combinations
        combination_serializer = CombinationInputSerializer(data=combinations_data, many=True)
        combination_serializer.is_valid(raise_exception=True)

        return attrs

    def create(self, validated_data):

        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User authentication is required to create a product.")

        variants_data = validated_data.pop("variants", [])
        combinations_data = validated_data.pop("combinations", [])
        category = validated_data.pop("Category")

        try:
            category_obj = Category.objects.filter(name=category).first()
        except Exception as e:
            raise serializers.ValidationError(f"Error creating product: {str(e)}")

        try:
            product = Products.objects.create(CreatedUser=request.user, **validated_data)
            product.Category = category_obj
        except Exception as e:
            raise serializers.ValidationError(f"Error creating product: {str(e)}")

        try:
            self._create_variants_and_combinations(product, variants_data, combinations_data)
        except Exception as e:
            product.delete()  # rollback product if variant creation fails
            raise serializers.ValidationError(f"Error creating variants or combinations: {str(e)}")

        return product

    def update(self, instance, validated_data):

        request = self.context.get('request')

        # Check that only the user who created the product can update
        if instance.CreatedUser != request.user:
            raise serializers.ValidationError("You are not authorized to update this product.")

        variants_data = validated_data.pop("variants", [])
        combinations_data = validated_data.pop("combinations", [])
        category_name = validated_data.pop("Category", None)

        if category_name:
            category_obj = Category.objects.filter(name=category_name).first()
            instance.Category = category_obj

        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        try:
            instance.save()
        except Exception as e:
            raise serializers.ValidationError(f"Error updating product: {str(e)}")

        # Reset old variants/combinations
        try:
            instance.variants.all().delete()
            instance.variant_combinations.all().delete()
            self._create_variants_and_combinations(instance, variants_data, combinations_data)
        except Exception as e:
            raise serializers.ValidationError(f"Error recreating variants/combinations: {str(e)}")

        return instance

    def _create_variants_and_combinations(self, product, variants_data, combinations_data):
        opt_lookup = {}

        for variant in variants_data:
            variant_obj = Variant.objects.create(product=product, name=variant["name"])
            for option in variant['options']:
                opt_obj = VariantOption.objects.create(variant=variant_obj, value=option)
                opt_lookup[option] = opt_obj

        for combination in combinations_data:
            combo_obj = ProductVariantCombination.objects.create(
                product=product,
                description=combination['description'],
                sku=combination['sku'],
                stock=combination['stock']
            )
            for option_value in combination['options']:
                opt_obj = opt_lookup.get(option_value)
                if not opt_obj:
                    raise serializers.ValidationError(f"Invalid option '{option_value}' in combination.")
                combo_obj.options.add(opt_obj)