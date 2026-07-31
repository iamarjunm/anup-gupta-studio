'use client';

import { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

export function SizeChartModal({ sizeChart }: { sizeChart: any }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sizeChart) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase hover:text-gray-600 transition-colors cursor-pointer"
      >
        SIZE CHART <ExternalLink className="w-3 h-3 opacity-70" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-medium text-gray-900">Size Chart</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr>
                      {sizeChart.headers?.map((header: string, i: number) => (
                        <th key={i} className="border-b-2 border-gray-900 py-3 pr-4 font-semibold text-gray-900 tracking-wide">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeChart.rows?.map((row: any, rowIndex: number) => (
                      <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        {row.cells?.map((cell: string, cellIndex: number) => (
                          <td key={cellIndex} className="py-4 pr-4 text-gray-700 font-medium">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
