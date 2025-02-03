'use client';

import { useAuthStore } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface Props {
  children: ReactNode;
}
export default function AuthRefreshProvider({ children }: Props) {
  const pathname = usePathname();
  const fetchAuth = useAuthStore((state) => state.fetchAuth);

  useEffect(() => {
    if (pathname === '/') {
      fetchAuth();
    }
  }, [pathname]);

  return <>{children}</>;
}
