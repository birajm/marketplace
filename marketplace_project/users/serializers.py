from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import VendorProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_vendor', 'is_customer')
        read_only_fields = ('is_vendor', 'is_customer')

class VendorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    shop_name = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False)
    is_approved = serializers.BooleanField(read_only=True)

    class Meta:
        model = VendorProfile
        fields = ('id', 'user', 'shop_name', 'description', 'is_approved', 'created_at')
        read_only_fields = ('created_at',) 