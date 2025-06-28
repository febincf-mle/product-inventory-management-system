from django.contrib import admin
from .models import Products, Category, ProductVariantCombination, Variant, VariantOption


admin.site.register([Products, Category, ProductVariantCombination, Variant, VariantOption])