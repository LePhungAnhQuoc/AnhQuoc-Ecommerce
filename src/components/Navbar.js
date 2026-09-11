'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext'; // or '@/context/CartContext'
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by ensuring code only renders dynamic badge on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
      <Link href="/" className="text-xl font-bold tracking-wide">
        AnhQuoc Store
      </Link>
      <Link href="/cart" className="relative bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
        🛒 Cart
        {/* Only render the badge after client-side hydration completes */}
        {mounted && totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  );
}