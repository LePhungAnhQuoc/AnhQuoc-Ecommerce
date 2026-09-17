'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
};

export default function CheckoutPage() {
  const shippingFee = 8;
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    email: user?.email || '',
    fullName: user?.name || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  if (!cart || cart.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="mb-6 text-slate-600">Add a few items before continuing to checkout.</p>
        <Link href="/" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          Continue shopping
        </Link>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl p-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Please sign in</h1>
        <p className="mb-6 text-slate-600">You need an account before placing an order.</p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Go to login
        </button>
      </main>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const total = subtotal + shippingFee;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          customer: {
            ...form,
            email: form.email.trim(),
            fullName: form.fullName.trim(),
          },
          subtotal: subtotal,
          shippingFee: shippingFee,
          total: total,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setError(data?.error || 'Unable to place your order right now.');
        return;
      }

      setSuccess(data.order);
      clearCart();
    } catch {
      setError('Unable to place your order right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="mx-auto max-w-3xl p-12">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">Order placed</p>
          <h1 className="text-3xl font-bold text-slate-900">Thank you, {user.name || user.email}!</h1>
          <p className="mt-4 text-slate-700">Your order has been confirmed.</p>

          <div className="mt-6 space-y-2 rounded-xl bg-white p-4 text-sm text-slate-700">
            <p><span className="font-semibold">Order number:</span> {success.orderNumber}</p>
            <p><span className="font-semibold">Subtotal:</span> ${success.subtotal.toFixed(2)}</p>
            <p><span className="font-semibold">Shipping:</span> ${success.shippingFee.toFixed(2)}</p>
            <p><span className="font-semibold">Total:</span> ${success.total.toFixed(2)}</p>
          </div>

          <Link href="/" className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.95fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Shipping details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="Seattle"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Postal code</label>
                <input
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  placeholder="98101"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Placing order...' : `Place order • $${total.toFixed(2)}`}
          </button>
        </form>

        <aside className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900">Order summary</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-slate-800">{item.title || item.name}</p>
                  <p className="text-sm text-slate-500">{item.quantity} x ${Number(item.price || 0).toFixed(2)}</p>
                </div>
                <p className="font-semibold text-slate-800">${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
