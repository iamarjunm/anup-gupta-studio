'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { SchemaConfig, FieldConfig } from '@/lib/schema-config';
import { createDocument, updateDocument, uploadImageToSanity, fetchReferences } from '@/app/actions/cms';
import { useToast } from '@/contexts/ToastContext';

export function CmsFormModal({ schema, doc, isOpen, onClose, onSaved }: { schema: SchemaConfig, doc?: any, isOpen: boolean, onClose: () => void, onSaved: (doc: any) => void }) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [references, setReferences] = useState<Record<string, any[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (doc) {
        setFormData(doc);
      } else {
        const defaults: any = {};
        if (schema.name === 'product') {
          defaults.sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'].map(s => ({
            size: s,
            stock: 10,
            _key: Math.random().toString(36).substring(2, 9)
          }));
        }
        setFormData(defaults);
      }
      // Fetch references for reference fields
      schema.fields.filter(f => f.type === 'reference').forEach(async (f) => {
        if (f.referenceTo) {
          const res = await fetchReferences(f.referenceTo);
          if (res.success) {
            setReferences(prev => ({ ...prev, [f.name]: res.data }));
          }
        }
      });
    }
  }, [isOpen, doc, schema]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    
    try {
      const res = await uploadImageToSanity(fd);
      if (res.success && res.asset) {
        handleChange(name, res.asset);
      } else {
        toast('Image upload failed', 'error');
      }
    } catch (error) {
      toast('Image upload failed', 'error');
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Auto-generate slug if it exists and wasn't provided
    const dataToSave = { ...formData };
    schema.fields.forEach(f => {
      if (f.type === 'slug' && !dataToSave[f.name] && dataToSave.title) {
        dataToSave[f.name] = { current: dataToSave.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') };
      }
      if (f.type === 'block' && typeof dataToSave[f.name] === 'string') {
         dataToSave[f.name] = dataToSave[f.name].split('\n').filter((line: string) => line.trim() !== '').map((line: string) => ({
           _key: Math.random().toString(36).substring(2, 9),
           _type: 'block',
           style: 'normal',
           children: [{ 
             _key: Math.random().toString(36).substring(2, 9),
             _type: 'span', 
             marks: [],
             text: line 
           }]
         }));
      }
      if (f.type === 'reference' && dataToSave[f.name]) {
        if (f.name.endsWith('s')) {
          const refValue = dataToSave[f.name];
          if (!Array.isArray(refValue)) {
            dataToSave[f.name] = [{
              _key: Math.random().toString(36).substring(2, 9),
              _type: 'reference',
              _ref: refValue._ref || refValue
            }];
          }
        }
      }
    });

    try {
      let res;
      if (doc?._id) {
        res = await updateDocument(doc._id, dataToSave);
      } else {
        res = await createDocument(schema.name, dataToSave);
      }

      if (res?.success) {
        toast(doc ? 'Document updated successfully' : 'Document created successfully', 'success');
        onSaved(res.data);
        onClose();
      } else {
        toast(res?.message || 'Failed to save document', 'error');
      }
    } catch (e: any) {
      toast(e.message || 'An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">{doc ? 'Edit' : 'Add'} {schema.title}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="cms-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schema.fields.map((field) => (
              <div key={field.name} className={
                ['block', 'text', 'image_array', 'sizes_array', 'styles_array', 'object', 'reference'].includes(field.type) && field.name.endsWith('s') 
                  || ['block', 'text', 'image_array', 'sizes_array', 'styles_array', 'object'].includes(field.type)
                  ? 'md:col-span-2' 
                  : ''
              }>
                <label className="block text-sm font-bold text-gray-700 mb-1">{field.title}</label>
                
                {field.type === 'string' && !field.options && (
                  <input
                    type="text"
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                    required={field.name === 'title'}
                  />
                )}

                {field.type === 'string' && field.options && (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white"
                  >
                    <option value="">Select an option</option>
                    {field.options.map((opt: any) => (
                      <option key={opt.value} value={opt.value}>{opt.title}</option>
                    ))}
                  </select>
                )}

                {field.type === 'number' && (
                  <input
                    type="number"
                    value={formData[field.name] ?? ''}
                    onChange={(e) => handleChange(field.name, e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                )}

                {field.type === 'datetime' && (
                  <input
                    type="datetime-local"
                    value={formData[field.name] ? new Date(formData[field.name]).toISOString().slice(0, 16) : ''}
                    onChange={(e) => handleChange(field.name, e.target.value ? new Date(e.target.value).toISOString() : '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white"
                  />
                )}

                {field.type === 'boolean' && (
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={formData[field.name] || false}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm font-medium text-gray-700">{field.title}</span>
                  </label>
                )}

                {field.type === 'text' && (
                  <div className="space-y-2">
                    <textarea
                      rows={field.name === 'sizeChartRaw' ? 10 : 3}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none font-mono text-sm"
                    />
                    {field.name === 'sizeChartRaw' && (
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-900 mt-2">
                        <p className="font-bold mb-2">How to format your size chart:</p>
                        <p className="mb-2">Copy directly from Excel/Sheets and paste above. Lines without tabs (like a single column in Excel) will become subheadings.</p>
                        <p className="font-semibold mt-4 mb-1">Example:</p>
                        <pre className="text-xs bg-white p-3 rounded border border-blue-200 overflow-x-auto">
                          Size Chart - Kurtas<br/>
                          <br/>
                          KURTA READY MEASUREMENT - SHORT<br/>
                          Size    Sleeve  Chest   Shoulder  Length<br/>
                          XS      24      39      16.5      33<br/>
                          Small   24.5    41      17        33<br/>
                          <br/>
                          PYJAMA<br/>
                          Size    Waist   Length<br/>
                          XS      28      38<br/>
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {field.type === 'block' && (
                  <textarea
                    rows={5}
                    placeholder="Enter plain text (will be converted to portable text block)"
                    value={typeof formData[field.name] === 'string' ? formData[field.name] : (formData[field.name] || []).map((b: any) => (b.children || []).map((c: any) => c.text).join('')).join('\n')}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                )}

                {field.type === 'slug' && (
                  <input
                    type="text"
                    placeholder="Auto-generated from title"
                    value={formData[field.name]?.current || formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, { current: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-gray-50"
                  />
                )}

                {field.type === 'array_string' && (
                  <input
                    type="text"
                    placeholder="Comma separated values"
                    value={Array.isArray(formData[field.name]) ? formData[field.name].join(', ') : (formData[field.name] || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleChange(field.name, val ? val.split(',').map(s => s.trim()) : []);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                )}

                {field.type === 'object' && (
                  <textarea
                    rows={6}
                    placeholder='{"key": "value"}'
                    value={typeof formData[field.name] === 'object' && formData[field.name] !== null ? JSON.stringify(formData[field.name], null, 2) : (formData[field.name] || '')}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        handleChange(field.name, parsed);
                      } catch (err) {
                        handleChange(field.name, e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none font-mono text-sm"
                  />
                )}

                {field.type === 'image' && (
                  <div className="mt-2 flex items-center gap-4">
                    {formData[field.name]?.asset?._ref && (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                          src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${formData[field.name].asset._ref.split('-')[1]}-${formData[field.name].asset._ref.split('-')[2]}.${formData[field.name].asset._ref.split('-')[3]}`}
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400 mb-2" />
                      <span className="text-xs font-medium text-gray-500">Upload new image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(field.name, e)} disabled={loading} />
                    </label>
                  </div>
                )}

                {field.type === 'image_array' && (
                  <div className="mt-2 grid grid-cols-3 gap-4">
                    {(formData[field.name] || []).map((imgObj: any, index: number) => (
                      <div key={index} className="relative aspect-[3/4] bg-gray-100 rounded-lg border overflow-hidden group">
                        {imgObj.asset?._ref && (
                          <img 
                            src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${imgObj.asset._ref.split('-')[1]}-${imgObj.asset._ref.split('-')[2]}.${imgObj.asset._ref.split('-')[3]}`}
                            alt={`Gallery ${index}`} 
                            className="w-full h-full object-cover" 
                          />
                        )}
                        <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              if (index > 0) {
                                const newArray = [...(formData[field.name] || [])];
                                const temp = newArray[index - 1];
                                newArray[index - 1] = newArray[index];
                                newArray[index] = temp;
                                handleChange(field.name, newArray);
                              }
                            }}
                            className={`p-1 bg-white rounded shadow-sm hover:bg-gray-100 text-gray-700 ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={index === 0}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const arr = formData[field.name] || [];
                              if (index < arr.length - 1) {
                                const newArray = [...arr];
                                const temp = newArray[index + 1];
                                newArray[index + 1] = newArray[index];
                                newArray[index] = temp;
                                handleChange(field.name, newArray);
                              }
                            }}
                            className={`p-1 bg-white rounded shadow-sm hover:bg-gray-100 text-gray-700 ${index === (formData[field.name] || []).length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={index === (formData[field.name] || []).length - 1}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newArray = [...(formData[field.name] || [])];
                            newArray.splice(index, 1);
                            handleChange(field.name, newArray);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-xs font-medium text-gray-500">Add Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        className="hidden" 
                        onChange={async (e) => {
                          const files = e.target.files;
                          if (!files || files.length === 0) return;
                          setLoading(true);
                          
                          const uploadPromises = Array.from(files).map(async (file) => {
                            const fd = new FormData();
                            fd.append('file', file);
                            const res = await uploadImageToSanity(fd);
                            if (res.success && res.asset) {
                              return { ...res.asset, _key: Math.random().toString(36).substring(2, 9) };
                            }
                            return null;
                          });

                          try {
                            const results = await Promise.all(uploadPromises);
                            const successfulUploads = results.filter(Boolean);
                            if (successfulUploads.length > 0) {
                              const newArray = [...(formData[field.name] || []), ...successfulUploads];
                              handleChange(field.name, newArray);
                            }
                            if (successfulUploads.length < files.length) {
                              toast('Some images failed to upload', 'error');
                            }
                          } catch (error) {
                            toast('Image upload failed', 'error');
                          }
                          setLoading(false);
                        }} 
                        disabled={loading} 
                      />
                    </label>
                  </div>
                )}

                {field.type === 'reference' && (
                  field.name.endsWith('s') ? (
                    <div className="space-y-2 border border-gray-200 p-3 rounded-lg max-h-48 overflow-y-auto bg-white">
                      {references[field.name]?.map((ref: any) => {
                        const isChecked = Array.isArray(formData[field.name]) 
                          ? formData[field.name].some((r: any) => r._ref === ref._id)
                          : formData[field.name]?._ref === ref._id;
                        return (
                          <label key={ref._id} className="flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-50 rounded">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = Array.isArray(formData[field.name]) ? [...formData[field.name]] : 
                                               (formData[field.name] ? [formData[field.name]] : []);
                                if (e.target.checked) {
                                  current.push({ _type: 'reference', _ref: ref._id, _key: Math.random().toString(36).substring(2, 9) });
                                } else {
                                  const idx = current.findIndex((r: any) => r._ref === ref._id);
                                  if (idx > -1) current.splice(idx, 1);
                                }
                                handleChange(field.name, current);
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="text-sm font-medium text-gray-700">{ref.title || ref.name || ref._id}</span>
                          </label>
                        )
                      })}
                      {(!references[field.name] || references[field.name].length === 0) && (
                        <div className="text-sm text-gray-500 italic">No items found.</div>
                      )}
                    </div>
                  ) : (
                    <select
                      value={formData[field.name]?._ref || ''}
                      onChange={(e) => handleChange(field.name, { _type: 'reference', _ref: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none bg-white"
                    >
                      <option value="">Select a {field.referenceTo}</option>
                      {references[field.name]?.map((ref: any) => (
                        <option key={ref._id} value={ref._id}>{ref.title || ref.name || ref._id}</option>
                      ))}
                    </select>
                  )
                )}

                {field.type === 'sizes_array' && (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {(formData[field.name] || []).map((sizeObj: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Size (e.g. S, M)"
                          value={sizeObj.size || ''}
                          onChange={(e) => {
                            const newSizes = [...(formData[field.name] || [])];
                            newSizes[index] = { ...newSizes[index], size: e.target.value, _key: newSizes[index]._key || Math.random().toString(36).substring(2, 9) };
                            handleChange(field.name, newSizes);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Stock"
                          value={sizeObj.stock ?? ''}
                          onChange={(e) => {
                            const newSizes = [...(formData[field.name] || [])];
                            newSizes[index] = { ...newSizes[index], stock: parseInt(e.target.value) || 0 };
                            handleChange(field.name, newSizes);
                          }}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSizes = [...(formData[field.name] || [])];
                            newSizes.splice(index, 1);
                            handleChange(field.name, newSizes);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newSizes = [...(formData[field.name] || [])];
                        newSizes.push({ size: '', stock: 0, _key: Math.random().toString(36).substring(2, 9) });
                        handleChange(field.name, newSizes);
                      }}
                      className="text-xs font-bold text-black uppercase tracking-wider hover:underline"
                    >
                      + Add Size
                    </button>
                  </div>
                )}

                {field.type === 'styles_array' && (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {(formData[field.name] || []).map((styleObj: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Style (e.g. Bandhgala)"
                          value={styleObj.name || ''}
                          onChange={(e) => {
                            const newStyles = [...(formData[field.name] || [])];
                            newStyles[index] = { ...newStyles[index], name: e.target.value, _key: newStyles[index]._key || Math.random().toString(36).substring(2, 9) };
                            handleChange(field.name, newStyles);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={styleObj.price ?? ''}
                          onChange={(e) => {
                            const newStyles = [...(formData[field.name] || [])];
                            newStyles[index] = { ...newStyles[index], price: parseFloat(e.target.value) || 0 };
                            handleChange(field.name, newStyles);
                          }}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newStyles = [...(formData[field.name] || [])];
                            newStyles.splice(index, 1);
                            handleChange(field.name, newStyles);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newStyles = [...(formData[field.name] || [])];
                        newStyles.push({ name: '', price: 0, _key: Math.random().toString(36).substring(2, 9) });
                        handleChange(field.name, newStyles);
                      }}
                      className="text-xs font-bold text-black uppercase tracking-wider hover:underline"
                    >
                      + Add Style
                    </button>
                  </div>
                )}
              </div>
            ))}
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <button 
            type="submit" 
            form="cms-form"
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-lg font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
