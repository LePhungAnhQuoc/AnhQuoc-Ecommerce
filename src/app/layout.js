import './globals.css';
import Navbar from '../components/Navbar';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { ProductsProvider } from '../context/ProductsContext';

export const metadata = {
  title: 'Next.js E-Commerce',
  description: 'Built with React, Next.js, and JavaScript',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 min-h-screen text-gray-800" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <ProductsProvider>
              <Navbar />
              {children}
            </ProductsProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}