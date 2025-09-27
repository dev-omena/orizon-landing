import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${halyard.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
