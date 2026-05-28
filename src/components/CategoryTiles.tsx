import Link from "next/link";
import { CATEGORIES } from "@/hooks/useCategories";

export default function CategoryTiles() {
  return (
    <section className="section py-10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">Shop by Category</h2>
        <Link href="/products" className="text-xs font-semibold text-[#A78BFA] hover:text-[#8B5CF6] transition-colors">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className="group flex flex-col items-center gap-2.5 p-3.5 rounded-2xl bg-[#13112A] border border-[#252248] hover:border-[#4C3699] hover:bg-[#2D1B69]/50 hover:shadow-sm transition-all duration-150 cursor-pointer"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform duration-150">{cat.emoji}</span>
            <span className="text-[11px] font-semibold text-[#9896B8] group-hover:text-[#A78BFA] transition-colors text-center leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
