export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_vendor: boolean;
  is_customer: boolean;
}

export interface VendorProfile {
  id: number;
  username: string;
  email: string;
  shop_name: string;
  description: string;
  is_approved: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: number;
  category_name: string;
  vendor: number;
  vendor_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order: number;
  product: number;
  product_name: string;
  product_price: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customer: number;
  customer_name: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  shipping_address: string;
  payment_status: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
} 