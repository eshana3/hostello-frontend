import HeroBanner from "@/components/HeroBanner";
import TrendingSection from "@/components/TrendingSection";
import CategoryTiles from "@/components/CategoryTiles";
import LatestProducts from "@/components/LatestProducts";
import RecentlySold from "@/components/RecentlySold";
import RecentlyViewed from "@/components/RecentlyViewed";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <RecentlyViewed />
      <TrendingSection />
      <CategoryTiles />
      <LatestProducts />
      <RecentlySold />
    </main>
  );
}
