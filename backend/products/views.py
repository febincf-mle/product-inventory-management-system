from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from products.models import Products
from products.serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateSerializer,
)

class ProductListView(APIView):
    """
    Handles listing all products and creating a new product.
    """

    def get(self, request, *args, **kwargs):
        """
        GET /api/v1/products/
        Returns a list of all products.

        Response:
            - 200 OK: List of products with limited fields (id, name, total stock).
            - 500 Internal Server Error: If an unexpected error occurs.
        """
        try:
            products = Products.objects.all()
            serializer = ProductListSerializer(products, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "Something went wrong. Try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, *args, **kwargs):
        """
        POST /api/v1/products/
        Creates a new product along with its variants and combinations.

        Request Body: JSON
            {
              "ProductName": "...",
              "ProductCode": "...",
              "ProductID": ...,
              "variants": [...],
              "combinations": [...]
            }

        Response:
            - 201 Created: Product created successfully with full detail.
            - 400 Bad Request: If validation fails.
        """
        serializer = ProductCreateSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            return Response(
                ProductDetailSerializer(product).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    """
    Handles retrieving, updating, or deactivating a specific product.
    """

    def get(self, request, *args, **kwargs):
        """
        GET /api/v1/products/<pk>/
        Retrieves full detail of a product by its primary key (UUID).

        Response:
            - 200 OK: Product detail
            - 404 Not Found: If product doesn't exist
        """
        pk = kwargs.get("pk")
        product = get_object_or_404(Products, pk=pk)
        serializer = ProductDetailSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        """
        PUT /api/v1/products/<pk>/
        Updates an existing product (overwrite-style update).

        Request Body: JSON - Same structure as POST.

        Response:
            - 200 OK: Product updated successfully.
            - 400 Bad Request: If validation fails.
        """
        pk = kwargs.get("pk")
        product = get_object_or_404(Products, pk=pk)
        serializer = ProductCreateSerializer(product, data=request.data)

        if serializer.is_valid():
            updated_product = serializer.save()
            return Response(ProductDetailSerializer(updated_product).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        """
        DELETE /api/v1/products/<pk>/
        Soft-deletes a product by setting `Active = False`.

        Response:
            - 200 OK: Product marked as inactive.
            - 404 Not Found: If product doesn't exist.
        """
        pk = kwargs.get("pk")
        product = get_object_or_404(Products, pk=pk)

        if not product.Active:
            return Response(
                {"message": "Product already inactive."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product.Active = False
        product.save()
        return Response(
            {"message": "Product deactivated successfully."},
            status=status.HTTP_200_OK
        )