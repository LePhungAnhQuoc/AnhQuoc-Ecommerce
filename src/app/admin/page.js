'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductsContext';
import { adminEmail } from '../Utilities';

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { products, isLoading, hasLoaded, error, loadProducts } = useProducts();

  useEffect(() => {
    if (authLoading || user?.email !== adminEmail) return;

    loadProducts().catch((loadError) => {
      console.error('Failed to load admin dashboard products', loadError);
    });
  }, [authLoading, user, loadProducts]);

  if (authLoading) {
    return <p className="py-16 text-center text-slate-600">Checking admin access...</p>;
  }

  if (!user || user.email !== adminEmail) {
    return (
      <main className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Admin access required</h1>
        <p className="mt-2 text-slate-600">Sign in with the store admin account to view the dashboard.</p>
        <Link href="/login" className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
          Sign in
        </Link>
      </main>
    );
  }

  const totalUnits = products.reduce((sum, product) => sum + (Number(product.stock) || 0), 0);
  const categories = new Set(products.map((product) => product.category).filter(Boolean));
  const metrics = [
    { 
      label: 'Total products', 
      value: isLoading || (!hasLoaded && !error) ? '—' : products.length, 
      detail: 'Items in your catalog', 
      color: 'bg-blue-50 text-blue-700' 
    },
    { label: 'Units in stock', 
      value: isLoading || (!hasLoaded && !error) ? '—' : totalUnits.toLocaleString(), 
      detail: 'Across all products', 
      color: 'bg-emerald-50 text-emerald-700' 
    },
    { label: 'Categories', 
      value: isLoading || (!hasLoaded && !error) ? '—' : categories.size, 
      detail: 'Product categories', 
      color: 'bg-violet-50 text-violet-700' 
    },
  ];

  return (
    <main className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Store overview</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">A quick look at your store catalog and inventory.</p>
        </div>
        <Link href="/admin/products" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          Manage products
        </Link>
      </header>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <section aria-label="Store metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{metric.value}</p>
              </div>
              <span className={`rounded-xl px-3 py-2 text-xs font-semibold ${metric.color}`}>Store</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Catalog snapshot</h2>
            <p className="mt-1 text-sm text-slate-500">Keep product details and inventory up to date.</p>
          </div>
          <Link href="/admin/products" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
            Open product manager <span aria-hidden="true">→</span>
          </Link>
        </div>
        {isLoading || (!hasLoaded && !error) ? (
          <p className="mt-6 text-sm text-slate-500">Loading catalog...</p>
        ) : products.length > 0 ? (
          <ul className="mt-5 divide-y divide-slate-100">
            {products.slice(0, 5).map((product) => (
              <li key={product.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-slate-800">{product.title || 'Untitled product'}</span>
                <span className="text-sm text-slate-500">{product.category || 'Uncategorized'} · {Number(product.stock) || 0} in stock</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            {error ? 'Catalog data is unavailable right now.' : 'No products in the catalog yet.'}
          </p>
        )}
      </section>
    </main>
  );
}
