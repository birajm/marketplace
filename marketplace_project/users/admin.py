from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, VendorProfile

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_vendor', 'is_customer', 'is_staff')
    list_filter = ('is_vendor', 'is_customer', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('Marketplace Roles', {'fields': ('is_vendor', 'is_customer')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Marketplace Roles', {'fields': ('is_vendor', 'is_customer')}),
    )

class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'user', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('shop_name', 'user__username', 'user__email')
    readonly_fields = ('created_at',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(VendorProfile, VendorProfileAdmin)
