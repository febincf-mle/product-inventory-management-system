import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from versatileimagefield.fields import VersatileImageField


class Products(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ProductID = models.BigIntegerField(unique=True)
    ProductCode = models.CharField(max_length=255, unique=True)
    ProductName = models.CharField(max_length=255)
    ProductImage = VersatileImageField(upload_to="uploads/", blank=True, null=True)
    CreatedDate = models.DateTimeField(auto_now_add=True)
    UpdatedDate = models.DateTimeField(blank=True, null=True)
    CreatedUser = models.ForeignKey("auth.User", related_name="user%(class)s_objects", on_delete=models.CASCADE)
    IsFavourite = models.BooleanField(default=False)
    Active = models.BooleanField(default=True)
    HSNCode = models.CharField(max_length=255, blank=True, null=True)
    TotalStock = models.DecimalField(default=0.00, max_digits=20, decimal_places=8, blank=True, null=True)

    Category = models.ForeignKey(
        'Category',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )

    # To match with the frontend.
    featured = models.BooleanField(default=True)
    is_new = models.BooleanField(default=True)
    in_stock = models.BooleanField(default=True)
    rating = models.FloatField(default=4.5)
    review_count = models.IntegerField(default=100)
    discount = models.DecimalField(default=0.00, max_digits=20, decimal_places=2, blank=True, null=True)
    old_price = models.DecimalField(default=0.00, max_digits=20, decimal_places=2, blank=True, null=True)
    price = models.DecimalField(default=0.00, max_digits=20, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = "products_product"
        verbose_name = _("product")
        verbose_name_plural = _("products")
        unique_together = (("ProductCode", "ProductID"),)
        ordering = ("-CreatedDate", "ProductID")

    def __str__(self):
        return self.ProductName
    

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    

class Variant(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ('product', 'name')

    def __str__(self):
        return f"{self.product.ProductName} - {self.name}"


class VariantOption(models.Model):
    variant = models.ForeignKey(Variant, on_delete=models.CASCADE, related_name='options')
    value = models.CharField(max_length=100)

    class Meta:
        unique_together = ('variant', 'value')

    def __str__(self):
        return f"{self.variant.name}: {self.value}"


class ProductVariantCombination(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sku = models.CharField(max_length=100, unique=True)  # unique identifier
    description = models.TextField(null=True, blank=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='variant_combinations')
    options = models.ManyToManyField(VariantOption)
    stock = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        opts = ", ".join([opt.value for opt in self.options.all()])
        return f"{self.product.ProductName} [{opts}]"