'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions/admin';
import { Download } from 'lucide-react';
import { OrderDetailsModal } from './order-details-modal';
import { useToast } from '@/contexts/ToastContext';

export function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { toast } = useToast();

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?._id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleExport = () => {
    if (orders.length === 0) {
      toast("No data to export.", "warning");
      return;
    }
    
    const headers = '"Order Number","Date","Customer Name","Customer Email","Status","Items Count","Total Amount","Shipping Address"';
    const rows = orders.map(order => {
      return [
        `"${String(order.orderNumber || order._id).replace(/"/g, '""')}"`,
        `"${new Date(order.createdAt).toLocaleDateString()}"`,
        `"${String(order.customerName || '').replace(/"/g, '""')}"`,
        `"${String(order.customerEmail || '').replace(/"/g, '""')}"`,
        `"${String(order.status || 'Processing').replace(/"/g, '""')}"`,
        `"${order.items?.length || 0}"`,
        `"${order.total || 0}"`,
        `"${order.shippingAddress ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`.replace(/"/g, '""') : 'N/A'}"`
      ].join(',');
    });
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'orders_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and update customer orders.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export All
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
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
