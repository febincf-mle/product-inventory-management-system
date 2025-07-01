from decimal import Decimal

from django.db import IntegrityError
from django.db import transaction
from django.utils.dateparse import parse_date

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from products.models import ProductVariantCombination
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer


class CartView(generics.RetrieveAPIView):
    """
    GET /api/v1/cart/
    Requires: JWT authentication

    Returns the current cart and its items for the authenticated user.
    If the cart doesn't exist, it will be created automatically.

    Success Response: 200 OK
    Error Response: 401 Unauthorized (if not authenticated)
    """

    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            cart, _ = Cart.objects.get_or_create(user=self.request.user)
            return cart
        except IntegrityError:
            return Response({
                'detail': 'Cart creation conflict. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AddToCartView(generics.CreateAPIView):
    """
    Add a product variant to the authenticated user's cart.

    Endpoint: POST /api/v1/actions/cart/add/
    Auth Required: Yes (JWT)

    Request Body:
    {
        "product_variant": "<variant_id>",  # UUID of the variant (required)
        "quantity": 2                        # Optional, defaults to 1
    }

    Success: 201 Created
    Error:
        - 400 Bad Request for invalid quantity or stock limit exceeded
        - 404 if variant not found
        - 401 if not authenticated
    """

    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Parse the quantity safely before using in the program.
            quantity = int(request.data.get('quantity', 1))
            if quantity < 1:
                raise ValueError
        except (ValueError, TypeError):
            return Response({'detail': 'Invalid quantity. Must be a positive integer.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Get the variant from the request POST data.
        variant_id = request.data.get('product_variant')
        variant = ProductVariantCombination.objects.filter(id=variant_id).first()
        if not variant:
            return Response({'detail': 'Variant not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Get or create cart and item
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, _ = CartItem.objects.get_or_create(cart=cart, product_variant=variant)

        # Check stock limit before Adding to the cart.
        total_quantity = cart_item.quantity + quantity
        if total_quantity > variant.stock:
            return Response({
                'detail': f'Only {variant.stock} item(s) available in stock.',
                'available_stock': str(variant.stock)
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update and return cart item
        cart_item.quantity = total_quantity
        cart_item.save()
        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)


class RemoveFromCartView(generics.DestroyAPIView):
    """
    Remove one quantity of a cart item or delete it completely if quantity is 1.

    Endpoint: DELETE /api/v1/actions/cart/remove/<pk>/
    Method: DELETE
    Auth Required: Yes (JWT)

    Path Parameter:
        pk (int): ID of the CartItem to remove

    Behavior:
    - If item quantity > 1: decrements the quantity by 1.
    - If item quantity == 1: removes the item from the cart.
    - If item doesn't exist: returns 404.

    Success Response: 204 No Content
    Error Response:
        - 404 if item not found
        - 401 if user not authenticated
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'detail': 'Cart not found.'}, status=status.HTTP_404_NOT_FOUND)

        item = CartItem.objects.filter(cart=cart, id=pk).first()
        if item:
            if item.quantity > 1:
                item.quantity -= 1
                item.save()
            else:
                item.delete()
            return Response({'detail': 'Item removed.'}, status=status.HTTP_204_NO_CONTENT)

        return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)


class CreateOrderView(generics.CreateAPIView):
    """
    POST /api/v1/actions/orders/create/
    Requires JWT Authentication

    Validates:
    - Ensures cart is not empty.
    - Checks stock availability.
    - Deducts stock.
    - Clears cart and creates order.

    Returns:
    - 201 on success
    - 400 if stock is insufficient
    - 404 if cart missing
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({'detail': 'Cart not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not cart.items.exists():
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        # Perform the below operation
        # as a single atomic unit.
        with transaction.atomic():
            # Lock stock rows to prevent race conditions.
            for item in cart.items.select_related('product_variant').select_for_update():
                if item.quantity > item.product_variant.stock:
                    return Response({
                        'detail': f'Not enough stock for {item.product_variant.sku}',
                        'available': str(item.product_variant.stock)
                    }, status=status.HTTP_400_BAD_REQUEST)

            total = Decimal('0.00')
            order = Order.objects.create(user=user)

            for item in cart.items.select_related('product_variant__product'):
                product = item.product_variant.product
                options = ", ".join([
                    f"{opt.variant.name if opt.variant else 'Unknown'}: {opt.value}"
                    for opt in item.product_variant.options.select_related('variant')
                ])
                price = product.price
                total += price * item.quantity

                OrderItem.objects.create(
                    order=order,
                    product_variant=item.product_variant,
                    product_name=product.ProductName,
                    variant_description=options,
                    quantity=item.quantity,
                    price_at_purchase=price
                )

                # Deduct stock
                product.TotalStock -= item.quantity
                item.product_variant.stock -= item.quantity
                item.product_variant.save()
                product.save()

            order.total_amount = total
            order.status = 'Success'
            order.save()
            cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=201)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.filter(user=user)
        params = self.request.query_params

        date_str = params.get('date')
        start_date_str = params.get('start_date')
        end_date_str = params.get('end_date')

        def safe_parse_date(date_str, field_name):
            if not date_str:
                return None
            try:
                parsed_date = parse_date(date_str)
                if not parsed_date:
                    raise ValueError
                return parsed_date
            except ValueError:
                raise ValidationError({field_name: f"Invalid date value '{date_str}'. Expected format: YYYY-MM-DD with a valid date."})

        exact_date = safe_parse_date(date_str, 'date')
        start_date = safe_parse_date(start_date_str, 'start_date')
        end_date = safe_parse_date(end_date_str, 'end_date')

        if exact_date:
            queryset = queryset.filter(created_at__date=exact_date)
        else:
            if start_date:
                queryset = queryset.filter(created_at__date__gte=start_date)
            if end_date:
                queryset = queryset.filter(created_at__date__lte=end_date)

        return queryset.order_by('-created_at')


class OrdersByProductView(generics.ListAPIView):
    """
    GET /api/v1/orders/by-product/<product_id>/
    Returns all orders where the given product is included (across users).

    Path Parameter:
        product_id (UUID): ID of the product to filter by

    Auth: Optional (default: IsAuthenticatedOrReadOnly)

    Success Response: 200 OK
    Error:
        - 404 if product not found
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Order.objects.filter(
            items__product_variant__product__id=product_id
        ).distinct().order_by('-created_at')