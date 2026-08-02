import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { CartSidebar } from '@/components/cart-sidebar';
import { client } from '@/lib/sanity';
import { ANNOUNCEMENT_BAR_QUERY, NAVIGATION_QUERY } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Premium Men\'s Ethnic Wear & Party Shirts Online – Anup Gupta',
  description: 'Premium Men\'s Ethnic Wear & Party Shirts Online. Crafted to stand out with signature hand embroidery.',
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const [announcements, navigationData] = await Promise.all([
    client.fetch(ANNOUNCEMENT_BAR_QUERY).catch(() => []),
    client.fetch(NAVIGATION_QUERY).catch(() => null)
  ]);
  return (
    <html lang="en">
      <body className="antialiased bg-white" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <Navbar announcements={announcements} navigation={navigationData} />
            {children}
            <Footer />
            <CartSidebar />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
