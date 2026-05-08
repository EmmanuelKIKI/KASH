import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CookieBanner } from '@/components/legal/CookieBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'KASH – Gérer. Encaisser. Grandir.',
  description: 'Plateforme de gestion financière pour freelances. Développé par Emmanuel KIKI.',
  manifest: '/manifest.json',
  authors: [{ name: 'Emmanuel KIKI' }],
  keywords: ['gestion financière', 'freelance', 'facturation', 'Bénin', 'FCFA'],
  icons: {
    icon: [
      { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'KASH – Gérer. Encaisser. Grandir.',
    description: 'Gérez vos revenus freelance avec KASH.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#00A36C',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icons/icon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.variable} font-sans bg-[#F7FAFC] text-[#1A202C] antialiased`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
