'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

type ProductFormProps = {
  product: {
    slug: string;
    title: string;
    price: number;
    image: string;
    availableSizes: string[];
  };
  children?: React.ReactNode;
};

export function ProductForm({ product, children }: ProductFormProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes?.[0] || 'Custom');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity,
    });
  };

  return (
    <>
      {/* Size Selector */}
      <div className="mb-6">
        <h3 className="text-[13px] text-gray-600 mb-3 tracking-wide">Size</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {(product.availableSizes || ['Custom']).map((size: string) => (
            <button 
              key={size}
              suppressHydrationWarning
              onClick={() => setSelectedSize(size)}
              className={`h-9 min-w-[36px] px-3 border flex items-center justify-center text-[11px] tracking-widest transition-colors cursor-pointer
                ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200 hover:border-black'}`}
            >
              {size}
            </button>
          ))}
          <button 
            suppressHydrationWarning
            onClick={() => setSelectedSize('Custom Tailored')}
            className={`h-9 px-4 border flex items-center justify-center text-[11px] tracking-widest transition-colors cursor-pointer
              ${selectedSize === 'Custom Tailored' ? 'bg-black text-white border-black' : 'bg-[#fcfcfc] text-gray-600 border-gray-200 hover:border-black'}`}
          >
            CUSTOM TAILORED
          </button>
        </div>
      </div>

      {/* Style Selector */}
      <div className="mb-6">
        <h3 className="text-[13px] text-gray-600 mb-3 tracking-wide">Style</h3>
        <div className="flex gap-2">
          <button suppressHydrationWarning className="h-9 px-5 bg-black text-white text-[11px] tracking-widest cursor-pointer">
            Only Kurta
          </button>
          <button suppressHydrationWarning className="h-9 px-5 border border-gray-200 text-gray-600 hover:text-black hover:border-black text-[11px] tracking-widest transition-colors cursor-pointer">
            Kurta set with Pant
          </button>
        </div>
      </div>

      {children}

      {/* Notes */}
      <p className="text-xs text-gray-600 mb-6 leading-relaxed">
        * For custom tailored size, Please provide your size details in the Order Notes in the cart
      </p>

      {/* Add to Cart Area */}
      <div className="flex gap-3 mb-10 h-[46px]">
        {/* Quantity */}
        <div className="flex items-center border border-gray-200 w-24 shrink-0 bg-white">
          <button 
            suppressHydrationWarning
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 text-gray-400 hover:text-black transition-colors cursor-pointer h-full flex items-center justify-center"
          >
            <Minus className="w-3 h-3" strokeWidth={1.5} />
          </button>
          <span suppressHydrationWarning className="flex-1 text-center font-medium text-[13px] text-gray-700">{quantity}</span>
          <button 
            suppressHydrationWarning
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 text-gray-400 hover:text-black transition-colors cursor-pointer h-full flex items-center justify-center"
          >
            <Plus className="w-3 h-3" strokeWidth={1.5} />
          </button>
        </div>
        
        {/* Add to Cart */}
        <button 
          suppressHydrationWarning
          onClick={handleAddToCart}
          className="flex-1 bg-black hover:bg-[#1a1a1a] text-white flex items-center justify-center gap-2 text-[11px] font-semibold tracking-widest transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          ADD TO CART
        </button>

        {/* Buy It Now */}
        <button 
          suppressHydrationWarning
          onClick={handleAddToCart}
          className="flex-1 bg-black hover:bg-[#1a1a1a] text-white text-[11px] font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          BUY IT NOW
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </>
  );
}
