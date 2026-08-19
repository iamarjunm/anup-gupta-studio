'use client';

import { useEffect } from 'react';

export function RecentViewTracker({ product }: { product: any }) {
  useEffect(() => {
    if (!product || !product.slug) return;

    const key = 'recentlyViewed';
    try {
      const stored = localStorage.getItem(key);
      let viewed = stored ? JSON.parse(stored) : [];

      // Remove if it already exists to move it to the top
      viewed = viewed.filter((p: any) => p.slug !== product.slug);

      // Add to beginning
      viewed.unshift({
        title: product.title,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        slug: product.slug,
        imageUrl: product.mainImageUrl || product.imageUrl,
        hoverImageUrl: product.galleryUrls?.[0],
        galleryUrls: product.galleryUrls,
        sizes: product.sizes,
        color: product.color,
        styles: product.styles
      });

      // Keep only top 4
      if (viewed.length > 4) {
        viewed = viewed.slice(0, 4);
      }

      localStorage.setItem(key, JSON.stringify(viewed));
    } catch (e) {
      console.error('Error tracking recently viewed', e);
    }
  }, [product]);

  return null;
}
