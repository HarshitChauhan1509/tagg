import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Fashion AI | What are you wearing tonight?",
  description: "Your wardrobe, understood by AI.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0", // Mobile friendly
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <main className="min-h-screen max-w-md mx-auto relative overflow-hidden bg-background shadow-2xl flex flex-col">
          <Navigation />
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
