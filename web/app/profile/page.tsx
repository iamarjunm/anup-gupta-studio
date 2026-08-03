'use client';

import { User, MapPin, Package, Settings, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { client } from '@/lib/sanity';
import { updateUserProfile, updateUserAddresses } from '@/app/actions/profile';
import { AddressModal, Address } from '@/components/address-modal';
import { InvoiceTemplate } from '@/components/invoice';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // State to hold the full Sanity user document
  const [sanityUser, setSanityUser] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'settings'>('profile');

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleSaveAddress = async (addr: Omit<Address, '_key'> & { _key?: string }) => {
    if (!user || !sanityUser) return;
    
    let currentAddresses = [...(sanityUser.addresses || [])];
    
    if (addr._key) {
      // Edit existing
      const index = currentAddresses.findIndex(a => a._key === addr._key);
      if (index > -1) {
        currentAddresses[index] = addr as Address;
      }
    } else {
      // Add new
      currentAddresses.push({
        ...addr,
        _key: Math.random().toString(36).substring(2, 9)
      } as Address);
    }

    const result = await updateUserAddresses(user.uid, currentAddresses);
    if (result.success) {
      setSanityUser({ ...sanityUser, addresses: currentAddresses });
      setIsAddressModalOpen(false);
    } else {
      alert(result.message);
    }
  };

  const handleDeleteAddress = async (key: string) => {
    if (!user || !sanityUser) return;
    const currentAddresses = (sanityUser.addresses || []).filter((a: Address) => a._key !== key);
    const result = await updateUserAddresses(user.uid, currentAddresses);
    if (result.success) {
      setSanityUser({ ...sanityUser, addresses: currentAddresses });
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    // Fetch extra profile data from Sanity using the Firebase UID
    if (user?.uid) {
      const fetchSanityUser = async () => {
        try {
          const data = await client.fetch(`*[_type == "user" && firebaseUid == $uid][0]`, { uid: user.uid });
          if (data) {
            setSanityUser(data);
            setName(data.name || user.displayName || '');
            setPhoneNumber(data.phoneNumber || '');
          }
        } catch (error) {
          console.error("Failed to fetch sanity user", error);
        }
      }
      fetchSanityUser();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && user?.uid && orders.length === 0) {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const fetchedOrders = await client.fetch(
            `*[_type == "order" && userId == $uid] | order(createdAt desc)`,
            { uid: user.uid }
          );
          setOrders(fetchedOrders);
        } catch (err) {
          console.error("Failed to fetch orders", err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, user?.uid]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut(auth);
    router.push('/');
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    setSaveMessage(null);
    
    const result = await updateUserProfile({
      firebaseUid: user.uid,
      name,
      phoneNumber,
      email: user.email,
    });
    
    setIsSaving(false);
    
    if (result.success) {
      setSaveMessage({ type: 'success', text: result.message });
      // Update local state to reflect changes without refresh
      setSanityUser((prev: any) => ({ ...prev, name, phoneNumber }));
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage({ type: 'error', text: result.message });
    }
  };

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <User className="w-16 h-16 text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900 mb-4">You are not logged in</h1>
        <p className="text-gray-500 max-w-md">Please log in or create an account from the navigation bar to view and manage your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-[#f8f8f8] p-6 sticky top-24">
            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-900 mb-6">My Account</h2>
            <nav className="space-y-1">
              <button onClick={() => { setActiveTab('profile'); setSelectedOrder(null); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <User className="w-4 h-4" /> Profile Details
              </button>
              <button onClick={() => { setActiveTab('orders'); setSelectedOrder(null); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <Package className="w-4 h-4" /> Order History
              </button>
              <button onClick={() => { setActiveTab('addresses'); setSelectedOrder(null); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'addresses' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <MapPin className="w-4 h-4" /> Addresses
              </button>
              <button onClick={() => { setActiveTab('settings'); setSelectedOrder(null); }} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <a href="#" onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors cursor-pointer">
                  <LogOut className="w-4 h-4" /> Log Out
                </a>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full">
          {activeTab === 'profile' && (
            <>
              <h1 className="text-2xl font-semibold uppercase tracking-wide text-gray-900 mb-8">
                Profile Details
              </h1>
              
              <div className="bg-white border border-gray-200 p-8">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                  <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center text-gray-400">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{sanityUser?.name || user.displayName || 'Loading...'}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {sanityUser?.isAdmin && <span className="inline-block mt-2 px-2 py-1 bg-gray-900 text-white text-xs font-semibold rounded tracking-wide">Admin</span>}
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6 max-w-xl">
                  {saveMessage && (
                    <div className={`p-4 text-sm flex items-center gap-2 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                      {saveMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                      {saveMessage.text}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" value={user.email || ''} className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors bg-gray-50 text-gray-500 cursor-not-allowed" disabled />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210" 
                      className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors" 
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-gray-900 cursor-pointer text-white px-8 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <>
              {selectedOrder ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 flex items-center gap-2"
                    >
                      ← Back to Orders
                    </button>
                    <button 
                      onClick={() => window.print()}
                      className="text-xs font-semibold uppercase tracking-wider bg-gray-900 text-white px-4 py-2 hover:bg-black transition-colors"
                    >
                      Download Invoice
                    </button>
                  </div>
                  <h1 className="text-2xl font-semibold uppercase tracking-wide text-gray-900 mb-2">
                    Order {selectedOrder.orderNumber}
                  </h1>
                  <p className="text-sm text-gray-500 mb-8">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  
                  <div className="bg-white border border-gray-200 p-8 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6 pb-8 border-b border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Status</p>
                        <span className={`inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                          selectedOrder.status === 'processing' ? 'bg-blue-50 text-blue-600' :
                          selectedOrder.status === 'shipped' ? 'bg-yellow-50 text-yellow-600' :
                          selectedOrder.status === 'delivered' ? 'bg-green-50 text-green-600' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {selectedOrder.status || 'Processing'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Shipping Address</p>
                        <p className="text-sm font-medium text-gray-900">{selectedOrder.customerName}</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedOrder.shippingAddress?.street}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.country}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Items Ordered</p>
                      <div className="space-y-4">
                        {selectedOrder.items?.map((item: any) => (
                          <div key={item._key} className="flex justify-between items-center p-4 border border-gray-100 bg-gray-50/50">
                            <div>
                              <p className="font-medium text-gray-900">{item.productTitle}</p>
                              <p className="text-gray-500 text-xs mt-1">Size: {item.variantSize} | Color: {item.variantColor} | Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-gray-900">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                        <span>Subtotal</span>
                        <span>Rs. {selectedOrder.subtotal?.toLocaleString('en-IN') || selectedOrder.total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>Shipping</span>
                        <span>{selectedOrder.shippingCost === 0 ? 'Free' : `Rs. ${selectedOrder.shippingCost?.toLocaleString('en-IN') || 0}`}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
                        <span>Total Paid</span>
                        <span>Rs. {selectedOrder.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <InvoiceTemplate order={selectedOrder} />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-semibold uppercase tracking-wide text-gray-900 mb-8">
                    Order History
                  </h1>
                  
                  {loadingOrders ? (
                    <div className="bg-white border border-gray-200 p-8 text-center py-20 flex justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order: any) => (
                        <div 
                          key={order._id} 
                          onClick={() => setSelectedOrder(order)}
                          className="bg-white border border-gray-200 p-6 hover:border-gray-400 transition-colors cursor-pointer group"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
                              <p className="font-semibold text-gray-900 group-hover:text-black transition-colors">{order.orderNumber}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Date</p>
                              <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Total</p>
                              <p className="font-medium text-gray-900">Rs. {order.total.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Status</p>
                              <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'processing' ? 'bg-blue-50 text-blue-600' :
                                order.status === 'shipped' ? 'bg-yellow-50 text-yellow-600' :
                                order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                                'bg-gray-50 text-gray-600'
                              }`}>
                                {order.status || 'Processing'}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {order.items?.map((item: any) => (
                              <div key={item._key} className="flex justify-between items-center text-sm">
                                <div className="flex gap-4 items-center">
                                  <div>
                                    <p className="font-medium text-gray-900">{item.productTitle}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">Size: {item.variantSize} | Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-medium text-gray-900">Rs. {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-gray-100 text-right">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 group-hover:text-gray-900 transition-colors">
                              View Details →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 p-8 text-center py-20 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No orders found yet.</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'addresses' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold uppercase tracking-wide text-gray-900">
                  Addresses
                </h1>
                <button 
                  onClick={() => { setEditingAddress(null); setIsAddressModalOpen(true); }}
                  className="bg-gray-900 text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
                >
                  Add New Address
                </button>
              </div>
              <div className="bg-white border border-gray-200 p-8">
                {sanityUser?.addresses?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sanityUser.addresses.map((addr: Address, i: number) => (
                      <div key={addr._key || i} className="p-6 border border-gray-200 flex flex-col justify-between h-full bg-gray-50/50">
                        <div>
                          <p className="font-semibold text-sm text-gray-900 mb-2">{sanityUser.name}</p>
                          <p className="text-sm text-gray-600">{addr.street}</p>
                          <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                          <p className="text-sm text-gray-600">{addr.country}</p>
                        </div>
                        <div className="flex gap-4 mt-6 pt-4 border-t border-gray-200">
                          <button 
                            onClick={() => { setEditingAddress(addr); setIsAddressModalOpen(true); }}
                            className="text-xs font-semibold text-gray-600 hover:text-black uppercase tracking-wider cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(addr._key)}
                            className="text-xs font-semibold text-red-500 hover:text-red-700 uppercase tracking-wider cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No saved addresses found.</p>
                  </div>
                )}
              </div>
              <AddressModal 
                isOpen={isAddressModalOpen} 
                onClose={() => setIsAddressModalOpen(false)} 
                onSave={handleSaveAddress}
                initialAddress={editingAddress}
              />
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <h1 className="text-2xl font-semibold uppercase tracking-wide text-gray-900 mb-8">
                Settings
              </h1>
              <div className="bg-white border border-gray-200 p-8">
                <p className="text-sm text-gray-600 mb-6">Manage your account preferences.</p>
                <button onClick={handleLogout} className="px-6 py-3 border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                  Sign out of all devices
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
