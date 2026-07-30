'use client';

import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';

const SLIDES = [
  {
    image: "https://picsum.photos/seed/hero_slide_1/1920/1080",
    title: "From Dawn Till Dusk",
    subtitle: "Hand-Embroidered Contemporary Fits",
  },
  {
    image: "https://picsum.photos/seed/hero_slide_2/1920/1080",
    title: "A New Narrative",
    subtitle: "Signature Evening Wear",
  },
  {
    image: "https://picsum.photos/seed/hero_slide_3/1920/1080",
    title: "Classic Monochrome",
    subtitle: "The Timeless Collection",
  }
];

export function HeroSlideshow() {
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
          {SLIDES.map((slide, index) => (
            <div className="relative flex-[0_0_100%] min-w-0 h-full" key={index}>
              <Image 
                src={slide.image} 
                alt={slide.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-end text-white pb-16">
                 <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif uppercase tracking-[0.05em] text-center mb-2 max-w-4xl leading-tight text-white drop-shadow-lg">
                   {slide.title}
                 </h1>
                 <p className="text-sm md:text-lg tracking-widest uppercase font-light drop-shadow-md mb-8">
                   {slide.subtitle}
                 </p>
                 <Link href="#" className="bg-white text-black px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-transparent hover:text-white border border-white transition-all duration-300">
                   Shop Collection
                 </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {SLIDES.map((_, index) => (
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
