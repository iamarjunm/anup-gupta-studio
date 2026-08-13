'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { client } from '@/lib/sanity';
import { InvoiceTemplate } from '@/components/invoice';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (orderId) {
      client.fetch(`*[_type == "order" && orderNumber == $orderId][0]`, { orderId })
        .then(setOrder)
        .catch(console.error);
    }
  }, [orderId]);

  return (
    <>
      <div className="print:hidden min-h-[70vh] flex flex-col items-center px-4 py-16 lg:py-24 bg-[#f8f8f8]">
      <div className="max-w-3xl w-full">
        {/* Header Section */}
        <div className="bg-white p-8 lg:p-12 border border-gray-100 shadow-sm text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-wide text-gray-900 uppercase mb-4">
            Order Confirmed
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg mx-auto">
            Thank you for shopping with Anup Gupta Studio. Your order has been successfully placed and payment is verified. We will send you a confirmation email shortly.
          </p>
          
          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.print()}
              disabled={!order}
              className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
            >
              Download Invoice
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Details Section */}
        {order && (
          <div className="bg-white border border-gray-100 shadow-sm p-8 lg:p-12">
            <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Order Number</p>
                <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date Placed</p>
                <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping To</p>
                <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
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

            <div className="py-8 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Items Ordered</p>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item._key} className="flex justify-between items-center p-4 border border-gray-100 bg-gray-50/50">
                    <div>
                      <p className="font-semibold text-gray-900">{item.productTitle}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Size: {item.variantSize} 
                        {item.variantColor && ` | Color: ${item.variantColor}`} 
                        | Qty: {item.quantity}
                      </p>
                      {item.measurements && (Array.isArray(item.measurements) ? item.measurements.length > 0 : Object.keys(item.measurements).length > 0) && (
                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 grid grid-cols-2 gap-x-2 gap-y-1">
                          {(Array.isArray(item.measurements) ? item.measurements : Object.entries(item.measurements).map(([k,v]) => ({key: k, value: v}))).map((m: any) => (
                            <div key={m.key}>
                              <span>{m.key}: </span>
                              <span className="font-medium text-gray-900">{String(m.value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-gray-900">Rs. {((item.price || 0) * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 w-full md:w-1/2 ml-auto space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal?.toLocaleString('en-IN') || (order.total || 0).toLocaleString('en-IN')}</span>
              </div>
              
              {(() => {
                const calculatedDiscount = order.discountAmount !== undefined 
                  ? order.discountAmount 
                  : Math.max(0, (order.subtotal || order.total) + (order.shippingCost || 0) - order.total);
                  
                return calculatedDiscount > 0 ? (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount {order.discountCode ? `(${order.discountCode})` : ''}</span>
                    <span>- Rs. {calculatedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                ) : null;
              })()}

              <div className="flex justify-between text-sm text-gray-600 pb-4 border-b border-gray-100">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? 'Free' : `Rs. ${order.shippingCost?.toLocaleString('en-IN') || 0}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                <span>Total Paid</span>
                <span>Rs. {(order.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      
      <InvoiceTemplate order={order} />
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-white"></div>}>
      <SuccessContent />
    </Suspense>
  );
}
