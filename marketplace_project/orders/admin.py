from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    raw_id_fields = ('product',)
    extra = 0
    readonly_fields = ('price',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('customer__username', 'customer__email', 'shipping_address_line1')
    readonly_fields = ('created_at', 'updated_at', 'total_amount')
    inlines = [OrderItemInline]
    fieldsets = (
        (None, {
            'fields': ('customer', 'status', 'total_amount')
        }),
        ('Shipping Information', {
            'fields': (
                'shipping_address_line1',
                'shipping_address_line2',
                'shipping_city',
                'shipping_state',
                'shipping_postal_code',
                'shipping_country'
            )
        }),
        ('Payment Information', {
            'fields': ('stripe_payment_intent_id',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
