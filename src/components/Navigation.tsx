"use client";

import { useAppStore } from "@/lib/store";
import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export function Navigation() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  return (
    <header className="px-6 py-4 flex items-center justify-between sticky top-0 bg-background/80 glass z-40">
      <div 
        className="font-serif text-xl font-bold cursor-pointer tracking-tight"
        onClick={() => router.push("/wardrobe")}
      >
        <span className="text-brand-dark">fashion</span>
        <span className="text-neutral-400">AI</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-sm font-medium">
          <User className="w-4 h-4" />
          {user.name}
        </div>
        <button 
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="p-2 text-neutral-500 hover:text-brand-dark transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
