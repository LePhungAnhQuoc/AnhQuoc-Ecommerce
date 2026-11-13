'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const productsRef = useRef([]);
  const hasLoadedRef = useRef(false);
  const requestRef = useRef(null);

  const loadProducts = useCallback(async ({ force = false } = {}) => {
    if (requestRef.current) return requestRef.current;
    if (hasLoadedRef.current && !force) return productsRef.current;

    setIsLoading(true);
    setError('');

    const request = (async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load products.');

        const catalog = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : null;
        if (!catalog) throw new Error('The product list returned an unexpected response.');

        productsRef.current = catalog;
        hasLoadedRef.current = true;
        setProducts(catalog);
        setHasLoaded(true);
        return catalog;
      } catch (loadError) {
        setError(loadError.message || 'Unable to load products.');
        throw loadError;
      } finally {
        requestRef.current = null;
        setIsLoading(false);
      }
    })();

    requestRef.current = request;
    return request;
  }, []);

  const updateProducts = useCallback((update) => {
    const nextProducts = typeof update === 'function' ? update(productsRef.current) : update;
    productsRef.current = nextProducts;
    hasLoadedRef.current = true;
    setProducts(nextProducts);
    setHasLoaded(true);
    setError('');
  }, []);

  return (
    <ProductsContext.Provider value={{ products, isLoading, hasLoaded, error, loadProducts, updateProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider.');
  }
  return context;
}
