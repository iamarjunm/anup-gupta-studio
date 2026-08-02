'use client';

import { X, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { updateOrderStatus } from '@/app/actions/admin';
import { useState } from 'react';

export function OrderDetailsModal({ order, isOpen, onClose, onUpdateStatus }: { order: any, isOpen: boolean, onClose: () => void, onUpdateStatus: (id: string, status: string) => void }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    const res = await updateOrderStatus(order._id, newStatus);
    if (res.success) {
      onUpdateStatus(order._id, newStatus);
    } else {
      alert('Failed to update status');
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'processing': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order #{order.orderNumber || order._id.slice(-6)}</h2>
            <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Status Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Current Status</h3>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-50 rounded-full">
                {getStatusIcon(order.status)}
              </div>
              <div className="flex-1">
                <select 
                  value={order.status || 'processing'}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={loading}
                  className="w-full text-sm font-bold uppercase tracking-wider py-2 px-3 rounded-lg border border-gray-200 outline-none cursor-pointer focus:ring-2 focus:ring-gray-200 transition-colors bg-white disabled:opacity-50"
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Customer Details</h3>
            <div>
              <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
              <p className="text-sm text-gray-500">{order.customerEmail}</p>
              {order.customerPhone && <p className="text-sm text-gray-500">{order.customerPhone}</p>}
            </div>
            
            {order.shippingAddress && (
              <div className="pt-4 border-t border-gray-50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {order.shippingAddress.street}<br/>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br/>
                  {order.shippingAddress.country}
                </p>
              </div>
            )}
          </div>

          {/* Itemized Receipt */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{item.productTitle}</p>
                    <p className="text-xs text-gray-500 mt-1">Size: {item.variantSize} | Color: {item.variantColor || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{item.price?.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>₹{order.subtotal?.toLocaleString('en-IN') || order.total?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>{order.shippingCost ? `₹${order.shippingCost.toLocaleString('en-IN')}` : 'Free'}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-50 mt-2">
                <span>Total</span>
                <span>₹{order.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
