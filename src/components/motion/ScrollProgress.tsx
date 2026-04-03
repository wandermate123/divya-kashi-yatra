"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });

  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[2px] w-full origin-left rounded-none bg-gradient-to-r from-transparent via-[var(--accent)] to-[var(--accent-strong)]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
