import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { writeClient, client } from '@/lib/sanity';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      items,
      shippingAddress,
      customerDetails,
      discountCode,
      subtotal,
      shippingCost,
      total
    } = payload;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      return NextResponse.json({ error: 'Razorpay secret not configured' }, { status: 500 });
    }

    // Verify the signature
    if (razorpay_signature === 'SKIP_VERIFICATION' && total === 0) {
      // Valid zero-amount order bypassing Razorpay
    } else {
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generated_signature = crypto
        .createHmac('sha256', key_secret)
        .update(text)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Generate Order Number
    const orderNumber = 'AGS-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Map items for Sanity Order Schema
    const sanityItems = items.map((item: any) => ({
      _key: Math.random().toString(36).substring(7),
      productTitle: item.title,
      quantity: item.quantity,
      price: item.price,
      variantSize: item.size,
      variantColor: item.color || 'Default',
    }));

    // Calculate discount
    const calculatedDiscountAmount = Math.max(0, (subtotal || 0) + (shippingCost || 0) - (total || 0));

    // Run order creation and discount increment concurrently
    const operations: Promise<any>[] = [
      writeClient.create({
        _type: 'order',
        orderNumber,
        createdAt: new Date().toISOString(),
        customerName: customerDetails?.name || '',
        customerEmail: customerDetails?.email || '',
        customerPhone: customerDetails?.phone || '',
        userId: customerDetails?.userId || '',
        items: sanityItems,
        shippingAddress: {
          street: shippingAddress?.street || '',
          city: shippingAddress?.city || '',
          state: shippingAddress?.state || '',
          postalCode: shippingAddress?.postalCode || '',
          country: shippingAddress?.country || 'India',
        },
        subtotal,
        discountCode: discountCode || '',
        discountAmount: calculatedDiscountAmount,
        total,
        shippingCost: shippingCost || 0,
        tax: 0,
        paymentId: razorpay_payment_id,
        paymentMethod: 'Razorpay',
        status: 'processing',
      })
    ];

    if (discountCode) {
      operations.push(
        (async () => {
          const dcQuery = `*[_type == "discountCode" && code == $code][0]`;
          const discount = await client.fetch(dcQuery, { code: discountCode });
          if (discount && discount._id) {
            await writeClient
              .patch(discount._id)
              .setIfMissing({ timesUsed: 0 })
              .inc({ timesUsed: 1 })
              .commit();
          }
        })()
      );
    }

    await Promise.all(operations);

    return NextResponse.json({ success: true, message: 'Payment verified successfully', orderNumber });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
