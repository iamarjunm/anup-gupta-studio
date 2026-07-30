export const SEARCH_PRODUCTS_QUERY = `*[_type == "product" && (title match $query || description match $query)] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url
}`;

export const NEW_ARRIVALS_QUERY = `*[_type == "product" && newArrival == true][0...5] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url
}`;

export const BESTSELLERS_QUERY = `*[_type == "product" && bestseller == true][0...5] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url
}`;

export const CLASSICS_QUERY = `*[_type == "product" && count((categories[]->title)[@ match "Classic"]) > 0][0...5] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url
}`;

export const ACCESSORIES_QUERY = `*[_type == "product" && count((categories[]->title)[@ match "Accessories"]) > 0][0...5] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hoverImageUrl": gallery[0].asset->url
}`;

export const CELEBRITIES_QUERY = `*[_type == "celebrity"] | order(_createdAt desc) [0...10] {
  name,
  "imageUrl": image.asset->url,
  link
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  title,
  price,
  compareAtPrice,
  "slug": slug.current,
  "images": [mainImage.asset->url] + gallery[].asset->url,
  description,
  availableSizes,
  fabric,
  lookAfterMe,
  "sizeChart": categories[0]->sizeChart
}`;

export const GLOBAL_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  productionAndShipping,
  disclaimer
}`;
