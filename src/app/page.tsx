import { BookingForm } from "@/components/BookingForm";
import { HomeShell } from "@/components/home/HomeShell";
import { TripHeroImage } from "@/components/TripHeroImage";
import { TripDetails } from "@/components/TripDetails";
import { Reveal } from "@/components/motion/Reveal";

export default function Home() {
  return (
    <main className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:py-14 md:py-16">
      <HomeShell>
        <TripHeroImage />

        <div className="mb-20 sm:mb-28">
          <TripDetails />
        </div>

        <Reveal>
          <section id="book" className="scroll-mt-12" aria-labelledby="booking-heading">
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
    </main>
  );
}
