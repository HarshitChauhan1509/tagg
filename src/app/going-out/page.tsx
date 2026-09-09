"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Occasion } from "@/lib/store";

const OCCASIONS: { id: Occasion; label: string; emoji: string }[] = [
  { id: "casual", label: "Casual Day", emoji: "☀️" },
  { id: "night_out", label: "Night Out", emoji: "🌙" },
  { id: "dinner", label: "Dinner", emoji: "🍝" },
  { id: "date", label: "Date", emoji: "🍷" },
  { id: "party", label: "Party", emoji: "🪩" },
  { id: "event", label: "Special Event", emoji: "✨" },
  { id: "work", label: "Work", emoji: "💼" },
];

export default function GoingOutPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Occasion | null>(null);

  return (
    <div className="flex flex-col min-h-full px-6 py-12 justify-between">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-4xl font-bold text-brand-dark mb-8 leading-tight">
          What's the <br /> occasion?
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {OCCASIONS.map((occasion, i) => (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 + 0.1 }}
              key={occasion.id}
              onClick={() => setSelected(occasion.id as any)}
              className={`p-6 rounded-3xl neo-border transition-all flex flex-col items-center gap-3 ${
                selected === occasion.id 
                  ? 'bg-brand-dark text-brand-light neo-shadow translate-y-[-2px]' 
                  : 'bg-white text-brand-dark hover:bg-neutral-50'
              }`}
            >
              <span className="text-3xl">{occasion.emoji}</span>
              <span className="font-bold text-sm text-center">{occasion.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="mt-12 w-full pb-10 relative">
        <button
          disabled={!selected}
          onClick={() => router.push(`/going-out/recommendation?occasion=${selected}`)}
          className="w-full bg-brand-dark text-brand-light neo-border neo-shadow rounded-full py-4 text-xl font-bold flex items-center justify-center gap-2 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Outfit
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
