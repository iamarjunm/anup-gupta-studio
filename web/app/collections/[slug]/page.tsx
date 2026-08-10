import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { ChevronDown, Grid3x3, LayoutGrid } from 'lucide-react';
import { client } from '@/lib/sanity';
import { COLLECTION_INFO_QUERY, PRODUCTS_BY_COLLECTION_QUERY } from '@/lib/queries';

const FALLBACK_PRODUCTS = [
  { title: "Narasimha Hand Embroidered Designer Kurta - Black", price: 16750, seed: "k1", isNew: false },
  { title: "Bobcat Hand Embroidered Designer Shawl Set With Kurta And Pant", price: 16900, seed: "k2", isNew: true },
  { title: "Botanic Hand Embroidered Designer Kurta - Red", price: 10500, seed: "k3", isNew: true },
  { title: "Pink Rai Bandhani Kurta - Pink", price: 9400, seed: "k4", isNew: false },
  { title: "Wild Striped Printed Designer Kurta - Black and White", price: 9400, seed: "k5", isNew: false },
  { title: "Bud Hand Embroidered Designer Kurta - Red", price: 11500, seed: "k6", isNew: true },
  { title: "Majestic Tiger Hand Embroidered Kurta", price: 15200, seed: "k7", isNew: true },
  { title: "Classic White Linen Kurta", price: 8900, seed: "k8", isNew: true },
  { title: "Midnight Blue Velvet Kurta", price: 12400, seed: "k9", isNew: true },
  { title: "Golden Thread Hand Embroidered Kurta", price: 14500, seed: "k10", isNew: true },
];

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const [collectionInfo, fetchedProducts] = await Promise.all([
    client.fetch(COLLECTION_INFO_QUERY, { slug }).catch(() => null),
    client.fetch(PRODUCTS_BY_COLLECTION_QUERY, { slug }).catch(() => [])
  ]);

  const title = collectionInfo?.title || slug.replace(/-/g, ' ').toUpperCase();
  const description = collectionInfo?.description || 'From Timeless Comfort to Occasion Elegance.';
  
  const products = fetchedProducts.length > 0 ? fetchedProducts : FALLBACK_PRODUCTS;

  return (
    <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-12 text-center md:text-left flex flex-col items-center md:items-start">
        <h1 className="text-2xl md:text-3xl font-semibold uppercase tracking-normal text-gray-900 mb-2">
          {title}
        </h1>
        <div className="text-sm md:text-base text-gray-600 italic font-serif">
          {description}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4 mb-8">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm text-gray-900 font-medium">
            Availability <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-900 font-medium">
            Price <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>178 items</span>
          <button className="flex items-center gap-2 font-medium text-gray-900 ml-4">
            Sort <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex items-center gap-2 ml-4">
            <button className="p-1.5 bg-gray-100 rounded text-gray-900">
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-12">
        {products.map((product: any, i: number) => (
          <div key={product.slug || product.seed || i} className="relative group">
            {product.newArrival && (
              <div className="absolute top-3 left-3 z-10 bg-[#222] text-white text-[10px] font-medium px-2 py-1 rounded-full shadow-sm">
                New
              </div>
            )}
            <ProductCard 
              title={product.title}
              price={product.price}
              imageUrl={product.imageUrl || (product.seed ? `https://picsum.photos/seed/${product.seed}/400/533` : `https://picsum.photos/seed/placeholder/400/533`)}
              hoverImageUrl={product.hoverImageUrl || (product.seed ? `https://picsum.photos/seed/${product.seed}_hover/400/533` : undefined)}
              href={`/product/${product.slug || 'sample-product'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
