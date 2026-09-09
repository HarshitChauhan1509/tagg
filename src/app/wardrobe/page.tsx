"use client";

import { useAppStore } from "@/lib/store";
import { Camera, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WardrobePage() {
  const wardrobe = useAppStore((state) => state.wardrobe);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-full">
      {wardrobe.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
          <div className="w-24 h-24 bg-[#E5E5E5] rounded-full flex items-center justify-center mb-6 neo-border neo-shadow">
            <Camera className="w-10 h-10 text-brand-dark" />
          </div>
          <h2 className="text-xl font-medium text-brand-dark mb-2">Your wardrobe is empty</h2>
          <p className="text-neutral-500 mb-8 max-w-[250px] md:max-w-md mx-auto">
            Scan your clothes with your camera to build your digital wardrobe.
          </p>
          <button 
            onClick={() => router.push("/wardrobe/scan")}
            className="bg-brand-accent text-brand-dark neo-border neo-shadow rounded-full px-8 py-3 font-bold hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all"
          >
            Scan an item
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8 w-full flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-brand-dark">My Wardrobe</h1>
              <p className="text-neutral-500 font-medium mt-1">{wardrobe.length} items</p>
            </div>
            <button
              onClick={() => router.push("/going-out")}
              className="w-full md:w-auto bg-brand-dark text-white rounded-full neo-border neo-shadow px-8 py-4 flex items-center justify-center gap-2 font-bold hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all text-lg shrink-0"
            >
              <Sparkles className="w-5 h-5 text-brand-accent" />
              I&apos;m going out tonight
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10 w-full">
            {wardrobe.map((item, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden neo-border neo-shadow flex flex-col cursor-pointer hover:translate-y-[-2px] transition-transform"
              >
                <div className="aspect-[4/5] bg-[#E5E5E5] relative overflow-hidden flex items-center justify-center border-b-2 border-brand-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.type} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 bg-white md:p-4">
                  <p className="font-bold text-brand-dark capitalize truncate text-sm md:text-base">
                    {item.color} {item.type}
                  </p>
                  <p className="text-xs md:text-sm text-neutral-500 capitalize mt-0.5 font-medium">
                    {item.style} • {item.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating Action Button for Adding Items */}
          <div className="fixed bottom-[100px] right-6 md:right-12 z-40">
            <button
              onClick={() => router.push("/wardrobe/scan")}
              className="w-16 h-16 bg-brand-accent text-brand-dark rounded-full neo-border neo-shadow flex items-center justify-center hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
