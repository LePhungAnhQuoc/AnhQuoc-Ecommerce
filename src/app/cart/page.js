'use client';

import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cart || cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Your Cart is Empty</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>

      <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        {cart.map((item) => {
          const title = item.title || item.name || 'Product Item';
          const image = item.thumbnail || item.image || (Array.isArray(item.images) && item.images[0]) || '';
          const price = Number(item.price) || 0;
          const itemTotal = (price * item.quantity).toFixed(2);

          return (
            <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-0">
              <div className="flex items-center gap-4">
                {image ? (
                  <Image
                    src={image}
                    alt={title}
                    width={64}
                    height={64}
                    unoptimized
                    className="h-16 w-16 rounded-md border object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-500">
                    No image
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-800">{title}</h3>
                  <p className="text-sm text-gray-500">
                    ${price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">${itemTotal}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-100 hover:text-red-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-white p-6 shadow-sm">
        <div>
          <span className="text-gray-600">Subtotal:</span>
          <span className="ml-2 text-3xl font-extrabold">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => (user ? router.push('/checkout') : router.push('/login'))}
          className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-700"
        >
          Checkout Now
        </button>
      </div>
    </main>
  );
}