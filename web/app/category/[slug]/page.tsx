import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { ChevronDown, Grid3x3, LayoutGrid } from 'lucide-react';
import { client } from '@/lib/sanity';
import { 
  COLLECTION_INFO_QUERY, 
  PRODUCTS_BY_COLLECTION_QUERY, 
  ALL_PRODUCTS_QUERY, 
  ALL_NEW_ARRIVALS_QUERY, 
  ALL_BESTSELLERS_QUERY 
} from '@/lib/queries';
import { CollectionGrid } from '@/components/collection-grid';
export default async function CategoryPage(props: { params: Promise<{ slug: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { slug } = params;
  
  let fetchedProducts = [];
  let collectionInfo = null;

  if (slug === 'all') {
    fetchedProducts = await client.fetch(ALL_PRODUCTS_QUERY).catch(() => []);
    collectionInfo = { title: 'Shop All', description: 'Explore our complete collection.' };
  } else if (slug === 'new-in') {
    fetchedProducts = await client.fetch(ALL_NEW_ARRIVALS_QUERY).catch(() => []);
    collectionInfo = { title: 'New Arrivals', description: 'The latest additions to our store.' };
  } else if (slug === 'bestsellers') {
    fetchedProducts = await client.fetch(ALL_BESTSELLERS_QUERY).catch(() => []);
    collectionInfo = { title: 'Bestsellers', description: 'Our most loved pieces.' };
  } else {
    const results = await Promise.all([
      client.fetch(COLLECTION_INFO_QUERY, { slug }).catch(() => null),
      client.fetch(PRODUCTS_BY_COLLECTION_QUERY, { slug }).catch(() => [])
    ]);
    collectionInfo = results[0];
    fetchedProducts = results[1];
  }

  const title = collectionInfo?.title || slug.replace(/-/g, ' ').toUpperCase();
  const description = collectionInfo?.description || 'From Timeless Comfort to Occasion Elegance.';
  
  let products = fetchedProducts || [];

  // Calculate highest price before any price filtering
  const highestPrice = Math.max(...products.map((p: any) => p.price || 0), 0);

  // 1. Filter by Availability
  const availability = searchParams.availability as string;
  if (availability === 'in_stock') {
    products = products.filter((p: any) => {
      if (!p.sizes || p.sizes.length === 0) return true;
      return p.sizes.some((s: any) => s.stock > 0);
    });
  } else if (availability === 'out_of_stock') {
    products = products.filter((p: any) => {
      if (!p.sizes || p.sizes.length === 0) return false;
      return p.sizes.every((s: any) => s.stock === 0);
    });
  }

  // 2. Filter by Price
  const priceFilter = searchParams.price as string;
  if (priceFilter) {
    if (priceFilter === '30000+') {
      products = products.filter((p: any) => (p.price || 0) >= 30000);
    } else {
      const [minStr, maxStr] = priceFilter.split('-');
      const min = parseInt(minStr, 10) || 0;
      const max = parseInt(maxStr, 10) || Infinity;
      products = products.filter((p: any) => (p.price || 0) >= min && (p.price || 0) <= max);
    }
  }

  // 3. Sort
  const sort = searchParams.sort as string;
  if (sort === 'price_asc') {
    products.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
  } else if (sort === 'price_desc') {
    products.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
  } else if (sort === 'newest') {
    products.sort((a: any, b: any) => {
      const dateA = new Date(a._createdAt || 0).getTime();
      const dateB = new Date(b._createdAt || 0).getTime();
      return dateB - dateA;
    });
  }
  return (
    <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-2xl md:text-3xl font-semibold uppercase tracking-wide text-gray-900 mb-4">
          {title}
        </h1>
        <div className="text-sm text-gray-900 font-medium">
          {description}
        </div>
      </div>

      <CollectionGrid products={products} highestPrice={highestPrice} />
    </div>
  );
}
