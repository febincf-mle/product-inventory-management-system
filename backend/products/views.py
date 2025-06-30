from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from products.models import Products, ProductVariantCombination
from products.paginator import ProductPagination
from products.serializers import (
    ProductListSerializer,
    ProductCreateSerializer,
    ProductVariantCombinationSerializer   
)


class ProductListView(APIView):

    def get_permissions(self):
        """
        Allows unrestricted access to GET requests,
        but requires authentication for POST requests.
        """
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, *args, **kwargs):
        """
        GET /api/v1/products/
        Public endpoint to retrieve a list of products with optional filters, sorting, and pagination.

        Query Parameters:
            - min_price (float): Minimum price
            - max_price (float): Maximum price
            - ratings (str): Comma-separated ratings (e.g., "4.5,5")
            - categories (str): Comma-separated category names (e.g., "Shirts,Pants")
            - sort (str): Sorting field: ['price-low', 'price-high', 'rating', 'newest', 'featured']

        Returns:
            200 OK: Paginated list of filtered products
            500 Server Error: On unexpected error
        """
        try:
            queryset = Products.objects.all()
            print(queryset)

            # --- Filters ---
            min_price = request.query_params.get('min_price')
            max_price = request.query_params.get('max_price')
            ratings = request.query_params.get('ratings')
            categories = request.query_params.get('categories')
            featured = request.query_params.get('featured')

            if featured:
                try:
                    queryset = queryset.filter(featured=True)
                except ValueError:
                    return Response({"error": "Invalid min_price"}, status=status.HTTP_400_BAD_REQUEST)

            if min_price:
                try:
                    queryset = queryset.filter(price__gte=float(min_price))
                except ValueError:
                    return Response({"error": "Invalid min_price"}, status=status.HTTP_400_BAD_REQUEST)

            if max_price:
                try:
                    queryset = queryset.filter(price__lte=float(max_price))
                except ValueError:
                    return Response({"error": "Invalid max_price"}, status=status.HTTP_400_BAD_REQUEST)

            if ratings:
                try:
                    ratings_list = [float(r) for r in ratings.split(',')]
                    threshold = min(ratings_list)
                    queryset = queryset.filter(rating__gte=threshold)
                except ValueError:
                    return Response({"error": "Invalid ratings."}, status=status.HTTP_400_BAD_REQUEST)

            if categories:
                category_list = [name.strip() for name in categories.split(',')]
                queryset = queryset.filter(Category__name__in=category_list)

            # --- Sorting ---
            sort = request.query_params.get('sort')
            sort_map = {
                'price-low': 'price',
                'price-high': '-price',
                'rating': '-rating',
                'newest': '-CreatedDate',
                'featured': '-is_new',
            }
            if sort in sort_map:
                queryset = queryset.order_by(sort_map[sort])

            # --- Pagination ---
            paginator = ProductPagination()
            paginated_qs = paginator.paginate_queryset(queryset, request)
            serializer = ProductListSerializer(paginated_qs, many=True)

            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            # Log the error for internal debugging
            print(f"[ProductListView ERROR]: {e}")
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
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
        serializer = ProductCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            product = serializer.save()
            return Response(
                ProductListSerializer(product).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    permission_classes = [AllowAny]
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
        serializer = ProductListSerializer(product)
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
        serializer = ProductCreateSerializer(product, data=request.data, context={'request': request})

        if serializer.is_valid():
            updated_product = serializer.save()
            return Response(ProductListSerializer(updated_product).data)
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
    

class ProductCombinationsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id):
        try:
            product = Products.objects.get(id=id)
        except Products.DoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

        combinations = ProductVariantCombination.objects.filter(product=product, is_deleted=False).prefetch_related('options')
        serializer = ProductVariantCombinationSerializer(combinations, many=True, context={'request': request})

        return Response({
            'product_id': product.id,
            'product_name': product.ProductName,
            'variants': serializer.data
        })


class ProductVariantCombinationDetailView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = ProductVariantCombination.objects.select_related('product').prefetch_related('options__variant')
    serializer_class = ProductVariantCombinationSerializer

    def get(self, request, *args, **kwargs):
        try:
            variant = self.get_object()
            serializer = self.get_serializer(variant, context={'request': request})

            # Wrap the response with product name
            data = serializer.data
            data["product_name"] = variant.product.ProductName

            return Response(data, status=status.HTTP_200_OK)
        except ProductVariantCombination.DoesNotExist:
            return Response({"detail": "Variant not found."}, status=status.HTTP_404_NOT_FOUND)