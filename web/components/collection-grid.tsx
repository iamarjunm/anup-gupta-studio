'use client';

import { useState } from 'react';
import { CollectionFilters } from './collection-filters';
import { ProductCard } from './product-card';

export function CollectionGrid({ products, highestPrice = 0 }: { products: any[], highestPrice?: number }) {
  const [layout, setLayout] = useState<'grid-2' | 'grid-4'>('grid-4');

  // Fallback if highestPrice is not provided by server
  const maxPrice = highestPrice > 0 ? highestPrice : Math.max(...products.map(p => p.price || 0), 0);

  return (
    <>
      <CollectionFilters 
        totalItems={products.length} 
        currentLayout={layout}
        onLayoutChange={setLayout}
        highestPrice={maxPrice}
      />

      {products.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          No products found.
        </div>
      ) : (
        <div className={
          layout === 'grid-4' 
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-12"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16"
        }>
          {products.map((product: any, i: number) => (
            <div key={product.slug || i} className="relative group">
              {product.newArrival && (
                <div className="absolute top-3 left-3 z-10 bg-[#222] text-white text-[10px] font-medium px-2 py-1 rounded-full shadow-sm">
                  New
                </div>
              )}
              <ProductCard 
                title={product.title}
                price={product.price}
                imageUrl={product.imageUrl || `https://picsum.photos/seed/placeholder/400/533`}
                hoverImageUrl={product.hoverImageUrl || undefined}
                galleryUrls={product.galleryUrls}
                href={`/product/${product.slug || 'sample-product'}`}
                slug={product.slug}
                sizes={product.sizes}
                color={product.color}
                styles={product.styles}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
