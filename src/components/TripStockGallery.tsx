"use client";

import { GALLERY_STOCK_IMAGES } from "@/data/trip-stock-images";
import { Reveal } from "@/components/motion/Reveal";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export function TripStockGallery() {
  const reduce = useReducedMotion();

  return (
    <Reveal>
      <section aria-label="Scenes from Varanasi and Sarnath" className="scroll-mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-[var(--foreground)] sm:text-3xl">
              Glimpses of the journey
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
              Mood frames of the ghats and Sarnath. On departure, our photographer documents the group
              professionally—every batch leaves with story-grade visuals.
            </p>
          </div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted)] sm:pb-1">Unsplash · stock</p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {GALLERY_STOCK_IMAGES.map((img, i) => (
            <motion.figure
              key={img.src}
              className="card-surface group overflow-hidden rounded-sm"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.75, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={
                reduce
                  ? undefined
                  : { y: -6, transition: { type: "spring", stiffness: 320, damping: 22 } }
              }
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  whileHover={reduce ? undefined : { scale: 1.05 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </motion.div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
              </div>
              <figcaption className="border-t border-[var(--border)] px-4 py-3 text-xs font-medium tracking-wide text-[var(--foreground)]">
                {img.label}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
