'use client';

import { useState } from 'react';
import { UserCircle } from 'lucide-react';
import { UserDetailsModal } from './user-details-modal';

export function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleRoleChange = (userId: string, isAdmin: boolean) => {
    setUsers(users.map(u => u._id === userId ? { ...u, isAdmin } : u));
    if (selectedUser?._id === userId) {
      setSelectedUser({ ...selectedUser, isAdmin });
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Auth Method</th>
              <th className="px-6 py-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found.</td>
              </tr>
            ) : (
              users?.map((user: any) => (
                <tr 
                  key={user._id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                      <UserCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{user.name || 'Anonymous User'}</div>
                      <div className="text-gray-500 text-xs">{user.email || 'No email provided'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                      ${user.isAdmin ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}
                    `}>
                      {user.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 capitalize">
                    {user.authProvider || 'email'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserDetailsModal 
        isOpen={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUpdateRole={handleRoleChange}
      />
    </>
  );
}
