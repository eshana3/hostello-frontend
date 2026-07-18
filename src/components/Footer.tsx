import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="mt-20"
      style={{
        background: "rgba(6,7,10,0.95)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 flex items-center justify-center relative overflow-hidden"
                style={{
                  borderRadius: 8,
                  background: "linear-gradient(145deg, #FFB347 0%, #FF8520 45%, #E86000 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.18), 0 3px 12px rgba(232,96,0,0.50), 0 1px 3px rgba(0,0,0,0.28)",
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
                  style={{ borderRadius: "8px 8px 0 0", background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)" }}
                />
                <ShoppingBag
                  className="w-3 h-3 text-white relative z-10"
                  style={{ filter: "drop-shadow(0 1px 1.5px rgba(0,0,0,0.30))" }}
                />
              </div>
              <span
                className="font-black text-sm tracking-tight bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 60%, #ffffff 100%)" }}
              >
                Hostel Mart
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
              Buy &amp; sell within your hostel — fast, free, on campus.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: "/products", label: "Browse"   },
              { href: "/polls",    label: "Requests" },
              { href: "/sell",     label: "Sell"     },
              { href: "/chats",    label: "Chats"    },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs font-medium transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.70)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.18)" }}>
            © {new Date().getFullYear()} Hostel Mart. Made for students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
