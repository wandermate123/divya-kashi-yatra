"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Fixed bottom-right on md+ — laptops/tablets where the mobile sticky bar is hidden. */
export function DesktopFloatingBookCTA() {
  const reduce = useReducedMotion();

  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-40 hidden md:block"
      style={{
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
        paddingRight: "max(1.25rem, env(safe-area-inset-right))",
      }}
    >
      <motion.a
        href="#book"
        className="btn-primary pointer-events-auto inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_12px_40px_-8px_rgba(0,0,0,0.65)] sm:px-6 sm:py-3.5 sm:text-base"
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26, delay: 0.15 }}
        whileHover={reduce ? undefined : { scale: 1.03 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
      >
        Book now
        <span className="hidden font-normal opacity-90 sm:inline">· from ₹8,999</span>
      </motion.a>
    </div>
  );
}
