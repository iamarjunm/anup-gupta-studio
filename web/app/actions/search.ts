'use server';

import { client } from '@/lib/sanity';
import { SEARCH_PRODUCTS_QUERY } from '@/lib/queries';

export async function searchProducts(query: string) {
  try {
    if (!query) return [];
    
    // Append wildcard for partial matches
    const searchQuery = `${query}*`;
    
    const products = await client.fetch(SEARCH_PRODUCTS_QUERY as string, { query: searchQuery } as any);
    return products;
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
}
export async function getBestSellers() {
  try {
    const { BESTSELLERS_QUERY } = await import('@/lib/queries');
    const products = await client.fetch(BESTSELLERS_QUERY);
    // Return only top 4
    return products?.slice(0, 4) || [];
  } catch (error) {
    console.error('Failed to fetch bestsellers:', error);
    return [];
  }
}
