"use client";
import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/types";

const KEY = "hm_recently_viewed";
const MAX = 8;

export function useRecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setProducts(JSON.parse(stored));
    } catch {}
  }, []);

  const add = useCallback((product: Product) => {
    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      const next = [product, ...filtered].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setProducts([]);
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  return { products, add, clear };
}
