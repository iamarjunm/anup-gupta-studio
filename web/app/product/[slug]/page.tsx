import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Share2, Plus, Minus, ExternalLink } from 'lucide-react';
import { ProductAccordion } from '@/components/product-accordion';
import { ProductForm } from '@/components/product-form';
import { client } from '@/lib/sanity';
import { PRODUCT_BY_SLUG_QUERY, GLOBAL_SETTINGS_QUERY, RELATED_PRODUCTS_QUERY } from '@/lib/queries';
import { RichText } from '@/components/rich-text';
import { ProductGallery } from '@/components/product-gallery';
import { SizeChartModal } from '@/components/size-chart-modal';
import { ProductCard } from '@/components/product-card';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
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
  }

  // Filter out any null/undefined images from the array just in case
  const images = [product.mainImageUrl, ...(product.galleryUrls || [])].filter(Boolean);
  const mainImage = images[0];

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 lg:px-8 xl:px-12 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 xl:gap-20 items-start">
        
        {/* Left Side - Images */}
        <div className="lg:col-span-7 xl:col-span-7 min-w-0">
          <ProductGallery images={images} title={product.title} />
        </div>

        {/* Right Side - Details */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col pt-4 lg:sticky lg:top-24 min-w-0">
          <h1 className="text-[15px] md:text-base tracking-[0.05em] uppercase text-gray-900 mb-5">
            {product.title}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <p className="text-gray-500 text-[13px] tracking-wide">
              Rs. {product.price?.toLocaleString('en-IN')}.00
            </p>
            {product.compareAtPrice && (
              <p className="text-gray-400 line-through text-[13px] tracking-wide">
                Rs. {product.compareAtPrice.toLocaleString('en-IN')}.00
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
              sizes: product.sizes
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
          <button suppressHydrationWarning className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase mt-6 hover:text-gray-600 transition-colors cursor-pointer w-fit">
            <Share2 className="w-4 h-4" /> SHARE
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20 pt-16 border-t border-gray-100">
          <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-widest text-gray-900 mb-10 text-center">
            Products You May Like
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
                href={`/product/${rp.slug}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
