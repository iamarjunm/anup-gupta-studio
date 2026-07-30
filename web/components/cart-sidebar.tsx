'use client';

import { useCart } from '@/contexts/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, cartTotal } = useCart();

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
                  <p className="text-xs text-gray-500 mt-1 mb-1">Size: {item.size}</p>
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
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">Subtotal</span>
              <span className="text-base font-semibold text-gray-900">Rs. {cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6 tracking-wide">Shipping & taxes calculated at checkout.</p>
            <button 
              onClick={() => {
                alert('Checkout is not implemented yet in this demo!');
                setIsCartOpen(false);
              }}
              className="w-full bg-gray-900 text-white py-4 text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors cursor-pointer"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
