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

        <div className="flex flex-col gap-3">
          {OCCASIONS.map((occ, i) => (
            <motion.button
              key={occ.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(occ.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 text-left transition-all ${
                selected === occ.id 
                  ? 'border-brand-dark bg-brand-dark text-white shadow-lg scale-[1.02]' 
                  : 'border-neutral-100 bg-white hover:border-neutral-300'
              }`}
            >
              <span className="text-2xl">{occ.emoji}</span>
              <span className="font-medium text-lg">{occ.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="mt-12 w-full pb-10">
        <button
          disabled={!selected}
          onClick={() => router.push(`/going-out/recommendation?occasion=${selected}`)}
          className="w-full bg-brand-accent text-brand-dark rounded-full py-4 text-lg font-bold flex items-center justify-center gap-2 hover:bg-[#b3e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_30px_rgba(204,255,0,0.3)]"
        >
          Generate Outfit
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
