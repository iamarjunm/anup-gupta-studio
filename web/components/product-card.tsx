'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, MoveLeft, MoveRight } from 'lucide-react';
import { useState } from 'react';
import { QuickAddModal } from './quick-add-modal';

interface ProductCardProps {
  title: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  hoverImageUrl?: string;
  galleryUrls?: string[];
  href: string;
  slug?: string;
  sizes?: { size: string; stock?: number }[];
  color?: string;
  styles?: { name: string; price: number }[];
  categorySlugs?: string[];
}

export function ProductCard({ title, price, originalPrice, imageUrl, hoverImageUrl, galleryUrls, href, slug, sizes, color, styles, categorySlugs }: ProductCardProps) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const images = [imageUrl, ...(galleryUrls || [])].filter(Boolean);
  const displayImage = images[currentImageIdx] || imageUrl;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="flex flex-col group">
        <Link href={href} className="relative aspect-[3/4] overflow-hidden mb-3 bg-[#f5f5f5] block">
          <Image
            src={displayImage}
            alt={title}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${images.length > 1 && currentImageIdx === 0 ? 'group-hover:opacity-0' : ''}`}
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          {images.length > 1 && currentImageIdx === 0 && (
            <Image
              src={images[1]}
              alt={title}
              fill
              className={`object-cover transition-all duration-500 scale-100 opacity-0 group-hover:scale-105 group-hover:opacity-100`}
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
          )}
          
          {/* Hover Arrows */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
              >
                <MoveLeft className="w-8 h-8" strokeWidth={1} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
              >
                <MoveRight className="w-8 h-8" strokeWidth={1} />
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentImageIdx ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}

          {originalPrice && (
            <div className="absolute top-3 right-3 bg-[#222] text-white text-[10px] font-medium px-2 py-1 rounded-sm shadow-sm z-10">
              Sale
            </div>
          )}
          <div className="absolute bottom-4 right-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             <button 
               suppressHydrationWarning
               className="group/btn bg-white border border-gray-200 text-black h-10 rounded-full flex items-center shadow-md transition-all duration-300 overflow-hidden w-10 hover:w-[100px]" 
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 setIsQuickAddOpen(true);
               }}
             >
               <div className="relative flex items-center justify-center shrink-0 w-10 h-10">
                 <div className="relative">
                   <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                   <span className="absolute -bottom-1 -right-1 bg-black text-white w-3 h-3 rounded-full flex items-center justify-center text-[10px] font-bold leading-none pb-[1px]">+</span>
                 </div>
               </div>
               <span className="text-[11px] font-semibold tracking-wider whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pr-4">
                 CHOOSE
               </span>
             </button>
          </div>
        </Link>
        <Link href={href} className="flex flex-col space-y-1">
          <h3 className="text-[13px] text-gray-900 leading-snug line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-gray-900 font-medium">Rs.{(price || 0).toLocaleString('en-IN')}.00</span>
            {originalPrice && (
              <span className="text-[12px] text-gray-500 line-through">Rs.{(originalPrice || 0).toLocaleString('en-IN')}.00</span>
            )}
          </div>
        </Link>
      </div>

      <QuickAddModal 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        product={{
          title,
          price,
          image: imageUrl,
          slug: slug || href.split('/').pop() || '',
          sizes: sizes,
          color: color,
          styles: styles,
          categorySlugs: categorySlugs
        }}
      />
    </>
  )
}

