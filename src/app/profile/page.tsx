"use client";

import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { LogOut, User, Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const user = useAppStore(state => state.user);
  const wardrobe = useAppStore(state => state.wardrobe);
  const logout = useAppStore(state => state.logout);
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-full px-6 pt-6">
      <h1 className="font-serif text-3xl font-bold text-brand-dark mb-8">My Profile</h1>
      
      <div className="bg-white p-6 rounded-3xl neo-border neo-shadow mb-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-brand-accent rounded-full neo-border mb-4 flex items-center justify-center">
          <User className="w-10 h-10 text-brand-dark" />
        </div>
        <h2 className="text-2xl font-bold text-brand-dark">{user.name}</h2>
        <p className="text-neutral-500 font-medium mt-1">tagg Member</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-accent" />
            Style Aesthetic
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.stylePreferences.map(style => (
              <span key={style} className="px-4 py-2 bg-neutral-100 rounded-full font-bold text-brand-dark text-sm border border-neutral-200">
                {style}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-neutral-400" />
            Stats
          </h3>
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex justify-between items-center">
            <span className="font-medium text-neutral-600">Wardrobe Items</span>
            <span className="font-bold text-xl text-brand-dark">{wardrobe.length}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="mt-12 w-full bg-white text-red-500 neo-border rounded-full py-4 text-lg font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
    </div>
  );
}
