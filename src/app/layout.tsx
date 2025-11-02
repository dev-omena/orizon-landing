import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap', // Improve font loading performance
  preload: true,
});

// Using fallback fonts until Halyard font file is added
const halyard = {
  variable: '--font-halyard',
};

export const metadata: Metadata = {
  title: "Orizon",
  description: "Your digital horizon awaits",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/Fav-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Separate viewport export as recommended by Next.js 14+
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${montserrat.variable} ${halyard.variable} antialiased overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
