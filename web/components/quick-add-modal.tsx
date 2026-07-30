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
  };
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', 'Custom Tailored'];
const COLORS = ['Black'];

export function QuickAddModal({ isOpen, onClose, product }: QuickAddModalProps) {
  const [selectedSize, setSelectedSize] = useState('XS');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);

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
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 pr-8">{product.title}</h2>
          <p className="text-gray-900 font-medium mb-8">
            Rs.{product.price.toLocaleString('en-IN')}.00
          </p>

          <div className="space-y-6">
            {/* Size */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-gray-700 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Color</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-2.5 text-sm border transition-colors ${
                      selectedColor === color
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 text-gray-700 hover:border-gray-900'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
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
              className="flex-1 bg-black text-white h-12 flex items-center justify-center gap-2 font-semibold text-sm hover:bg-gray-900 transition-colors"
              onClick={() => {
                // Handle add to cart logic here
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
