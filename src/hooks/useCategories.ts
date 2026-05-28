import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "Electronics",  name: "Electronics",  emoji: "💻", color: "text-blue-600",   bgColor: "bg-blue-50"   },
  { id: "Books",        name: "Books",         emoji: "📚", color: "text-amber-600",  bgColor: "bg-amber-50"  },
  { id: "Clothes",      name: "Clothes",       emoji: "👕", color: "text-pink-600",   bgColor: "bg-pink-50"   },
  { id: "Sports",       name: "Sports",        emoji: "⚽", color: "text-green-600",  bgColor: "bg-green-50"  },
  { id: "Appliances",   name: "Appliances",    emoji: "🔌", color: "text-purple-600", bgColor: "bg-purple-50" },
  { id: "Accessories",  name: "Accessories",   emoji: "🎒", color: "text-rose-600",   bgColor: "bg-rose-50"   },
  { id: "Furniture",    name: "Furniture",     emoji: "🪑", color: "text-orange-600", bgColor: "bg-orange-50" },
  { id: "Other",        name: "Other",         emoji: "📦", color: "text-gray-600",   bgColor: "bg-gray-50"   },
];

export function useCategories() {
  return { categories: CATEGORIES };
}
