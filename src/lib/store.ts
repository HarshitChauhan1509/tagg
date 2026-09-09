import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

// Only configure localforage on the client
if (typeof window !== 'undefined') {
  localforage.config({
    name: 'fashion-ai-mvp',
    storeName: 'wardrobe_db',
  });
}

// Create a custom storage adapter for Zustand using localforage
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    try {
      return (await localforage.getItem(name)) || null;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    try {
      await localforage.setItem(name, value);
    } catch (e) {
      console.error(e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    try {
      await localforage.removeItem(name);
    } catch (e) {
      console.error(e);
    }
  },
};

export type Occasion = 'casual' | 'night_out' | 'dinner' | 'date' | 'party' | 'event' | 'work';

export interface UserProfile {
  id: string;
  name: string;
  stylePreferences: string[];
}

export interface ClothingItem {
  id: string;
  userId: string;
  image: string; // Base64 string
  category: string; // 'top', 'bottom', 'outerwear', 'shoes', 'accessory'
  type: string; // 'shirt', 'jeans', 'blazer', etc.
  color: string;
  pattern: string;
  style: string;
  fit: string;
  formality: number; // 1-10
  occasions: Occasion[];
  createdAt: number;
}

interface AppState {
  user: UserProfile | null;
  wardrobe: ClothingItem[];
  login: (name: string, stylePreferences: string[]) => void;
  logout: () => void;
  addClothingItem: (item: ClothingItem) => void;
  removeClothingItem: (id: string) => void;
  updateClothingItem: (id: string, data: Partial<ClothingItem>) => void;
  clearWardrobe: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      wardrobe: [],
      login: (name, stylePreferences) => 
        set({ user: { id: Date.now().toString(), name, stylePreferences } }),
      logout: () => set({ user: null, wardrobe: [] }),
      addClothingItem: (item) => 
        set((state) => ({ wardrobe: [item, ...state.wardrobe] })),
      removeClothingItem: (id) => 
        set((state) => ({ wardrobe: state.wardrobe.filter((i) => i.id !== id) })),
      updateClothingItem: (id, data) => 
        set((state) => ({
          wardrobe: state.wardrobe.map((i) => (i.id === id ? { ...i, ...data } : i)),
        })),
      clearWardrobe: () => set({ wardrobe: [] }),
    }),
    {
      name: 'fashion-app-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
