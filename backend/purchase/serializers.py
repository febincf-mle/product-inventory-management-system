from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem
from products.models import ProductVariantCombination


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()
    options = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product_variant', 'product_name', 'product_image', 'options', 'quantity', 'price']

    def get_product_name(self, obj):
        return obj.product_variant.product.ProductName
    
    def get_product_image(self, obj):
        return obj.product_variant.product.ProductImage.url if obj.product_variant.product.ProductImage else None

    def get_options(self, obj):
        return [
            f"{opt.variant.name}: {opt.value}"
            for opt in obj.product_variant.options.select_related('variant').all()
        ]

    def get_price(self, obj):
        return obj.product_variant.product.price


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'items']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'variant_description', 'quantity', 'price_at_purchase']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'total_amount', 'status', 'items']