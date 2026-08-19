'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    title: string;
    price: number;
    image: string;
    slug: string;
    sizes?: { size: string; stock?: number }[];
    color?: string;
    styles?: { name: string; price: number }[];
    categorySlugs?: string[];
  };
}

import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', 'Custom Tailored'];

export function QuickAddModal({ isOpen, onClose, product }: QuickAddModalProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const isAccessory = product.categorySlugs?.includes('accessories');
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes.map(s => s.size) : DEFAULT_SIZES;
  
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'XS');
  const [quantity, setQuantity] = useState(1);
  const defaultStyle = product.styles && product.styles.length > 0 ? product.styles[0] : undefined;
  const [selectedStyle, setSelectedStyle] = useState(defaultStyle);
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

  const displayPrice = selectedStyle?.price || product.price;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-[900px] h-[85vh] sm:h-auto sm:max-h-[90vh] flex flex-col sm:flex-row overflow-hidden shadow-2xl z-10 m-4 rounded-lg">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-500 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Image Section */}
        <div className="w-full sm:w-[45%] h-[40vh] sm:h-auto relative bg-[#f5f5f5] shrink-0">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
            sizes="(max-width: 640px) 100vw, 45vw"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">{product.title}</h2>
          <p className="text-gray-900 font-medium mb-8">
            Rs.{displayPrice.toLocaleString('en-IN')}.00
          </p>

          <div className="space-y-6">
            {/* Size */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {(product.sizes && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES.map(s => ({ size: s, stock: 1 }))).map((sizeObj: any) => {
                  const isOutOfStock = sizeObj.stock === 0;
                  return (
                    <button
                      key={sizeObj.size}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(sizeObj.size)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        isOutOfStock ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' :
                        selectedSize === sizeObj.size
                          ? 'bg-black text-white border-black cursor-pointer'
                          : 'border-gray-200 text-gray-700 hover:border-gray-900 cursor-pointer'
                      }`}
                    >
                      {sizeObj.size}
                    </button>
                  );
                })}
                {/* Custom Tailored Button */}
                {!isAccessory && (!product.sizes || !product.sizes.some(s => s.size === 'Custom Tailored')) && (
                  <button
                    onClick={() => setSelectedSize('Custom Tailored')}
                    className={`px-4 py-2 text-sm border transition-colors cursor-pointer ${
                      selectedSize === 'Custom Tailored'
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-gray-700 hover:border-gray-900'
                    }`}
                  >
                    Custom Tailored
                  </button>
                )}
              </div>
            </div>

            {/* Custom Measurements Form */}
            {!isAccessory && selectedSize === 'Custom Tailored' && (
              <div className="mt-6 p-5 bg-[#fcfcfc] border border-gray-200">
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

            {/* Color Display */}
            {product.color && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Color</p>
                <div className="inline-flex h-10 px-4 items-center justify-center bg-black text-white text-sm">
                  {product.color}
                </div>
              </div>
            )}

            {/* Style Selector */}
            {product.styles && product.styles.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Style</p>
                <div className="flex flex-wrap gap-2">
                  {product.styles.map((style) => (
                    <button
                      key={style.name}
                      onClick={() => setSelectedStyle(style)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedStyle?.name === style.name
                          ? 'bg-black text-white border-black'
                          : 'border-gray-200 text-gray-700 hover:border-gray-900'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart Actions */}
          <div className="mt-10 flex gap-4">
            <div className="flex items-center border border-gray-200 w-32 shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-12 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              className="flex-1 bg-black text-white h-12 flex items-center justify-center gap-2 font-semibold text-sm hover:bg-gray-900 transition-colors disabled:opacity-50"
              disabled={!selectedSize}
              onClick={() => {
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
                  quantity: quantity,
                  color: product.color,
                  style: selectedStyle?.name,
                  ...(selectedSize === 'Custom Tailored' && { measurements })
                });
                onClose();
              }}
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={2} />
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
