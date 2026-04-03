"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { ReactNode } from "react";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

type NavItem = { href: string; label: string; primary?: boolean };

const nav: NavItem[] = [
  { href: "#trip-overview", label: "Overview" },
  { href: "#upcoming-batches", label: "Next batches" },
  { href: "#itinerary-heading", label: "Itinerary" },
  { href: "#luxury-traveller", label: "Traveller" },
  { href: "#accommodation-heading", label: "Stay" },
  { href: "#terms-heading", label: "Terms" },
  { href: "#payment-heading", label: "Payment" },
  { href: "#contact", label: "Contact" },
  { href: "#book", label: "Book", primary: true },
];

type Props = { children: ReactNode };

export function HomeShell({ children }: Props) {
  const reduce = useReducedMotion();

  return (
    <>
      <ScrollProgress />
      <div className="relative z-10">
        <header className="mb-12 px-4 sm:mb-16">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              className="mx-auto flex justify-center"
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/wandermate-logo.png"
                alt="WanderMate"
                width={200}
                height={200}
                className="h-[3.25rem] w-auto sm:h-[4rem]"
                priority
              />
            </motion.div>
            <motion.div
              className="mx-auto mb-8 mt-7 h-px max-w-[min(100%,14rem)] bg-gradient-to-r from-transparent via-[var(--border-hover)] to-transparent"
              initial={reduce ? false : { scaleX: 0, opacity: 0 }}
              animate={reduce ? undefined : { scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.p
              className="text-[11px] font-medium uppercase tracking-[0.35em] text-[var(--muted)] sm:text-xs"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              Strangers trip on earth · connected in Kashi
            </motion.p>
            <motion.h1
              className="font-display mt-5 text-balance text-4xl font-medium leading-[1.08] tracking-tight text-[var(--foreground)] sm:text-5xl md:text-[3.25rem]"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Divya Kashi Yatra
            </motion.h1>
            <motion.p
              className="mx-auto mt-4 max-w-xl text-sm text-[var(--muted)] sm:text-base"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              Every weekend &amp; long vacations · round-the-year departures from NCR
              <span className="mx-2 text-[var(--border-hover)]">·</span>
              <span className="font-semibold text-[var(--foreground)]">WanderMate</span>
            </motion.p>
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              Log off Friday — reset in Kashi.{" "}
              <span className="font-medium text-[var(--foreground)]">Starting price of ₹8,999.</span>
            </motion.p>

            <motion.nav
              className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
              aria-label="Page sections"
              initial={reduce ? false : { opacity: 0 }}
              animate={reduce ? undefined : { opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className={
                    item.primary === true
                      ? "btn-primary text-xs sm:text-sm"
                      : "rounded-full border border-[var(--border)] bg-[var(--accent-subtle)] px-3 py-2 text-xs text-[var(--foreground)] backdrop-blur-sm transition-colors duration-300 hover:border-[var(--border-hover)] hover:bg-[rgba(255,255,255,0.12)] sm:px-4 sm:text-sm"
                  }
                  whileHover={reduce ? undefined : { y: -2 }}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  custom={i}
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>
          </div>
        </header>

        {children}
      </div>
    </>
  );
}
