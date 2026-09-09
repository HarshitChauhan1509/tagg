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
          <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
            <Camera className="w-10 h-10 text-neutral-300" />
          </div>
          <h2 className="text-xl font-medium text-brand-dark mb-2">Your wardrobe is empty</h2>
          <p className="text-neutral-500 mb-8 max-w-[250px]">
            Scan your clothes with your camera to build your digital wardrobe.
          </p>
          <button 
            onClick={() => router.push("/wardrobe/scan")}
            className="bg-brand-dark text-white rounded-full px-8 py-3 font-medium hover:bg-neutral-800 transition-colors"
          >
            Scan an item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-10">
          {wardrobe.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col cursor-pointer"
            >
              <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.type} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-medium text-brand-dark capitalize truncate text-sm">
                  {item.color} {item.type}
                </p>
                <p className="text-xs text-neutral-400 capitalize mt-0.5">
                  {item.style} • {item.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Fixed bottom action bar */}
      {wardrobe.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none z-50">
          <div className="max-w-md w-full flex gap-3 pointer-events-auto">
            <button
              onClick={() => router.push("/wardrobe/scan")}
              className="w-14 h-14 bg-white text-brand-dark rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-neutral-100 flex items-center justify-center hover:bg-neutral-50 transition-colors shrink-0"
            >
              <Plus className="w-6 h-6" />
            </button>
            <button
              onClick={() => router.push("/going-out")}
              className="flex-1 bg-brand-dark text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center font-medium hover:bg-neutral-800 transition-colors text-lg"
            >
              I'm going out tonight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
