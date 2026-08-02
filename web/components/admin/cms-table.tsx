'use client';

import { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { SchemaConfig } from '@/lib/schema-config';
import { CmsFormModal } from './cms-form-modal';
import { deleteDocument } from '@/app/actions/cms';

export function CmsTable({ schema, initialDocs }: { schema: SchemaConfig, initialDocs: any[] }) {
  const [docs, setDocs] = useState(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayFields = schema.fields.filter(f => !['block', 'image', 'array_string', 'object'].includes(f.type)).slice(0, 4);

  const handleEdit = (doc: any) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDoc(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    const res = await deleteDocument(id);
    if (res.success) {
      setDocs(docs.filter(d => d._id !== id));
    } else {
      alert('Failed to delete document');
    }
  };

  const handleSaved = (savedDoc: any) => {
    if (selectedDoc) {
      setDocs(docs.map(d => d._id === savedDoc._id ? savedDoc : d));
    } else {
      setDocs([savedDoc, ...docs]);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{schema.title}s</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all your {schema.title.toLowerCase()} content.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {schema.title}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                {displayFields.map(f => (
                  <th key={f.name} className="px-6 py-4">{f.title}</th>
                ))}
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {docs.length === 0 ? (
                <tr>
                  <td colSpan={displayFields.length + 1} className="px-6 py-8 text-center text-gray-500">No documents found.</td>
                </tr>
              ) : (
                docs.map((doc: any) => (
                  <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                    {displayFields.map(f => (
                      <td key={f.name} className="px-6 py-4">
                        {f.type === 'boolean' ? (
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${doc[f.name] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {doc[f.name] ? 'Yes' : 'No'}
                          </span>
                        ) : f.type === 'slug' ? (
                          <span className="text-gray-500 text-xs font-mono">{doc[f.name]?.current || 'N/A'}</span>
                        ) : f.type === 'reference' ? (
                          <span className="text-gray-500 text-xs">Ref: {doc[f.name]?._ref?.slice(-6) || 'None'}</span>
                        ) : (
                          <span className="font-medium text-gray-900 truncate max-w-[200px] block">
                            {doc[f.name]?.toString() || '-'}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(doc)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(doc._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CmsFormModal 
        schema={schema}
        doc={selectedDoc}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={handleSaved}
      />
    </>
  );
}
