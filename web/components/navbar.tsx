'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag, Menu, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SearchModal } from './search-modal';
import { AuthModal } from './auth-modal';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useCart } from '@/contexts/CartContext';

const KURTA_LINKS = [
  "HANDCRAFTED KURTA",
  "HAND EMBROIDERED COLOURFUL CLASSICS",
  "LINEN COLLECTION",
  "VISCOSE CLASSIC",
  "PRINTED KURTA",
  "KOKO'S WEDDING",
  "VIEW ALL"
];

const LINEN_LINKS = [
  "LINEN KURTA",
  "LINEN SHIRTS"
];

function NavItem({ label, href = "#", links, images, rightAlign = false }: { label: string, href?: string, links?: string[], images?: { src: string, label: string }[], rightAlign?: boolean }) {
  return (
    <div className="group h-full flex items-center">
      <Link href={href} className="text-gray-900 hover:text-gray-500 transition-colors h-full flex items-center gap-1 group-hover:text-gray-500">
        {label}
      </Link>
      
      {links && (
        <div className="absolute top-[80px] left-0 w-full bg-white border-t border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          <div className="max-w-[1600px] mx-auto px-8 py-10 flex">
            {/* Links Column */}
            <div className="w-[400px] flex flex-col gap-4">
              {links.map((link) => (
                <Link key={link} href="#" className="text-sm font-medium tracking-wide text-gray-900 hover:text-gray-500 transition-colors uppercase">
                  {link}
                </Link>
              ))}
            </div>
            
            {/* Images Columns */}
            {images && (
              <div className="flex-1 flex gap-6 justify-end">
                {images.map((img, i) => (
                  <div key={i} className="relative w-[300px] aspect-[3/4] group/img overflow-hidden">
                    <Image 
                      src={img.src}
                      alt={img.label}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                       <span className="text-white text-xs font-semibold uppercase tracking-wider">{img.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div className="bg-[#1c1c1c] text-white text-[11px] sm:text-xs py-2.5 text-center font-bold tracking-wide">
        All our products are Size-Inclusive
      </div>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        {/* Mobile Header */}
        <div className="lg:hidden px-4 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="text-gray-900 hover:text-gray-600 transition-colors p-1 -ml-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
          
          <Link href="/" className="flex flex-col items-center justify-center shrink-0">
            <svg viewBox="0 0 100 30" className="h-5 w-auto mb-1">
              <path d="M10,15 C20,5 30,5 50,15 C70,25 80,25 90,15 C80,5 70,5 50,15 C30,25 20,25 10,15 Z" fill="none" stroke="black" strokeWidth="1"/>
            </svg>
            <span className="text-[11px] font-serif tracking-[0.1em] uppercase text-black leading-none">
              Anup Gupta
            </span>
          </Link>
          
          <div className="flex items-center gap-4 justify-end flex-1">
            <SearchModal triggerClass="text-gray-900 hover:text-gray-500 transition-colors p-1" />
            <button onClick={() => setIsCartOpen(true)} className="text-gray-900 hover:text-gray-500 transition-colors relative p-1 -mr-1 cursor-pointer">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex px-8 h-[80px] items-center justify-between max-w-[1800px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex flex-col shrink-0 w-[200px]">
            <svg viewBox="0 0 100 30" className="h-7 w-auto mb-1 self-start">
              <path d="M10,15 C20,5 30,5 50,15 C70,25 80,25 90,15 C80,5 70,5 50,15 C30,25 20,25 10,15 Z" fill="none" stroke="black" strokeWidth="1"/>
            </svg>
            <span className="text-[14px] font-serif tracking-[0.1em] uppercase text-black leading-none">
              Anup Gupta
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-6 xl:gap-8 text-[11px] font-semibold tracking-wider uppercase h-full flex-1 justify-center">
            <NavItem label="New In" href="/collections/new-in" />
            <NavItem label="Shirts" href="/collections/shirts" />
            <NavItem 
              label="Kurtas" 
              href="/collections/kurtas"
              links={KURTA_LINKS}
              images={[
                { src: "https://picsum.photos/seed/kurtacol1/600/800", label: "ALL KURTA COLLECTION" },
                { src: "https://picsum.photos/seed/kurtacol2/600/800", label: "HAND EMBROIDERED KURTA" }
              ]}
            />
            <NavItem label="Bundi Kurta" href="/collections/bundi-kurta" />
            <NavItem label="Tuxedo" href="/collections/tuxedo" />
            <NavItem label="Bandhgala" href="/collections/bandhgala" />
            <NavItem 
              label="Linen Luxe" 
              href="/collections/linen-luxe"
              links={LINEN_LINKS}
              images={[
                { src: "https://picsum.photos/seed/linencol1/600/800", label: "LINEN LUXE" },
                { src: "https://picsum.photos/seed/linencol2/600/800", label: "LINEN COLLECTION" }
              ]}
            />
            <NavItem label="Printed Luxe Kurta" href="/collections/printed-luxe-kurta" />
            <NavItem label="Accessories" href="/collections/accessories" />
            <NavItem label="Shop By" links={["OCCASION", "COLOR", "PRICE"]} />
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5 justify-end w-[200px] h-full">
            <SearchModal triggerClass="text-gray-900 hover:text-gray-500 transition-colors p-1" />
            <div className="relative group/profile h-[80px] flex items-center">
              {user ? (
                <Link href="/profile" className="text-gray-900 hover:text-gray-500 transition-colors p-1 flex items-center h-full">
                  <User className="w-[18px] h-[18px]" strokeWidth={2} />
                </Link>
              ) : (
                <button suppressHydrationWarning onClick={() => setIsAuthModalOpen(true)} className="text-gray-900 hover:text-gray-500 transition-colors p-1 flex items-center h-full">
                  <User className="w-[18px] h-[18px]" strokeWidth={2} />
                </button>
              )}
              
              <div className="absolute top-full right-0 w-[200px] bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-300 z-50 flex flex-col py-2 rounded-b-md">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <span className="block text-[11px] font-semibold text-gray-900 truncate">{user.displayName || user.email}</span>
                    </div>
                    <Link href="/profile" className="px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">Profile</Link>
                    <Link href="/profile" className="px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">Track Orders</Link>
                    <button onClick={() => signOut(auth)} className="text-left cursor-pointer px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-red-600 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-1 pt-3.5 w-full">Logout</button>
                  </>
                ) : (
                  <>
                    <button suppressHydrationWarning onClick={() => setIsAuthModalOpen(true)} className="text-left w-full cursor-pointer px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">Log In</button>
                    <button suppressHydrationWarning onClick={() => setIsAuthModalOpen(true)} className="text-left w-full cursor-pointer px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">Create Account</button>
                  </>
                )}
              </div>
            </div>
            <button suppressHydrationWarning onClick={() => setIsCartOpen(true)} className="text-gray-900 hover:text-gray-500 transition-colors relative p-1 -mr-1 cursor-pointer">
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-[400px] bg-white flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-gray-900">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 transition-colors -mr-2"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col text-[13px] font-semibold tracking-wider uppercase text-gray-900">
                <Link href="/collections/new-in" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  New In <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/collections/shirts" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  Shirts <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/collections/kurtas" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  Kurtas <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/collections/bundi-kurta" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  Bundi Kurta <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/collections/tuxedo" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  Tuxedo <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/collections/bandhgala" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  Bandhgala <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/collections/linen-luxe" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  Linen Luxe <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/collections/printed-luxe-kurta" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  Printed Luxe Kurta <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link href="/collections/accessories" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  Accessories <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              </nav>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
              <Link href="/profile" className="flex items-center gap-3 text-sm font-medium text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="w-5 h-5" strokeWidth={1.5} /> My Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

