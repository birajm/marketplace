from django.db import models
from django.conf import settings # Recommended way to refer to AUTH_USER_MODEL
from products.models import Product
# Import VendorProfile directly if needed, or access via Product.vendor
from users.models import VendorProfile

class Order(models.Model):
    """Model representing a customer order."""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),         # Order created, payment not yet confirmed
        ('PROCESSING', 'Processing'),   # Payment confirmed, vendor preparing shipment
        ('SHIPPED', 'Shipped'),          # Order handed off to carrier
        ('DELIVERED', 'Delivered'),      # Order received by customer
        ('CANCELLED', 'Cancelled'),      # Order cancelled (by customer or admin)
        ('FAILED', 'Failed'),           # Payment failed
    ]

    # Link to the customer who placed the order
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, # Keep order history even if user is deleted
        null=True, # Allow for guest checkouts? Or require login?
        blank=True, # If guest checkout allowed
        related_name='orders'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    # Shipping Information (consider a separate Address model for reusability)
    shipping_address_line1 = models.CharField(max_length=255, blank=True, null=True)
    shipping_address_line2 = models.CharField(max_length=255, blank=True, null=True)
    shipping_city = models.CharField(max_length=100, blank=True, null=True)
    shipping_state = models.CharField(max_length=100, blank=True, null=True)
    shipping_postal_code = models.CharField(max_length=20, blank=True, null=True)
    shipping_country = models.CharField(max_length=100, blank=True, null=True)

    # Billing Information (optional, might be same as shipping or handled by Stripe)
    # ... billing address fields ...

    # Stripe payment intent ID for tracking and reconciliation
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['customer']),
            models.Index(fields=['stripe_payment_intent_id']),
        ]

    def __str__(self):
        customer_identifier = self.customer.email if self.customer else 'Guest'
        return f"Order {self.id} by {customer_identifier} - {self.status}"

    def update_total_amount(self):
        """Recalculates the total amount based on order items."""
        total = sum(item.get_total_item_price() for item in self.items.all())
        self.total_amount = total
        self.save(update_fields=['total_amount'])

class OrderItem(models.Model):
    """Model representing a single item within an order."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    # Link to the specific product purchased
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL, # Keep item history even if product is deleted
        null=True, # Product might be deleted later
        related_name='order_items'
    )
    # Store the vendor at the time of order for commission/splitting logic
    # This avoids issues if a product changes vendors later
    vendor = models.ForeignKey(
        VendorProfile,
        on_delete=models.SET_NULL, # Keep vendor reference even if vendor profile is deleted
        null=True, # Vendor might be deleted later
        related_name='order_items'
    )
    quantity = models.PositiveIntegerField(default=1)
    # Store the price at the time of purchase to avoid changes if product price updates
    price = models.DecimalField(max_digits=10, decimal_places=2)
    # Store product name/details redundantly? Optional, helps if product is deleted.
    # product_name = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['order', 'id']
        # Ensure a product doesn't appear twice in the same order
        # unique_together = ('order', 'product') # Add if variants aren't used

    def __str__(self):
        product_name = self.product.name if self.product else '[Deleted Product]'
        return f"{self.quantity} x {product_name} in Order {self.order.id}"

    def save(self, *args, **kwargs):
        # Automatically populate vendor and price from the product if not set
        if self.product and self.vendor is None:
            self.vendor = self.product.vendor
        if self.product and self.price is None:
            self.price = self.product.price # Capture price at time of order
        # Add product_name capture here if desired
        # if self.product and not self.product_name:
        #     self.product_name = self.product.name
        super().save(*args, **kwargs)

    def get_total_item_price(self):
        """Calculate the total price for this line item."""
        return self.price * self.quantity
