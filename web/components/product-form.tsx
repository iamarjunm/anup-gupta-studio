'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

type ProductFormProps = {
  product: {
    slug: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    image: string;
    sizes: { size: string, stock: number }[];
    color?: string;
    styles?: { name: string, price: number }[];
  };
  children?: React.ReactNode;
};

export function ProductForm({ product, children }: ProductFormProps) {
  const { toast } = useToast();
  const defaultSize = product.sizes?.find(s => s.stock > 0)?.size || 'Custom Tailored';
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();
  
  const defaultStyle = product.styles && product.styles.length > 0 ? product.styles[0] : undefined;
  const [selectedStyle, setSelectedStyle] = useState(defaultStyle);

  const displayPrice = selectedStyle?.price || product.price;
  
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

  const [showStickyBar, setShowStickyBar] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (!showStickyBar && window.scrollY > 300) {
        setShowStickyBar(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showStickyBar]);

  const handleAddToCart = (openCart: boolean = true) => {
    // Basic validation for custom tailored
    if (selectedSize === 'Custom Tailored') {
      const missing = Object.entries(measurements).find(([_, val]) => !val.trim());
      if (missing) {
        toast(`Please enter your measurement for: ${missing[0]}`, 'warning');
        return;
      }
    }

    addItem({
      slug: product.slug,
      title: product.title,
      price: displayPrice,
      image: product.image,
      size: selectedSize,
      quantity,
      color: product.color,
      style: selectedStyle?.name,
      ...(selectedSize === 'Custom Tailored' && { measurements })
    }, openCart);

    if (!openCart) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
    setShowStickyBar(false);
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <p className="text-gray-900 font-semibold text-sm tracking-wide">
          Rs. {(displayPrice || 0).toLocaleString('en-IN')}.00
        </p>
        {product.compareAtPrice && !selectedStyle && (
          <p className="text-gray-400 line-through text-sm tracking-wide">
            Rs. {(product.compareAtPrice || 0).toLocaleString('en-IN')}.00
          </p>
        )}
      </div>

      {/* Size Selector */}
      <div className="mb-4">
        <h3 className="text-[13px] text-gray-900 mb-3">
          Size
        </h3>
        
        {/* Sizes Layout */}
        <div className="flex flex-wrap gap-2">
          {(product.sizes || []).map((sizeObj: any) => {
            const isOutOfStock = sizeObj.stock === 0;
            return (
              <button 
                key={sizeObj.size}
                disabled={isOutOfStock}
                suppressHydrationWarning
                onClick={() => {
                  setSelectedSize(sizeObj.size);
                  setShowStickyBar(true);
                }}
                className={`h-10 min-w-[40px] px-3 border flex flex-col items-center justify-center transition-colors
                  ${isOutOfStock ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' :
                    selectedSize === sizeObj.size ? 'bg-black text-white border-black cursor-pointer' : 'bg-white text-gray-900 border-gray-200 hover:border-black cursor-pointer'}`}
              >
                <span className={`text-[13px] ${isOutOfStock ? 'line-through' : ''}`}>{sizeObj.size}</span>
              </button>
            )
          })}
          
          {/* Custom Tailored Button */}
          <button 
            suppressHydrationWarning
            onClick={() => {
              setSelectedSize('Custom Tailored');
              setShowStickyBar(true);
            }}
            className={`h-10 px-5 border flex items-center justify-center text-[13px] transition-colors cursor-pointer
              ${selectedSize === 'Custom Tailored' ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200 hover:border-black'}`}
          >
            Custom Tailored
          </button>
        </div>

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

      {/* Color Display */}
      {product.color && (
        <div className="mb-4">
          <h3 className="text-[13px] text-gray-900 mb-3">
            Color
          </h3>
          <div className="inline-flex h-10 px-5 items-center justify-center bg-black text-white text-[13px]">
            {product.color}
          </div>
        </div>
      )}

      {/* Style Selector */}
      {product.styles && product.styles.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[13px] text-gray-900 mb-3">
            Style
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.styles.map((style) => (
              <button 
                key={style.name}
                suppressHydrationWarning
                onClick={() => setSelectedStyle(style)}
                className={`h-10 px-5 border flex items-center justify-center text-[13px] transition-colors cursor-pointer
                  ${selectedStyle?.name === style.name ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200 hover:border-black'}`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      )}


      {children}

      {/* Add to Cart Area */}
      <div className="flex flex-col gap-3 mb-10">
        <div className="flex gap-3 h-[46px]">
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
        </div>

        {/* Buy It Now */}
        <button 
          suppressHydrationWarning
          onClick={() => handleAddToCart(true)}
          className="w-full h-[46px] bg-black hover:bg-[#1a1a1a] text-white text-[11px] font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          BUY IT NOW
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      {/* Sticky Bottom Bar */}
      {mounted && createPortal(
        <div 
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl bg-white border border-gray-200 p-2 shadow-2xl z-[9999] transition-transform duration-300 hidden md:flex items-center justify-between ${showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-16 relative bg-gray-100 shrink-0">
               <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <p className="text-[13px] font-semibold text-gray-900 truncate max-w-[200px] md:max-w-xs">{product.title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {selectedSize} 
                {product.color && ` / ${product.color}`}
                {selectedStyle && ` / ${selectedStyle.name}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 pr-2">
            <p className="text-[13px] font-medium text-gray-900 hidden sm:block">
              Rs. {displayPrice.toLocaleString('en-IN')}.00
            </p>
            <button 
              suppressHydrationWarning
              onClick={() => handleAddToCart(false)}
              className="bg-black hover:bg-[#1a1a1a] text-white px-6 py-3 text-[11px] font-semibold tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
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
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
