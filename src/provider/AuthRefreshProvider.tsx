'use client';

import { useAuthStore } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

export default function AuthRefreshProvider({ children }: Props) {
  const pathname = usePathname();
  const { auth, fetchAuth } = useAuthStore((state) => state);

  useEffect(() => {
    if (!auth) {
      fetchAuth();
    }
  }, [pathname]);

  return <>{children}</>;
}
