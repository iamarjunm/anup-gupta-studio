'use client';

import { useState } from 'react';
import { Download, Loader2, Database, Users, ShoppingCart, Tag, Mail } from 'lucide-react';
import { getExportData } from '@/app/actions/admin';
import { useToast } from '@/contexts/ToastContext';

export function AdminExportCentre() {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();

  const downloadCsv = (filename: string, headers: string, rows: string[][]) => {
    const csvRows = rows.map(row => row.join(','));
    const csv = [headers, ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJson = (filename: string, data: any) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async (type: 'orders' | 'users' | 'products' | 'subscribers' | 'all') => {
    setIsExporting(type);
    
    try {
      const res = await getExportData();
      if (!res.success || !res.data) {
        toast('Failed to fetch export data', 'error');
        setIsExporting(null);
        return;
      }

      const { orders, users, products, subscribers } = res.data;

      if (type === 'all') {
        downloadJson('anup_gupta_store_backup.json', res.data);
      } else if (type === 'orders') {
        const headers = '"Order Number","Date","Customer Name","Customer Email","Status","Total Amount"';
        const rows = orders.map((o: any) => [
          `"${String(o.orderNumber || o._id).replace(/"/g, '""')}"`,
          `"${new Date(o.createdAt || o._createdAt).toLocaleDateString()}"`,
          `"${String(o.customerName || '').replace(/"/g, '""')}"`,
          `"${String(o.customerEmail || '').replace(/"/g, '""')}"`,
          `"${String(o.status || 'Processing').replace(/"/g, '""')}"`,
          `"${o.total || 0}"`
        ]);
        downloadCsv('orders_export.csv', headers, rows);
      } else if (type === 'users') {
        const headers = '"Name","Email","Role","Auth Provider","Joined Date"';
        const rows = users.map((u: any) => [
          `"${String(u.name || 'Anonymous User').replace(/"/g, '""')}"`,
          `"${String(u.email || 'No email').replace(/"/g, '""')}"`,
          `"${u.isAdmin ? 'Admin' : 'Customer'}"`,
          `"${String(u.authProvider || 'email').replace(/"/g, '""')}"`,
          `"${new Date(u.createdAt || u._createdAt).toLocaleDateString()}"`
        ]);
        downloadCsv('users_export.csv', headers, rows);
      } else if (type === 'products') {
        const headers = '"Name","Slug","Price","Available"';
        const rows = products.map((p: any) => [
          `"${String(p.name || '').replace(/"/g, '""')}"`,
          `"${String(p.slug?.current || '').replace(/"/g, '""')}"`,
          `"${p.price || 0}"`,
          `"${p.isAvailable ? 'Yes' : 'No'}"`
        ]);
        downloadCsv('products_export.csv', headers, rows);
      } else if (type === 'subscribers') {
        const headers = '"Email","Subscribed At"';
        const rows = subscribers.map((s: any) => [
          `"${String(s.email || '').replace(/"/g, '""')}"`,
          `"${new Date(s._createdAt).toLocaleDateString()}"`
        ]);
        downloadCsv('subscribers_export.csv', headers, rows);
      }
      
    } catch (e) {
      toast('An error occurred during export.', 'error');
      console.error(e);
    }

    setIsExporting(null);
  };

  const exportOptions = [
    { id: 'orders', name: 'Orders (CSV)', icon: ShoppingCart, color: 'bg-blue-50 text-blue-700' },
    { id: 'users', name: 'Users (CSV)', icon: Users, color: 'bg-green-50 text-green-700' },
    { id: 'products', name: 'Products (CSV)', icon: Tag, color: 'bg-purple-50 text-purple-700' },
    { id: 'subscribers', name: 'Subscribers (CSV)', icon: Mail, color: 'bg-orange-50 text-orange-700' },
  ] as const;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
          <Database className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-gray-900">Export Centre</h2>
          <p className="text-sm text-gray-500">Download store data for accounting and analysis.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {exportOptions.map(option => (
          <button
            key={option.id}
            onClick={() => handleExport(option.id)}
            disabled={!!isExporting}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-all ${isExporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${option.color}`}>
              {isExporting === option.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <option.icon className="w-5 h-5" />
              )}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 text-center">
              {option.name}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => handleExport('all')}
        disabled={!!isExporting}
        className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isExporting === 'all' ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Preparing Backup...</>
        ) : (
          <><Download className="w-4 h-4" /> Export Store Backup (JSON)</>
        )}
      </button>
      <p className="text-xs text-center text-gray-400 mt-3">
        The full backup includes all relational data, schema references, and metadata.
      </p>
    </div>
  );
}
