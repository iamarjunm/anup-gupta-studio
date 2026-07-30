'use client';

import { User, MapPin, Package, Settings, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { client } from '@/lib/sanity';
import { updateUserProfile } from '@/app/actions/profile';

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
              <a href="#" className="flex items-center gap-3 px-4 py-3 bg-gray-900 text-white text-sm font-medium transition-colors">
                <User className="w-4 h-4" /> Profile Details
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium transition-colors">
                <Package className="w-4 h-4" /> Order History
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium transition-colors">
                <MapPin className="w-4 h-4" /> Addresses
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-sm font-medium transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </a>
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
        </div>

      </div>
    </div>
  );
}
