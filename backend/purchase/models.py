from django.db import models
from decimal import Decimal
from django.conf import settings
from products.models import *


class Cart(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s Cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey(ProductVariantCombination, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product_variant')
        verbose_name = "Cart Item"

    def __str__(self):
        return f"{self.product_variant} x {self.quantity}"


class Order(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=20, decimal_places=8, default=Decimal('0.00'))
    status = models.CharField(max_length=50, default='Pending')  # Pending, Completed, Cancelled

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_variant = models.ForeignKey(ProductVariantCombination, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255)
    variant_description = models.TextField()  # e.g., "Size: M, Color: Blue"
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=20, decimal_places=8)

    def __str__(self):
        return f"{self.product_name} [{self.variant_description}] x {self.quantity}"