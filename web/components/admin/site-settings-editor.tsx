'use client';

import { useState } from 'react';
import { Loader2, Save, Upload } from 'lucide-react';
import { SchemaConfig } from '@/lib/schema-config';
import { updateDocument, createDocument, uploadImageToSanity } from '@/app/actions/cms';
import { useToast } from '@/contexts/ToastContext';

export function SiteSettingsEditor({ schema, initialDoc }: { schema: SchemaConfig, initialDoc: any }) {
  const [formData, setFormData] = useState<any>(initialDoc || {});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleCoverImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    
    try {
      const res = await uploadImageToSanity(fd);
      if (res.success && res.asset) {
        const newLinks = [...(formData.instagramLinks || [])];
        const existingItem = typeof newLinks[idx] === 'object' ? newLinks[idx] : { link: newLinks[idx] || '' };
        newLinks[idx] = { ...existingItem, _type: 'instagramPost', coverImage: res.asset };
        updateField(['instagramLinks'], newLinks);
        toast('Image uploaded successfully', 'success');
      } else {
        toast('Image upload failed: ' + (res.message || ''), 'error');
      }
    } catch (error) {
      toast('Image upload failed', 'error');
    }
    setLoading(false);
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

    if (Array.isArray(dataToSave.instagramLinks)) {
      dataToSave.instagramLinks = dataToSave.instagramLinks.map((linkItem: any) => {
        if (typeof linkItem === 'string') {
          return { _type: 'instagramPost', link: linkItem };
        }
        return { ...linkItem, _type: 'instagramPost' };
      }).filter((item: any) => item.link);
    }

    try {
      let res;
      if (initialDoc?._id) {
        res = await updateDocument(initialDoc._id, dataToSave);
      } else {
        res = await createDocument('siteSettings', dataToSave);
      }

      if (res?.success) {
        toast('Settings saved successfully!', 'success');
      } else {
        toast('Failed to save settings: ' + (res?.message || 'Unknown error'), 'error');
      }
    } catch (e: any) {
      toast(e.message || 'Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
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



        {/* Global Content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-100 pb-3">Global Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Instagram Post Links</label>
              <div className="mb-3 text-[11px] text-gray-500">Note: You can paste a direct image URL below, or use Sanity Studio for full image uploads.</div>
              <div className="space-y-3">
                {(formData.instagramLinks || []).map((linkItem: any, idx: number) => {
                  const link = typeof linkItem === 'string' ? linkItem : (linkItem?.link || '');
                  
                  return (
                    <div key={idx} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Item {idx + 1}</span>
                        <button 
                          onClick={() => {
                            const newLinks = [...(formData.instagramLinks || [])];
                            newLinks.splice(idx, 1);
                            updateField(['instagramLinks'], newLinks);
                          }}
                          className="text-red-500 text-xs font-medium hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={link} 
                        onChange={e => {
                          const newLinks = [...(formData.instagramLinks || [])];
                          const existingItem = typeof linkItem === 'object' ? linkItem : {};
                          newLinks[idx] = { ...existingItem, _type: 'instagramPost', link: e.target.value };
                          updateField(['instagramLinks'], newLinks);
                        }} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none font-mono text-sm mb-2" 
                        placeholder="Instagram Post/Reel URL"
                      />
                      <div className="mt-2 flex flex-col md:flex-row items-center gap-4">
                        {typeof linkItem === 'object' && linkItem?.coverImage?.asset?._ref && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 relative group">
                            <img 
                              src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${linkItem.coverImage.asset._ref.split('-')[1]}-${linkItem.coverImage.asset._ref.split('-')[2]}.${linkItem.coverImage.asset._ref.split('-')[3]}`}
                              alt="Cover Preview" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newLinks = [...(formData.instagramLinks || [])];
                                  const existingItem = typeof linkItem === 'object' ? linkItem : { link };
                                  newLinks[idx] = { ...existingItem, _type: 'instagramPost', coverImage: null };
                                  updateField(['instagramLinks'], newLinks);
                                }}
                                className="text-white text-[10px] font-bold"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>
                        )}
                        <label className="flex-1 w-full border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                          <Upload className="w-4 h-4 text-gray-400 mb-1" />
                          <span className="text-[10px] font-medium text-gray-500">Upload optional cover image</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCoverImageUpload(idx, e)} disabled={loading} />
                        </label>
                      </div>
                    </div>
                  );
                })}
                <button 
                  onClick={() => {
                    updateField(['instagramLinks'], [...(formData.instagramLinks || []), { _type: 'instagramPost', link: '', coverImage: null }]);
                  }}
                  className="px-3 py-2 bg-black text-white text-xs font-bold rounded-lg uppercase tracking-wider mt-2"
                >
                  + Add Link
                </button>
              </div>
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
