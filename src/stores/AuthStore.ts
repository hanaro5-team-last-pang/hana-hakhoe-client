import { AuthType } from '@/types/hanaHakdang';
import { createStore } from 'zustand/vanilla';

export type AuthState = {
  auth: AuthType | null;
  loading: boolean;
};

export type AuthActions = {
  fetchAuth: () => void;
  removeAuth: () => void;
};

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
  auth: null,
  loading: true,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    fetchAuth: async () => {
      set({ loading: true });
      try {
        const res = await fetch('/api/user-info', {
          method: 'GET',
        });
        const data = (await res.json()) as AuthType;
        set({ auth: data });
      } catch (error) {
        console.log(error);
        return;
      } finally {
        set({ loading: false });
      }
    },
    removeAuth: () => set(() => ({ auth: null })),
  }));
};
