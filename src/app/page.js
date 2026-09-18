'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toastProduct, setToastProduct] = useState(null);

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

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastProduct(product);
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
              <Link href={`/products/${product.id}`} className="block">
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
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}