import { AuthProvider } from '@/context/AuthContext';
import { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-fontRegular">
        <AuthProvider>
          {children}
          <div id={'modal-root'} />
        </AuthProvider>
      </body>
    </html>
  );
}
