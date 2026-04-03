"use client";

import { HERO_STOCK_IMAGE } from "@/data/trip-stock-images";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export function TripHeroImage() {
  const reduce = useReducedMotion();

  return (
    <motion.figure
      className="relative -mx-4 mb-14 overflow-hidden rounded-sm border border-[var(--border)] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] sm:mx-0 sm:mb-20"
      initial={reduce ? false : { opacity: 0, clipPath: "inset(12% 8% 12% 8%)" }}
      animate={reduce ? undefined : { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Hero PNG is 16:9 — use the same aspect so object-cover matches without side crop */}
      <div className="relative w-full aspect-video">
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.08 }}
          animate={reduce ? undefined : { scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <Image
            src={HERO_STOCK_IMAGE.src}
            alt={HERO_STOCK_IMAGE.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/15 to-transparent sm:via-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--background)]/40 via-transparent to-[var(--background)]/40 opacity-70" />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--background)]/95 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-14 text-left sm:px-8 sm:pb-6 sm:pt-16">
          <motion.span
            className="font-display text-lg font-medium text-[var(--foreground)] sm:text-xl"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {HERO_STOCK_IMAGE.label}
          </motion.span>
          <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">
            Divya Kashi Yatra
          </span>
        </figcaption>
      </div>
    </motion.figure>
  );
}
