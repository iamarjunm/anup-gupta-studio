'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { RichText } from './rich-text';

type AccordionSection = {
  title: string;
  content: any;
  isTable?: boolean;
};

export function ProductAccordion({ sections }: { sections: AccordionSection[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="border-t border-gray-100">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={section.title} className="border-b border-gray-100">
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-4 text-[11px] font-semibold tracking-widest uppercase text-gray-900 hover:text-gray-600 transition-colors text-left cursor-pointer"
            >
              {section.title}
              {isOpen ? <Minus className="w-3.5 h-3.5 text-gray-400" /> : <Plus className="w-3.5 h-3.5 text-gray-400" />}
            </button>
            {isOpen && section.content && (
              <div className="pb-6 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
                {section.isTable ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr>
                          {section.content.headers?.map((header: string, i: number) => (
                            <th key={i} className="border-b-2 border-gray-900 py-3 pr-4 font-semibold text-gray-900 uppercase tracking-wider">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.content.rows?.map((row: any, rowIndex: number) => (
                          <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                            {row.cells?.map((cell: string, cellIndex: number) => (
                              <td key={cellIndex} className="py-3 pr-4 text-gray-700">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <RichText value={section.content} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
