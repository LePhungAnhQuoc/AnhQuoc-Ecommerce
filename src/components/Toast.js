'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Toast({ product, onClose }) {
  useEffect(() => {
    if (!product) {
      return;
    }

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose, product]);

  const handleClose = () => {
    onClose();
  };

  const image = product?.thumbnail || product?.image;
  const title = product?.title || product?.name;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transform transition-all duration-300 ease-in-out ${
        product ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'
      }`}
    >
      {product && (
        <div className="flex max-w-sm items-center gap-3 rounded-xl border border-emerald-500 bg-emerald-600 p-4 text-white shadow-2xl">
          {image && (
            <Image
              src={image}
              alt={title}
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
            <p className="line-clamp-1 text-sm font-semibold text-white">{title}</p>
            <p className="text-xs font-bold text-emerald-100">${product.price}</p>
          </div>

          <div className="flex flex-col items-end gap-1 border-l border-emerald-500/60 pl-3">
            <button
              onClick={handleClose}
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
  );
}
