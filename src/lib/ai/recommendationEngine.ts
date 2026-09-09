import { ClothingItem, Occasion, UserProfile } from "@/lib/store";

export interface OutfitRecommendation {
  top?: ClothingItem;
  bottom?: ClothingItem;
  outerwear?: ClothingItem;
  shoes?: ClothingItem;
  reasoning: string;
}

const OCCASION_FORMALITY: Record<Occasion, { min: number; max: number }> = {
  casual: { min: 1, max: 4 },
  night_out: { min: 4, max: 7 },
  dinner: { min: 5, max: 8 },
  date: { min: 4, max: 8 },
  party: { min: 3, max: 7 },
  event: { min: 6, max: 10 },
  work: { min: 5, max: 9 },
};

// Extremely basic color harmony checking for the MVP
const COMPATIBLE_COLORS: Record<string, string[]> = {
  'black': ['white', 'black', 'gray', 'red', 'blue', 'green', 'brown', 'beige'],
  'white': ['black', 'white', 'gray', 'red', 'blue', 'green', 'brown', 'navy', 'beige', 'pink'],
  'navy': ['white', 'gray', 'brown', 'beige', 'red'],
  'gray': ['black', 'white', 'navy', 'blue', 'pink', 'red'],
  // Fallback: assume neutral compatibility
};

function isColorCompatible(color1: string, color2: string): boolean {
  if (color1 === color2) return true;
  if (COMPATIBLE_COLORS[color1]?.includes(color2)) return true;
  if (COMPATIBLE_COLORS[color2]?.includes(color1)) return true;
  // If neither are explicitly listed, just return true for the MVP so we don't return null outfits
  return true; 
}

export function generateRecommendation(
  wardrobe: ClothingItem[],
  occasion: Occasion,
  user: UserProfile
): OutfitRecommendation | null {
  if (wardrobe.length === 0) return null;

  const targetFormality = OCCASION_FORMALITY[occasion];
  
  // Filter items by category
  const tops = wardrobe.filter(i => i.category === 'top');
  const bottoms = wardrobe.filter(i => i.category === 'bottom');
  const shoes = wardrobe.filter(i => i.category === 'shoes');
  const outers = wardrobe.filter(i => i.category === 'outerwear' || i.type === 'blazer' || i.type === 'jacket');

  // If we don't have basic items, just return null
  if (tops.length === 0 || bottoms.length === 0) return null;

  // Find the best top based on formality
  const selectedTop = tops.find(t => t.formality >= targetFormality.min && t.formality <= targetFormality.max) || tops[0];
  
  // Find a compatible bottom
  const selectedBottom = bottoms.find(b => 
    (b.formality >= targetFormality.min && b.formality <= targetFormality.max) && 
    isColorCompatible(selectedTop.color, b.color)
  ) || bottoms[0];

  // Optional: Outerwear (only if occasion is night_out, dinner, date, or event, or if it fits)
  let selectedOuter: ClothingItem | undefined;
  if (outers.length > 0 && ['night_out', 'dinner', 'date', 'event'].includes(occasion)) {
    selectedOuter = outers.find(o => isColorCompatible(o.color, selectedTop.color)) || outers[0];
  }

  // Shoes
  let selectedShoes: ClothingItem | undefined;
  if (shoes.length > 0) {
    selectedShoes = shoes.find(s => s.formality >= targetFormality.min) || shoes[0];
  }

  // Generate Reasoning dynamically based on the AI metadata
  let reasoningText = `This ${selectedTop.color} ${selectedTop.type} pairs perfectly with the ${selectedBottom.color} ${selectedBottom.type} for a ${occasion.replace('_', ' ')} setting.`;
  
  if (selectedOuter) {
    reasoningText += ` Adding the ${selectedOuter.color} ${selectedOuter.type} gives the outfit a sharper silhouette and elevates the formality.`;
  }
  
  if (selectedShoes) {
    reasoningText += ` Finishing off with ${selectedShoes.color} ${selectedShoes.type} keeps the look grounded and ${selectedShoes.style}.`;
  }

  // Add personalized touch
  if (user.stylePreferences.length > 0) {
    reasoningText += ` This aligns nicely with your ${user.stylePreferences[0].toLowerCase()} aesthetic.`;
  }

  return {
    top: selectedTop,
    bottom: selectedBottom,
    outerwear: selectedOuter,
    shoes: selectedShoes,
    reasoning: reasoningText
  };
}
