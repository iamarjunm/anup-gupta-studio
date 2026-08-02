import { getAdminStats, getAdminRecentOrders } from '../actions/admin';
import { IndianRupee, ShoppingBag, Users, Package } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [statsRes, recentOrdersRes] = await Promise.all([
    getAdminStats(),
    getAdminRecentOrders(),
  ]);

  const stats = statsRes.data || { totalRevenue: 0, totalOrders: 0, activeOrders: 0, totalUsers: 0, totalProducts: 0 };
  const recentOrders = recentOrdersRes.orders || [];

  const statCards = [
    { name: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee },
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
    { name: 'Active Orders', value: stats.activeOrders, icon: Package },
    { name: 'Total Users', value: stats.totalUsers, icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store's performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-700">
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No recent orders found.</td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.orderNumber || order._id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <div>{order.customerName}</div>
                      <div className="text-gray-500 text-xs">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
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
      </div>
    </div>
  );
}
