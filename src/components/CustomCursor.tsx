"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Outer ring — lags behind for trail effect
  const outerX = useSpring(rawX, { stiffness: 75, damping: 16, mass: 0.3 });
  const outerY = useSpring(rawY, { stiffness: 75, damping: 16, mass: 0.3 });

  // Inner dot — tracks precisely
  const innerX = useSpring(rawX, { stiffness: 900, damping: 38 });
  const innerY = useSpring(rawY, { stiffness: 900, damping: 38 });

  useEffect(() => {
    const check = () =>
      setIsDesktop(
        window.innerWidth >= 1024 &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label, [data-hover]";

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown  = () => setClicking(true);
    const onUp    = () => setClicking(false);
    const onOver  = (e: MouseEvent) =>
      setHovering(!!(e.target as Element).closest(INTERACTIVE));
    const onOut   = (e: MouseEvent) => {
      const to = e.relatedTarget as Element | null;
      if (!to?.closest(INTERACTIVE)) setHovering(false);
    };

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseup",    onUp);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);

    return () => {
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
    };
  }, [isDesktop, rawX, rawY]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none select-none"
        style={{ x: outerX, y: outerY, translateX: "-50%", translateY: "-50%", zIndex: 99998 }}
        animate={{
          scale:   hovering ? 1.7 : clicking ? 0.65 : 1,
          opacity: visible  ? 1   : 0,
        }}
        transition={{ scale: { type: "spring", stiffness: 320, damping: 22 }, opacity: { duration: 0.15 } }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "1.5px solid rgba(255,122,24,0.55)",
          background: hovering ? "rgba(255,122,24,0.08)" : "transparent",
          boxShadow: hovering
            ? "0 0 22px rgba(255,122,24,0.28), inset 0 0 10px rgba(255,122,24,0.10)"
            : "0 0 10px rgba(255,122,24,0.14)",
          transition: "background 0.18s, box-shadow 0.18s",
        }} />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none select-none"
        style={{ x: innerX, y: innerY, translateX: "-50%", translateY: "-50%", zIndex: 99999 }}
        animate={{
          scale:   clicking ? 0.35 : hovering ? 0 : 1,
          opacity: visible  ? 1    : 0,
        }}
        transition={{ scale: { type: "spring", stiffness: 700, damping: 28 }, opacity: { duration: 0.1 } }}
      >
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#FF7A18",
          boxShadow: "0 0 8px rgba(255,122,24,0.75)",
        }} />
      </motion.div>
    </>
  );
}
