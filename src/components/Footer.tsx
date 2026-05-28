import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#080912] border-t border-white/[0.06] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#7C3AED] rounded-md flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-black text-sm text-white tracking-tight">Hostello</span>
            </div>
            <p className="text-xs text-white/30 max-w-xs leading-relaxed">
              Buy & sell within your hostel — fast, free, on campus.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { href: "/products",  label: "Browse" },
              { href: "/polls",     label: "Requests" },
              { href: "/sell",      label: "Sell" },
              { href: "/chats",     label: "Chats" },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-xs text-white/40 hover:text-white/80 transition-colors font-medium">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-8 pt-6">
          <p className="text-xs text-white/20 text-center">
            © {new Date().getFullYear()} Hostello. Made for students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
