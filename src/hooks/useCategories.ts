import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "Electronics",  name: "Electronics",  emoji: "💻", color: "text-blue-400",   bgColor: "bg-blue-900/20"   },
  { id: "Books",        name: "Books",         emoji: "📚", color: "text-orange-400", bgColor: "bg-orange-900/20" },
  { id: "Clothes",      name: "Clothes",       emoji: "👕", color: "text-pink-400",   bgColor: "bg-pink-900/20"   },
  { id: "Furniture",    name: "Furniture",     emoji: "🪑", color: "text-orange-400", bgColor: "bg-orange-900/20" },
  { id: "Sports",       name: "Sports",        emoji: "⚽", color: "text-green-400",  bgColor: "bg-green-900/20"  },
  { id: "Stationery",   name: "Stationery",    emoji: "✏️", color: "text-yellow-400", bgColor: "bg-yellow-900/20" },
  { id: "Food",         name: "Food",          emoji: "🍜", color: "text-yellow-400", bgColor: "bg-yellow-900/20" },
  { id: "Appliances",   name: "Appliances",    emoji: "🔌", color: "text-orange-400", bgColor: "bg-orange-900/20" },
  { id: "Vehicles",     name: "Vehicles",      emoji: "🚲", color: "text-sky-400",    bgColor: "bg-sky-900/20"    },
  { id: "Other",        name: "Other",         emoji: "📦", color: "text-gray-400",   bgColor: "bg-gray-900/20"   },
];

export function useCategories() {
  return { categories: CATEGORIES };
}
