"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/hooks/useCategories";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function CategoryTiles() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const all = [{ id: "", name: "All" }, ...CATEGORIES.map(c => ({ id: c.id, name: c.name }))];

  return (
    <div className="px-3 sm:px-5 py-4">
      <div className="max-w-7xl mx-auto">
        {/*
         * One container animation instead of per-chip motion.div wrappers.
         * Previously: 10+ individual Framer Motion elements with staggered delays.
         * Now: a single animated container — same visual effect, far less overhead.
         */}
        <motion.div
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
        >
          {all.map((cat) => {
            const isActive = cat.id === "" ? !activeCategory : activeCategory === cat.id;
            return (
              <Link
                key={cat.id}
                href={cat.id ? `/products?category=${cat.id}` : "/products"}
                className={clsx(
                  "block shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all duration-200",
                )}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 100%)",
                        color: "#fff",
                        boxShadow: "0 4px 16px rgba(255,122,24,0.32), inset 0 1px 0 rgba(255,255,255,0.15)",
                        border: "1px solid transparent",
                      }
                    : {
                        background: "rgba(17,24,39,0.55)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.60)",
                        backdropFilter: "blur(10px)",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.08)";
                    el.style.color = "rgba(255,255,255,0.85)";
                    el.style.borderColor = "rgba(255,255,255,0.14)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(17,24,39,0.55)";
                    el.style.color = "rgba(255,255,255,0.60)";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                  }
                }}
              >
                {cat.name}
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
