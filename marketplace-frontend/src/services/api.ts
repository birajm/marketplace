import axios from 'axios';
import { ApiResponse, Category, Product, Order, User, VendorProfile } from '../types';

// Use environment variable for API URL, fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const productsApi = {
  getAll: async (params?: { category?: string; vendor?: string }) => {
    const response = await api.get<ApiResponse<Product[]>>('/products/', { params });
    return response.data;
  },
  getById: async (slug: string) => {
    const response = await api.get<ApiResponse<Product>>(`/products/${slug}/`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories/');
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  create: async (orderData: Partial<Order>) => {
    const response = await api.post<ApiResponse<Order>>('/orders/', orderData);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get<ApiResponse<Order[]>>('/orders/');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}/`);
    return response.data;
  },
};

// Users API
export const usersApi = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post<{ token: string }>('/auth/login/', credentials);
    return response.data;
  },
  register: async (userData: Partial<User>) => {
    const response = await api.post<ApiResponse<User>>('/users/', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/users/me/');
    return response.data;
  },
};

// Vendors API
export const vendorsApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<VendorProfile[]>>('/vendors/');
    return response.data;
  },
  getById: async (shopName: string) => {
    const response = await api.get<ApiResponse<VendorProfile>>(`/vendors/${shopName}/`);
    return response.data;
  },
};

export default api; 