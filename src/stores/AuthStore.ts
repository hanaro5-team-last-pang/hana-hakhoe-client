import { DEFAULT_PROFILE_URL } from '@/constant';
import { AuthType, BaseResType } from '@/types/hanaHakdang';
import sha256 from 'crypto-js/sha256';
import { createStore } from 'zustand/vanilla';

type AuthResType = {
  userId: number;
  name: string;
  role: 'MENTOR' | 'MENTEE';
  profileImageUrl?: string;
  birthDate: string;
};

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
        const auth = (await res.json()) as AuthResType;
        console.log(auth);
        set({
          auth: {
            ...auth,
            profileImage:
              auth.profileImageUrl ??
              `${DEFAULT_PROFILE_URL}/${sha256(auth.name)}?s=32&d=identicon&r=PG`,
            birth: auth.birthDate,
          },
        });
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
