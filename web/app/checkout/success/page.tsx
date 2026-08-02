import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" strokeWidth={1.5} />
          </div>
        </div>
        
        <h1 className="text-3xl font-semibold tracking-wide text-gray-900 uppercase">
          Order Confirmed
        </h1>
        
        <p className="text-gray-500 text-sm leading-relaxed">
          Thank you for shopping with Anup Gupta Studio. Your order has been successfully placed and payment is verified. We will send you a confirmation email shortly.
        </p>
        
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors"
          >
            Continue Shopping
          </Link>
          <Link 
            href="/profile"
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 text-xs font-semibold uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
