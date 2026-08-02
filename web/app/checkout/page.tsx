'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { client } from '@/lib/sanity';
import { updateUserProfile, updateUserAddresses } from '@/app/actions/profile';
import { AddressModal, Address } from '@/components/address-modal';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { items, cartTotal, appliedDiscount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sanityUser, setSanityUser] = useState<any>(null);
  
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressKey, setSelectedAddressKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push('/');
    }
  }, [items, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const data = await client.fetch(`*[_type == "user" && firebaseUid == $uid][0]`, { uid: user.uid });
          if (data) {
            setSanityUser(data);
            const defaultAddress = data.addresses?.[0];
            if (defaultAddress) {
              setSelectedAddressKey(defaultAddress._key);
            }
            setFormData(prev => ({
              ...prev,
              name: data.name || user.displayName || '',
              email: user.email || '',
              phoneNumber: data.phoneNumber || '',
            }));
          } else {
             setFormData(prev => ({ ...prev, email: user.email || '', name: user.displayName || '' }));
          }
        } catch (error) {
          console.error("Failed to fetch sanity user", error);
        }
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getFinalTotal = () => {
    if (!appliedDiscount) return cartTotal;
    if (appliedDiscount.discountType === 'percentage') {
      return Math.round(cartTotal - (cartTotal * appliedDiscount.percentageOff) / 100);
    }
    return Math.max(0, cartTotal - appliedDiscount.percentageOff);
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Prepare final address
      let finalAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country
      };

      if (user?.uid && sanityUser?.addresses?.length > 0) {
        if (!selectedAddressKey) {
          alert("Please select a shipping address.");
          setIsProcessing(false);
          return;
        }
        const selected = sanityUser.addresses.find((a: any) => a._key === selectedAddressKey);
        if (selected) finalAddress = selected;
      }

      if (!user?.uid && (!finalAddress.street || !finalAddress.city || !finalAddress.state || !finalAddress.postalCode)) {
        alert("Please fill in all shipping details.");
        setIsProcessing(false);
        return;
      }

      // 2. Razorpay Flow
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      const finalAmount = getFinalTotal();

      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount })
      });
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        alert('Could not create order: ' + (orderData.error || 'Unknown error'));
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.amount, 
        currency: orderData.currency,
        name: 'Anup Gupta Studio',
        description: 'Store Purchase',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              clearCart();
              router.push('/checkout/success');
            } else {
              alert('Payment verification failed: ' + verifyData.error);
            }
          } catch (err) {
            alert('An error occurred during verification');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phoneNumber
        },
        theme: {
          color: '#000000'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAddress = async (addr: Omit<Address, '_key'> & { _key?: string }) => {
    if (!user || !sanityUser) return;
    
    let currentAddresses = [...(sanityUser.addresses || [])];
    const newAddr = {
      ...addr,
      _key: Math.random().toString(36).substring(2, 9)
    } as Address;
    
    currentAddresses.push(newAddr);

    const result = await updateUserAddresses(user.uid, currentAddresses);
    if (result.success) {
      setSanityUser({ ...sanityUser, addresses: currentAddresses });
      setSelectedAddressKey(newAddr._key);
      setIsAddressModalOpen(false);
    } else {
      alert(result.message);
    }
  };

  if (isLoading || items.length === 0) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-12 lg:py-16 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        
        {/* Left Form */}
        <div className="flex-1 w-full">
          <h1 className="text-2xl font-bold uppercase tracking-wider mb-8 text-gray-900">Checkout</h1>
          
          <form id="checkout-form" onSubmit={handlePayNow} className="bg-white p-6 lg:p-10 border border-gray-100 shadow-sm rounded-md space-y-8">
            {/* Contact Info */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-4 pb-2 border-b border-gray-100">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Phone Number</label>
                  <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-4 pb-2 border-b border-gray-100">Shipping Address</h2>
              
              {user?.uid ? (
                <div>
                  {sanityUser?.addresses?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {sanityUser.addresses.map((addr: Address) => (
                        <div 
                          key={addr._key} 
                          onClick={() => setSelectedAddressKey(addr._key)}
                          className={`p-4 border rounded cursor-pointer transition-colors ${selectedAddressKey === addr._key ? 'border-black bg-gray-50/50' : 'border-gray-200 hover:border-gray-400'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-semibold text-sm text-gray-900">{sanityUser.name}</p>
                            {selectedAddressKey === addr._key && <ShieldCheck className="w-4 h-4 text-green-600" />}
                          </div>
                          <p className="text-sm text-gray-600">{addr.street}</p>
                          <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                          <p className="text-sm text-gray-600">{addr.country}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border border-gray-200 rounded mb-4">
                      <p className="text-sm mb-4">No saved addresses are available.</p>
                    </div>
                  )}
                  
                  <button 
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-xs font-bold uppercase tracking-wider text-black border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
                  >
                    + Add New Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Street Address</label>
                    <input required name="street" value={formData.street} onChange={handleChange} type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">City</label>
                    <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">State / Province</label>
                    <input required name="state" value={formData.state} onChange={handleChange} type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Postal Code</label>
                    <input required name="postalCode" value={formData.postalCode} onChange={handleChange} type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Country</label>
                    <input required name="country" value={formData.country} onChange={handleChange} type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                  </div>
                </div>
              )}
            </section>
          </form>
        </div>

        {/* Right Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-md sticky top-24">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-900 mb-6 pb-2 border-b border-gray-100">Order Summary</h2>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 aspect-[3/4] bg-gray-50 shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-relaxed mb-1">{item.title}</h3>
                    <p className="text-[11px] text-gray-500 mb-1">Size: {item.size} | Qty: {item.quantity}</p>
                    <p className="text-xs font-medium text-gray-900">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 py-4 border-t border-b border-gray-100 mb-6">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                  <span>Discount</span>
                  <span>- Rs. {
                    appliedDiscount.discountType === 'percentage' 
                      ? Math.round((cartTotal * appliedDiscount.percentageOff) / 100).toLocaleString('en-IN')
                      : appliedDiscount.percentageOff.toLocaleString('en-IN')
                  }</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-lg font-semibold text-gray-900 mb-8">
              <span>Total</span>
              <span>Rs. {getFinalTotal().toLocaleString('en-IN')}</span>
            </div>

            <button 
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-black text-white py-4 text-xs font-semibold uppercase tracking-widest hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><ShieldCheck className="w-4 h-4" /> Pay Now</>
              )}
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-wider">Secure Checkout via Razorpay</p>
          </div>
        </div>

      </div>

      <AddressModal 
        isOpen={isAddressModalOpen} 
        onClose={() => setIsAddressModalOpen(false)} 
        onSave={handleSaveAddress}
      />
    </div>
  );
}
