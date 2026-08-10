import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Share2, Plus, Minus, ExternalLink } from 'lucide-react';
import { ProductAccordion } from '@/components/product-accordion';
import { ProductForm } from '@/components/product-form';
import { ShareButton } from '@/components/share-button';
import { client } from '@/lib/sanity';
import { PRODUCT_BY_SLUG_QUERY, GLOBAL_SETTINGS_QUERY, RELATED_PRODUCTS_QUERY, FALLBACK_PRODUCTS_QUERY } from '@/lib/queries';
import { RichText } from '@/components/rich-text';
import { ProductGallery } from '@/components/product-gallery';
import { SizeChartModal } from '@/components/size-chart-modal';
import { ProductCard } from '@/components/product-card';
import { Suspense } from 'react';

export const revalidate = 60; // Revalidate every 60 seconds

function ProductLoader() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-20 items-start w-full">
      <div className="lg:col-span-7 xl:col-span-7 w-full flex flex-col md:flex-row gap-4">
         <div className="hidden md:flex flex-col gap-4">
           <div className="w-[100px] aspect-[3/4] bg-gray-100 animate-pulse"></div>
           <div className="w-[100px] aspect-[3/4] bg-gray-100 animate-pulse"></div>
           <div className="w-[100px] aspect-[3/4] bg-gray-100 animate-pulse"></div>
         </div>
         <div className="flex-1 w-full aspect-[3/4] bg-gray-100 animate-pulse"></div>
      </div>
      <div className="lg:col-span-5 xl:col-span-5 pt-4">
        <div className="h-6 w-3/4 bg-gray-200 mb-6 animate-pulse"></div>
        <div className="h-4 w-1/4 bg-gray-200 mb-12 animate-pulse"></div>
        <div className="h-12 w-full bg-gray-100 mb-8 animate-pulse"></div>
        <div className="h-12 w-full bg-gray-50 mb-12 animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-100 animate-pulse"></div>
          <div className="h-4 w-full bg-gray-100 animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-100 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

async function ProductPageContent({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const { slug } = await paramsPromise;
  
  // Fetch data in parallel
  const [fetchedProduct, settings] = await Promise.all([
    client.fetch(PRODUCT_BY_SLUG_QUERY, { slug }),
    client.fetch(GLOBAL_SETTINGS_QUERY)
  ]);

  let product = fetchedProduct;
  
  if (slug === 'test' || (!product && process.env.NODE_ENV === 'development')) {
    // Provide a mock product for design testing if Sanity is empty or slug is test
    product = {
      title: 'Sample Product Design',
      price: 5999,
      compareAtPrice: 7999,
      slug: slug,
      images: [
        'https://picsum.photos/seed/1/800/1200',
        'https://picsum.photos/seed/2/800/1200',
        'https://picsum.photos/seed/3/800/1200'
      ],
      description: [{ _type: 'block', children: [{ _type: 'span', text: 'This is a beautiful sample product to help you preview the layout and design of the product details page.' }] }],
      fabric: [{ _type: 'block', children: [{ _type: 'span', text: '100% Premium Cotton' }] }],
      lookAfterMe: [{ _type: 'block', children: [{ _type: 'span', text: 'Machine wash cold. Do not bleach.' }] }],
      sizes: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 0 },
        { size: 'L', stock: 5 },
        { size: 'XL', stock: 2 }
      ],
      sizeChart: {
        headers: ['Size', 'Sleeve', 'Chest', 'Shoulder', 'Length'],
        rows: [
          { cells: ['XS', '24', '39', '15.5', '33'] },
          { cells: ['Small', '24.5', '41', '17', '33'] },
          { cells: ['Medium', '25', '43', '18', '34'] },
          { cells: ['Large', '25', '45', '18.5', '34'] },
          { cells: ['X-Large', '25.5', '47', '19.5', '35'] },
          { cells: ['2 XL', '26', '49', '20', '36'] },
          { cells: ['3 XL', '26', '51', '21', '36'] }
        ]
      },
      sizeChartRaw: "Size Chart - Kurtas\nKURTA READY MEASUREMENT - SHORT\nSize\tSleeve\tChest \tShoulder\tLength\nXS\t24\t39\t16.5\t33\nSmall\t24.5\t41\t17\t33\nMedium\t25\t43\t18\t34\nLarge\t25\t45\t18.5\t34\n\nPYJAMA\nSize\tWaist\tLength\nXS\t28\t38\nSmall\t30\t39"
    };
  } else if (!product) {
    notFound();
  }

  let relatedProducts = [];
  if (slug !== 'test' && product) {
    const categorySlugs = product.categorySlugs || (product.singleCategorySlug ? [product.singleCategorySlug] : []);
    const subcategorySlugs = product.subcategorySlugs || (product.singleSubcategorySlug ? [product.singleSubcategorySlug] : []);
    
    if (categorySlugs.length > 0 || subcategorySlugs.length > 0) {
      relatedProducts = await client.fetch(RELATED_PRODUCTS_QUERY, {
        slug: product.slug,
        categorySlugs,
        subcategorySlugs
      });
    }

    if (!relatedProducts || relatedProducts.length === 0) {
      relatedProducts = await client.fetch(FALLBACK_PRODUCTS_QUERY, {
        slug: product.slug
      });
    }
  }

  // Filter out any null/undefined images from the array just in case
  const images = [product.mainImageUrl, ...(product.galleryUrls || [])].filter(Boolean);
  const mainImage = images[0];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-20 items-start">
        
        {/* Left Side - Images */}
        <div className="lg:col-span-6 xl:col-span-6 min-w-0">
          <ProductGallery images={images} title={product.title} />
        </div>

        {/* Right Side - Details */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col pt-4 lg:sticky lg:top-24 min-w-0">
          <h1 className="text-lg font-medium uppercase text-gray-900 mb-5 text-pretty text-left w-full">
            {product.title}
          </h1>
          {/* Interactive Form */}
          <ProductForm 
            product={{
              slug: product.slug,
              title: product.title,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              image: mainImage || '',
              sizes: product.sizes,
              color: product.color,
              styles: product.styles
            }}
          >


            {/* Size Chart Modal */}
            <div className="mb-6">
              <SizeChartModal sizeChart={product.sizeChart} sizeChartRaw={product.sizeChartRaw} />
            </div>

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
          <ShareButton />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20 pt-16">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-8 text-left">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map((rp: any) => (
              <ProductCard
                key={rp.slug}
                title={rp.title}
                price={rp.price}
                originalPrice={rp.compareAtPrice}
                imageUrl={rp.imageUrl}
                hoverImageUrl={rp.hoverImageUrl}
                galleryUrls={rp.galleryUrls}
                href={`/product/${rp.slug}`}
                slug={rp.slug}
                sizes={rp.sizes}
                color={rp.color}
                styles={rp.styles}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 lg:px-8 xl:px-12 py-8 md:py-12">
      <Suspense fallback={<ProductLoader />}>
        <ProductPageContent paramsPromise={params} />
      </Suspense>
    </div>
  );
}
