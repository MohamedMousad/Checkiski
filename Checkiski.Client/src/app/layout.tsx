import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Script from 'next/script';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Checkiski | Premium Multiplayer Chess",
  description: "Experience the next level of online chess. Play beautifully designed, real-time multiplayer chess powered by Stockfish.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/10.0.0/signalr.min.js" strategy="beforeInteractive" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
