import React from 'react';
import { useDispatch } from 'react-redux';
import { Product } from '../types';
import { addItem } from '../features/cartSlice';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      dispatch(addItem({ product, quantity: 1 }));
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative rounded-lg border p-4 transition-all hover:shadow-lg">
      <a href={`/products/${product.slug}`} className="block">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
          {/* Add product image here */}
          <div className="h-48 w-full bg-gray-200" />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category_name}</p>
          <p className="text-lg font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </a>
      <div className="mt-4">
        <Button
          onClick={handleAddToCart}
          isLoading={isAdding}
          className="w-full"
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
}; 