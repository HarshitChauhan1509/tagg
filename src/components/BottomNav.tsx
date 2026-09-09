"use client";

import { useAppStore } from "@/lib/store";
import { LayoutGrid, Camera, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function BottomNav() {
  const user = useAppStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  // Don't show bottom nav on the scan page itself since it has its own camera UI
  if (pathname === '/wardrobe/scan') return null;
  // Don't show bottom nav on signup or landing page
  if (pathname === '/' || pathname === '/signup') return null;

  const tabs = [
    { name: "Wardrobe", path: "/wardrobe", icon: LayoutGrid },
    { name: "Scan", path: "/wardrobe/scan", icon: Camera, isCenter: true },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 flex justify-center z-50 pointer-events-none">
      <div className="bg-brand-dark rounded-full px-6 py-4 flex items-center justify-between w-full max-w-[300px] pointer-events-auto neo-border neo-shadow">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || (tab.path === '/wardrobe' && pathname.startsWith('/going-out'));
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <button
                key={tab.name}
                onClick={() => router.push(tab.path)}
                className="w-14 h-14 bg-brand-accent text-brand-dark rounded-full flex items-center justify-center -mt-8 neo-border neo-shadow hover:translate-y-[2px] transition-all"
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          }

          return (
            <button
              key={tab.name}
              onClick={() => router.push(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-brand-accent" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold tracking-wide">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
