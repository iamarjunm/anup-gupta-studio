import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { CartSidebar } from '@/components/cart-sidebar';

export const metadata: Metadata = {
  title: 'Premium Men\'s Ethnic Wear & Party Shirts Online – Anup Gupta',
  description: 'Premium Men\'s Ethnic Wear & Party Shirts Online. Crafted to stand out with signature hand embroidery.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <CartSidebar />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
