from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from products.models import Products, Variant, VariantOption, ProductVariantCombination


# ---------------------------------------- Serializers for Listing --------------------------------------- #

class ProductListSerializer(ModelSerializer):
    class Meta:
        model = Products
        fields = ['id', 'ProductName', 'TotalStock']


class VariantOptionSerializer(ModelSerializer):
    class Meta:
        model = VariantOption
        fields = ['value']


class VariantSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = Variant
        fields = ['name', 'options']


    def get_options(self, obj):
        return [option.value for option in obj.options.all()]


class ProductDetailSerializer(ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)
    class Meta:
        model = Products
        fields = ['id', 'ProductName', 'variants', 'Active']

# --------------------------------------------- Serializers for Creation --------------------------------------#

class VariantInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    options = serializers.ListField(child=serializers.CharField())


class CombinationInputSerializer(serializers.Serializer):
    sku = serializers.CharField()
    stock = serializers.DecimalField(max_digits=20, decimal_places=8)
    options = serializers.ListField(child=serializers.CharField())


class ProductCreateSerializer(serializers.ModelSerializer):
    variants = VariantInputSerializer(many=True)
    combinations = CombinationInputSerializer(many=True)
    CreatedUser = serializers.CharField()

    class Meta:
        model = Products
        fields = ['ProductName', 'ProductCode', 'ProductID', 'variants', 'combinations', 'CreatedUser']

    def create(self, validated_data):
        variants_data = validated_data.pop("variants")
        combinations_data = validated_data.pop("combinations")
        created_user = User.objects.get(username=validated_data.pop("CreatedUser"))

        product = Products.objects.create(CreatedUser=created_user, **validated_data)

        self._create_variants_and_combinations(product, variants_data, combinations_data)
        return product

    def update(self, instance, validated_data):
        variants_data = validated_data.pop("variants", [])
        combinations_data = validated_data.pop("combinations", [])
        created_user_username = validated_data.pop("CreatedUser", None)

        # Update basic product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if created_user_username:
            user = User.objects.get(username=created_user_username)
            instance.CreatedUser = user

        instance.save()

        # Delete existing variants and combinations (simplest approach)
        instance.variants.all().delete()
        instance.variant_combinations.all().delete()

        self._create_variants_and_combinations(instance, variants_data, combinations_data)

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
                sku=combination['sku'],
                stock=combination['stock']
            )
            for option_value in combination['options']:
                opt_obj = opt_lookup.get(option_value)
                if opt_obj:
                    combo_obj.options.add(opt_obj)