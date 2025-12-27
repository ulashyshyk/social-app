// apps/web/src/app/layout.tsx
import type { Metadata } from 'next';
import { AuthProvider } from '../../contexts/AuthContext';
import AuthModal from '../../components/auth/AuthModal';
import Navbar from '../../components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Turkish-Azeri Social',
  description: 'Social network for Turkish and Azeri people',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <AuthModal />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
