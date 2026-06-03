import "./globals.css";
import { Outfit, Playfair_Display } from 'next/font/google';
import Script from 'next/script';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: "Checkiski | Premium Multiplayer Chess",
  description: "Experience the next evolution of online chess. Real-time multiplayer, AI analysis, and tactical training.",
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/icon.svg?v=2', type: 'image/svg+xml' },
    ],
  },
};

import Navbar from "../components/Navbar";
import CursorGlow from "../components/CursorGlow";
import PortalEntry from "../components/PortalEntry";
import AtmosphereController from "../components/AtmosphereController";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <Script id="theme-cleanup" strategy="beforeInteractive">
          {`
            try {
              const current = localStorage.getItem('checkiski-board-theme');
              if (current === 'ivory-steel' || current === 'light-steel') {
                localStorage.removeItem('checkiski-board-theme');
              }
            } catch(e) {}
          `}
        </Script>
        <PortalEntry />
        <AtmosphereController>
          <CursorGlow />
          <Navbar />
          <main className="page-content">
            {children}
          </main>
        </AtmosphereController>
      </body>
    </html>
  );
}
