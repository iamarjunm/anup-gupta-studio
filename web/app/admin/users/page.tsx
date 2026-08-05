import { getAdminUsers } from '../../actions/admin';
import { UsersTable } from '@/components/admin/users-table';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const { users } = await getAdminUsers();

  return (
    <div className="space-y-8">
      <UsersTable initialUsers={users || []} />
    </div>
  );
}
