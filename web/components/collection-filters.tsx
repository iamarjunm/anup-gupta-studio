'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Grid3x3, LayoutGrid } from 'lucide-react';

export function CollectionFilters({ 
  totalItems, 
  onLayoutChange,
  currentLayout,
  highestPrice
}: { 
  totalItems: number,
  onLayoutChange: (layout: 'grid-2' | 'grid-4') => void,
  currentLayout: 'grid-2' | 'grid-4',
  highestPrice?: number
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSort = searchParams.get('sort') || '';
  const currentAvailability = searchParams.get('availability') || '';
  const currentPrice = searchParams.get('price') || '';

  const [sortOpen, setSortOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  // Parse current price min/max from URL for local state
  const initialMinPrice = currentPrice ? currentPrice.split('-')[0] : '';
  const initialMaxPrice = currentPrice && currentPrice.includes('-') ? currentPrice.split('-')[1] : '';
  
  const [minPriceInput, setMinPriceInput] = useState(initialMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(initialMaxPrice);

  const applyPriceFilter = () => {
    if (!minPriceInput && !maxPriceInput) {
      updateParam('price', '');
    } else {
      updateParam('price', `${minPriceInput || 0}-${maxPriceInput || highestPrice}`);
    }
    setPriceOpen(false);
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4 mb-8">
      <div className="flex items-center gap-6">
        {/* Availability Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setAvailabilityOpen(!availabilityOpen); setSortOpen(false); setPriceOpen(false); }}
            className="flex items-center gap-2 text-sm text-gray-900 font-medium"
          >
            Availability <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {availabilityOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 py-1">
              <button 
                onClick={() => { updateParam('availability', ''); setAvailabilityOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!currentAvailability ? 'font-bold' : ''}`}
              >
                All
              </button>
              <button 
                onClick={() => { updateParam('availability', 'in_stock'); setAvailabilityOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentAvailability === 'in_stock' ? 'font-bold' : ''}`}
              >
                In Stock
              </button>
              <button 
                onClick={() => { updateParam('availability', 'out_of_stock'); setAvailabilityOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentAvailability === 'out_of_stock' ? 'font-bold' : ''}`}
              >
                Out of Stock
              </button>
            </div>
          )}
        </div>

        {/* Price Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setPriceOpen(!priceOpen); setAvailabilityOpen(false); setSortOpen(false); }}
            className="flex items-center gap-2 text-sm text-gray-900 font-medium"
          >
            Price <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {priceOpen && (
            <div className="absolute top-full left-0 mt-2 w-[320px] bg-white border border-gray-200 shadow-xl rounded-lg z-50 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input 
                    type="number"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
                <span className="text-sm text-gray-600 font-medium">to</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input 
                    type="number"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    placeholder={highestPrice ? highestPrice.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : '0.00'}
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-md text-sm outline-none focus:border-gray-400 transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  The highest price is Rs.{highestPrice ? highestPrice.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : '0.00'}
                </p>
                <button 
                  onClick={applyPriceFilter}
                  className="px-4 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-4 sm:mt-0">
        <span>{totalItems} items</span>
        
        {/* Sort Dropdown */}
        <div className="relative ml-0 sm:ml-4">
          <button 
            onClick={() => { setSortOpen(!sortOpen); setAvailabilityOpen(false); setPriceOpen(false); }}
            className="flex items-center gap-2 text-sm text-gray-900 font-medium"
          >
            Sort <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          
          {sortOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 py-1">
               <button 
                onClick={() => { updateParam('sort', ''); setSortOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!currentSort ? 'font-bold' : ''}`}
              >
                Featured
              </button>
              <button 
                onClick={() => { updateParam('sort', 'price_asc'); setSortOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentSort === 'price_asc' ? 'font-bold' : ''}`}
              >
                Price: Low to High
              </button>
              <button 
                onClick={() => { updateParam('sort', 'price_desc'); setSortOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentSort === 'price_desc' ? 'font-bold' : ''}`}
              >
                Price: High to Low
              </button>
              <button 
                onClick={() => { updateParam('sort', 'newest'); setSortOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentSort === 'newest' ? 'font-bold' : ''}`}
              >
                Newest Arrivals
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={() => onLayoutChange('grid-4')}
            className={`p-1.5 rounded transition-colors ${currentLayout === 'grid-4' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onLayoutChange('grid-2')}
            className={`p-1.5 rounded transition-colors ${currentLayout === 'grid-2' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(sortOpen || availabilityOpen || priceOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => { setSortOpen(false); setAvailabilityOpen(false); setPriceOpen(false); }}
        />
      )}
    </div>
  );
}
