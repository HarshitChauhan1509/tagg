"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Plus, Camera, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WardrobePage() {
  const wardrobe = useAppStore((state) => state.wardrobe);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-full px-4 pt-6">
      <div className="flex justify-between items-end mb-6">
        <h1 className="font-serif text-3xl font-bold text-brand-dark">
          My Wardrobe
        </h1>
        <span className="text-neutral-500 font-medium">
          {wardrobe.length} items
        </span>
      </div>

      {wardrobe.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-20 text-center">
          <div className="w-24 h-24 bg-[#E5E5E5] rounded-full flex items-center justify-center mb-6 neo-border neo-shadow">
            <Camera className="w-10 h-10 text-brand-dark" />
          </div>
          <h2 className="text-xl font-medium text-brand-dark mb-2">Your wardrobe is empty</h2>
          <p className="text-neutral-500 mb-8 max-w-[250px]">
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
        <div className="grid grid-cols-2 gap-4 mb-10">
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
              <div className="p-3 bg-white">
                <p className="font-bold text-brand-dark capitalize truncate text-sm">
                  {item.color} {item.type}
                </p>
                <p className="text-xs text-neutral-500 capitalize mt-0.5 font-medium">
                  {item.style} • {item.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Fixed bottom action bar */}
      {wardrobe.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none z-50 bg-gradient-to-t from-background via-background/80 to-transparent pt-12">
          <div className="max-w-md w-full flex gap-3 pointer-events-auto">
            <button
              onClick={() => router.push("/wardrobe/scan")}
              className="w-14 h-14 bg-brand-accent text-brand-dark rounded-full neo-border neo-shadow flex items-center justify-center hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all shrink-0"
            >
              <Plus className="w-6 h-6" />
            </button>
            <button
              onClick={() => router.push("/going-out")}
              className="flex-1 bg-brand-dark text-white rounded-full neo-border neo-shadow flex items-center justify-center font-bold hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all text-lg"
            >
              I&apos;m going out tonight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
