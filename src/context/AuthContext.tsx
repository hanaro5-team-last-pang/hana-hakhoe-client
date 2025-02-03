'use client';

import { AuthStore, createAuthStore } from '@/stores/AuthStore';
import { useStore } from 'zustand/index';
import { createContext, useContext } from 'react';

export type AuthStoreApi = ReturnType<typeof createAuthStore>;
export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined
);

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext);

  if (!authStoreContext) {
    throw new Error();
  }

  return useStore(authStoreContext, selector);
};
