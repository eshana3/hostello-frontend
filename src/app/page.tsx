import HeroBanner from "@/components/HeroBanner";
import CategoryTiles from "@/components/CategoryTiles";
import TrendingSection from "@/components/TrendingSection";
import LatestProducts from "@/components/LatestProducts";
import RecentlySold from "@/components/RecentlySold";
import RecentlyViewed from "@/components/RecentlyViewed";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-8 md:gap-12 pb-6">
      <HeroBanner />

      <Suspense fallback={null}>
        <CategoryTiles />
      </Suspense>

      <RecentlyViewed />
      <TrendingSection />
      <LatestProducts />
      <RecentlySold />
    </main>
  );
}