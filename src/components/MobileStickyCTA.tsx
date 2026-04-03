"use client";

/** Fixed bottom bar on small screens — thumb‑reachable booking entry. Hidden at md+ where header nav is enough. */
export function MobileStickyCTA() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div
        className="pointer-events-auto border-t border-[var(--border)] bg-[var(--background)]/92 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
        style={{
          paddingBottom: "max(0.65rem, env(safe-area-inset-bottom))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
          paddingTop: "0.65rem",
        }}
      >
        <a
          href="#book"
          className="btn-primary flex min-h-[3.25rem] w-full text-base font-semibold"
        >
          Book now · from ₹8,999
        </a>
        <p className="mt-2 text-center text-[10px] text-[var(--muted)]">
          ₹3,999 advance · secure Razorpay
        </p>
      </div>
    </div>
  );
}
