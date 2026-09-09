"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const user = useAppStore((state) => state.user);
  const router = useRouter();

  // If already logged in, redirect to wardrobe
  useEffect(() => {
    if (user) {
      router.push("/wardrobe");
    }
  }, [user, router]);

  if (user) return null; // Avoid flicker

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 justify-between">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-20"
      >
        <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-brand-dark mb-4">
          What are you wearing tonight?
        </h1>
        <p className="text-lg text-neutral-600 font-sans max-w-sm">
          Your wardrobe, understood by AI. Scan your clothes, get tailored outfit recommendations, and never overthink your fit again.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="pb-10 w-full"
      >
        <button 
          onClick={() => router.push("/signup")}
          className="w-full bg-brand-dark text-white rounded-full py-4 text-lg font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
        >
          Get Started
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
