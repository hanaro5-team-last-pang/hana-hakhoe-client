'use client';

import { getMyAuthData } from '@/app/action';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  role: 'mentor' | 'mentee' | null;
  name: string | null;
  setRole: (role: 'mentor' | 'mentee' | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<'mentor' | 'mentee' | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    // 로그인 시 getAuthData 호출
    const fetchAuthData = async () => {
      const authData = await getMyAuthData();
      if (authData.role === 'MENTOR') {
        setRole('mentor');
      } else {
        setRole('mentee');
      }
      setName(authData.name);
    };

    fetchAuthData();
  }, []);

  return (
    <AuthContext.Provider value={{ role, name, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
