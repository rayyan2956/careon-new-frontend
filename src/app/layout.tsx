import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CareOn - Health Monitoring System',
  description: 'Modern health monitoring application for patients, doctors, and pharmacies. Manage appointments, prescriptions, and medical records seamlessly.',
  keywords: ['health monitoring', 'medical app', 'healthcare', 'telemedicine', 'patient care', 'doctor appointments'],
  authors: [{ name: 'CareOn Team' }],
  creator: 'CareOn',
  publisher: 'CareOn',
  metadataBase: new URL('https://careon.app'),

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://careon.app',
    title: 'CareOn - Health Monitoring System',
    description: 'Modern health monitoring application for patients, doctors, and pharmacies. Manage appointments, prescriptions, and medical records seamlessly.',
    siteName: 'CareOn',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CareOn Health Monitoring',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'CareOn - Health Monitoring System',
    description: 'Modern health monitoring application for patients, doctors, and pharmacies.',
    images: ['/og-image.png'],
    creator: '@careon',
  },

  // Mobile & PWA
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#14b8a6' },
    { media: '(prefers-color-scheme: dark)', color: '#0d9488' },
  ],

  // Icons
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  // Additional
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CareOn',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

