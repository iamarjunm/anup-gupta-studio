import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

const CART_ITEMS = [
  {
    id: 1,
    title: "Narasimha Hand Embroidered Designer Kurta",
    color: "Black",
    size: "40",
    price: 16750,
    quantity: 1,
    image: "https://picsum.photos/seed/k1/200/266"
  },
  {
    id: 2,
    title: "Bobcat Hand Embroidered Designer Shawl Set",
    color: "Red",
    size: "42",
    price: 16900,
    quantity: 1,
    image: "https://picsum.photos/seed/k2/200/266"
  }
];

export default function CartPage() {
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST approx
  const total = subtotal + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
      <h1 className="text-2xl md:text-3xl font-semibold uppercase tracking-wide text-gray-900 mb-8 md:mb-12 text-center">
        Your Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Cart Items */}
        <div className="flex-1 w-full">
          <div className="border-t border-gray-200">
            {CART_ITEMS.map((item) => (
              <div key={item.id} className="flex gap-6 py-6 border-b border-gray-200">
                <div className="relative w-24 md:w-32 aspect-[3/4] bg-gray-100 shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 uppercase tracking-wide mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.color} | Size: {item.size}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Rs. {(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center border border-gray-300">
                      <button className="px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-medium w-10 text-center">
                        {item.quantity}
                      </span>
                      <button className="px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px] bg-[#f8f8f8] p-8 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-900 mb-6 border-b border-gray-200 pb-4">
            Order Summary
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">Rs. {(subtotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Estimated Tax</span>
              <span className="font-medium text-gray-900">Rs. {(tax || 0).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-8">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 uppercase tracking-wide">Total</span>
              <span className="font-semibold text-gray-900">Rs. {(total || 0).toLocaleString()}</span>
            </div>
          </div>

          <Link href="/checkout" className="w-full bg-gray-900 text-white flex items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors">
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
          
          <div className="mt-4 text-center">
            <Link href="/" className="inline-block border-b border-gray-400 text-gray-500 text-xs font-medium hover:text-gray-900 hover:border-gray-900 transition-colors pb-0.5">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
