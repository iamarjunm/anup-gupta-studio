'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type CartItem = {
  id: string; // usually slug + size
  slug: string;
  title: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  color?: string;
  style?: string;
  measurements?: Record<string, string>;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>, openCart?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartCount: number;
  cartTotal: number;
  appliedDiscount: any;
  setAppliedDiscount: (discount: any) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [promoCode, setPromoCode] = useState('');

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((newItem: Omit<CartItem, 'id'>, openCart: boolean = true) => {
    setItems(current => {
      // Create a deterministic hash for measurements if they exist
      const measurementsStr = newItem.measurements 
        ? Object.entries(newItem.measurements).sort().map(([k,v]) => `${k}:${v}`).join('|')
        : '';
        
      const idBase = `${newItem.slug}-${newItem.size}${newItem.style ? `-${newItem.style}` : ''}${newItem.color ? `-${newItem.color}` : ''}`;
      const id = measurementsStr ? `${idBase}-${measurementsStr}` : idBase;
      const existingItem = current.find(item => item.id === id);
      
      if (existingItem) {
        return current.map(item => 
          item.id === id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      
      return [...current, { ...newItem, id }];
    });
    if (openCart) setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      setItems(current => current.filter(item => item.id !== id));
      return;
    }
    setItems(current => current.map(item => item.id === id ? { ...item, quantity } : item));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartCount,
      cartTotal,
      appliedDiscount,
      setAppliedDiscount,
      promoCode,
      setPromoCode
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
