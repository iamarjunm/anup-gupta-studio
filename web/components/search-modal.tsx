'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { ProductCard } from './product-card';
import { searchProducts } from '@/app/actions/search';
import { useDebounce } from '@/hooks/useDebounce';



export function SearchModal({ triggerClass }: { triggerClass?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const sanityResults = await searchProducts(debouncedQuery);
        setResults(sanityResults || []);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery]);



  return (
    <>
      <button suppressHydrationWarning className={triggerClass} onClick={() => setIsOpen(true)}>
        <Search className="w-[18px] h-[18px] lg:w-5 lg:h-5" strokeWidth={1.5} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-start pt-16 sm:pt-24 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-full max-w-[800px] bg-white rounded-lg shadow-2xl p-6 md:p-8 m-4 max-h-[85vh] overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 mb-6">
              <Search className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={1.5} />
              <input 
                suppressHydrationWarning
                type="text" 
                placeholder="Search" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-lg outline-none bg-transparent placeholder:text-gray-400"
                autoFocus
              />
              <button onClick={() => { setIsOpen(false); setQuery(''); }} className="text-gray-500 hover:text-black transition-colors shrink-0 p-1">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="space-y-8">
              {query && (
                 <h3 className="text-sm font-semibold text-gray-900 mb-4">
                   {loading ? 'Searching...' : (results.length === 0 ? 'No results found.' : 'Search Results:')}
                 </h3>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(!query ? [] : results).map((product: any, idx: number) => (
                  <ProductCard 
                    key={product.slug || product.title || idx}
                    title={product.title}
                    price={product.price}
                    originalPrice={product.compareAtPrice || product.originalPrice}
                    imageUrl={product.imageUrl}
                    hoverImageUrl={product.hoverImageUrl}
                    href={`/product/${product.slug || 'sample-product'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
