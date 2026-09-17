'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToast, toastProduct]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  if (loading) return <p className="p-12 text-center text-lg">Loading Store...</p>;

  return (
    <main className="relative mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-extrabold">Featured Products</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {products.map((product) => {
          const title = product.title || product.name;
          const image = product.thumbnail || product.image || (product.images && product.images[0]);
          const description = product.description;
          const price = product.price;

          return (
            <div key={product.id} className="flex flex-col justify-between rounded-xl border bg-white p-4 shadow-sm">
              <div>
                {image && (
                  <Image
                    src={image}
                    alt={title}
                    width={400}
                    height={300}
                    unoptimized
                    className="mb-4 h-48 w-full rounded-md object-cover"
                  />
                )}
                <h2 className="mb-2 text-xl font-semibold">{title}</h2>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">{description}</p>
              </div>
              <div>
                <div className="mb-4 text-2xl font-bold">${price}</div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`fixed bottom-5 right-5 z-50 transform transition-all duration-300 ease-in-out ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'
        }`}
      >
        {toastProduct && (
          <div className="flex max-w-sm items-center gap-3 rounded-xl border border-emerald-500 bg-emerald-600 p-4 text-white shadow-2xl">
            {(toastProduct.thumbnail || toastProduct.image) && (
              <Image
                src={toastProduct.thumbnail || toastProduct.image}
                alt={toastProduct.title || toastProduct.name}
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 flex-shrink-0 rounded-lg border border-emerald-400/50 object-cover"
              />
            )}

            <div className="flex-1 pr-2">
              <div className="mb-0.5 flex items-center gap-1.5">
                <span className="rounded bg-emerald-700/80 px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-100">
                  Added to Cart
                </span>
              </div>
              <p className="line-clamp-1 text-sm font-semibold text-white">
                {toastProduct.title || toastProduct.name}
              </p>
              <p className="text-xs font-bold text-emerald-100">${toastProduct.price}</p>
            </div>

            <div className="flex flex-col items-end gap-1 border-l border-emerald-500/60 pl-3">
              <button
                onClick={() => setShowToast(false)}
                className="p-1 text-xs font-bold leading-none text-white/70 hover:text-white"
              >
                ✕
              </button>
              <Link
                href="/cart"
                className="mt-1 whitespace-nowrap rounded bg-white px-2 py-1 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50"
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