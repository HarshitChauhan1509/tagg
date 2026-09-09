"use client";

import { useAppStore, Occasion } from "@/lib/store";
import { generateRecommendation } from "@/lib/ai/recommendationEngine";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

function RecommendationContent() {
  const searchParams = useSearchParams();
  const occasion = searchParams.get('occasion') as Occasion;
  const router = useRouter();
  
  const wardrobe = useAppStore(state => state.wardrobe);
  const user = useAppStore(state => state.user);

  const [isLoading, setIsLoading] = useState(true);

  // Generate once per mount or refresh
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    if (user && wardrobe.length > 0 && occasion) {
      // Simulate AI thinking time for effect
      setTimeout(() => {
        const result = generateRecommendation(wardrobe, occasion, user);
        setRecommendation(result);
        setIsLoading(false);
      }, 1500);
    } else {
      setIsLoading(false);
    }
  }, [user, wardrobe, occasion]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-12 h-12 text-brand-dark mb-6" />
        </motion.div>
        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-2">Styling your look...</h2>
        <p className="text-neutral-500">The AI is analyzing your wardrobe.</p>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-6 text-center pt-20">
        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">Not enough items!</h2>
        <p className="text-neutral-500 mb-8 max-w-xs">
          We need more clothes in your wardrobe to generate a good outfit for this occasion. Make sure you have at least a top and a bottom.
        </p>
        <button 
          onClick={() => router.push("/wardrobe/scan")}
          className="bg-brand-dark text-white rounded-full px-8 py-3 font-medium hover:bg-neutral-800 transition-colors"
        >
          Add Clothes
        </button>
      </div>
    );
  }

  const items = [
    recommendation.top,
    recommendation.bottom,
    recommendation.outerwear,
    recommendation.shoes
  ].filter(Boolean);

  return (
    <div className="flex flex-col min-h-full px-6 pt-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-neutral-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-serif text-2xl font-bold text-brand-dark tracking-tight">
          Tonight&apos;s Look
        </h1>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item: any, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm"
          >
            <div className="w-20 h-24 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.type} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-medium text-brand-dark capitalize text-lg leading-tight mb-1">
                {item.color} {item.type}
              </p>
              <p className="text-sm text-neutral-500 capitalize">
                {item.fit} • {item.style}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: items.length * 0.1 + 0.2 }}
        className="bg-brand-dark text-white p-6 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24" />
        </div>
        <h3 className="text-brand-accent font-bold mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Why it works
        </h3>
        <p className="text-lg leading-relaxed text-brand-light/90 relative z-10 font-serif">
          &quot;{recommendation.reasoning}&quot;
        </p>
      </motion.div>
    </div>
  );
}

export default function RecommendationPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen items-center justify-center px-6 text-center">
        <Sparkles className="w-12 h-12 text-brand-dark mb-6 animate-spin" />
        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-2">Loading...</h2>
      </div>
    }>
      <RecommendationContent />
    </Suspense>
  );
}
