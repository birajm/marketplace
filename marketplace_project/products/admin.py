from django.contrib import admin
from .models import Category, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'vendor', 'category', 'price', 'stock', 'is_active')
    list_filter = ('is_active', 'category', 'vendor')
    list_editable = ('price', 'stock', 'is_active')
    search_fields = ('name', 'description', 'vendor__shop_name')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('vendor', 'category', 'name', 'slug', 'description')
        }),
        ('Pricing and Inventory', {
            'fields': ('price', 'stock', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
