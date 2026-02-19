import type { Metadata } from "next";
import "./globals.css";
import { Nunito_Sans } from "next/font/google";

const nunito = Nunito_Sans({
  weight: ['400', '700'], // optional, all weights you use
  subsets: ['latin'],      // must specify at least one
  preload: true,
});

export const metadata: Metadata = {
  title: "IskoArena - Admin Dashboard",
  description: "UP Cebu Intramurals Tracker",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
