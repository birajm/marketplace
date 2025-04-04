from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """Custom user model extending Django's AbstractUser."""
    # Add common fields if needed, e.g., email verification status
    email = models.EmailField(unique=True, blank=False, null=False) # Make email required and unique

    # Explicitly set username requirement based on AbstractUser default
    # USERNAME_FIELD = 'username' # Default
    # REQUIRED_FIELDS = ['email'] # If using username as primary identifier

    # If you want to use EMAIL as the primary identifier instead:
    # USERNAME_FIELD = 'email'
    # REQUIRED_FIELDS = ['username'] # Or just [] if username is not needed at all

    # Add role distinction
    is_vendor = models.BooleanField('vendor status', default=False, help_text='Designates whether the user can log in as a vendor.')
    is_customer = models.BooleanField('customer status', default=True, help_text='Designates whether the user is treated as a customer.')

    def __str__(self):
        return self.email # Or self.username

class VendorProfile(models.Model):
    """Profile specific to users marked as vendors."""
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='vendor_profile',
        limit_choices_to={'is_vendor': True} # Optional: Ensure only vendors can have profiles
    )
    shop_name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # Stripe Connect Account ID for managing payouts
    stripe_account_id = models.CharField(max_length=255, blank=True, null=True)
    # Optional: Admin approval mechanism for vendors
    is_approved = models.BooleanField(default=False, help_text='Designates whether the vendor profile has been approved by an admin.')

    def __str__(self):
        return self.shop_name
