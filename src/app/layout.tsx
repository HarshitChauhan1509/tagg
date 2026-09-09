import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Fashion AI | What are you wearing tonight?",
  description: "Your wardrobe, understood by AI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-[100dvh] flex flex-col bg-background`}>
        <Navigation />
        <main className="w-full flex-1 max-w-7xl mx-auto relative flex flex-col pt-6 pb-32 px-4 md:px-8">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
