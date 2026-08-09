import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function POST(request: Request) {
  try {
    const { items, discountCode, shippingCost = 0 } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty or invalid' }, { status: 400 });
    }

    // Fetch prices and discount code concurrently
    const slugs = items.map((item: any) => item.slug);
    const productQuery = `*[_type == "product" && slug.current in $slugs] {
      "slug": slug.current,
      price,
      styles
    }`;
    const dcQuery = `*[_type == "discountCode" && code == $code && isActive == true][0]`;
    
    const [products, discount] = await Promise.all([
      client.fetch(productQuery, { slugs }),
      discountCode ? client.fetch(dcQuery, { code: discountCode }) : Promise.resolve(null)
    ]);

    let subtotal = 0;
    for (const item of items) {
      const product = products.find((p: any) => p.slug === item.slug);
      if (product) {
        let itemPrice = product.price;
        if (item.style && product.styles) {
          const matchedStyle = product.styles.find((s: any) => s.name === item.style);
          if (matchedStyle && matchedStyle.price) {
            itemPrice = matchedStyle.price;
          }
        }
        subtotal += itemPrice * item.quantity;
      } else {
        return NextResponse.json({ error: `Product not found: ${item.slug}` }, { status: 400 });
      }
    }

    let finalAmount = subtotal;

    // Validate discount code securely
    if (discountCode) {
      if (!discount) {
        return NextResponse.json({ error: 'Invalid or expired promo code.' }, { status: 400 });
      }
      
      // Check usage limits if any
      const timesUsed = discount.timesUsed || 0;
      if (discount.usageLimit && timesUsed >= discount.usageLimit) {
        return NextResponse.json({ error: 'Promo code usage limit reached.' }, { status: 400 });
      }
      
      // Calculate discount amount
      if (discount.discountType === 'percentage') {
        finalAmount = Math.round(subtotal - (subtotal * discount.percentageOff) / 100);
      } else if (discount.discountType === 'fixed') {
        finalAmount = Math.max(0, subtotal - discount.percentageOff);
      }
    }

    finalAmount += shippingCost;

    const amountInPaise = Math.round(finalAmount * 100);
    const receipt = 'receipt_' + Math.random().toString(36).substring(7);

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    const auth = Buffer.from(`${key_id}:${key_secret}`).toString('base64');

    if (finalAmount > 0) {
      const res = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return NextResponse.json({ error: data.error?.description || 'Failed to create order' }, { status: res.status });
      }

      return NextResponse.json({
        ...data,
        serverCalculatedSubtotal: subtotal,
        serverCalculatedTotal: finalAmount
      });
    } else {
      // 0 total order
      return NextResponse.json({
        id: 'FREE_ORDER',
        amount: 0,
        currency: 'INR',
        receipt,
        serverCalculatedSubtotal: subtotal,
        serverCalculatedTotal: finalAmount
      });
    }
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
