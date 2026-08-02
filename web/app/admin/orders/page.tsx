import { getAdminOrders } from '../../actions/admin';
import { OrdersTable } from '@/components/admin/orders-table';

export default async function AdminOrdersPage() {
  const { orders } = await getAdminOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and update customer orders.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <OrdersTable initialOrders={orders || []} />
      </div>
    </div>
  );
}
