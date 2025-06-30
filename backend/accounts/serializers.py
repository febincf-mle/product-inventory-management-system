from django.contrib.auth.models import User
from rest_framework import serializers

from purchase.models import Cart


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        Cart.objects.create(user=user)  # Auto-create cart
        return user