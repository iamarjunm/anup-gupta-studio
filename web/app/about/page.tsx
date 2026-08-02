import Image from 'next/image';
import Link from 'next/link';
import img1 from '@/assets/anup-gupta-1.jpg';
import img2 from '@/assets/anup-gupta-2.jpg';
import img3 from '@/assets/anup-gupta-3.jpg';

export default function AboutPage() {
  return (
    <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-12 md:py-24 space-y-24 md:space-y-40 text-gray-900">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.05em] mb-8">The Anup Gupta Journey</h1>
        <h2 className="text-xl md:text-2xl font-light tracking-wide">Who is Anup Gupta?</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed font-light text-lg">
          <p>
            Anup Gupta, a celebrated designer from Delhi, masterfully blends Indian tradition with global silhouettes. His creations are a vibrant reflection of bold elegance inspired by Bollywood style.
          </p>
          <p>
            With an ambitious vision to globalize Indian couture, he is actively taking it to the world stage. More than just fabric, his designs speak volumes of culture, celebration, and cinematic flair, embodying a unique sartorial narrative.
          </p>
        </div>
      </section>

      {/* Feature 1 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
          <Image 
            src={img1} 
            alt="Anup Gupta" 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-6 max-w-xl">
          <h2 className="text-2xl md:text-4xl font-serif uppercase tracking-[0.05em]">A Decade of Defining Luxury Fashion</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed font-light text-lg">
            <p>
              With over a decade of rich experience in the luxury fashion industry, Anup Gupta's journey began by assisting his wife, a renowned designer, in founding 'Anoodhi', a luxury brand dedicated to women's ethnic and contemporary wear.
            </p>
            <p>
              During this period, he discovered a profound passion for menswear, which led him to launch his own distinguished label. His designs seamlessly blend traditional Indian aesthetics with a captivating Bollywood-inspired flair, creating truly unique pieces.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 2 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <div className="space-y-6 max-w-xl md:order-1 order-2">
          <h2 className="text-2xl md:text-4xl font-serif uppercase tracking-[0.05em]">Bespoke Menswear with a Cinematic Charm</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed font-light text-lg">
            <p>
              Anup Gupta Studio specializes in crafting bespoke menswear, each piece infused with a distinctive Bollywood-inspired twist. We excel in designing exquisite sherwanis, sophisticated tuxedos, and other statement ethnic wear.
            </p>
            <p>
              Our philosophy revolves around blending rich Indian tradition with modern sophistication. Every single design is a celebration of style, culture, and the enchanting allure of cinematic charm, meticulously created to stand out.
            </p>
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 md:order-2 order-1">
          <Image 
            src={img2} 
            alt="Anup Gupta Studio overview" 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Signature Collection */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
          <Image 
            src={img3} 
            alt="Anup Gupta Signature Collection" 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-8 max-w-xl">
          <h2 className="text-2xl md:text-4xl font-serif uppercase tracking-[0.05em]">Discover the Signature Collection</h2>
          <p className="text-gray-700 leading-relaxed font-light text-lg">
            Our Signature Collection offers an exquisite range of menswear, meticulously designed for every discerning taste and occasion:
          </p>
          <ul className="space-y-6 text-gray-700 font-light">
            <li className="flex flex-col">
              <strong className="text-gray-900 font-medium uppercase text-sm tracking-wider mb-1">Tuxedo Collection</strong>
              <span>Featuring Black Tie, White Tie, Modern Slim, and Bespoke options for unparalleled formal elegance.</span>
            </li>
            <li className="flex flex-col">
              <strong className="text-gray-900 font-medium uppercase text-sm tracking-wider mb-1">Executive Suits</strong>
              <span>Crafted from premium Wool, available in Three-piece and Double-breasted designs for sophisticated professional wear.</span>
            </li>
            <li className="flex flex-col">
              <strong className="text-gray-900 font-medium uppercase text-sm tracking-wider mb-1">Sherwani Heritage</strong>
              <span>A tribute to tradition with Wedding, Silk, and intricately Embroidered sherwanis.</span>
            </li>
            <li className="flex flex-col">
              <strong className="text-gray-900 font-medium uppercase text-sm tracking-wider mb-1">Bandhgala Mastery</strong>
              <span>Showcasing modern Indian formal wear with refined Bandhgalas, Luxury Dress Shirts, and versatile Nehru Jackets.</span>
            </li>
          </ul>
          
          <div className="pt-8">
            <Link 
              href="/collection/all"
              className="inline-block px-8 py-4 bg-gray-900 text-white text-sm font-medium tracking-widest uppercase hover:bg-gray-800 transition-colors"
            >
              Explore Our Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 p-8 md:p-16 text-center space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Authenticity in Craft</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Our designs are deeply rooted in culture, going beyond mere fabric to tell a compelling story.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Relationships Over Transactions</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              We believe fashion is built on trust and genuine connection with our esteemed clientele.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Global Vision, Local Soul</h3>
            <p className="text-gray-600 font-light leading-relaxed">
              Taking the vibrant essence of India to the world stage, while upholding its unique spirit in every creation.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
