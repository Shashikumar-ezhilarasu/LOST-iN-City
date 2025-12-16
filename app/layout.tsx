import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: "Lost & Found Quest",
  description: "A gamified Lost & Found application with medieval RPG fantasy theme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 pt-20 pb-24 min-h-screen">
            {children}
          </main>
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}
