'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useCart } from '../../../context/CartContext';
import Toast from '../../../components/Toast';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [toastProduct, setToastProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const productDetailAPI = `https://dummyjson.com/products/${id}`;
  const { user } = useAuth();
  const router = useRouter();

  const getPrimaryImage = (item) => {
    if (!item) return '/placeholder.png';
    return item.thumbnail || item.images?.[0] || item.image || '/placeholder.png';
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(productDetailAPI);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data = await res.json();
        setProduct(data);
        setSelectedImage(getPrimaryImage(data));
      } catch (error) {
        console.error('Failed to load product details', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="p-12 text-center text-lg">Loading product details...</p>;
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl p-10 text-center">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Product not found</h1>
        <Link href="/" className="text-sm font-semibold text-blue-600 underline">
          Back to home
        </Link>
      </main>
    );
  }

  const productImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [getPrimaryImage(product)].filter(Boolean);

  const salePrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-slate-700">{product.category}</span>
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <Image
                src={selectedImage}
                alt={product.title}
                width={800}
                height={700}
                unoptimized
                className="h-[420px] w-full object-cover md:h-[560px]"
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-xl border-2 bg-slate-50 p-1 transition ${
                    selectedImage === image ? 'border-orange-500' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    width={220}
                    height={180}
                    unoptimized
                    className="h-20 w-full rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                {product.brand}
              </span>
              <h1 className="text-3xl font-bold text-slate-900">{product.title}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="rounded bg-yellow-100 px-2 py-1 font-semibold text-yellow-700">
                  ★ {product.rating}
                </span>
                <span>{product.reviews?.length || 0} ratings</span>
                <span className="text-emerald-600">{product.stock} in stock</span>
              </div>
            </div>

            <div className="rounded-xl bg-orange-50 p-4">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-extrabold text-orange-600">${salePrice}</span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="mb-1 text-lg text-slate-400 line-through">${product.price}</span>
                    <span className="mb-1 rounded bg-orange-200 px-2 py-1 text-xs font-bold text-orange-700">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-semibold text-emerald-600">Free shipping</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Delivery</span>
                <span className="font-semibold text-slate-700">2 - 5 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Warranty</span>
                <span className="font-semibold text-slate-700">12 months</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  addToCart(product);
                  setToastProduct(product);
                }}
                className="flex-1 rounded-xl bg-orange-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-orange-600"
              >
                Add to Cart
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl border border-orange-500 bg-white px-5 py-3 text-base font-semibold text-orange-600 transition hover:bg-orange-50"
                onClick={() => {
                  addToCart(product);
                  (user ? router.push('/checkout') : router.push('/login'))
                }}
              >
                Buy Now
              </button>
            </div>

            <Toast product={toastProduct} onClose={setToastProduct} />

            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <p className="mb-2 font-semibold text-slate-800">Seller</p>
              <div className="flex items-center justify-between">
                <span>Official Store</span>
                <span className="font-semibold text-emerald-600">Trusted seller</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Product information</h2>
        <p className="mb-6 leading-7 text-slate-600">{product.description}</p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-lg font-semibold text-slate-800">Highlights</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Premium quality materials</li>
              <li>• Designed for everyday use</li>
              <li>• Fast and secure shipping</li>
              <li>• Easy 30-day returns</li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-3 text-lg font-semibold text-slate-800">Details</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Category: {product.category}</li>
              <li>• Brand: {product.brand}</li>
              <li>• Stock: {product.stock}</li>
              <li>• Rating: {product.rating}/5</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
