'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getSanityUser } from '../app/actions/auth';

interface AuthContextType {
  user: User | null;
  sanityUser: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  sanityUser: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sanityUser, setSanityUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const sUser = await getSanityUser(user.uid);
        setSanityUser(sUser);
      } else {
        setSanityUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, sanityUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
