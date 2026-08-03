'use server'

import { client } from '@/lib/sanity';

export async function validateDiscountCode(code: string) {
  try {
    const query = `*[_type == "discountCode" && code == $code && isActive == true][0] {
      code,
      discountType,
      percentageOff,
      minimumPurchaseAmount
    }`;
    
    const discount = await client.fetch(query, { code });
    
    if (!discount) {
      return { success: false, error: 'Invalid or expired promo code.' };
    }
    
    return { success: true, discount };
  } catch (error) {
    console.error('Error validating discount code:', error);
    return { success: false, error: 'Failed to validate promo code.' };
  }
}
