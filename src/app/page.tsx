import { BookingForm } from "@/components/BookingForm";
import { DesktopFloatingBookCTA } from "@/components/DesktopFloatingBookCTA";
import { HomeShell } from "@/components/home/HomeShell";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { TripHeroImage } from "@/components/TripHeroImage";
import { TripDetails } from "@/components/TripDetails";
import { Reveal } from "@/components/motion/Reveal";

export default function Home() {
  return (
    <main className="relative z-10 mx-auto max-w-4xl pb-28 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] md:px-4 md:pb-16 md:py-16">
      <HomeShell>
        <TripHeroImage />

        <div className="mb-20 sm:mb-28">
          <TripDetails />
        </div>

        <Reveal>
          <section id="book" className="scroll-mt-6 md:scroll-mt-12" aria-labelledby="booking-heading">
            <div className="section-rule mb-10" />
            <h2
              id="booking-heading"
              className="font-display text-center text-3xl font-medium tracking-tight text-[var(--foreground)] sm:text-4xl"
            >
              Reserve your seats
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-[var(--muted)]">
              We run this trip <strong className="font-medium text-[var(--foreground)]/90">most weekends</strong> and on{" "}
              <strong className="font-medium text-[var(--foreground)]/90">long vacation windows</strong> year-round.
              Published <strong className="font-medium text-[var(--foreground)]/90">batch dates</strong> are in the{" "}
              <a href="#upcoming-batches" className="font-medium text-[var(--foreground)] underline-offset-2 hover:underline">
                Next batches
              </a>{" "}
              section above — same package for each; pick your departure dates here. Pickup details go out on WhatsApp
              after payment. Razorpay checkout.
            </p>
            <div className="mt-10">
              <BookingForm />
            </div>
          </section>
        </Reveal>
      </HomeShell>
      <MobileStickyCTA />
      <DesktopFloatingBookCTA />
    </main>
  );
}
