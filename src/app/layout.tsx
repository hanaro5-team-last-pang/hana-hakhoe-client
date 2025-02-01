import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
          {' '}
          {children}
          <ToastContainer className="custom-toast" autoClose={3000} />
          <div id={'modal-root'} />
        </AuthProvider>
      </body>
    </html>
  );
}
