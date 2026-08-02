'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = images[activeIndex] || images[0];

  return (
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
      <div className="relative aspect-[3/4] w-full bg-[#f5f5f5] overflow-hidden">
        {mainImage ? (
          <Image 
            src={mainImage} 
            alt={title}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
        )}
      </div>
    </div>
  );
}
