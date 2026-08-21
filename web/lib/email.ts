export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return { success: false, error: 'API key not set' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Anup Gupta Studio <orders@anupguptastudio.com>',
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend API Error:', data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmationEmail(orderData: any) {
  if (!orderData.customerEmail) return;

  const subject = `Order Confirmation #${orderData.orderNumber}`;
  
  const itemsHtml = orderData.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee;">
        <strong>${item.productTitle}</strong><br/>
        <span style="color: #666666; font-size: 12px;">Size: ${item.variantSize} ${item.variantColor ? `| Color: ${item.variantColor}` : ''} ${item.variantStyle ? `| Style: ${item.variantStyle}` : ''}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Anup Gupta Studio</h1>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="margin-top: 0; color: #111111;">Thank you for your order!</h2>
        <p style="line-height: 1.6; color: #4b5563;">Hi ${orderData.customerName},</p>
        <p style="line-height: 1.6; color: #4b5563;">We've received your order <strong>#${orderData.orderNumber}</strong> and we're getting it ready for you. We will notify you once it ships.</p>
      </div>

      <h3 style="text-transform: uppercase; font-size: 14px; letter-spacing: 1px; border-bottom: 2px solid #111111; padding-bottom: 10px;">Order Summary</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 12px; border-bottom: 2px solid #eeeeee; color: #666666;">Item</th>
            <th style="text-align: center; padding: 12px; border-bottom: 2px solid #eeeeee; color: #666666;">Qty</th>
            <th style="text-align: right; padding: 12px; border-bottom: 2px solid #eeeeee; color: #666666;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="text-align: right; padding: 12px; color: #666666;">Subtotal:</td>
            <td style="text-align: right; padding: 12px;">₹${orderData.subtotal?.toLocaleString('en-IN') || orderData.total?.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right; padding: 12px; color: #666666;">Shipping:</td>
            <td style="text-align: right; padding: 12px;">${orderData.shippingCost ? '₹' + orderData.shippingCost.toLocaleString('en-IN') : 'Free'}</td>
          </tr>
          ${orderData.discountAmount ? `
          <tr>
            <td colspan="2" style="text-align: right; padding: 12px; color: #666666;">Discount \${orderData.discountCode ? '(' + orderData.discountCode + ')' : ''}:</td>
            <td style="text-align: right; padding: 12px; color: #dc2626;">-₹\${orderData.discountAmount.toLocaleString('en-IN')}</td>
          </tr>
          ` : ''}
          <tr>
            <td colspan="2" style="text-align: right; padding: 12px; font-weight: bold; font-size: 16px;">Total:</td>
            <td style="text-align: right; padding: 12px; font-weight: bold; font-size: 16px;">₹${orderData.total.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>

      ${orderData.shippingAddress ? `
      <h3 style="text-transform: uppercase; font-size: 14px; letter-spacing: 1px; border-bottom: 2px solid #111111; padding-bottom: 10px;">Shipping Address</h3>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #4b5563;">
        ${orderData.shippingAddress.street}<br/>
        ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}<br/>
        ${orderData.shippingAddress.country}
      </div>
      ` : ''}

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999;">
        <p>If you have any questions, reply to this email or contact us at support@anupguptastudio.com.</p>
        <p>&copy; ${new Date().getFullYear()} Anup Gupta Studio. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: orderData.customerEmail, subject, html });
}

export async function sendOrderStatusUpdateEmail(orderData: any, newStatus: string) {
  if (!orderData.customerEmail) return;

  const statusMessages: Record<string, string> = {
    'processing': 'We are currently processing your order.',
    'shipped': 'Great news! Your order has been shipped and is on its way to you.',
    'delivered': 'Your order has been delivered. We hope you love it!',
    'cancelled': 'Your order has been cancelled. If you have any questions, please contact us.'
  };

  const subject = `Order Update #${orderData.orderNumber} - ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
  const message = statusMessages[newStatus.toLowerCase()] || `Your order status has been updated to ${newStatus}.`;

  const itemsHtml = (orderData.items || []).map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee;">
        <strong>${item.productTitle}</strong><br/>
        <span style="color: #666666; font-size: 12px;">Size: ${item.variantSize} ${item.variantColor ? `| Color: ${item.variantColor}` : ''} ${item.variantStyle ? `| Style: ${item.variantStyle}` : ''}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  let trackingHtml = '';
  if (newStatus.toLowerCase() === 'shipped' && (orderData.trackingNumber || orderData.trackingLink)) {
    trackingHtml = `
      <div style="margin-top: 25px; padding: 20px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
        <h3 style="margin-top: 0; color: #166534; font-size: 16px; margin-bottom: 12px;">Tracking Information</h3>
        ${orderData.trackingNumber ? `<p style="margin: 0 0 10px 0; color: #15803d;"><strong>Tracking ID:</strong> ${orderData.trackingNumber}</p>` : ''}
        ${orderData.trackingLink ? `<a href="${orderData.trackingLink}" style="display: inline-block; background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">Track Your Package</a>` : ''}
      </div>
    `;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Anup Gupta Studio</h1>
      </div>
      
      <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="margin-top: 0; color: #111111;">Order Status Update</h2>
        <p style="line-height: 1.6; color: #4b5563;">Hi ${orderData.customerName},</p>
        <p style="line-height: 1.6; color: #4b5563;">${message}</p>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border-left: 4px solid #111111; font-weight: bold;">
          Order #${orderData.orderNumber} is now: <span style="text-transform: uppercase;">${newStatus}</span>
        </div>

        ${trackingHtml}
      </div>

      ${orderData.items && orderData.items.length > 0 ? `
      <h3 style="text-transform: uppercase; font-size: 14px; letter-spacing: 1px; border-bottom: 2px solid #111111; padding-bottom: 10px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 12px; border-bottom: 2px solid #eeeeee; color: #666666;">Item</th>
            <th style="text-align: center; padding: 12px; border-bottom: 2px solid #eeeeee; color: #666666;">Qty</th>
            <th style="text-align: right; padding: 12px; border-bottom: 2px solid #eeeeee; color: #666666;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="text-align: right; padding: 12px; color: #666666;">Subtotal:</td>
            <td style="text-align: right; padding: 12px;">₹${orderData.subtotal?.toLocaleString('en-IN') || orderData.total?.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align: right; padding: 12px; color: #666666;">Shipping:</td>
            <td style="text-align: right; padding: 12px;">${orderData.shippingCost ? '₹' + orderData.shippingCost.toLocaleString('en-IN') : 'Free'}</td>
          </tr>
          ${orderData.discountAmount ? `
          <tr>
            <td colspan="2" style="text-align: right; padding: 12px; color: #666666;">Discount \${orderData.discountCode ? '(' + orderData.discountCode + ')' : ''}:</td>
            <td style="text-align: right; padding: 12px; color: #dc2626;">-₹\${orderData.discountAmount.toLocaleString('en-IN')}</td>
          </tr>
          ` : ''}
          <tr>
            <td colspan="2" style="text-align: right; padding: 12px; font-weight: bold; color: #111111; font-size: 16px;">Total:</td>
            <td style="text-align: right; padding: 12px; font-weight: bold; color: #111111; font-size: 16px;">₹${orderData.total?.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>
      ` : ''}

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999;">
        <p>If you have any questions, reply to this email or contact us at support@anupguptastudio.com.</p>
        <p>&copy; ${new Date().getFullYear()} Anup Gupta Studio. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: orderData.customerEmail, subject, html });
}
