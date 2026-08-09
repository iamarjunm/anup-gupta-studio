export const SEARCH_PRODUCTS_QUERY = `*[_type == "product" && (title match $query || description match $query)] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url,
  sizes,
  color,
  styles
}`;

export const NEW_ARRIVALS_QUERY = `*[_type == "product" && newArrival == true][0...5] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url,
  sizes,
  color,
  styles
}`;

export const BESTSELLERS_QUERY = `*[_type == "product" && bestseller == true][0...5] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url,
  sizes,
  color,
  styles
}`;

export const FEATURED_SECTIONS_QUERY = `*[(_type == "category" || _type == "subcategory") && (featuredOnHome == true || displayOnHome == true)] | order(order asc) {
  title,
  "slug": slug.current,
  "products": *[_type == "product" && references(^._id)][0...5] {
    title,
    price,
    compareAtPrice,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    "hoverImageUrl": gallery[0].asset->url,
    sizes,
    color,
    styles
  }
}`;

export const CELEBRITIES_QUERY = `*[_type == "celebrity"] | order(_createdAt desc) [0...10] {
  name,
  "imageUrl": image.asset->url,
  "link": "/product/" + product->slug.current
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "mainImageUrl": mainImage.asset->url,
  "galleryUrls": gallery[].asset->url,
  description,
  sizes,
  color,
  styles,
  fabric,
  lookAfterMe,
  "sizeChartRaw": coalesce((categories[]->sizeChartRaw)[@ != null && @ != ""][0], (subcategories[]->sizeChartRaw)[@ != null && @ != ""][0]),
  "sizeChart": coalesce((categories[]->sizeChart)[@ != null][0], (subcategories[]->sizeChart)[@ != null][0]),
  "categorySlugs": categories[]->slug.current,
  "subcategorySlugs": subcategories[]->slug.current,
  "singleCategorySlug": categories->slug.current,
  "singleSubcategorySlug": subcategories->slug.current
}`;

export const GLOBAL_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  productionAndShipping,
  disclaimer,
  instagramLinks
}`;

export const HERO_QUERY = `*[_type == "heroSection"] {
  heading1,
  heading2,
  description,
  "imageUrl": backgroundImage.asset->url,
  link
}`;

export const CATEGORIES_QUERY = `*[_type == "category"] | order(order asc) {
  title,
  "slug": slug.current,
  "imageUrl": image.asset->url
}`;

export const MARQUEE_QUERY = `*[_type == "marquee"][0] {
  text,
  "imageUrl": backgroundImage.asset->url
}`;

export const ANNOUNCEMENT_BAR_QUERY = `*[_type == "announcementBar" && active == true] | order(order asc) {
  text,
  code,
  codeColor
}`;

export const COLLECTION_INFO_QUERY = `*[(_type == "category" || _type == "subcategory" || _type == "collection") && slug.current == $slug][0] {
  title,
  description
}`;

export const PRODUCTS_BY_COLLECTION_QUERY = `*[_type == "product" && (
  $slug in categories[]->slug.current || 
  $slug == categories->slug.current ||
  $slug in subcategories[]->slug.current || 
  $slug == subcategories->slug.current ||
  $slug in collections[]->slug.current ||
  $slug == collections->slug.current
)] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url,
  newArrival,
  bestseller,
  _createdAt,
  sizes,
  color,
  styles
}`;

export const ALL_PRODUCTS_QUERY = `*[_type == "product"] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url,
  newArrival,
  bestseller,
  _createdAt,
  sizes,
  color,
  styles
}`;

export const ALL_NEW_ARRIVALS_QUERY = `*[_type == "product" && newArrival == true] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url,
  newArrival,
  bestseller,
  _createdAt,
  sizes,
  color,
  styles
}`;

export const ALL_BESTSELLERS_QUERY = `*[_type == "product" && bestseller == true] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url,
  newArrival,
  bestseller,
  _createdAt,
  sizes,
  color,
  styles
}`;

export const NAVIGATION_QUERY = `{
  "categories": *[_type == "category"] | order(order asc) {
    title,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    "subcategories": *[_type == "subcategory" && parentCategory._ref == ^._id] | order(title asc) {
      title,
      "slug": slug.current,
      "imageUrl": image.asset->url
    }
  },
  "collections": *[_type == "collection"] | order(title asc) {
    title,
    "slug": slug.current
  }
}`;

export const RELATED_PRODUCTS_QUERY = `*[_type == "product" && slug.current != $slug && (
  count((categories[]->slug.current)[@ in $categorySlugs]) > 0 ||
  categories->slug.current in $categorySlugs ||
  count((subcategories[]->slug.current)[@ in $subcategorySlugs]) > 0 ||
  subcategories->slug.current in $subcategorySlugs
)] | order(bestseller desc, newArrival desc) [0...4] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url,
  bestseller,
  newArrival,
  sizes,
  color,
  styles
}`;

export const FALLBACK_PRODUCTS_QUERY = `*[_type == "product" && slug.current != $slug] | order(_createdAt desc) [0...4] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url,
  bestseller,
  newArrival,
  sizes,
  color,
  styles
}`;
