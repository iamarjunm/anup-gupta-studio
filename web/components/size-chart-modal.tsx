'use client';

import { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

export function SizeChartModal({ sizeChart, sizeChartRaw }: { sizeChart?: any, sizeChartRaw?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sizeChart && !sizeChartRaw) return null;

  const parseSizeChartRaw = (raw: string) => {
    const sections: { title: string, headers: string[], rows: string[][] }[] = [];
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    
    let currentTitle = '';
    let currentHeaders: string[] = [];
    let currentRows: string[][] = [];

    lines.forEach(line => {
      // Split by tab, or if no tabs, split by 2+ spaces, or commas
      let cells: string[] = [];
      if (line.includes('\t')) {
        cells = line.split('\t');
      } else if (line.includes(',')) {
        cells = line.split(',');
      } else {
        cells = line.split(/\s{2,}/);
      }
      
      cells = cells.map(c => c.trim()).filter(Boolean);

      if (cells.length > 1) {
        if (currentHeaders.length === 0) {
          currentHeaders = cells;
        } else {
          currentRows.push(cells);
        }
      } else if (cells.length === 1) {
        if (currentHeaders.length > 0 || currentRows.length > 0) {
          sections.push({ title: currentTitle, headers: currentHeaders, rows: currentRows });
          currentTitle = '';
          currentHeaders = [];
          currentRows = [];
        }
        currentTitle = cells[0];
      }
    });

    if (currentHeaders.length > 0 || currentRows.length > 0) {
      sections.push({ title: currentTitle, headers: currentHeaders, rows: currentRows });
    }
    return sections;
  };

  let sections: any[] = [];
  if (sizeChartRaw) {
    sections = parseSizeChartRaw(sizeChartRaw);
  } else if (sizeChart) {
    sections = [{ title: '', headers: sizeChart.headers, rows: sizeChart.rows?.map((r: any) => r.cells) || [] }];
  }

  if (sections.length === 0 && !sizeChartRaw) return null;

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
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-medium text-gray-900">Size Guide</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors cursor-pointer p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-12">
              {sections.length > 0 ? sections.map((section, idx) => (
                <div key={idx}>
                  {section.title && (
                    <h3 className="text-sm font-bold tracking-widest text-gray-900 uppercase mb-6 bg-gray-50 p-4 border-l-4 border-black">
                      {section.title}
                    </h3>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr>
                          {section.headers?.map((header: string, i: number) => (
                            <th key={i} className="border-b-2 border-gray-900 py-3 pr-6 font-bold text-gray-900 tracking-wide uppercase text-xs whitespace-nowrap">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.rows?.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            {row?.map((cell: string, cellIndex: number) => (
                              <td key={cellIndex} className={`py-4 pr-6 ${cellIndex === 0 ? 'font-semibold text-gray-900' : 'text-gray-600 font-medium'} whitespace-nowrap`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )) : (
                <div className="bg-gray-50 p-6 whitespace-pre-wrap font-mono text-sm text-gray-700">
                  {sizeChartRaw}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
