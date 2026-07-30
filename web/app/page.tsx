import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { ShieldCheck, Award, ThumbsUp } from "lucide-react";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { client } from "@/lib/sanity";
import { NEW_ARRIVALS_QUERY, BESTSELLERS_QUERY, CLASSICS_QUERY, ACCESSORIES_QUERY, CELEBRITIES_QUERY } from "@/lib/queries";

const FALLBACK_CELEBRITIES = [
  { name: "Honey Singh", seed: "honey", link: "/collections/shirts" },
  { name: "Allu Arjun", seed: "allu", link: "/collections/shirts" },
  { name: "Devansh Kamboj", seed: "devansh", link: "/collections/shirts" },
  { name: "Diljit Dosanjh", seed: "diljit", link: "/collections/shirts" },
  { name: "Ranveer Singh", seed: "ranveer", link: "/collections/shirts" },
  { name: "Vicky Kaushal", seed: "vicky", link: "/collections/shirts" },
  { name: "Shahid Kapoor", seed: "shahid", link: "/collections/shirts" },
  { name: "Ayushmann Khurrana", seed: "ayushmann", link: "/collections/shirts" },
];

const CATEGORIES = [
  { title: "Hand Embroidered Shirts", seed: "shirts" },
  { title: "Hand Embroidered Kurta", seed: "kurtas" },
  { title: "Cotton Oversized Shirts", seed: "cotton" },
  { title: "Hand Embroidered Tuxedo", seed: "tuxedo" },
  { title: "Linen Luxe", seed: "linen" },
  { title: "Bundi Kurta", seed: "bundi" },
  { title: "Bandhgala", seed: "bandhgala" },
  { title: "Printed Luxe Kurta", seed: "printed" },
];

// Fallback constants
const FALLBACK_NEW_DROPS = [
  { title: "Slither(Snake) - Hand Embroidered Designer Shirt", price: 8900, seed: "snake" },
  { title: "Conquerer(Globe) - Hand Embroidered Designer Shirt", price: 8900, seed: "globe" },
  { title: "Cobweb(Spider) - Hand Embroidered Designer Shirt", price: 7250, seed: "spider" },
  { title: "Ember - Hand Embroidered Designer Shirt", price: 5750, seed: "ember" },
  { title: "Zodiac Signs - Hand Embroidered Designer Shirt", price: 8900, seed: "zodiac" },
];

const FALLBACK_CLASSICS = [
  { title: "Pink Rai Bandhani Kurta - Pink", price: 9400, seed: "pinkkurta" },
  { title: "Bud Hand Embroidered Designer Kurta - Red", price: 11500, seed: "redkurta" },
  { title: "Botanic Hand Embroidered Designer Kurta - Red", price: 10500, seed: "botanic" },
  { title: "Ascend Hand Embroidered Designer Kurta - Black", price: 12500, seed: "ascend" },
  { title: "Crest Hand Embroidered Designer Kurta - Wine", price: 9500, seed: "crest" },
];

const FALLBACK_BESTSELLERS = [
  { title: "The Champagne Shirt - Black", price: 5200, seed: "champagne" },
  { title: "Leopard/Animal Print - Handcrafted Designer Shirt", price: 7650, seed: "leopard" },
  { title: "Drizzle Metal (Chain) Hand Embroidered Designer Shirt", price: 5750, seed: "drizzle" },
  { title: "Parrot hand embroidered designer shirt - Black", price: 8900, seed: "parrot", originalPrice: 9000 },
  { title: "Scorpion Hand Embroidered Designer Shirt", price: 8900, seed: "scorpion" },
];

const FALLBACK_ACCESSORIES = [
  { title: "Bobcat - Hand Embroidered Designer Shawl", price: 9500, seed: "bobcat" },
  { title: "Flecked - Hand Embroidered Designer Shawl", price: 9500, seed: "flecked" },
  { title: "Speckled Birds Hand Embroidered Designer Shawl", price: 9500, seed: "speckled" },
  { title: "Panther Pounce - Hand Embroidered Designer Bow-Tie", price: 4550, seed: "bow" },
  { title: "Worker Bees - Hand Embroidered Designer Tie", price: 5000, seed: "bees" },
];

// Helper to map either real Sanity data or fallback data
const mapProduct = (product: any) => ({
  title: product.title,
  price: product.price,
  originalPrice: product.compareAtPrice || product.originalPrice,
  imageUrl: product.imageUrl || `https://picsum.photos/seed/${product.seed}/600/800`,
  hoverImageUrl: product.hoverImageUrl || `https://picsum.photos/seed/${product.seed}_hover/600/800`,
  href: `/product/${product.slug || 'sample-product'}`
});

export default async function Home() {
  // Fetch real data from Sanity concurrently
  const [newArrivalsRaw, bestsellersRaw, classicsRaw, accessoriesRaw, celebritiesRaw] = await Promise.all([
    client.fetch(NEW_ARRIVALS_QUERY).catch(() => []),
    client.fetch(BESTSELLERS_QUERY).catch(() => []),
    client.fetch(CLASSICS_QUERY).catch(() => []),
    client.fetch(ACCESSORIES_QUERY).catch(() => []),
    client.fetch(CELEBRITIES_QUERY).catch(() => []),
  ]);

  // If Sanity array is empty, use the fallback arrays
  const newDrops = newArrivalsRaw.length > 0 ? newArrivalsRaw : FALLBACK_NEW_DROPS;
  const bestsellers = bestsellersRaw.length > 0 ? bestsellersRaw : FALLBACK_BESTSELLERS;
  const classics = classicsRaw.length > 0 ? classicsRaw : FALLBACK_CLASSICS;
  const accessories = accessoriesRaw.length > 0 ? accessoriesRaw : FALLBACK_ACCESSORIES;
  const celebrities = celebritiesRaw.length > 0 ? celebritiesRaw : FALLBACK_CELEBRITIES;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSlideshow />

      {/* Celebrities Section */}
      <section className="max-w-[1600px] mx-auto px-4 lg:px-8 py-16 overflow-hidden">
        <SectionHeader title="Our Customers are celebrities for us" />
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 lg:gap-6 no-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          {celebrities.map((celeb: any, idx: number) => (
            <Link href={celeb.link || "#"} key={celeb.name || idx} className="group cursor-pointer shrink-0 snap-start w-[75vw] sm:w-[350px] md:w-[400px]">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
                <Image 
                  src={celeb.imageUrl || `https://picsum.photos/seed/${celeb.seed}/600/800`}
                  alt={celeb.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-white py-16 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <SectionHeader title="Popular Categories" />
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 lg:gap-6 no-scrollbar pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
            {CATEGORIES.map((cat) => (
              <Link href="#" key={cat.title} className="group block shrink-0 snap-start w-[70vw] sm:w-[280px] lg:w-[320px]">
                <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                  <Image 
                    src={`https://picsum.photos/seed/${cat.seed}/600/800`}
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
          <SectionHeader title="New Drops" viewAll />
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
          src="https://picsum.photos/seed/defining_days_new/1920/1080" 
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
                  Not for every day — only for defining days.
               </span>
               <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white pr-8">
                  Not for every day — only for defining days.
               </span>
               <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white pr-8">
                  Not for every day — only for defining days.
               </span>
               <span className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white pr-8">
                  Not for every day — only for defining days.
               </span>
             </div>
          </div>
          <Link href="#" className="inline-block bg-white text-black px-12 py-4 text-xs font-semibold uppercase tracking-wider hover:bg-transparent hover:text-white border border-white transition-all duration-300">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Colorful Classics */}
      <section className="bg-[#f8f8f8] py-16">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <SectionHeader title="Hand Embroidered Colorful Classics" viewAll />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {classics.map((product: any, idx: number) => {
              const mapped = mapProduct(product);
              return <ProductCard key={mapped.title || idx} {...mapped} />
            })}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-white py-16">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <SectionHeader title="Bestsellers" viewAll />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {bestsellers.map((product: any, idx: number) => {
              const mapped = mapProduct(product);
              return <ProductCard key={mapped.title || idx} {...mapped} />
            })}
          </div>
        </div>
      </section>

      {/* Accessories */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
          <SectionHeader title="Accessories" viewAll />
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {accessories.map((product: any, idx: number) => {
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
          {Array.from({length: 6}).map((_, i) => (
            <Link href="#" key={i} className="relative aspect-[4/5] group block overflow-hidden bg-gray-100">
              <Image 
                src={`https://picsum.photos/seed/instagram_new_${i}/400/500`}
                alt={`Instagram post ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
