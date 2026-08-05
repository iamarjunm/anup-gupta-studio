'use client';

import { useState } from 'react';
import { UserCircle, Download } from 'lucide-react';
import { UserDetailsModal } from './user-details-modal';
import { useToast } from '@/contexts/ToastContext';

export function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();

  const handleRoleChange = (userId: string, isAdmin: boolean) => {
    setUsers(users.map(u => u._id === userId ? { ...u, isAdmin } : u));
    if (selectedUser?._id === userId) {
      setSelectedUser({ ...selectedUser, isAdmin });
    }
  };

  const handleExport = () => {
    if (users.length === 0) {
      toast("No data to export.", "warning");
      return;
    }
    
    const headers = '"Name","Email","Role","Auth Provider","Joined Date"';
    const rows = users.map(user => {
      return [
        `"${String(user.name || 'Anonymous User').replace(/"/g, '""')}"`,
        `"${String(user.email || 'No email provided').replace(/"/g, '""')}"`,
        `"${user.isAdmin ? 'Admin' : 'Customer'}"`,
        `"${String(user.authProvider || 'email').replace(/"/g, '""')}"`,
        `"${new Date(user.createdAt).toLocaleDateString()}"`
      ].join(',');
    });
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'users_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">Directory of all registered customers and admins.</p>
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
