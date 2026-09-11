'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext'; // Adjust path if using '@/context/CartContext'

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast notification state
  const [toastProduct, setToastProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Failed to load products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000); // Notification visible for 3 seconds

      return () => clearTimeout(timer); // Clean up timer on new addition
    }
  }, [showToast, toastProduct]);

  // Handler to add item and trigger toast
  const handleAddToCart = (product) => {
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  if (loading) return <p className="text-center p-12 text-lg">Loading Store...</p>;

  return (
    <main className="max-w-6xl mx-auto p-6 relative">
      <h1 className="text-3xl font-extrabold mb-8">Featured Products</h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const title = product.title || product.name;
          const image = product.thumbnail || product.image || (product.images && product.images[0]);
          const description = product.description;
          const price = product.price;

          return (
            <div key={product.id} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-4">${price}</div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Windows-style Bottom-Right Toast Notification */}
      <div
        className={`fixed bottom-5 right-5 z-50 transform transition-all duration-300 ease-in-out ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'
        }`}
      >
        {toastProduct && (
          <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-2xl border border-emerald-500 max-w-sm flex items-center gap-3">
            {/* Product Thumbnail */}
            {(toastProduct.thumbnail || toastProduct.image) && (
              <img
                src={toastProduct.thumbnail || toastProduct.image}
                alt={toastProduct.title || toastProduct.name}
                className="w-12 h-12 object-cover rounded-lg border border-emerald-400/50 flex-shrink-0"
              />
            )}

            {/* Notification Details */}
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs bg-emerald-700/80 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-emerald-100">
                  Added to Cart
                </span>
              </div>
              <p className="font-semibold text-sm line-clamp-1 text-white">
                {toastProduct.title || toastProduct.name}
              </p>
              <p className="text-xs text-emerald-100 font-bold">${toastProduct.price}</p>
            </div>

            {/* View Cart Link / Close Button */}
            <div className="flex flex-col gap-1 items-end border-l border-emerald-500/60 pl-3">
              <button
                onClick={() => setShowToast(false)}
                className="text-white/70 hover:text-white text-xs font-bold leading-none p-1"
              >
                ✕
              </button>
              <Link
                href="/cart"
                className="text-xs bg-white text-emerald-800 font-bold px-2 py-1 rounded hover:bg-emerald-50 transition mt-1 whitespace-nowrap"
              >
                View →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}