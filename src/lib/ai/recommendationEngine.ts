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

// Helper to get random item
function getRandom<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

export function generateRecommendation(
  wardrobe: ClothingItem[],
  occasion: Occasion,
  user: UserProfile
): OutfitRecommendation | null {
  if (wardrobe.length === 0) return null;

  const targetFormality = OCCASION_FORMALITY[occasion];
  
  // Make filtering robust. Users might type "pants" as category instead of "bottom", or "tshirt" instead of "top".
  const tops = wardrobe.filter(i => 
    i.category.toLowerCase() === 'top' || 
    i.category.toLowerCase() === 'tshirt' ||
    i.category.toLowerCase() === 'shirt' ||
    ['t-shirt', 'shirt', 'sweater', 'hoodie', 'top', 'blouse'].includes(i.type.toLowerCase())
  );
  
  const bottoms = wardrobe.filter(i => 
    i.category.toLowerCase() === 'bottom' || 
    i.category.toLowerCase() === 'pants' ||
    i.category.toLowerCase() === 'jeans' ||
    ['jeans', 'trousers', 'shorts', 'skirt', 'pants', 'bottom'].includes(i.type.toLowerCase())
  );
  
  const shoes = wardrobe.filter(i => 
    i.category.toLowerCase() === 'shoes' || 
    ['sneakers', 'boots', 'heels', 'shoes', 'loafers'].includes(i.type.toLowerCase())
  );
  
  const outers = wardrobe.filter(i => 
    i.category.toLowerCase() === 'outerwear' || 
    i.category.toLowerCase() === 'jacket' ||
    ['blazer', 'jacket', 'coat', 'outerwear'].includes(i.type.toLowerCase())
  );

  // If we don't have basic items, just return null
  if (tops.length === 0 || bottoms.length === 0) return null;

  // Find valid tops
  const validTops = tops.filter(t => t.formality >= targetFormality.min && t.formality <= targetFormality.max);
  const selectedTop = getRandom(validTops.length > 0 ? validTops : tops)!;
  
  // Find valid bottoms
  const validBottoms = bottoms.filter(b => 
    (b.formality >= targetFormality.min && b.formality <= targetFormality.max) && 
    isColorCompatible(selectedTop.color, b.color)
  );
  const selectedBottom = getRandom(validBottoms.length > 0 ? validBottoms : bottoms)!;

  // Optional: Outerwear
  let selectedOuter: ClothingItem | undefined;
  if (outers.length > 0 && ['night_out', 'dinner', 'date', 'event'].includes(occasion)) {
    const validOuters = outers.filter(o => isColorCompatible(o.color, selectedTop.color));
    selectedOuter = getRandom(validOuters.length > 0 ? validOuters : outers);
  }

  // Shoes
  let selectedShoes: ClothingItem | undefined;
  if (shoes.length > 0) {
    const validShoes = shoes.filter(s => s.formality >= targetFormality.min);
    selectedShoes = getRandom(validShoes.length > 0 ? validShoes : shoes);
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
