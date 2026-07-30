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
        <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {(product.availableSizes || ['Custom']).map((size: string) => (
            <button 
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-10 border flex items-center justify-center text-sm transition-colors cursor-pointer
                ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200 hover:border-black'}`}
            >
              {size}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setSelectedSize('Custom Tailored')}
          className={`border text-sm px-4 py-2 transition-colors cursor-pointer
            ${selectedSize === 'Custom Tailored' ? 'bg-black text-white border-black' : 'border-gray-200 text-gray-900 hover:border-black'}`}
        >
          Custom Tailored
        </button>
      </div>

      {children}

      {/* Notes */}
      <p className="text-sm text-gray-600 mb-8">
        * For custom tailored size, Please provide your size details in the Order Notes in the cart
      </p>

      {/* Add to Cart Area */}
      <div className="flex flex-col gap-4 mb-12">
        <div className="flex gap-4 h-12">
          <div className="flex items-center border border-gray-300 w-32">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="flex-1 text-center font-medium">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-[#333] hover:bg-[#222] text-white flex items-center justify-center gap-2 font-medium tracking-wide transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            ADD TO CART
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          className="w-full bg-black hover:bg-gray-900 text-white h-12 font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          BUY IT NOW
        </button>
      </div>
    </>
  );
}
