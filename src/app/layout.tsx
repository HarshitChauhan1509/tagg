import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navigation } from "@/components/Navigation";
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
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex items-center justify-center p-0 md:p-4`}>
        <main className="w-full h-[100dvh] md:h-[90vh] md:max-h-[900px] max-w-md mx-auto relative overflow-hidden bg-background md:rounded-[3rem] md:neo-border md:neo-shadow flex flex-col shadow-2xl">
          <Navigation />
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
