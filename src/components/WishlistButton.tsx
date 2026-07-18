"use client";
import { memo } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import clsx from "clsx";

interface WishlistButtonProps {
  productId: string;
  size?: "sm" | "md";
  className?: string;
}

function WishlistButton({ productId, size = "md", className }: WishlistButtonProps) {
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(productId);

  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(productId); }}
      className={clsx(
        "rounded-full flex items-center justify-center transition-all duration-200",
        size === "sm" ? "w-7 h-7" : "w-9 h-9",
        wishlisted
          ? "bg-rose-500 text-white shadow-sm shadow-rose-200"
          : "bg-[#151521] border border-[#1E1E2E] text-[#9CA3AF] hover:text-rose-400 hover:border-rose-500/40 shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
        className
      )}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={clsx(size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4", wishlisted && "fill-current")} />
    </button>
  );
}

export default memo(WishlistButton);
