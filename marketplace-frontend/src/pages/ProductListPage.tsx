import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = searchParams.get('category') || undefined;
  const vendor = searchParams.get('vendor') || undefined;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsApi.getAll({ category, vendor }),
          categoriesApi.getAll(),
        ]);
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, vendor]);

  const handleCategoryChange = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (categorySlug) {
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Products</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!category ? 'default' : 'outline'}
            onClick={() => handleCategoryChange(null)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.slug ? 'default' : 'outline'}
              onClick={() => handleCategoryChange(cat.slug)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}; 