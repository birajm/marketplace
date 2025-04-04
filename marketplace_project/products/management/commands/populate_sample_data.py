from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from users.models import VendorProfile
from products.models import Category, Product
from decimal import Decimal

class Command(BaseCommand):
    help = 'Populates the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')
        
        # Create categories
        categories = {
            'Electronics': 'Latest gadgets and electronic devices',
            'Fashion': 'Clothing, shoes, and accessories',
            'Home & Garden': 'Home decor and garden supplies',
            'Books': 'Books across various genres',
            'Sports': 'Sports equipment and accessories'
        }
        
        created_categories = {}
        for name, description in categories.items():
            category, created = Category.objects.get_or_create(
                name=name,
                defaults={'description': description}
            )
            created_categories[name] = category
            if created:
                self.stdout.write(f'Created category: {name}')

        # Create vendor users and profiles
        vendors = [
            {
                'username': 'techstore',
                'email': 'tech@example.com',
                'password': 'techstore123',
                'shop_name': 'Tech Store',
                'description': 'Your one-stop shop for all things tech'
            },
            {
                'username': 'fashionista',
                'email': 'fashion@example.com',
                'password': 'fashion123',
                'shop_name': 'Fashionista Boutique',
                'description': 'Trendy fashion for everyone'
            },
            {
                'username': 'bookworm',
                'email': 'books@example.com',
                'password': 'books123',
                'shop_name': 'Bookworm Corner',
                'description': 'A reader\'s paradise'
            }
        ]

        created_vendors = {}
        for vendor_data in vendors:
            user = get_user_model().objects.create_user(
                username=vendor_data['username'],
                email=vendor_data['email'],
                password=vendor_data['password'],
                is_vendor=True
            )
            vendor_profile = VendorProfile.objects.create(
                user=user,
                shop_name=vendor_data['shop_name'],
                description=vendor_data['description'],
                is_approved=True
            )
            created_vendors[vendor_data['username']] = vendor_profile
            self.stdout.write(f'Created vendor: {vendor_data["shop_name"]}')

        # Create sample products
        products = [
            {
                'vendor': 'techstore',
                'category': 'Electronics',
                'name': 'Smartphone X',
                'description': 'Latest smartphone with amazing features',
                'price': Decimal('999.99'),
                'stock': 50
            },
            {
                'vendor': 'techstore',
                'category': 'Electronics',
                'name': 'Laptop Pro',
                'description': 'Powerful laptop for professionals',
                'price': Decimal('1499.99'),
                'stock': 30
            },
            {
                'vendor': 'fashionista',
                'category': 'Fashion',
                'name': 'Designer Dress',
                'description': 'Elegant designer dress for special occasions',
                'price': Decimal('299.99'),
                'stock': 20
            },
            {
                'vendor': 'fashionista',
                'category': 'Fashion',
                'name': 'Casual Jeans',
                'description': 'Comfortable casual jeans for everyday wear',
                'price': Decimal('79.99'),
                'stock': 100
            },
            {
                'vendor': 'bookworm',
                'category': 'Books',
                'name': 'The Great Novel',
                'description': 'A masterpiece of modern literature',
                'price': Decimal('24.99'),
                'stock': 75
            },
            {
                'vendor': 'bookworm',
                'category': 'Books',
                'name': 'Science Fiction Collection',
                'description': 'Collection of classic sci-fi stories',
                'price': Decimal('34.99'),
                'stock': 40
            }
        ]

        for product_data in products:
            vendor = created_vendors[product_data['vendor']]
            category = created_categories[product_data['category']]
            product = Product.objects.create(
                vendor=vendor,
                category=category,
                name=product_data['name'],
                description=product_data['description'],
                price=product_data['price'],
                stock=product_data['stock']
            )
            self.stdout.write(f'Created product: {product.name}')

        self.stdout.write(self.style.SUCCESS('Successfully created sample data')) 