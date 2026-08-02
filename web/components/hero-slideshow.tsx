'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';

const SLIDES = [
  {
    imageUrl: "https://picsum.photos/seed/hero_slide_1/1920/1080",
    heading1: "From Dawn Till Dusk",
    heading2: "Hand-Embroidered Contemporary Fits",
    link: "#"
  },
  {
    imageUrl: "https://picsum.photos/seed/hero_slide_2/1920/1080",
    heading1: "A New Narrative",
    heading2: "Signature Evening Wear",
    link: "#"
  },
  {
    imageUrl: "https://picsum.photos/seed/hero_slide_3/1920/1080",
    heading1: "Classic Monochrome",
    heading2: "The Timeless Collection",
    link: "#"
  }
];

interface Slide {
  heading1?: string;
  heading2?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

export function HeroSlideshow({ slides }: { slides?: Slide[] }) {
  const activeSlides = slides && slides.length > 0 ? slides : SLIDES;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full h-[calc(100vh-104px)] bg-gray-900 overflow-hidden">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {activeSlides.map((slide, index) => (
            <div className="relative flex-[0_0_100%] min-w-0 h-full" key={index}>
              <Image 
                src={slide.imageUrl || ''} 
                alt={slide.heading1 || 'Hero Slide'}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                priority={index === 0}
              />
              {slide.link ? (
                <Link href={slide.link} className="absolute inset-0 z-10">
                  <span className="sr-only">Go to {slide.heading1}</span>
                </Link>
              ) : null}
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-end text-white pb-16 pointer-events-none">
                 {slide.heading1 && (
                   <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif uppercase tracking-[0.05em] text-center mb-2 max-w-4xl leading-tight text-white drop-shadow-lg">
                     {slide.heading1}
                   </h1>
                 )}
                 {slide.heading2 && (
                   <p className="text-sm md:text-lg tracking-widest uppercase font-light drop-shadow-md mb-8">
                     {slide.heading2}
                   </p>
                 )}
                 {slide.description && (
                   <p className="text-sm md:text-base font-light mb-8 max-w-2xl text-center">
                     {slide.description}
                   </p>
                 )}
               </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {activeSlides.map((_, index) => (
          <button
            suppressHydrationWarning
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
