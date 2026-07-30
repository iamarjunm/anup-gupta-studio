import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Share2, Plus, Minus, ExternalLink } from 'lucide-react';
import { ProductAccordion } from '@/components/product-accordion';
import { ProductForm } from '@/components/product-form';
import { client } from '@/lib/sanity';
import { PRODUCT_BY_SLUG_QUERY, GLOBAL_SETTINGS_QUERY } from '@/lib/queries';
import { RichText } from '@/components/rich-text';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch data in parallel
  const [product, settings] = await Promise.all([
    client.fetch(PRODUCT_BY_SLUG_QUERY, { slug }),
    client.fetch(GLOBAL_SETTINGS_QUERY)
  ]);

  if (!product) {
    notFound();
  }

  // Filter out any null/undefined images from the array just in case
  const images = (product.images || []).filter(Boolean);
  const mainImage = images[0];

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* Left Side - Images */}
        <div className="lg:col-span-7 xl:col-span-8 flex gap-4 min-w-0">
          {/* Thumbnails (Hidden on Mobile) */}
          <div className="hidden md:flex flex-col gap-4 w-20 xl:w-24 shrink-0">
            {images.map((img: string, i: number) => (
              <button key={i} className={`relative aspect-[3/4] border-2 transition-colors overflow-hidden cursor-pointer ${i === 0 ? 'border-gray-900' : 'border-transparent hover:border-gray-300'}`}>
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
                alt={product.title}
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

        {/* Right Side - Details */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col pt-4 lg:sticky lg:top-24 min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold uppercase tracking-wide text-gray-900 mb-4">
            {product.title}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <p className="text-gray-900 font-medium tracking-wide">
              Rs. {product.price?.toLocaleString('en-IN')}
            </p>
            {product.compareAtPrice && (
              <p className="text-gray-500 line-through text-sm tracking-wide">
                Rs. {product.compareAtPrice.toLocaleString('en-IN')}
              </p>
            )}
          </div>

          {/* Interactive Form */}
          <ProductForm 
            product={{
              slug: product.slug,
              title: product.title,
              price: product.price,
              image: mainImage || '',
              availableSizes: product.availableSizes
            }}
          >
            {/* Color Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <button className="bg-black text-white px-6 py-2 text-sm font-medium cursor-pointer">
                Black
              </button>
            </div>

            {/* Size Chart Link */}
            {product.sizeChart && (
              <Link href="#" className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase border-b border-black w-fit pb-1 mb-6 hover:text-gray-600 hover:border-gray-600 transition-colors">
                SIZE CHART <ExternalLink className="w-4 h-4" />
              </Link>
            )}

            {/* Description */}
            <div className="mb-8">
              <RichText value={product.description} />
            </div>
          </ProductForm>

          {/* Accordion */}
          <ProductAccordion 
            sections={[
              {
                title: 'FABRIC',
                content: product.fabric
              },
              {
                title: 'LOOK AFTER ME',
                content: product.lookAfterMe
              },
              {
                title: 'SIZE CHART',
                isTable: true,
                content: product.sizeChart
              },
              {
                title: 'PRODUCTION & SHIPPING',
                content: settings?.productionAndShipping
              },
              {
                title: 'DISCLAIMER',
                content: settings?.disclaimer
              }
            ]} 
          />

          {/* Share */}
          <button className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase mt-6 hover:text-gray-600 transition-colors cursor-pointer">
            <Share2 className="w-4 h-4" /> SHARE
          </button>
        </div>
      </div>
    </div>
  );
}
