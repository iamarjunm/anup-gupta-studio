import Image from "next/image";
import Link from "next/link";
import { Suspense } from 'react';

import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { ShieldCheck, Award, ThumbsUp } from "lucide-react";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { InstagramPost } from "@/components/instagram-post";
import { client } from "@/lib/sanity";
import {
  HERO_QUERY,
  CATEGORIES_QUERY,
  MARQUEE_QUERY,
  NEW_ARRIVALS_QUERY,
  BESTSELLERS_QUERY,
  FEATURED_SECTIONS_QUERY,
  CELEBRITIES_QUERY,
  GLOBAL_SETTINGS_QUERY
} from "@/lib/queries";

const FALLBACK_CELEBRITIES = [
  { name: "Honey Singh", seed: "honey", link: "/category/shirts" },
  { name: "Allu Arjun", seed: "allu", link: "/category/shirts" },
  { name: "Devansh Kamboj", seed: "devansh", link: "/category/shirts" },
  { name: "Diljit Dosanjh", seed: "diljit", link: "/category/shirts" },
  { name: "Ranveer Singh", seed: "ranveer", link: "/category/shirts" },
  { name: "Vicky Kaushal", seed: "vicky", link: "/category/shirts" },
  { name: "Shahid Kapoor", seed: "shahid", link: "/category/shirts" },
  { name: "Ayushmann Khurrana", seed: "ayushmann", link: "/category/shirts" },
];


const FALLBACK_NEW_DROPS = [
  { title: "Slither(Snake) - Hand Embroidered Designer Shirt", price: 8900, seed: "snake" },
  { title: "Conquerer(Globe) - Hand Embroidered Designer Shirt", price: 8900, seed: "globe" },
  { title: "Cobweb(Spider) - Hand Embroidered Designer Shirt", price: 7250, seed: "spider" },
  { title: "Ember - Hand Embroidered Designer Shirt", price: 5750, seed: "ember" },
  { title: "Zodiac Signs - Hand Embroidered Designer Shirt", price: 8900, seed: "zodiac" },
];

const FALLBACK_BESTSELLERS = [
  { title: "The Champagne Shirt - Black", price: 5200, seed: "champagne" },
  { title: "Leopard/Animal Print - Handcrafted Designer Shirt", price: 7650, seed: "leopard" },
  { title: "Drizzle Metal (Chain) Hand Embroidered Designer Shirt", price: 5750, seed: "drizzle" },
  { title: "Parrot hand embroidered designer shirt - Black", price: 8900, seed: "parrot", originalPrice: 9000 },
  { title: "Scorpion Hand Embroidered Designer Shirt", price: 8900, seed: "scorpion" },
];

// Helper to map either real Sanity data or fallback data
const mapProduct = (product: any) => ({
  title: product.title,
  price: product.price,
  originalPrice: product.compareAtPrice || product.originalPrice,
  imageUrl: product.imageUrl || (product.seed ? `https://picsum.photos/seed/${product.seed}/600/800` : undefined),
  hoverImageUrl: product.hoverImageUrl || (product.seed ? `https://picsum.photos/seed/${product.seed}_hover/600/800` : undefined),
  href: `/product/${product.slug || 'sample-product'}`,
  slug: product.slug,
  sizes: product.sizes,
  color: product.color,
  styles: product.styles
});

function HomeLoader() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Hero Skeleton */}
      <div className="w-full h-[80vh] md:h-screen bg-gray-100 animate-pulse"></div>
      {/* Section Skeleton */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-16 w-full">
        <div className="h-6 w-64 bg-gray-200 mb-8 animate-pulse"></div>
        <div className="flex gap-4 overflow-hidden">
           <div className="w-[75vw] sm:w-[350px] shrink-0 aspect-[3/4] bg-gray-100 animate-pulse"></div>
           <div className="w-[75vw] sm:w-[350px] shrink-0 aspect-[3/4] bg-gray-100 animate-pulse"></div>
           <div className="w-[75vw] sm:w-[350px] shrink-0 aspect-[3/4] bg-gray-100 animate-pulse"></div>
           <div className="w-[75vw] sm:w-[350px] shrink-0 aspect-[3/4] bg-gray-100 animate-pulse hidden md:block"></div>
        </div>
      </div>
    </div>
  );
}

async function HomeContent() {
  // Fetch real data from Sanity concurrently
  const [heroRaw, categoriesRaw, marqueeRaw, newArrivalsRaw, bestsellersRaw, featuredSectionsRaw, celebritiesRaw, settingsRaw] = await Promise.all([
    client.fetch(HERO_QUERY).catch(() => []),
    client.fetch(CATEGORIES_QUERY).catch(() => []),
    client.fetch(MARQUEE_QUERY).catch(() => null),
    client.fetch(NEW_ARRIVALS_QUERY).catch(() => []),
    client.fetch(BESTSELLERS_QUERY).catch(() => []),
    client.fetch(FEATURED_SECTIONS_QUERY).catch(() => []),
    client.fetch(CELEBRITIES_QUERY).catch(() => []),
    client.fetch(GLOBAL_SETTINGS_QUERY).catch(() => null),
  ]);

  // If Sanity array is empty, use the fallback arrays
  const heroSlides = heroRaw.length > 0 ? heroRaw : undefined;
  const categories = categoriesRaw; // Dynamic only, no fallback
  const marquee = {
    text: marqueeRaw?.text || "Not for every day — only for defining days.",
    imageUrl: marqueeRaw?.imageUrl || "https://picsum.photos/seed/defining_days_new/1920/1080"
  };
  const newDrops = newArrivalsRaw.length > 0 ? newArrivalsRaw : FALLBACK_NEW_DROPS;
  const bestsellers = bestsellersRaw.length > 0 ? bestsellersRaw : FALLBACK_BESTSELLERS;
  const featuredSections = featuredSectionsRaw; // Dynamic only
  const celebrities = celebritiesRaw.length > 0 ? celebritiesRaw : FALLBACK_CELEBRITIES;
  const instagramLinks = settingsRaw?.instagramLinks || [];
  const displayInstaCount = Math.max(6, instagramLinks.length);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSlideshow slides={heroSlides} />

      {/* Celebrities Section */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-8 py-16 overflow-hidden">
        <SectionHeader title="Our Customers are celebrities for us" />
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 lg:gap-6 no-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          {celebrities.map((celeb: any, idx: number) => (
            <Link href={celeb.link || "#"} key={celeb.name || idx} className="group cursor-pointer shrink-0 snap-start w-[75vw] sm:w-[350px] md:w-[400px]">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5] mb-3">
                <Image
                  src={celeb.imageUrl || `https://picsum.photos/seed/${celeb.seed}/600/800`}
                  alt={celeb.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-[13px] text-gray-900 font-semibold tracking-wider uppercase px-1 leading-relaxed text-center group-hover:underline transition-colors">{celeb.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-white py-16 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <SectionHeader title="Popular Categories" />
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 lg:gap-6 no-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            {categories.map((cat: any) => (
              <Link href={`/category/${cat.slug || cat.seed}`} key={cat.title} className="group block shrink-0 snap-start w-[70vw] sm:w-[280px] lg:w-[320px]">
                <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                  <Image
                    src={cat.imageUrl || `https://picsum.photos/seed/${cat.seed}/600/800`}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500"></div>
                </div>
                <h3 className="text-[13px] text-gray-900 group-hover:underline transition-colors px-1 leading-relaxed">{cat.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Drops */}
      <section className="bg-[#f8f8f8] py-16">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <SectionHeader title="New Drops" viewAll viewAllLink="/collection/new-in" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {newDrops.map((product: any, idx: number) => {
              const mapped = mapProduct(product);
              return <ProductCard key={mapped.title || idx} {...mapped} />
            })}
          </div>
        </div>
      </section>

      {/* Defining Days Banner */}
      <section className="relative w-full h-[80vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src={marquee.imageUrl}
          alt="Defining Days"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-full overflow-hidden flex whitespace-nowrap mb-16">
            <div className="animate-marquee flex items-center shrink-0">
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white pr-8">
                {marquee.text}
              </span>
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white pr-8">
                {marquee.text}
              </span>
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white pr-8">
                {marquee.text}
              </span>
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white pr-8">
                {marquee.text}
              </span>
            </div>
          </div>
          <Link href="/collection/all" className="inline-block bg-white text-black px-12 py-4 text-xs font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white border border-white transition-all duration-300">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Dynamic Featured Sections */}
      {featuredSections.map((section: any, sectionIdx: number) => {
        if (!section.products || section.products.length === 0) return null;

        return (
          <section key={section.slug || sectionIdx} className={`py-16 ${sectionIdx % 2 === 0 ? 'bg-[#f8f8f8]' : 'bg-white'}`}>
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
              <SectionHeader title={section.title} viewAll viewAllLink={`/category/${section.slug}`} />
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {section.products.map((product: any, idx: number) => {
                  const mapped = mapProduct(product);
                  return <ProductCard key={mapped.title || idx} {...mapped} />
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* Bestsellers */}
      <section className="bg-white py-16">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <SectionHeader title="Bestsellers" viewAll viewAllLink="/collection/bestsellers" />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {bestsellers.map((product: any, idx: number) => {
              const mapped = mapProduct(product);
              return <ProductCard key={mapped.title || idx} {...mapped} />
            })}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="bg-white text-gray-900 py-16 lg:py-24 text-center border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wide mb-16">
            Now, That&apos;s A Promise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-4">
              <ShieldCheck className="w-10 h-10 stroke-[1.5]" />
              <h3 className="text-lg font-semibold tracking-wide">Elegance</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-[250px] mx-auto">Designs that inspire.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Award className="w-10 h-10 stroke-[1.5]" />
              <h3 className="text-lg font-semibold tracking-wide">Quality</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-[250px] mx-auto">Meticulousness and craftsmanship that is of the next level.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <ThumbsUp className="w-10 h-10 stroke-[1.5]" />
              <h3 className="text-lg font-semibold tracking-wide">Premium</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-[250px] mx-auto">A tale that speaks for itself - premium fashion has never been so accessible!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="w-full">
        <div className="py-8 md:py-12 text-center border-t border-gray-100">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900">
            FOLLOW US ON INSTAGRAM
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full">
          {Array.from({ length: displayInstaCount }).map((_, i) => {
            const link = instagramLinks[i] || "#";
            return (
              <Suspense key={i} fallback={<div className="aspect-[4/5] bg-gray-100 animate-pulse"></div>}>
                <InstagramPost url={link} index={i} />
              </Suspense>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoader />}>
      <HomeContent />
    </Suspense>
  );
}
