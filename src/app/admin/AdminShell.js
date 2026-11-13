'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminURL } from '../Utilities.js';

const navigation = [
  { label: 'Dashboard', href: adminURL, icon: 'dashboard' },
  { label: 'Products', href: `${adminURL}/products`, icon: 'products' },
];

function NavigationIcon({ name }) {
  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </>
    ),
    products: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 md:flex">
      {isDrawerOpen && (
        <button
          type="button"
          aria-label="Close admin navigation"
          onClick={closeDrawer}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      <aside
        id="admin-navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-slate-300 shadow-2xl transition-transform duration-200 md:sticky md:top-0 md:z-auto md:h-screen md:shrink-0 md:translate-x-0 md:shadow-none ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <Link href={adminURL} onClick={closeDrawer} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-lg font-bold text-white">
              A
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide text-white">ANHQUOC</span>
              <span className="block text-xs text-slate-400">Store administration</span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close admin navigation"
            onClick={closeDrawer}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
          <nav aria-label="Admin navigation" className="mt-3 space-y-1">
            {navigation.map((item) => {
              const isActive = item.href === adminURL
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeDrawer}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive
                      ? 'bg-blue-500/15 text-blue-300'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <NavigationIcon name={item.icon} />
                  {item.label}
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-4">
          <Link
            href="/"
            onClick={closeDrawer}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6M9 12h12" />
              <path d="M3 4v16" />
            </svg>
            Back to storefront
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex items-center gap-4 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur md:hidden">
          <button
            type="button"
            aria-label="Open admin navigation"
            aria-expanded={isDrawerOpen}
            aria-controls="admin-navigation"
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900">Admin dashboard</p>
            <p className="text-xs text-slate-500">Manage your store</p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
