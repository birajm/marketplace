from django.db import models
# Correct import path assumes 'users' app is at the same level as 'products'
from users.models import VendorProfile
from django.utils.text import slugify

class Category(models.Model):
    """Model representing product categories."""
    name = models.CharField(max_length=100, unique=True)
    # Slug field for user-friendly URLs, auto-generated if blank
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['name'] # Optional: Default ordering

    def save(self, *args, **kwargs):
        # Auto-generate slug from name if it's not provided
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Product(models.Model):
    """Model representing a product listed by a vendor."""
    vendor = models.ForeignKey(
        VendorProfile,
        on_delete=models.CASCADE, # Or models.PROTECT if you want to prevent vendor deletion if they have products
        related_name='products'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL, # Keep product if category is deleted
        null=True,
        blank=True,
        related_name='products'
    )
    name = models.CharField(max_length=255)
    # Slug field for user-friendly URLs, auto-generated if blank
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0, help_text='Available quantity')

    # Placeholder for image field - requires Pillow and MEDIA settings
    # image = models.ImageField(upload_to='products/%Y/%m/%d/', blank=True, null=True)

    is_active = models.BooleanField(
        default=True,
        help_text='Designates whether this product is visible and purchasable.'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at'] # Optional: Default ordering (newest first)
        # Optional: Index fields commonly used for filtering/ordering
        indexes = [
            models.Index(fields=['slug', 'id']),
            models.Index(fields=['name']),
            models.Index(fields=['-created_at']),
        ]

    def save(self, *args, **kwargs):
        # Auto-generate slug from name if it's not provided
        if not self.slug:
            # Ensure slug uniqueness if multiple products have similar names
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f'{base_slug}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} (by {self.vendor.shop_name})"

# Future Consideration: ProductVariant model
# If products have variants (e.g., size, color), create a separate model:
# class ProductVariant(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
#     attribute_name = models.CharField(max_length=50) # e.g., 'Size', 'Color'
#     attribute_value = models.CharField(max_length=50) # e.g., 'L', 'Red'
#     stock_change = models.IntegerField(default=0) # How this variant affects overall product stock
#     price_modifier = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # Price difference
#     sku = models.CharField(max_length=100, blank=True, null=True, unique=True)
