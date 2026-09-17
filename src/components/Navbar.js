'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cart } = useCart();
  const { user, isLoading, logout } = useAuth();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="flex items-center justify-between bg-gray-900 p-4 text-white shadow-md">
      <Link href="/" className="text-xl font-bold tracking-wide">
        AnhQuoc Store
      </Link>
      <div className="flex items-center gap-3">
        {!isLoading && (user ? (
          <>
            <span className="hidden text-sm text-gray-300 sm:inline">{user.email}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-gray-600 px-3 py-2 text-sm hover:bg-gray-800"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link href="/login" className="rounded-lg border border-gray-600 px-3 py-2 text-sm hover:bg-gray-800">
            Sign in
          </Link>
        ))}
        <Link href="/cart" className="relative rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700">
          🛒 Cart
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}