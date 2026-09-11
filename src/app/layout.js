import './globals.css';
import Navbar from '../components/Navbar';
import { CartProvider } from '../context/CartContext';

export const metadata = {
  title: 'Next.js E-Commerce',
  description: 'Built with React, Next.js, and JavaScript',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-800">
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}