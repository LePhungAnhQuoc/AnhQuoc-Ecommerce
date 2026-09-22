'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { adminEmail, getProductThumbnail } from '../../Utilities';

const emptyForm = {
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    thumbnail: '',
};

export default function AdminProductsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const productAPIUrl = '/api/products';
    const categoryOptions = [
        'Beauty',
        'Fragrances',
        'Furniture',
        'Groceries',
        'Home Decoration',
        'Laptops',
        'Mens Shirts',
        'Mens Shoes',
        'Smartphones',
        'Skincare',
        'Sports',
        'Womens Bags',
        'Womens Dresses',
        'Womens Shoes'
    ];

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(productAPIUrl);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unable to load products.');
            setProducts(data);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email !== adminEmail) return;
        loadProducts();
    }, [user]);

    const updateField = (event) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const handleThumbnailSelect = () => {
        const url = window.prompt('Enter image URL', form.thumbnail || '');
        if (url === null) return;
        setForm((current) => ({ ...current, thumbnail: url.trim() }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setMessage('');
    };

    const submitForm = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const response = await fetch(editingId ? `/api/products/${editingId}` : '/api/products', {
                method: editingId ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Unable to save product.');

            await loadProducts();
            resetForm();
            setMessage(editingId ? 'Product updated successfully!' : 'Product created successfully!');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setSaving(false);
        }
    };

    const editProduct = (product) => {
        setEditingId(product.id);
        setForm({
            title: product.title || '',
            description: product.description || '',
            category: product.category || '',
            brand: product.brand || '',
            price: product.price ?? '',
            stock: product.stock ?? '',
            thumbnail: getProductThumbnail(product) || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const removeProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;

        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const data = await response.json();
            setMessage(data.error || 'Unable to delete product.');
            return;
        }

        setProducts((current) => current.filter((product) => product.id !== id));
        if (editingId === id) resetForm();
        setMessage('Product deleted successfully!');
    };

    if (authLoading || loading) return <p className="p-12 text-center">Loading product manager...</p>;

    if (!user || user.email !== adminEmail) {
        return (
            <main className="mx-auto max-w-2xl p-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900">Admin access required</h1>
                <p className="mt-2 text-slate-600">Sign in with the store admin account to manage products.</p>
                <Link href="/login" className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Sign in</Link>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl space-y-8 p-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Store admin</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">Product manager</h1>
                <p className="mt-2 text-slate-600">Create, update, and remove products from the catalog.</p>
            </div>

            <form onSubmit={submitForm} className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:grid-cols-2">
                <h2 className="md:col-span-2 text-xl font-bold text-slate-900">{editingId ? 'Edit product' : 'Add product'}</h2>

                {['title', 'brand', 'stock'].map((field) => (
                    <label key={field} className="space-y-1 text-sm font-semibold text-slate-700">
                        <span className="capitalize">{field}</span>
                        <input name={field} type={field === 'stock' ? 'number' : 'text'} min={field === 'stock' ? '0' : undefined} value={form[field]} onChange={updateField} className="w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" required={field !== 'brand'} />
                    </label>
                ))}

                <label className="space-y-1 text-sm font-semibold text-slate-700">
                    <span>Price</span>
                    <div className="flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                        <input
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.price}
                            onChange={updateField}
                            className="w-full border-0 bg-transparent px-3 py-2 font-normal outline-none"
                            required
                        />
                        <span className="border-l border-slate-300 px-3 text-sm font-medium text-slate-600">$</span>
                    </div>
                </label>

                <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">
                    <span>Category</span>
                    <select
                        name="category"
                        value={form.category}
                        onChange={updateField}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                    >
                        <option value="">Select category</option>
                        {categoryOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col space-y-1 text-sm font-semibold text-slate-700 md:col-span-1">
                    <span>Description</span>
                    <textarea name="description" value={form.description} onChange={updateField} rows="6" className="min-h-0 w-full flex-1 rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" required />
                </label>
                <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 md:col-span-1">
                    <span>Thumbnail</span>
                    <div className="flex min-h-[120px] flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-4 text-center">
                        {form.thumbnail ? (
                            <img
                                src={form.thumbnail}
                                alt="Product thumbnail preview"
                                className="mb-3 h-28 w-full rounded-lg object-cover"
                            />
                        ) : (
                            <div className="mb-3 text-slate-400">No image selected</div>
                        )}
                        <button
                            type="button"
                            onClick={handleThumbnailSelect}
                            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                            Select image
                        </button>
                    </div>
                </div>
                <div className="flex gap-3 md:col-span-2">
                    <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving...' : editingId ? 'Update product' : 'Create product'}</button>
                    {editingId && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700">Cancel</button>}
                </div>
                {message && <p className="md:col-span-2 text-sm font-semibold text-slate-600">{message}</p>}
            </form>

            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="border-b border-slate-200 p-5"><h2 className="text-xl font-bold text-slate-900">Catalog ({products.length})</h2></div>
                <div className="divide-y divide-slate-200">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                            <div><h3 className="font-semibold text-slate-900">{product.title}</h3><p className="text-sm text-slate-500">{product.category} | ${Number(product.price).toFixed(2)} | {product.stock} in stock</p></div>
                            <div className="flex gap-2"><button type="button" onClick={() => editProduct(product)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">Edit</button><button type="button" onClick={() => removeProduct(product.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600">Delete</button></div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
