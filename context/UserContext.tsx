'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/lib/types';

interface UserContextValue {
  user: User | null;
  login: (user: User) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('av_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const login = (u: User) => {
    setUser(u);
    try { localStorage.setItem('av_user', JSON.stringify(u)); } catch {}
  };

  const signOut = () => {
    setUser(null);
    try { localStorage.removeItem('av_user'); } catch {}
  };

  return (
    <UserContext.Provider value={{ user, login, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
