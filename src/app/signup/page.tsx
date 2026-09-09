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
  const [step, setStep] = useState(0);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) => 
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleNext = () => {
    if (step === 0) setStep(1); // Mocking OAuth success
    else if (step === 1 && name.trim()) setStep(2);
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
        {step === 0 ? (
          <>
            <h1 className="font-serif text-5xl font-bold text-brand-dark mb-4 tracking-tight">
              Join the club.
            </h1>
            <p className="text-xl text-neutral-600 mb-12 font-medium">Create your digital wardrobe in seconds.</p>
            
            <div className="space-y-4">
              <button 
                onClick={handleNext}
                className="w-full bg-white text-brand-dark neo-border neo-shadow rounded-full py-4 text-lg font-bold flex items-center justify-center gap-3 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
              </button>
              <button 
                onClick={handleNext}
                className="w-full bg-brand-dark text-white neo-border neo-shadow rounded-full py-4 text-lg font-bold flex items-center justify-center gap-3 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.8 1.46-.07 2.65.55 3.53 1.5-3.03 1.94-2.58 5.62.48 6.94-1.2 2.62-2.8 5-4.67 4.53zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Continue with Apple
              </button>
            </div>
            <p className="text-center text-sm text-neutral-400 mt-8 font-medium">
              By continuing, you agree to our Terms & Conditions.
            </p>
          </>
        ) : step === 1 ? (
          <>
            <h1 className="font-serif text-5xl font-bold text-brand-dark mb-4 tracking-tight">
              What should we call you?
            </h1>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              className="w-full text-3xl border-b-4 border-neutral-200 bg-transparent py-3 focus:outline-none focus:border-brand-accent transition-colors placeholder:text-neutral-300 font-sans mt-8 font-bold text-brand-dark"
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
          </>
        ) : (
          <>
            <h1 className="font-serif text-5xl font-bold text-brand-dark mb-4 tracking-tight">
              What&apos;s your vibe?
            </h1>
            <p className="text-neutral-600 mb-8 font-medium text-lg">Select a few styles to help the AI understand your aesthetic.</p>
            <div className="flex flex-wrap gap-3">
              {STYLES.map((style) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-5 py-3 rounded-full neo-border transition-all duration-200 font-bold flex items-center gap-2 ${
                      isSelected 
                        ? 'bg-brand-accent text-brand-dark neo-shadow translate-y-[-2px]' 
                        : 'bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {style}
                    {isSelected && <Check className="w-5 h-5" />}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </motion.div>

      {step > 0 && (
        <div className="pb-10 w-full">
          <button 
            onClick={handleNext}
            disabled={step === 1 && !name.trim()}
            className="w-full bg-brand-dark text-white neo-border neo-shadow rounded-full py-4 text-xl font-bold flex items-center justify-center gap-2 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#0F0F0F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 1 ? 'Next' : 'Complete Profile'}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
