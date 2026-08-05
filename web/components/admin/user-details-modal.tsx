'use client';

import { Shield, ShieldAlert, X, Mail, Calendar, User as UserIcon } from 'lucide-react';
import { updateUserRole } from '@/app/actions/admin';
import { useToast } from '@/contexts/ToastContext';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { useState } from 'react';

interface UserDetailsModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateRole: (id: string, isAdmin: boolean) => void;
}

export function UserDetailsModal({ isOpen, user, onClose, onUpdateRole }: UserDetailsModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { toast } = useToast();

  if (!isOpen || !user) return null;

  const handleRoleToggle = async () => {
    setIsUpdating(true);
    const newRole = !user.isAdmin;
    const res = await updateUserRole(user._id, newRole);
    if (res.success) {
      toast(`User role updated to ${newRole ? 'Admin' : 'Customer'}`, 'success');
      onUpdateRole(user._id, newRole);
    } else {
      toast(res.message || 'Failed to update user role', 'error');
    }
    setIsUpdating(false);
    setShowConfirm(false);
  };

  return (
    <>
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

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                Danger Zone
              </h3>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isUpdating}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                  user.isAdmin 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : user.isAdmin ? (
                  <><ShieldAlert className="w-4 h-4" /> Revoke Admin Access</>
                ) : (
                  <><Shield className="w-4 h-4" /> Grant Admin Access</>
                )}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal 
        isOpen={showConfirm}
        title={user.isAdmin ? 'Remove Admin Privileges' : 'Grant Admin Privileges'}
        message={`Are you sure you want to ${user.isAdmin ? 'remove' : 'grant'} admin privileges for ${user.name || user.email}?`}
        confirmText="Confirm"
        onConfirm={handleRoleToggle}
        onCancel={() => setShowConfirm(false)}
        isDestructive={user.isAdmin}
      />
    </>
  );
}
