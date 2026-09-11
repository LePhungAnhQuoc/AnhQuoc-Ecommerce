'use client';

import { useCart } from '../../context/CartContext'; // Adjust path if using '@/context/CartContext'
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cart || cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
        {cart.map((item) => {
          // Robust extraction for dynamic properties from DummyJSON or custom API
          const title = item.title || item.name || 'Product Item';
          const image =
            item.thumbnail ||
            item.image ||
            (Array.isArray(item.images) && item.images[0]) ||
            '';
          const price = Number(item.price) || 0;
          const itemTotal = (price * item.quantity).toFixed(2);

          return (
            <div key={item.id} className="flex justify-between items-center py-4 border-b last:border-0">
              <div className="flex items-center gap-4">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
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
                <span className="font-semibold text-lg">${itemTotal}</span>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 font-medium text-sm px-3 py-1.5 rounded-lg transition-colors duration-150 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-3xl font-extrabold ml-2">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => alert('Proceeding to Checkout...')}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
          Checkout Now
        </button>
      </div>
    </main>
  );
}