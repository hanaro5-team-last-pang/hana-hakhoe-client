'use client';

import { AuthStoreApi, AuthStoreContext } from '@/context/AuthContext';
import { createAuthStore } from '@/stores/AuthStore';
import { type ReactNode, useRef } from 'react';

interface Props {
  children: ReactNode;
}

export const AuthStoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AuthStoreApi>(undefined);
  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  return (
    <AuthStoreContext.Provider value={storeRef.current}>
      {children}
    </AuthStoreContext.Provider>
  );
};
