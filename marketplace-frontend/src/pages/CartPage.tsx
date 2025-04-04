import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { removeItem, updateQuantity } from '../features/cartSlice';
import { Button } from '../components/Button';

export const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeItem(productId));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
          <p className="mb-8 text-gray-600">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button href="/products">Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                  {/* Add product image here */}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        <a
                          href={`/products/${item.product.slug}`}
                          className="hover:underline"
                        >
                          {item.product.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.product.category_name}
                      </p>
                    </div>
                    <p className="text-lg font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.product.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.product.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button className="mt-6 w-full" href="/checkout">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 