import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Left Side - Forms */}
        <div className="flex-1 w-full lg:pr-8">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          
          <div className="mb-10">
            <h2 className="text-xl font-semibold uppercase tracking-wide text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <input type="email" placeholder="Email" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="offers" className="accent-gray-900" />
                <label htmlFor="offers" className="text-sm text-gray-600">Email me with news and offers</label>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold uppercase tracking-wide text-gray-900 mb-6">Shipping Address</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" />
                <input type="text" placeholder="Last Name" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" />
              </div>
              <input type="text" placeholder="Address" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" />
              <input type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="City" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" />
                <input type="text" placeholder="State" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" />
                <input type="text" placeholder="PIN Code" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" />
              </div>
              <input type="tel" placeholder="Phone" className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold uppercase tracking-wide text-gray-900 mb-6">Payment</h2>
            <div className="p-4 border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-sm gap-2">
              <Lock className="w-4 h-4" /> This is a secure 128-bit SSL encrypted payment
            </div>
            {/* Add mockup payment options here */}
          </div>
        </div>

        {/* Right Side - Summary */}
        <div className="w-full lg:w-[450px]">
          <div className="bg-[#f8f8f8] p-8 lg:sticky lg:top-24 border border-gray-100">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-gray-900 mb-6">In Your Bag</h3>
            
            <div className="flex gap-4 pb-6 border-b border-gray-200 mb-6">
               <div className="relative w-16 aspect-[3/4] bg-gray-100">
                 <Image src="https://picsum.photos/seed/k1/100/133" alt="Item" fill className="object-cover" referrerPolicy="no-referrer" sizes="64px" />
                 <span className="absolute -top-2 -right-2 z-10 bg-gray-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
               </div>
               <div className="flex-1 flex flex-col justify-center">
                 <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900 line-clamp-1">Narasimha Hand Embroidered</h4>
                 <p className="text-xs text-gray-500 mt-1">Black / 40</p>
                 <span className="text-sm font-medium text-gray-900 mt-1">Rs. 16,750</span>
               </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">Rs. 16,750</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">Free</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-semibold text-gray-900 uppercase tracking-wide">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-500 mr-2">INR</span>
                  <span className="text-xl font-semibold text-gray-900">Rs. 16,750</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gray-900 text-white py-4 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
