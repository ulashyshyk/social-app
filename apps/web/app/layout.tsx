import type { Metadata } from 'next';
import { IBM_Plex_Sans, Noto_Sans } from 'next/font/google';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../components/providers/ThemeProvider'; // ← YENİ
import AuthModal from '../components/auth/AuthModal';
import Navbar from '../components/layout/Navbar';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({ 
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-heading',
});

const notoSans = Noto_Sans({ 
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
});

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
    <html 
      lang="tr" 
      className={`${ibmPlexSans.variable} ${notoSans.variable}`}
      suppressHydrationWarning // ← YENİ (next-themes için gerekli)
    >
      <body>
        <ThemeProvider> {/* ← YENİ: AuthProvider'ın dışında wrap et */}
          <AuthProvider>
            <Navbar />
            <AuthModal />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
