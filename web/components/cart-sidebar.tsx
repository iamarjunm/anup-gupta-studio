'use client';

import { useCart } from '@/contexts/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { validateDiscountCode } from '@/app/actions/discount';



export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, cartTotal, appliedDiscount, setAppliedDiscount, promoCode, setPromoCode } = useCart();
  const [promoError, setPromoError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close cart when route changes
  useEffect(() => {
    setIsCartOpen(false);
    setIsCheckingOut(false);
  }, [pathname, setIsCartOpen]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const getFinalTotal = () => {
    if (!appliedDiscount) return cartTotal;
    if (appliedDiscount.discountType === 'percentage') {
      return Math.round(cartTotal - (cartTotal * appliedDiscount.percentageOff) / 100);
    }
    return Math.max(0, cartTotal - appliedDiscount.percentageOff);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity cursor-pointer" 
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Your Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-900 transition-colors -mr-2 cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-200" strokeWidth={1} />
              <p className="text-sm tracking-wide">Your cart is currently empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 border border-gray-900 text-gray-900 px-8 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 aspect-[3/4] bg-gray-50 shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xs font-semibold tracking-wide uppercase text-gray-900 line-clamp-2 leading-relaxed">
                      <Link href={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)}>
                        {item.title}
                      </Link>
                    </h3>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1 -mr-1 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 mb-1">
                    <p>Size: {item.size}</p>
                    {item.color && <p>Color: {item.color}</p>}
                    {item.style && <p>Style: {item.style}</p>}
                  </div>
                  <p className="text-xs font-medium text-gray-900 mb-3">Rs. {item.price.toLocaleString('en-IN')}</p>
                  
                  <div className="mt-auto flex items-center border border-gray-200 w-24">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:text-black cursor-pointer"><Minus className="w-3 h-3" /></button>
                    <span className="flex-1 text-center text-xs font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:text-black cursor-pointer"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4">
            
            {/* Promo Code Section */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 border border-gray-200 px-3 py-2 text-xs uppercase placeholder:normal-case focus:outline-none focus:border-gray-900"
                />
                <button 
                  onClick={async () => {
                    if (!promoCode) return;
                    setIsApplying(true);
                    setPromoError('');
                    const res = await validateDiscountCode(promoCode);
                    if (res.success) {
                       setAppliedDiscount(res.discount);
                    } else {
                       setPromoError(res.error || 'Invalid code');
                       setAppliedDiscount(null);
                    }
                    setIsApplying(false);
                  }}
                  disabled={isApplying || !promoCode}
                  className="bg-gray-900 text-white px-4 py-2 text-xs font-semibold uppercase hover:bg-black disabled:opacity-50 cursor-pointer"
                >
                  {isApplying ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {promoError && <p className="text-[10px] text-red-500">{promoError}</p>}
              {appliedDiscount && <p className="text-[10px] text-green-600">Promo code applied successfully!</p>}
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                   <span>Discount ({appliedDiscount.discountType === 'percentage' ? `${appliedDiscount.percentageOff}% OFF` : `Rs. ${appliedDiscount.percentageOff} OFF`})</span>
                   <span>- Rs. {
                     appliedDiscount.discountType === 'percentage' 
                       ? Math.round((cartTotal * appliedDiscount.percentageOff) / 100).toLocaleString('en-IN')
                       : appliedDiscount.percentageOff.toLocaleString('en-IN')
                   }</span>
                </div>
              )}
              <div className="flex justify-between items-center text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span className="uppercase tracking-wider">Total</span>
                <span>Rs. {getFinalTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center tracking-wide">Shipping & taxes calculated at checkout.</p>
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-gray-900 text-white py-4 text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors cursor-pointer disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Redirecting...
                </>
              ) : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
