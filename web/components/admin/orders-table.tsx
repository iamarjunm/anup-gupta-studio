'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions/admin';
import { OrderDetailsModal } from './order-details-modal';

export function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?._id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 font-medium">
          <tr>
            <th className="px-6 py-4">Order Details</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Items</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
            </tr>
          ) : (
            orders.map((order: any) => (
              <tr 
                key={order._id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{order.orderNumber || order._id.slice(-6)}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{order.customerName}</div>
                  <div className="text-gray-500 text-xs">{order.customerEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-600 text-xs space-y-1">
                    {order.items?.length > 0 ? `${order.items.length} items` : '0 items'}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  ₹{order.total?.toLocaleString('en-IN') || 0}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                      ${order.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                      ${order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                      ${!['delivered', 'processing', 'shipped', 'cancelled'].includes(order.status) ? 'bg-gray-100 text-gray-700' : ''}
                    `}>
                    {order.status || 'Processing'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <OrderDetailsModal 
      isOpen={!!selectedOrder}
      order={selectedOrder}
      onClose={() => setSelectedOrder(null)}
      onUpdateStatus={handleStatusChange}
    />
    </>
  );
}
