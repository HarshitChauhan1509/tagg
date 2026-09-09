"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const STYLES = ["Minimalist", "Streetwear", "Vintage", "Preppy", "Gorpcore", "Avant-garde"];

export default function SignupPage() {
  const login = useAppStore((state) => state.login);
  const router = useRouter();

  const [name, setName] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) => 
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleNext = () => {
    if (step === 1 && name.trim()) setStep(2);
    else if (step === 2) {
      login(name, selectedStyles);
      router.push("/wardrobe");
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 justify-between">
      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-20"
      >
        {step === 1 ? (
          <>
            <h1 className="font-serif text-4xl font-bold text-brand-dark mb-4">
              What should we call you?
            </h1>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="w-full text-3xl border-b-2 border-neutral-300 bg-transparent py-2 focus:outline-none focus:border-brand-dark transition-colors placeholder:text-neutral-400 font-sans mt-8"
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
          </>
        ) : (
          <>
            <h1 className="font-serif text-4xl font-bold text-brand-dark mb-4">
              What's your vibe?
            </h1>
            <p className="text-neutral-600 mb-8">Select a few styles to help the AI understand your aesthetic.</p>
            <div className="flex flex-wrap gap-3">
              {STYLES.map((style) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-5 py-3 rounded-full border-2 transition-all duration-200 font-medium flex items-center gap-2 ${
                      isSelected 
                        ? 'border-brand-dark bg-brand-dark text-white' 
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {style}
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </motion.div>

      <div className="pb-10 w-full">
        <button 
          onClick={handleNext}
          disabled={step === 1 && !name.trim()}
          className="w-full bg-brand-dark text-white rounded-full py-4 text-lg font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 1 ? 'Next' : 'Complete Profile'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
