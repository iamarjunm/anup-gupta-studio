'use client';

import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { useState } from 'react';
import { submitNewsletter } from '@/app/actions/newsletter';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const formData = new FormData();
    formData.append('email', email);
    
    const result = await submitNewsletter(formData);
    
    if (result.success) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Failed to subscribe');
    }
  };

  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16 mb-20">
        <div className="space-y-6">
          <h4 className="text-[13px] text-gray-900 uppercase">SHOP</h4>
          <nav className="flex flex-col gap-4 text-[13px] text-gray-800">
            <Link href="/collection/all" className="hover:text-black transition-colors inline-block w-fit">Shop All</Link>
            <Link href="/collection/new-in" className="hover:text-black transition-colors inline-block w-fit">New Arrivals</Link>
            <Link href="/collection/bestsellers" className="hover:text-black transition-colors inline-block w-fit">Bestsellers</Link>
            <Link href="/collection/featured" className="hover:text-black transition-colors inline-block w-fit">Featured</Link>
          </nav>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[13px] text-gray-900 uppercase">HELP</h4>
          <nav className="flex flex-col gap-4 text-[13px] text-gray-800">
            <Link href="/returns-policy" className="hover:text-black transition-colors inline-block w-fit">Returns Policy</Link>
            <Link href="/shipping-returns" className="hover:text-black transition-colors inline-block w-fit">Shipping</Link>
            <Link href="/privacy-policy" className="hover:text-black transition-colors inline-block w-fit">Privacy Policy</Link>
            <Link href="/terms-conditions" className="hover:text-black transition-colors inline-block w-fit">Terms and Conditions</Link>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-[13px] text-gray-900 uppercase">ABOUT</h4>
          <nav className="flex flex-col gap-4 text-[13px] text-gray-800">
            <Link href="/about" className="hover:text-black transition-colors inline-block w-fit">The Label</Link>
            <Link href="/faqs" className="hover:text-black transition-colors inline-block w-fit">FAQs</Link>
            <Link href="/contact" className="hover:text-black transition-colors inline-block w-fit">Contact Us</Link>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-[13px] text-gray-900 uppercase mb-8">JOIN OUR NEWSLETTER</h4>
          {status === 'success' ? (
            <div className="text-[13px] text-green-700 font-medium py-2">
              Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubmit} suppressHydrationWarning className="flex w-full border-b border-gray-300 pb-2 focus-within:border-black transition-colors group">
              <input 
                suppressHydrationWarning
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-gray-800 text-gray-900"
                required
                disabled={status === 'loading'}
              />
              <button 
                suppressHydrationWarning 
                type="submit" 
                className="text-gray-900 hover:text-gray-500 transition-colors pl-2 disabled:opacity-50"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                )}
              </button>
            </form>
          )}
          {status === 'error' && (
            <div className="text-[13px] text-red-600 mt-2">{errorMessage}</div>
          )}
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 md:px-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[13px] text-gray-600">
          © {new Date().getFullYear()} Anup Gupta
        </p>
        <div className="flex justify-center gap-6">
          <Link href="https://www.instagram.com/anupguptadesigner/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
            <span className="sr-only">Instagram</span>
            <Instagram className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
