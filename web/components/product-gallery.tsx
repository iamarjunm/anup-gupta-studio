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
                  sizes="(max-width: 768px) 25vw, 10vw"
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
                  sizes="(max-width: 768px) 100vw, 50vw"
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
        <div className="fixed inset-0 z-[10000] bg-[#000] h-[100dvh] w-screen overflow-hidden">
          {/* Close Button */}
          <button 
            onClick={() => setIsModalOpen(false)}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white z-[10002] p-2 bg-black/40 hover:bg-black/80 rounded-full transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
          </button>

          {/* Modal Main Image Scroll Area */}
          <div 
            id="gallery-scroll-container"
            className="absolute inset-0 w-full h-full overflow-y-auto scroll-smooth flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onScroll={(e) => {
              const target = e.currentTarget;
              // Estimate which image is in view
              const imageHeight = target.scrollWidth * 1.333; // Approx 3:4 aspect ratio
              const index = Math.round(target.scrollTop / imageHeight);
              if (index !== activeIndex && index >= 0 && index < images.length) {
                setActiveIndex(index);
              }
            }}
          >
            {images.map((img: string, i: number) => (
              <div 
                key={i}
                id={`modal-img-${i}`}
                className="w-full relative"
                ref={el => {
                  if (el && isModalOpen && i === activeIndex && !el.dataset.scrolled) {
                    el.scrollIntoView();
                    el.dataset.scrolled = "true";
                  }
                }}
              >
                <Image 
                  src={img} 
                  alt={`${title} - Image ${i + 1}`}
                  width={1500}
                  height={2000}
                  className="w-full h-auto block"
                  referrerPolicy="no-referrer"
                  sizes="100vw"
                  priority={i === activeIndex}
                />
              </div>
            ))}
          </div>

          {/* Modal Thumbnails Sidebar (Overlaid) */}
          <div className="absolute top-0 right-0 w-[80px] sm:w-[120px] h-full flex flex-col items-center gap-3 sm:gap-4 p-3 sm:p-4 overflow-y-auto py-20 z-[10001] pointer-events-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => {
                  setActiveIndex(i);
                  const targetElement = document.getElementById(`modal-img-${i}`);
                  if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`pointer-events-auto relative w-full aspect-[3/4] border transition-all shrink-0 ${activeIndex === i ? 'border-white/80 opacity-100 scale-100' : 'border-transparent opacity-40 hover:opacity-100 scale-95'}`}
              >
                <Image 
                  src={img} 
                  alt={`Modal Thumbnail ${i+1}`} 
                  fill 
                  className="object-cover" 
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 768px) 25vw, 10vw"
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
