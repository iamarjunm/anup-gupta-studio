'use client';

import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { SchemaConfig } from '@/lib/schema-config';
import { updateDocument, createDocument } from '@/app/actions/cms';

export function SiteSettingsEditor({ schema, initialDoc }: { schema: SchemaConfig, initialDoc: any }) {
  const [formData, setFormData] = useState<any>(initialDoc || {});
  const [loading, setLoading] = useState(false);

  // Helper for deeply nested updates
  const updateField = (path: string[], value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dataToSave = { ...formData };
    // Convert portable text fields if they are plain strings
    ['productionAndShipping', 'disclaimer'].forEach(field => {
      if (typeof dataToSave[field] === 'string') {
        dataToSave[field] = [{
          _type: 'block',
          children: [{ _type: 'span', text: dataToSave[field] }]
        }];
      }
    });

    let res;
    if (initialDoc?._id) {
      res = await updateDocument(initialDoc._id, dataToSave);
    } else {
      res = await createDocument('siteSettings', dataToSave);
    }

    if (res?.success) {
      alert('Settings saved successfully!');
    } else {
      alert('Failed to save settings: ' + res?.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage global configuration, shipping rules, and promotional games.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Site Name</label>
              <input type="text" value={formData.siteName || ''} onChange={e => updateField(['siteName'], e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Tagline</label>
              <input type="text" value={formData.tagline || ''} onChange={e => updateField(['tagline'], e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Contact Email</label>
              <input type="email" value={formData.contactEmail || ''} onChange={e => updateField(['contactEmail'], e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Contact Phone</label>
              <input type="text" value={formData.contactPhone || ''} onChange={e => updateField(['contactPhone'], e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Address</label>
              <input type="text" value={formData.address || ''} onChange={e => updateField(['address'], e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Currency</label>
              <input type="text" placeholder="INR" value={formData.currency || ''} onChange={e => updateField(['currency'], e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">Shipping Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.shippingSettings?.shippingEnabled || false} onChange={e => updateField(['shippingSettings', 'shippingEnabled'], e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
                <span className="text-sm font-bold text-gray-700">Enable Shipping Calculations</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Standard Shipping Cost</label>
              <input type="number" value={formData.shippingSettings?.standardShippingCost || 0} onChange={e => updateField(['shippingSettings', 'standardShippingCost'], parseFloat(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Free Shipping Threshold</label>
              <input type="number" value={formData.shippingSettings?.freeShippingThreshold || 0} onChange={e => updateField(['shippingSettings', 'freeShippingThreshold'], parseFloat(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
          </div>
        </div>

        {/* Promotional Games */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">Promotional Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.promotionalGames?.enabled || false} onChange={e => updateField(['promotionalGames', 'enabled'], e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
                <span className="text-sm font-bold text-gray-700">Enable Promotional Games</span>
              </label>
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.promotionalGames?.showFloatingButton || false} onChange={e => updateField(['promotionalGames', 'showFloatingButton'], e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
                <span className="text-sm font-bold text-gray-700">Show Floating Trigger Button</span>
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Active Game</label>
              <select value={formData.promotionalGames?.activeGame || ''} onChange={e => updateField(['promotionalGames', 'activeGame'], e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none">
                <option value="">None</option>
                <option value="crazySpin">Crazy Spin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Auto-open Delay (ms)</label>
              <input type="number" value={formData.promotionalGames?.autoOpenDelay || 0} onChange={e => updateField(['promotionalGames', 'autoOpenDelay'], parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" />
            </div>
            
            {/* Crazy Spin Specifics */}
            {formData.promotionalGames?.activeGame === 'crazySpin' && (
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3"><h4 className="text-xs font-bold uppercase text-gray-500">Crazy Spin Config</h4></div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Bomb Probability (0-1)</label>
                   <input type="number" step="0.1" value={formData.promotionalGames?.crazySpinGameConfig?.bombProbability || 0} onChange={e => updateField(['promotionalGames', 'crazySpinGameConfig', 'bombProbability'], parseFloat(e.target.value))} className="w-full px-2 py-1 text-sm border rounded-md" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Segments</label>
                   <input type="number" value={formData.promotionalGames?.crazySpinGameConfig?.numberOfSegments || 8} onChange={e => updateField(['promotionalGames', 'crazySpinGameConfig', 'numberOfSegments'], parseInt(e.target.value))} className="w-full px-2 py-1 text-sm border rounded-md" />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase">Spin Duration (ms)</label>
                   <input type="number" value={formData.promotionalGames?.crazySpinGameConfig?.spinDuration || 5000} onChange={e => updateField(['promotionalGames', 'crazySpinGameConfig', 'spinDuration'], parseInt(e.target.value))} className="w-full px-2 py-1 text-sm border rounded-md" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">Global Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Instagram Post Links (Comma Separated)</label>
              <textarea 
                rows={3} 
                value={Array.isArray(formData.instagramLinks) ? formData.instagramLinks.join(', ') : ''} 
                onChange={e => updateField(['instagramLinks'], e.target.value.split(',').map(s => s.trim()))} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none font-mono text-sm" 
                placeholder="https://instagram.com/p/..., https://instagram.com/p/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Global Production & Shipping Info</label>
              <textarea 
                rows={4} 
                value={typeof formData.productionAndShipping === 'string' ? formData.productionAndShipping : formData.productionAndShipping?.[0]?.children?.[0]?.text || ''} 
                onChange={e => updateField(['productionAndShipping'], e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Global Disclaimer</label>
              <textarea 
                rows={4} 
                value={typeof formData.disclaimer === 'string' ? formData.disclaimer : formData.disclaimer?.[0]?.children?.[0]?.text || ''} 
                onChange={e => updateField(['disclaimer'], e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none" 
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-8 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-black text-white font-bold uppercase tracking-wider rounded-full shadow-2xl hover:bg-gray-900 hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
