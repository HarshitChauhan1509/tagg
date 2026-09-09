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
  user: UserProfile,
  anchorId?: string
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

  let anchorItem: ClothingItem | undefined;
  if (anchorId) {
    anchorItem = wardrobe.find(i => i.id === anchorId);
  }

  // Determine anchor role
  let isAnchorTop = false;
  let isAnchorBottom = false;
  let isAnchorOuter = false;
  let isAnchorShoe = false;

  if (anchorItem) {
    if (tops.some(t => t.id === anchorItem!.id)) isAnchorTop = true;
    else if (bottoms.some(b => b.id === anchorItem!.id)) isAnchorBottom = true;
    else if (outers.some(o => o.id === anchorItem!.id)) isAnchorOuter = true;
    else if (shoes.some(s => s.id === anchorItem!.id)) isAnchorShoe = true;
    else isAnchorTop = true; // fallback
  }

  // Find valid tops
  let selectedTop: ClothingItem;
  if (isAnchorTop) {
    selectedTop = anchorItem!;
  } else {
    const validTops = tops.filter(t => t.formality >= targetFormality.min && t.formality <= targetFormality.max && t.id !== anchorItem?.id);
    selectedTop = getRandom(validTops.length > 0 ? validTops : tops.filter(t => t.id !== anchorItem?.id)) || tops[0];
  }

  if (!selectedTop) return null;
  
  // Find valid bottoms
  let selectedBottom: ClothingItem;
  if (isAnchorBottom) {
    selectedBottom = anchorItem!;
  } else {
    const validBottoms = bottoms.filter(b => 
      b.id !== selectedTop.id &&
      b.id !== anchorItem?.id &&
      (b.formality >= targetFormality.min && b.formality <= targetFormality.max) && 
      isColorCompatible(selectedTop.color, b.color)
    );
    const fallbackBottoms = bottoms.filter(b => b.id !== selectedTop.id && b.id !== anchorItem?.id);
    selectedBottom = getRandom(validBottoms.length > 0 ? validBottoms : fallbackBottoms) || bottoms[0];
  }

  if (!selectedBottom) return null;

  // Optional: Outerwear
  let selectedOuter: ClothingItem | undefined;
  if (isAnchorOuter) {
    selectedOuter = anchorItem!;
  } else if (outers.length > 0 && ['night_out', 'dinner', 'date', 'event'].includes(occasion)) {
    const validOuters = outers.filter(o => 
      o.id !== selectedTop.id && 
      o.id !== selectedBottom?.id && 
      o.id !== anchorItem?.id &&
      isColorCompatible(o.color, selectedTop.color)
    );
    const fallbackOuters = outers.filter(o => o.id !== selectedTop.id && o.id !== selectedBottom?.id && o.id !== anchorItem?.id);
    selectedOuter = getRandom(validOuters.length > 0 ? validOuters : fallbackOuters);
  }

  // Shoes
  let selectedShoes: ClothingItem | undefined;
  if (isAnchorShoe) {
    selectedShoes = anchorItem!;
  } else if (shoes.length > 0) {
    const validShoes = shoes.filter(s => 
      s.id !== selectedTop.id && 
      s.id !== selectedBottom?.id && 
      s.id !== selectedOuter?.id && 
      s.id !== anchorItem?.id &&
      s.formality >= targetFormality.min
    );
    const fallbackShoes = shoes.filter(s => 
      s.id !== selectedTop.id && 
      s.id !== selectedBottom?.id && 
      s.id !== selectedOuter?.id &&
      s.id !== anchorItem?.id
    );
    selectedShoes = getRandom(validShoes.length > 0 ? validShoes : fallbackShoes);
  }

  // Generate Reasoning dynamically based on the AI metadata
  let reasoningText = '';
  if (anchorItem) {
    reasoningText += `We built this look around your new ${anchorItem.color} ${anchorItem.type}. `;
  }
  
  reasoningText += `This ${selectedTop.color} ${selectedTop.type} pairs perfectly with the ${selectedBottom.color} ${selectedBottom.type} for a ${occasion.replace('_', ' ')} setting.`;
  
  if (selectedOuter && selectedOuter.id !== anchorItem?.id) {
    reasoningText += ` Adding the ${selectedOuter.color} ${selectedOuter.type} gives the outfit a sharper silhouette and elevates the formality.`;
  }
  
  if (selectedShoes && selectedShoes.id !== anchorItem?.id) {
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
