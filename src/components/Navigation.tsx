"use client";

import { useAppStore } from "@/lib/store";
import { User, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export function Navigation() {
  const user = useAppStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;
  if (pathname === '/wardrobe/scan') return null; // Hide completely on scan page

  return (
    <header className="px-6 py-4 flex items-center justify-center sticky top-0 bg-background/80 glass z-40">
      <div 
        className="font-serif text-2xl font-bold cursor-pointer tracking-tight flex items-center"
        onClick={() => router.push("/wardrobe")}
      >
        <span className="text-brand-dark">fashion</span>
        <span className="text-brand-accent ml-1 drop-shadow-[1px_1px_0_rgba(15,15,15,1)]">AI</span>
      </div>
    </header>
  );
}
