'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MoveLeft, MoveRight, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const mainImage = images[activeIndex] || images[0];

  return (
    <>
      <div className="flex flex-col gap-4 min-w-0">
        <div className="flex gap-4 min-w-0">
          {/* Thumbnails (Hidden on Mobile) */}
          <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
            {images.map((img: string, i: number) => (
              <button 
                key={i} 
                suppressHydrationWarning
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-[3/4] border-2 transition-colors overflow-hidden cursor-pointer ${activeIndex === i ? 'border-gray-900' : 'border-transparent hover:border-gray-300'}`}
              >
                <Image 
                  src={img} 
                  alt={`Thumbnail ${i+1}`} 
                  fill 
                  className="object-cover" 
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div 
            className="relative aspect-[3/4] w-full bg-[#f5f5f5] overflow-hidden cursor-zoom-in group"
            onClick={() => setIsModalOpen(true)}
          >
            {mainImage ? (
              <>
                <Image 
                  src={mainImage} 
                  alt={title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  priority
                />
                
                {/* Mobile/Desktop Arrows */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-2 md:opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                    >
                      <MoveLeft className="w-8 h-8" strokeWidth={1} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 md:opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                    >
                      <MoveRight className="w-8 h-8" strokeWidth={1} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
            )}
          </div>
        </div>

        {/* Mobile Pagination Dots */}
        {images.length > 1 && (
          <div className="flex md:hidden items-center justify-center gap-2 mt-2">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[10000] bg-[#111] bg-opacity-100 flex flex-col h-[100dvh] w-screen">
          {/* Close Button */}
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-50 p-2"
          >
            <X className="w-8 h-8" strokeWidth={1} />
          </button>

          {/* Modal Main Image */}
          <div className="flex-1 relative w-full flex items-center justify-center p-0 sm:p-4 min-h-0">
             <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
               <Image 
                  src={mainImage} 
                  alt={title}
                  fill
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
             </div>
             
             {/* Arrows in Modal */}
             {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 transition-colors drop-shadow-md"
                  >
                    <MoveLeft className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 transition-colors drop-shadow-md"
                  >
                    <MoveRight className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={1} />
                  </button>
                </>
              )}
          </div>

          {/* Modal Thumbnails */}
          <div className="h-24 sm:h-32 shrink-0 w-full bg-[#0a0a0a] flex items-center justify-start sm:justify-center gap-3 p-4 overflow-x-auto border-t border-white/5">
            {images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveIndex(i)}
                className={`relative h-full aspect-[3/4] border transition-colors shrink-0 ${activeIndex === i ? 'border-white/50' : 'border-transparent hover:border-white/30 opacity-50 hover:opacity-100'}`}
              >
                <Image 
                  src={img} 
                  alt={`Modal Thumbnail ${i+1}`} 
                  fill 
                  className="object-cover" 
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
