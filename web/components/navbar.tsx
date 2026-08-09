'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SearchModal } from './search-modal';
import { AuthModal } from './auth-modal';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useCart } from '@/contexts/CartContext';
import anupGuptaIcon from '@/assets/ANUP_GUPTA_ICON.jpg-removebg-preview.png';

// Removed hardcoded links

function NavItem({ label, href = "#", links, columns, images, rightAlign = false }: { label: string, href?: string, links?: { label: string, href: string }[], columns?: { title?: string, links: { label: string, href: string }[] }[], images?: { src: string, label: string, href: string }[], rightAlign?: boolean }) {
  return (
    <div className="group h-full flex items-center">
      <Link href={href} className="text-gray-900 hover:text-gray-500 transition-colors h-full flex items-center gap-1 group-hover:text-gray-500">
        {label}
      </Link>

      {(links || columns) && (
        <div className="absolute top-[64px] left-0 w-full bg-white border-t border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          <div className="max-w-[1600px] mx-auto px-8 py-10 flex">
            {/* Standard Links Column */}
            {links && !columns && (
              <div className="w-[400px] flex flex-col gap-4">
                {links.map((link) => (
                  <Link key={link.label} href={link.href} className="text-sm font-medium tracking-wide text-gray-900 hover:text-gray-500 transition-colors uppercase">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Multiple Columns Layout */}
            {columns && (
              <div className="flex gap-16">
                {columns.map((col, idx) => (
                  <div key={idx} className="flex flex-col gap-4 w-[250px]">
                    {col.title && (
                      <h4 className="text-xs text-gray-500 font-semibold tracking-widest uppercase mb-1">{col.title}</h4>
                    )}
                    {col.links.map((link) => (
                      <Link key={link.label} href={link.href} className="text-sm font-medium tracking-wide text-gray-900 hover:text-gray-500 transition-colors uppercase">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Images Columns */}
            {images && (
              <div className="flex-1 flex gap-6 justify-end">
                {images.map((img, i) => (
                  <Link href={img.href} key={i} className="relative w-[300px] aspect-[3/4] group/img overflow-hidden cursor-pointer block">
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
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar({ announcements, navigation }: { announcements?: any[], navigation?: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const { user, sanityUser } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();

  const activeAnnouncements = announcements && announcements.length > 0
    ? announcements
    : [{ text: "All our products are Size-Inclusive" }];

  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  const nextAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length);
  };

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
      <div className="bg-[#1c1c1c] text-white py-2.5 relative flex items-center justify-center">
        {activeAnnouncements.length > 1 && (
          <button suppressHydrationWarning onClick={prevAnnouncement} className="absolute left-4 md:left-8 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <div className="text-[11px] sm:text-xs text-center font-bold tracking-wide animate-in fade-in duration-500" key={currentAnnouncementIndex}>
          {activeAnnouncements[currentAnnouncementIndex].text}{' '}
          {activeAnnouncements[currentAnnouncementIndex].code && (
            <span className={activeAnnouncements[currentAnnouncementIndex].codeColor || "text-gray-300"}>
              {activeAnnouncements[currentAnnouncementIndex].code}
            </span>
          )}
        </div>

        {activeAnnouncements.length > 1 && (
          <button suppressHydrationWarning onClick={nextAnnouncement} className="absolute right-4 md:right-8 text-gray-400 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        {/* Mobile Header */}
        <div className="lg:hidden px-4 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="text-gray-900 hover:text-gray-600 transition-colors p-1 -ml-1"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>

          <Link href="/" className="flex flex-col items-center justify-center shrink-0">
            <Image 
              src={anupGuptaIcon}
              alt="Anup Gupta Studio Icon"
              className="h-8 w-auto object-contain mix-blend-multiply"
            />
            <span className="text-[11px] font-serif tracking-[0.1em] uppercase text-black leading-none mt-1">
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
        <div className="hidden lg:flex px-8 h-[64px] items-center justify-between max-w-[1800px] mx-auto">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start justify-center shrink-0 w-[200px]">
            <div className="flex flex-col items-center w-fit">
              <Image 
                src={anupGuptaIcon}
                alt="Anup Gupta Studio Icon"
                className="h-10 w-auto object-contain mix-blend-multiply"
              />
              <span className="text-[14px] font-serif tracking-[0.1em] uppercase text-black leading-none mt-1">
                Anup Gupta
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-6 xl:gap-8 text-[11px] font-semibold tracking-wider uppercase h-full flex-1 justify-center">
            {navigation?.categories?.map((cat: any) => {
              const links = cat.subcategories?.length > 0 ? cat.subcategories.map((sub: any) => ({
                label: sub.title,
                href: `/category/${sub.slug}`
              })) : undefined;

              const images = [];
              if (cat.imageUrl) {
                images.push({ src: cat.imageUrl, label: `All ${cat.title} Products`, href: `/category/${cat.slug}` });
              }
              const subWithImage = cat.subcategories?.find((sub: any) => sub.imageUrl);
              if (subWithImage) {
                images.push({ src: subWithImage.imageUrl, label: `All ${subWithImage.title} Products`, href: `/category/${subWithImage.slug}` });
              }

              return (
                <NavItem
                  key={cat.slug}
                  label={cat.title}
                  href={`/category/${cat.slug}`}
                  links={links}
                  images={images.length > 0 ? images : undefined}
                />
              );
            })}

            {/* Shop By Dropdown */}
            <NavItem
              label="Shop By"
              columns={[
                {
                  title: 'Collections',
                  links: (navigation?.collections || []).map((col: any) => ({
                    label: col.title,
                    href: `/collection/${col.slug}`
                  }))
                },
                {
                  title: 'Featured',
                  links: [
                    { label: 'Shop All', href: '/collection/all' },
                    { label: 'New Arrivals', href: '/collection/new-in' },
                    { label: 'Bestsellers', href: '/collection/bestsellers' },
                  ]
                }
              ]}
            />
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5 justify-end w-[200px] h-full">
            <SearchModal triggerClass="text-gray-900 hover:text-gray-500 transition-colors p-1" />
            <div className="relative group/profile h-full flex items-center">
              {user ? (
                <Link href="/profile" className="text-gray-900 hover:text-gray-500 transition-colors p-1 flex items-center h-full">
                  <User className="w-[18px] h-[18px]" strokeWidth={2} />
                </Link>
              ) : (
                <button suppressHydrationWarning onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }} className="text-gray-900 hover:text-gray-500 transition-colors p-1 flex items-center h-full">
                  <User className="w-[18px] h-[18px]" strokeWidth={2} />
                </button>
              )}

              <div className="absolute top-full right-0 w-[200px] bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-300 z-50 flex flex-col py-2 rounded-b-md">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <span className="block text-[11px] font-semibold text-gray-900 truncate">{user.displayName || user.email}</span>
                    </div>
                    {sanityUser?.isAdmin && (
                      <Link href="/admin" className="px-4 py-2.5 text-[11px] font-bold tracking-wider uppercase text-blue-600 hover:bg-blue-50 transition-colors">Admin Portal</Link>
                    )}
                    <Link href="/profile" className="px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">Profile</Link>
                    <button onClick={() => signOut(auth)} className="text-left cursor-pointer px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-red-600 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-1 pt-3.5 w-full">Logout</button>
                  </>
                ) : (
                  <>
                    <button suppressHydrationWarning onClick={() => { setAuthModalMode('login'); setIsAuthModalOpen(true); }} className="text-left w-full cursor-pointer px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">Log In</button>
                    <button suppressHydrationWarning onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }} className="text-left w-full cursor-pointer px-4 py-2.5 text-[11px] font-semibold tracking-wider uppercase text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">Create Account</button>
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authModalMode} />

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
                <Link href="/collection/new-in" className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                  New In <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                {navigation?.categories?.map((cat: any) => (
                  <div key={cat.slug} className="flex flex-col border-b border-gray-50">
                    <Link href={`/category/${cat.slug}`} className="px-6 py-4 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                      {cat.title} <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    {cat.subcategories?.map((sub: any) => (
                      <Link key={sub.slug} href={`/category/${sub.slug}`} className="px-10 py-3 text-[11px] text-gray-600 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                ))}

                {navigation?.collections?.map((col: any) => (
                  <Link key={col.slug} href={`/collection/${col.slug}`} className="px-6 py-4 border-b border-gray-50 flex items-center justify-between" onClick={() => setIsMobileMenuOpen(false)}>
                    {col.title} <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700 pb-2 border-b border-gray-200">
                    <User className="w-5 h-5" strokeWidth={1.5} /> 
                    <div className="flex flex-col">
                      <span>My Account</span>
                      <span className="text-[11px] font-normal text-gray-500">{user.displayName || user.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {sanityUser?.isAdmin && (
                      <Link href="/admin" className="text-left w-full px-4 py-3 text-[13px] font-semibold text-blue-600 bg-blue-50/50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Admin Portal</Link>
                    )}
                    <Link href="/profile" className="text-left w-full px-4 py-3 text-[13px] font-semibold text-gray-900 bg-gray-100/50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                    <button onClick={() => { setIsMobileMenuOpen(false); signOut(auth); }} className="text-left w-full px-4 py-3 text-[13px] font-semibold text-red-600 bg-red-50/50 rounded-lg">Logout</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setIsMobileMenuOpen(false); setAuthModalMode('login'); setIsAuthModalOpen(true); }} className="w-full px-4 py-3.5 text-[13px] font-semibold text-gray-900 bg-gray-200/50 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-gray-200">
                    <User className="w-4 h-4"/> Log In
                  </button>
                  <button onClick={() => { setIsMobileMenuOpen(false); setAuthModalMode('signup'); setIsAuthModalOpen(true); }} className="w-full px-4 py-3.5 text-[13px] font-semibold text-white bg-black hover:bg-[#222] transition-colors rounded-lg text-center">
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

