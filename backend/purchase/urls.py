from django.urls import path
from .views import (
    CartView, AddToCartView, RemoveFromCartView,
    CreateOrderView, OrderListView, OrdersByProductView
)

urlpatterns = [
    path('cart/', CartView.as_view(), name='get-cart'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/remove/<int:pk>/', RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('orders/create/', CreateOrderView.as_view(), name='create-order'),
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/by-product/<uuid:product_id>/', OrdersByProductView.as_view(), name='orders-by-product'),
]