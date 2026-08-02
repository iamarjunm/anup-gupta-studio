'use client';

import { X, ShieldAlert, ShieldCheck, Mail, Calendar, User as UserIcon } from 'lucide-react';
import { updateUserRole } from '@/app/actions/admin';
import { useState } from 'react';

export function UserDetailsModal({ user, isOpen, onClose, onUpdateRole }: { user: any, isOpen: boolean, onClose: () => void, onUpdateRole: (id: string, isAdmin: boolean) => void }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const toggleAdminRole = async () => {
    if (!confirm(`Are you sure you want to ${user.isAdmin ? 'remove' : 'grant'} admin privileges for ${user.name || user.email}?`)) return;
    
    setLoading(true);
    const res = await updateUserRole(user._id, !user.isAdmin);
    if (res.success) {
      onUpdateRole(user._id, !user.isAdmin);
    } else {
      alert('Failed to update user role');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">User Profile</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
              <UserIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.name || 'Anonymous User'}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Mail className="w-3 h-3" /> {user.email || 'No email'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Joined</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Auth Method</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {user.authProvider || 'Email'}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  {user.isAdmin ? <ShieldCheck className="w-4 h-4 text-green-500" /> : <ShieldAlert className="w-4 h-4 text-gray-400" />}
                  Admin Privileges
                </h4>
                <p className="text-xs text-gray-500 mt-1">Allow this user to access the admin portal.</p>
              </div>
              <button
                onClick={toggleAdminRole}
                disabled={loading}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-colors disabled:opacity-50 ${
                  user.isAdmin 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                {loading ? 'Saving...' : user.isAdmin ? 'Revoke Access' : 'Grant Access'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
