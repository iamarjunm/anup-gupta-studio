import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16 mb-20">
        <div className="space-y-6">
          <h4 className="text-[13px] text-gray-900 uppercase">SHOP</h4>
          <nav className="flex flex-col gap-4 text-[13px] text-gray-800">
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">New Arrivals</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Handcrafted Shirts</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Handcrafted Kurta</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Cotton Oversized Shirts</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Gift Card</Link>
          </nav>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-[13px] text-gray-900 uppercase">HELP</h4>
          <nav className="flex flex-col gap-4 text-[13px] text-gray-800">
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Returns Policy</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Shipping/Returns</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Privacy Policy</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Terms and Conditions</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Fit Guide</Link>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-[13px] text-gray-900 uppercase">ABOUT</h4>
          <nav className="flex flex-col gap-4 text-[13px] text-gray-800">
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">The Label</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">FAQs</Link>
            <Link href="#" className="hover:text-black transition-colors inline-block w-fit">Contact Us</Link>
          </nav>
        </div>

        <div className="space-y-6">
          <h4 className="text-[13px] text-gray-900 uppercase mb-8">SIGN UP TO THE KOKO CLUB</h4>
          <form suppressHydrationWarning className="flex w-full border-b border-gray-300 pb-2 focus-within:border-black transition-colors group">
            <input 
              suppressHydrationWarning
              type="email" 
              placeholder="Email address" 
              className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-gray-800 text-gray-900"
              required
            />
            <button suppressHydrationWarning type="submit" className="text-gray-900 hover:text-gray-500 transition-colors pl-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 md:px-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[13px] text-gray-600">
          © {new Date().getFullYear()} Anup Gupta
        </p>
        <div className="flex justify-center gap-6">
          <Link href="#" className="text-gray-600 hover:text-black transition-colors">
            <span className="sr-only">Facebook</span>
            <Facebook className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <Link href="#" className="text-gray-600 hover:text-black transition-colors">
            <span className="sr-only">Instagram</span>
            <Instagram className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </footer>
  )
}
