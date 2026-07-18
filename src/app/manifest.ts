import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hostel Mart – Buy & Sell on Campus",
    short_name: "Hostel Mart",
    description: "Buy & sell within your hostel — fast, free, on campus",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D1A",
    theme_color: "#FF7A18",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
