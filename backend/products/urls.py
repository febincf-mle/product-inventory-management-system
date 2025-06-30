from django.urls import path
from products.views import (
    ProductListView, ProductDetailView, 
    ProductCombinationsView, ProductVariantCombinationDetailView
)

urlpatterns = [
    path('', ProductListView.as_view(), name="products"),
    path('<uuid:pk>/', ProductDetailView.as_view(), name="product_details"),
    path('<uuid:id>/combinations/', ProductCombinationsView.as_view(), name='product-combinations'),
    path('variant-combinations/<uuid:pk>/', ProductVariantCombinationDetailView.as_view(), name='variant-combination-detail'),
]