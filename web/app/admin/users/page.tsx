import { getAdminUsers } from '../../actions/admin';
import { UsersTable } from '@/components/admin/users-table';

export default async function AdminUsersPage() {
  const { users } = await getAdminUsers();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Directory of all registered customers and admins.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <UsersTable initialUsers={users || []} />
      </div>
    </div>
  );
}
