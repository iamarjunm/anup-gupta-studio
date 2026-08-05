'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { X } from 'lucide-react';
import { syncUserWithSanity } from '@/app/actions/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
    }
  }, [isOpen, initialMode]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Sync with Sanity just in case the user was created before Sanity was attached
        await syncUserWithSanity({
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          name: userCredential.user.displayName || 'User',
          authProvider: 'email'
        });
        onClose();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Sync with Sanity
        await syncUserWithSanity({
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          name: name,
          authProvider: 'email'
        });
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Sync with Sanity
      await syncUserWithSanity({
        uid: userCredential.user.uid,
        email: userCredential.user.email!,
        name: userCredential.user.displayName || 'Google User',
        image: userCredential.user.photoURL || undefined,
        authProvider: 'google'
      });
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-[400px] bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <h2 className="text-2xl font-bold uppercase tracking-wide text-center text-gray-900 mb-6">
          {isLogin ? 'Log In' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm border border-red-100 text-center">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleSignIn}
          type="button"
          disabled={loading}
          className="w-full flex items-center justify-center cursor-pointer gap-3 border border-gray-300 bg-white text-gray-900 px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors mb-6 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={18} height={18} />
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-x-0 h-px bg-gray-200"></div>
          <span className="relative bg-white px-4 text-xs font-medium text-gray-400 uppercase tracking-widest">
            Or With Email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 cursor-pointer text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="text-gray-900 font-medium cursor-pointer underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
