import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import RootProviders from "@/providers/RootProviders";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Tracker App",
  description: "Track your budget",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
        <body className={inter.className}>
          <Toaster richColors position="bottom-right" />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
