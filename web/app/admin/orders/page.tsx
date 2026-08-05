import { getAdminOrders } from '../../actions/admin';
import { OrdersTable } from '@/components/admin/orders-table';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const { orders } = await getAdminOrders();

  return (
    <div className="space-y-8">
      <OrdersTable initialOrders={orders || []} />
    </div>
  );
}
