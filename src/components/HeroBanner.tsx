"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, TrendingUp, Building2, Tag, Search, SlidersHorizontal, Plus } from "lucide-react";
import { motion, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, duration = 1.6) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    const frames = Math.round(duration * 60);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      setValue(Math.round(target * (frame / frames)));
      if (frame >= frames) clearInterval(timer);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { value, ref };
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

function StatCard({ value, suffix = "", label, icon: Icon, fill }: {
  value: number; suffix?: string; label: string; icon: React.ElementType; fill?: boolean;
}) {
  const { value: count, ref } = useCountUp(value);
  return (
    <motion.div
      variants={fadeUp}
      className={fill ? "flex items-center gap-2.5 px-3.5 py-3 rounded-2xl" : "flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl"}
      style={{
        background: "rgba(11,15,23,0.70)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(255,122,24,0.12)" }}>
        <Icon className="w-4 h-4 text-[#FF9B3D]" />
      </div>
      <div className="min-w-0">
        <span ref={ref} className="text-lg sm:text-xl font-black text-white block leading-none">
          {count}{suffix}
        </span>
        <p className="text-[10.5px] sm:text-xs text-white/40 font-medium mt-1 leading-tight truncate">{label}</p>
      </div>
    </motion.div>
  );
}

function ActionCard({ href, icon: Icon, title, subtitle }: {
  href: string; icon: React.ElementType; title: string; subtitle: string;
}) {
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.18, ease: EASE }}>
      <Link
        href={href}
        className="group glass-card flex items-center gap-3.5 px-4 py-4 transition-colors duration-200 hover:border-[#FF7A18]/35"
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{ background: "rgba(255,122,24,0.14)" }}
        >
          <Icon className="w-[19px] h-[19px] text-[#FF9B3D]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14.5px] font-bold text-white leading-tight">{title}</p>
          <p className="text-[12px] text-white/40 mt-0.5 leading-tight">{subtitle}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-white/25 shrink-0 transition-all duration-200 group-hover:text-[#FF9B3D] group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}

function MobileSearchRow() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = () => {
    if (q.trim()) router.push(`/products?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <motion.div variants={fadeUp} className="flex items-stretch gap-2.5">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="Search for items…"
          className="glass-card w-full h-12 pl-11 pr-4 text-[14px] text-white placeholder:text-white/30 focus:outline-none transition-colors duration-200 focus:border-[#FF7A18]/45"
        />
      </div>
      <Link
        href="/products"
        aria-label="Filters"
        className="glass-card flex items-center justify-center shrink-0 w-12 h-12 transition-colors duration-200 hover:border-[#FF7A18]/35 active:scale-95"
      >
        <SlidersHorizontal className="w-4 h-4 text-white/60" />
      </Link>
    </motion.div>
  );
}

export default function HeroBanner() {
  return (
    <>
      {/* ───────────────────────── Desktop hero — unchanged ───────────────────────── */}
      <section className="hidden md:block px-3 sm:px-5 pt-5 pb-2">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl min-h-[500px]"
            style={{
              background: "#090C12",
              backgroundImage: [
                "radial-gradient(ellipse 75% 55% at 80% 35%, rgba(255,122,24,0.14) 0%, transparent 55%)",
                "radial-gradient(ellipse 55% 60% at 100% 5%,  rgba(255,155,61,0.08) 0%, transparent 48%)",
                "radial-gradient(ellipse 40% 40% at 0%   90%, rgba(79,70,229,0.06) 0%, transparent 50%)",
              ].join(", "),
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
              }}
            />

            <motion.div
              className="absolute pointer-events-none"
              style={{
                right: -60, top: -60, width: 360, height: 360,
                background: "radial-gradient(circle, rgba(255,122,24,0.18) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            />

            <motion.div
              className="relative px-8 sm:px-14 py-14 flex flex-col justify-center min-h-[500px]"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} className="mb-6">
                <span
                  className="inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,122,24,0.10)",
                    border: "1px solid rgba(255,122,24,0.25)",
                    color: "#FF9B3D",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Campus Marketplace
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-[2.7rem] sm:text-[3.4rem] font-black tracking-tight leading-[1.05] mb-5 max-w-[520px]"
              >
                Buy &amp; Sell<br />
                Within Your{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 55%, #FFD4A0 100%)" }}
                >
                  Hostel
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-[15px] leading-relaxed mb-9 max-w-[380px]"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                Find textbooks, electronics, clothes &amp; more—listed by students in your own block.
              </motion.p>

              <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-200 group"
                  style={{
                    background: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 100%)",
                    boxShadow: "0 4px 24px rgba(255,122,24,0.40), 0 1px 4px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(255,122,24,0.55), 0 2px 6px rgba(0,0,0,0.3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(255,122,24,0.40), 0 1px 4px rgba(0,0,0,0.3)"; (e.currentTarget as HTMLElement).style.transform = ""; }}
                >
                  Browse Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.80)",
                    backdropFilter: "blur(12px)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                >
                  Post Listing
                </Link>
              </motion.div>

              <motion.div
                variants={container}
                className="flex flex-wrap items-center gap-3 mt-10"
              >
                <StatCard value={200} suffix="+" label="Active Listings" icon={TrendingUp} />
                <StatCard value={38}  label="Hostels on Campus" icon={Building2} />
                <StatCard value={8}   label="Categories"       icon={Tag} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Mobile hero — premium redesign ───────────────────────── */}
      <section className="md:hidden px-4 pt-4">
        {/* Compact hero card */}
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "#090C12",
            backgroundImage: [
              "radial-gradient(ellipse 100% 70% at 75% 0%, rgba(255,122,24,0.16) 0%, transparent 60%)",
              "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(79,70,229,0.07) 0%, transparent 55%)",
            ].join(", "),
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <motion.div
            className="absolute pointer-events-none"
            style={{
              right: -50, top: -50, width: 220, height: 220,
              background: "radial-gradient(circle, rgba(255,122,24,0.20) 0%, transparent 70%)",
              filter: "blur(32px)",
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />

          <motion.div
            className="relative px-5 py-6"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} className="mb-3.5">
              <span
                className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,122,24,0.10)",
                  border: "1px solid rgba(255,122,24,0.25)",
                  color: "#FF9B3D",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Campus Marketplace
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[1.85rem] font-black tracking-tight leading-[1.12] mb-2"
            >
              Buy &amp; Sell Within Your{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #FF9B3D 0%, #FF7A18 55%, #FFD4A0 100%)" }}
              >
                Hostel
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[13px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Textbooks, electronics, clothes &amp; more — listed by students in your block.
            </motion.p>
          </motion.div>
        </div>

        {/* Action cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2.5 mt-6"
        >
          <ActionCard href="/products" icon={Search} title="Browse Products" subtitle="Explore items around you" />
          <ActionCard href="/sell" icon={Plus} title="Post Listing" subtitle="Sell your unused items" />
        </motion.div>

        {/* Search + filter */}
        <div className="mt-6">
          <MobileSearchRow />
        </div>

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-2 mt-6"
        >
          <StatCard value={200} suffix="+" label="Listings" icon={TrendingUp} fill />
          <StatCard value={38}  label="Hostels"  icon={Building2} fill />
          <StatCard value={8}   label="Categories" icon={Tag} fill />
        </motion.div>
      </section>
    </>
  );
}
