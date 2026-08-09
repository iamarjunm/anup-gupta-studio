import React from 'react';

export function InvoiceTemplate({ order }: { order: any }) {
  if (!order) return null;

  const calculatedDiscount = order.discountAmount !== undefined 
    ? order.discountAmount 
    : Math.max(0, (order.subtotal || order.total) + (order.shippingCost || 0) - order.total);

  return (
    <div className="hidden print:block absolute top-0 left-0 w-full bg-white text-black p-8 z-[99999] font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest mb-1">ANUP GUPTA STUDIO</h1>
            <p className="text-sm text-gray-500">Premium Men's Ethnic Wear & Party Shirts</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
            <p className="text-sm font-semibold">Order #{order.orderNumber}</p>
            <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Billed To</h3>
            <p className="font-semibold text-gray-800">{order.customerName}</p>
            <p className="text-sm text-gray-600 mt-1">{order.customerEmail}</p>
            <p className="text-sm text-gray-600">{order.customerPhone}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Shipped To</h3>
            <p className="font-semibold text-gray-800">{order.customerName}</p>
            {order.shippingAddress ? (
              <>
                <p className="text-sm text-gray-600 mt-1">{order.shippingAddress.street}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
              </>
            ) : (
              <p className="text-sm text-gray-600 mt-1">Address not provided</p>
            )}
          </div>
        </div>

        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Item</th>
              <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Qty</th>
              <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Price</th>
              <th className="py-3 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any, idx: number) => (
              <tr key={item._key || idx} className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-semibold text-gray-800">{item.productTitle}</p>
                  <p className="text-xs text-gray-500 mt-1">Size: {item.variantSize} {item.variantColor ? `| Color: ${item.variantColor}` : ''}</p>
                </td>
                <td className="py-4 text-center text-gray-800">{item.quantity}</td>
                <td className="py-4 text-right text-gray-800">Rs. {item.price.toLocaleString('en-IN')}</td>
                <td className="py-4 text-right font-medium text-gray-800">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="w-full flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>Rs. {order.subtotal?.toLocaleString('en-IN') || order.total.toLocaleString('en-IN')}</span>
            </div>
            {calculatedDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount {order.discountCode ? `(${order.discountCode})` : ''}</span>
                <span>- Rs. {calculatedDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600 pb-3 border-b border-gray-200">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? 'Free' : `Rs. ${order.shippingCost?.toLocaleString('en-IN') || 0}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-1">
              <span>Total Paid</span>
              <span>Rs. {order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
          <p>This is a computer generated invoice and does not require a physical signature.</p>
          <p className="mt-1">Thank you for shopping with Anup Gupta Studio!</p>
        </div>
      </div>
    </div>
  );
}
