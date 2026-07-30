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
