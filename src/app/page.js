'use client';

import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import Toast from '../components/Toast';
import { getFilteredData } from './Utilities';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastProduct, setToastProduct] = useState(null);
  const { addToCart } = useCart();
  const { products, isLoading, hasLoaded, error, loadProducts } = useProducts();

  useEffect(() => {
    loadProducts().catch((loadError) => {
      console.error('Failed to load products', loadError);
    });
  }, [loadProducts]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastProduct(product);
  };

  const filteredProducts = useMemo(() => {
    return getFilteredData(products, searchQuery);
  }, [products, searchQuery]);

  if (isLoading || (!hasLoaded && !error)) return <p className="p-12 text-center text-lg">Loading Store...</p>;
  if (error) return <p role="alert" className="p-12 text-center text-red-700">Unable to load products: {error}</p>;

  return (
    <main className="relative mx-auto max-w-6xl p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Featured Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
        <label className="w-full sm:max-w-sm">
          <span className="mb-2 block text-sm font-semibold text-gray-700">Search products</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, brand, or category"
            aria-label="Search products"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </label>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {filteredProducts.map((product) => {
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
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold">No products found</h2>
          <p className="mt-2 text-sm text-gray-600">Try a different name, brand, or category.</p>
        </div>
      )}
    </main>
  );
}