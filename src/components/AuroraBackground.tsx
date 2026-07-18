"use client";
import { motion } from "framer-motion";

const BLOBS = [
  { x: "14%",  y: "18%",  w: 640, h: 520, color: "rgba(255,122,24,0.065)", dur: 28, delay: 0  },
  { x: "83%",  y: "14%",  w: 520, h: 420, color: "rgba(79,70,229,0.045)",  dur: 34, delay: 5  },
  { x: "62%",  y: "74%",  w: 700, h: 560, color: "rgba(0,212,255,0.028)",  dur: 40, delay: 10 },
  { x: "26%",  y: "80%",  w: 460, h: 360, color: "rgba(255,155,61,0.045)", dur: 25, delay: 15 },
];

export default function AuroraBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Static radial base */}
      <div style={{
        position: "absolute", inset: 0,
        background: [
          "radial-gradient(ellipse 90% 55% at 50% -8%, rgba(255,122,24,0.07) 0%, transparent 58%)",
          "radial-gradient(ellipse 55% 75% at 96% 85%, rgba(79,70,229,0.045) 0%, transparent 52%)",
          "radial-gradient(ellipse 40% 50% at 5% 90%, rgba(0,212,255,0.025) 0%, transparent 50%)",
        ].join(", "),
      }} />

      {/* Animated blobs */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: b.x, top: b.y,
            width: b.w, height: b.h,
            transform: "translate(-50%, -50%)",
            background: b.color,
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
            filter: "blur(80px)",
            willChange: "transform",
          }}
          animate={{
            x:      [0, 38, -28, 0],
            y:      [0, -32, 18, 0],
            scale:  [1, 1.07, 0.95, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: b.dur,
            delay:    b.delay,
            ease:     "easeInOut",
          }}
        />
      ))}

      {/* Grain noise overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.020,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "160px",
      }} />
    </div>
  );
}
