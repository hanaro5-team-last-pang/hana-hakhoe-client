import StompConnectionProvider from '@/provider/StompConnectionProvider';
import React, { ReactNode } from 'react';

export default function Layout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <StompConnectionProvider>
      <div className="h-screen p-2 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[1fr_18fr_9fr] rounded-lg border-4 border-gray-300">
          {children}
        </div>
      </div>
      {modal}
    </StompConnectionProvider>
  );
}
