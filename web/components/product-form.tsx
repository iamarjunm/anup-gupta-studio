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
    sizes: { size: string, stock: number }[];
  };
  children?: React.ReactNode;
};

export function ProductForm({ product, children }: ProductFormProps) {
  const defaultSize = product.sizes?.find(s => s.stock > 0)?.size || 'Custom Tailored';
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  
  const [measurements, setMeasurements] = useState<Record<string, string>>({
    'Chest': '',
    'Waist': '',
    'Hips': '',
    'Sleeve Length': '',
    'Neck': '',
    'Stomach': '',
    'Shoulder': '',
    'Shirt Length': ''
  });

  const handleAddToCart = (openCart: boolean = true) => {
    // Basic validation for custom tailored
    if (selectedSize === 'Custom Tailored') {
      const missing = Object.entries(measurements).find(([_, val]) => !val.trim());
      if (missing) {
        alert(`Please enter your measurement for: ${missing[0]}`);
        return;
      }
    }

    addItem({
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity,
      ...(selectedSize === 'Custom Tailored' && { measurements })
    }, openCart);

    if (!openCart) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <>
      {/* Size Selector */}
      <div className="mb-6">
        <h3 className="text-[13px] text-gray-600 mb-3 tracking-wide flex items-center justify-between">
          <span>Size</span>
        </h3>
        
        {/* Sizes Grid */}
        <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-4">
          {(product.sizes || []).map((sizeObj: any) => {
            const isOutOfStock = sizeObj.stock === 0;
            return (
              <button 
                key={sizeObj.size}
                disabled={isOutOfStock}
                suppressHydrationWarning
                onClick={() => setSelectedSize(sizeObj.size)}
                className={`h-12 border flex flex-col items-center justify-center transition-colors
                  ${isOutOfStock ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' :
                    selectedSize === sizeObj.size ? 'bg-black text-white border-black cursor-pointer' : 'bg-white text-gray-900 border-gray-200 hover:border-black cursor-pointer'}`}
              >
                <span className={`text-[13px] ${isOutOfStock ? 'line-through' : ''}`}>{sizeObj.size}</span>
              </button>
            )
          })}
        </div>

        {/* Custom Tailored Button */}
        <button 
          suppressHydrationWarning
          onClick={() => setSelectedSize('Custom Tailored')}
          className={`h-11 px-6 border flex items-center justify-center text-[13px] transition-colors cursor-pointer
            ${selectedSize === 'Custom Tailored' ? 'bg-black text-white border-black font-medium' : 'bg-white text-gray-900 border-gray-200 hover:border-black font-medium'}`}
        >
          Custom Tailored
        </button>

        {/* Custom Measurements Form */}
        {selectedSize === 'Custom Tailored' && (
          <div className="mt-6 mb-6 p-5 bg-[#fcfcfc] border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-[13px] font-semibold tracking-wide text-gray-900 mb-4">Enter Your Measurements (inches/cm)</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(measurements).map(field => (
                <div key={field} className="flex flex-col">
                  <label className="text-[11px] text-gray-600 mb-1">{field}</label>
                  <input 
                    type="text"
                    placeholder="e.g., 38"
                    value={measurements[field]}
                    onChange={(e) => setMeasurements({...measurements, [field]: e.target.value})}
                    className="h-10 px-3 border border-gray-200 text-[13px] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
              * Please ensure measurements are accurate. Custom tailored pieces cannot be returned.
            </p>
          </div>
        )}
      </div>



      {children}

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
          onClick={() => handleAddToCart(false)}
          className="flex-1 bg-black hover:bg-[#1a1a1a] text-white flex items-center justify-center gap-2 text-[11px] font-semibold tracking-widest transition-colors cursor-pointer"
        >
          {isAdded ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              ADDED
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              ADD TO CART
            </>
          )}
        </button>

        {/* Buy It Now */}
        <button 
          suppressHydrationWarning
          onClick={() => handleAddToCart(true)}
          className="flex-1 bg-black hover:bg-[#1a1a1a] text-white text-[11px] font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          BUY IT NOW
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </>
  );
}
