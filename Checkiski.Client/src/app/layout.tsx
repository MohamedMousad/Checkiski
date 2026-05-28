import "./globals.css";
import { Outfit, Inter } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-local',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: "Checkiski | Premium Multiplayer Chess",
  description: "Experience the next evolution of online chess. Real-time multiplayer, powered by a modern engine, wrapped in a cinematic interface.",
  icons: { icon: '/favicon.ico' },
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
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
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
