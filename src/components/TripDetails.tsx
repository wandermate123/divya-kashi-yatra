import type { ReactNode } from "react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { TripStockGallery } from "@/components/TripStockGallery";
import {
  ACCOMMODATION_STOCK_IMAGE,
  LUXURY_TRAVELLER_STOCK_IMAGE,
} from "@/data/trip-stock-images";
import { BATCH_OPTIONS, formatBatchDateRange } from "@/lib/booking";

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display scroll-mt-8 text-3xl font-medium leading-snug tracking-tight text-[var(--foreground)] sm:text-[2.15rem]"
    >
      <span className="relative inline-block pb-3">
        {children}
        <span
          className="absolute bottom-0 left-0 h-[2px] w-10 bg-gradient-to-r from-[var(--accent)] to-transparent sm:w-14"
          aria-hidden
        />
      </span>
    </h2>
  );
}

export function TripDetails() {
  return (
    <div className="space-y-24 sm:space-y-28">
      <Reveal>
        {/* Page 1 — positioning */}
        <section aria-labelledby="trip-overview" className="scroll-mt-8">
        <SectionTitle id="trip-overview">Log off Friday. Reset in Kashi</SectionTitle>
        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.32em] text-[var(--muted)]">
          Strangers trip on earth, connected in Kashi
        </p>
        <p className="mt-4 max-w-3xl leading-relaxed text-[var(--muted)]">
          <strong className="text-[var(--foreground)]">Divya Kashi Yatra</strong> runs{" "}
          <strong className="text-[var(--foreground)]">round the year</strong> from Delhi NCR — on{" "}
          <strong className="text-[var(--foreground)]/90">almost every weekend</strong>, and on{" "}
          <strong className="text-[var(--foreground)]/90">long vacations</strong> (public holidays, festive long
          weekends, and extended breaks). Professionals, repeat travellers, and first-timers all join the same sacred
          rhythm. Starting price <strong className="text-[var(--foreground)]">₹8,999</strong> per person (NCR pickup);
          the <strong className="text-[var(--foreground)]">published dates below</strong> are open now; pickup time and
          meeting point are messaged on WhatsApp after you book.
        </p>

        <aside
          id="upcoming-batches"
          aria-labelledby="upcoming-batches-heading"
          className="card-surface mt-8 scroll-mt-8 rounded-sm p-5 sm:p-6"
        >
          <h3
            id="upcoming-batches-heading"
            className="font-display text-lg font-medium text-[var(--foreground)] sm:text-xl"
          >
            Weekends, holidays &amp; vacation windows
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Departures are timed so you can log off Friday and return without burning a work week — schedules tighten
            around long weekends and peak vacation periods when demand is highest.
          </p>

          <div className="relative mt-6 overflow-hidden rounded-sm border border-[var(--border-hover)] bg-[var(--background-mid)]/90 p-5 sm:p-6">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[var(--foreground)]/90 via-[var(--foreground)]/40 to-transparent"
              aria-hidden
            />
            <p className="pl-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]">
              Upcoming next batches · calendar
            </p>
            <p className="mt-2 pl-4 text-xs leading-relaxed text-[var(--muted)]">
              These are the <strong className="text-[var(--foreground)]/90">next confirmed departures</strong> on sale.
              Choose the same date at checkout — your Trip Captain will still message you with final pickup time and
              meeting point.
            </p>
            <ul className="mt-5 space-y-0 pl-4" aria-label="Published departure dates">
              {BATCH_OPTIONS.map((b, index) => (
                <li
                  key={b.key}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[var(--border)] py-4 first:border-t-0 first:pt-0"
                >
                  <span className="font-display text-lg font-medium text-[var(--foreground)] sm:text-xl">
                    {formatBatchDateRange(b.start, b.end)}
                  </span>
                  {index === 0 ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--background)] bg-[var(--foreground)] px-2 py-0.5">
                      Next up
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className="mt-4 pl-4 text-sm text-[var(--muted)]">
              <strong className="text-[var(--foreground)]/90">One package</strong> for every date listed — same
              itinerary, inclusions, and price. Pick your departure below at checkout.
            </p>
            <p className="mt-5 border-t border-[var(--border)] pt-4 pl-4 text-xs leading-relaxed text-[var(--muted)]">
              More weekends and long-vacation batches are added all year. Not seeing your dates? WhatsApp{" "}
              <a
                href="https://wa.me/919214313559"
                className="font-medium text-[var(--foreground)] underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                +91 9214313559
              </a>{" "}
              — we&apos;ll tell you what&apos;s opening next.
            </p>
          </div>
        </aside>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Kashi Vishwanath Temple",
            "Assi Ghat",
            "Ganga Aarti",
            "Sarnath Stupa",
            "Pickup: Gurgaon, Delhi & Noida",
          ].map((item) => (
            <li
              key={item}
              className="card-surface flex gap-3 rounded-sm px-4 py-3.5 text-sm text-[var(--foreground)] transition-[border-color,transform] duration-300 hover:border-[var(--border-hover)]"
            >
              <span className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden>
                ◆
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        </section>
      </Reveal>

      <TripStockGallery />

      <Reveal>
        {/* Pages 3–4 — itinerary */}
        <section aria-labelledby="itinerary-heading" className="scroll-mt-8">
        <SectionTitle id="itinerary-heading">Sacred Kashi itinerary</SectionTitle>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
          The flow below is the same for everyone on this trip. Pickup time and exact meeting point for your batch are
          shared after you book.
        </p>

        <div className="mt-10 space-y-12 border-l border-[var(--border-hover)] pl-7 sm:pl-10">
          <article className="relative">
            <span
              className="absolute -left-[1.55rem] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent)]/35 bg-[var(--background-mid)] text-xs font-semibold text-[var(--accent)] sm:-left-[2.55rem] sm:h-9 sm:w-9"
              aria-hidden
            >
              0
            </span>
            <h3 className="font-display text-xl font-medium text-[var(--foreground)]">
              Day 0 (Friday)
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--accent)]">
              <li>Departure from Delhi via Tempo Traveller (tourist van). Overnight journey.</li>
            </ul>
          </article>

          <article className="relative">
            <span
              className="absolute -left-[1.55rem] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent)]/35 bg-[var(--background-mid)] text-xs font-semibold text-[var(--accent)] sm:-left-[2.55rem] sm:h-9 sm:w-9"
              aria-hidden
            >
              1
            </span>
            <h3 className="font-display text-xl font-medium text-[var(--foreground)]">
              Day 1 (Saturday) — Arrival &amp; cultural exploration
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--accent)]">
              <li>Arrival in Varanasi &amp; hotel check-in</li>
              <li>Freshen up and relax</li>
              <li>Visit Sankat Mochan Temple, Durga Temple &amp; Tulsi Manas Mandir</li>
              <li>Witness the mesmerizing Ganga Aarti at Dashashwamedh Ghat</li>
              <li>Explore local markets and shops</li>
              <li>Enjoy famous street food Tamatar Chaat &amp; Thandai</li>
              <li>Dinner and overnight stay at hotel</li>
            </ul>
          </article>

          <article className="relative">
            <span
              className="absolute -left-[1.55rem] top-0 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent)]/35 bg-[var(--background-mid)] text-xs font-semibold text-[var(--accent)] sm:-left-[2.55rem] sm:h-9 sm:w-9"
              aria-hidden
            >
              2
            </span>
            <h3 className="font-display text-xl font-medium text-[var(--foreground)]">
              Day 2 (Sunday) — Spiritual &amp; heritage tour
            </h3>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--accent)]">
              <li>Visit Kashi Vishwanath Temple &amp; Kaal Bhairav Temple</li>
              <li>Food walk — Kachori-Sabzi, Kulhad Chai &amp; Lassi</li>
              <li>Boat ride on the Ganges with scenic ghat views</li>
              <li>Return to hotel for rest</li>
              <li>Excursion to Sarnath — historic Buddhist site</li>
              <li>Evening dinner in Varanasi</li>
              <li>Departure from Varanasi at 8:00 PM</li>
            </ul>
          </article>
        </div>
        </section>
      </Reveal>

      <Reveal>
        {/* Luxury Tempo / AC traveller */}
        <section
          id="luxury-traveller"
          aria-labelledby="luxury-traveller-heading"
          className="scroll-mt-8 overflow-hidden rounded-sm border border-[var(--border)] card-surface shadow-[0_32px_90px_-40px_rgba(0,0,0,0.9)]"
        >
        <div className="grid lg:grid-cols-2 lg:items-stretch">
          <div className="relative aspect-[4/3] min-h-[220px] lg:aspect-auto lg:min-h-[320px]">
            <Image
              src={LUXURY_TRAVELLER_STOCK_IMAGE.src}
              alt={LUXURY_TRAVELLER_STOCK_IMAGE.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[var(--background)]/85" />
            <p className="absolute bottom-3 left-3 right-3 text-xs text-[var(--muted)] lg:hidden">
              {LUXURY_TRAVELLER_STOCK_IMAGE.label}
            </p>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <SectionTitle id="luxury-traveller-heading">Your luxury traveller</SectionTitle>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              Journeys begin in a <strong className="text-[var(--foreground)]">Tempo Traveller–class AC tourist van</strong>{" "}
              from Delhi NCR (Gurgaon, Delhi, or Noida pickup). Settle in for an{" "}
              <strong className="text-[var(--foreground)]">overnight drive</strong> with comfortable seating, room for the group,
              and our logistics team handling driver allowance, tolls, and parking as per your package.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-[var(--muted)]">
              <li className="flex gap-2">
                <span className="text-[var(--accent)]" aria-hidden>
                  ✓
                </span>
                AC group vehicle for the Delhi ↔ Varanasi leg
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent)]" aria-hidden>
                  ✓
                </span>
                Punctual reporting at your pickup point — 30 minutes before departure
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent)]" aria-hidden>
                  ✓
                </span>
                Exact vehicle may vary by batch and fleet
              </li>
            </ul>
            <p className="mt-4 hidden text-xs text-[var(--muted)] lg:block">{LUXURY_TRAVELLER_STOCK_IMAGE.label}</p>
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        {/* Page 5 — accommodation */}
        <section aria-labelledby="accommodation-heading" className="scroll-mt-8 rounded-sm card-surface p-6 sm:p-8">
        <figure className="-mx-6 -mt-6 mb-8 overflow-hidden border-b border-[var(--border)] sm:-mx-8 sm:-mt-8">
          {/* Asset is ~3:2 (1024×683) — match aspect so the room isn’t cropped like a 21:9 banner */}
          <div className="relative aspect-[3/2] w-full min-h-[160px]">
            <Image
              src={ACCOMMODATION_STOCK_IMAGE.src}
              alt={ACCOMMODATION_STOCK_IMAGE.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 896px) 100vw, 896px"
              loading="lazy"
            />
          </div>
          <figcaption className="px-4 py-3 text-xs text-[var(--muted)] sm:px-8">
            {ACCOMMODATION_STOCK_IMAGE.label}
          </figcaption>
        </figure>
        <SectionTitle id="accommodation-heading">Accommodation</SectionTitle>
        <p className="mt-3 text-sm text-[var(--muted)]">Partner stays (subject to availability) — five properties we use:</p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[var(--foreground)] marker:font-medium marker:text-[var(--muted)]">
          {[
            "COCO-CABANA",
            "Hotel DEV Residency by Elegance",
            "Hotel The Elegance",
            "Hotel Sankalp",
            "Hotel Bliss Banaras",
          ].map((name) => (
            <li key={name} className="border-b border-[var(--border)] border-opacity-60 pb-3 last:border-0 last:pb-0">
              {name}
            </li>
          ))}
        </ol>
        <p className="mt-6 text-xs leading-relaxed text-[var(--muted)]">
          Please note: All listed hotels are subject to availability. If these specific properties are fully booked, we
          will provide accommodations of a similar standard.
        </p>
        </section>
      </Reveal>

      <Reveal>
        {/* Page 6 — inclusions / exclusions */}
        <section
          aria-labelledby="inclusions-heading"
          className="grid gap-10 rounded-sm card-surface p-6 sm:grid-cols-2 sm:p-8"
        >
        <div>
          <h2 id="inclusions-heading" className="font-display text-xl font-medium text-[var(--foreground)]">
            Inclusions
          </h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-[var(--muted)] marker:text-[var(--accent)]">
            <li>Accommodation: Premium 3 or 4 star stay in Varanasi</li>
            <li>5 meals: 3 breakfasts &amp; 2 lunch</li>
            <li>Transportation: Pickup and drop from Delhi NCR</li>
            <li>Senior Storyteller</li>
            <li>Professional photographer to document the journey</li>
            <li>Logistics covered: Driver allowance, toll charges, parking fees</li>
            <li>Private boating and VIP Darshan</li>
            <li>Safety: First aid kits available throughout the trip</li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl font-medium text-[var(--foreground)]">Exclusions</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-[var(--muted)] marker:text-[var(--accent)]/55">
            <li>Personal expenses &amp; dinner (self-exploration in famous spots in Varanasi)</li>
            <li>Anything not mentioned in inclusions</li>
            <li>Any personal expenses such as laundry, shopping, tips or snacks</li>
            <li>Any adventure activities not specifically mentioned in the itinerary</li>
            <li>Entrance fees to temples, parks, or sightseeing spots (if applicable)</li>
            <li>Travel insurance</li>
          </ul>
        </div>
        </section>
      </Reveal>

      <Reveal>
        {/* Page 7 — terms */}
        <section aria-labelledby="terms-heading" className="scroll-mt-8 rounded-sm card-surface p-6 sm:p-8">
        <SectionTitle id="terms-heading">WanderMate — terms &amp; conditions</SectionTitle>
        <div className="mt-6 space-y-6 text-sm leading-relaxed text-[var(--muted)]">
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">General guidelines</h3>
            <ul className="mt-2 list-inside list-disc space-y-2 marker:text-[var(--accent)]/55">
              <li>
                Drinking &amp; smoking are strictly prohibited during the journey to ensure the health, comfort, and
                safety of all fellow travelers.
              </li>
              <li>Any act of misconduct, indiscipline, or inappropriate behavior will not be tolerated.</li>
              <li>
                WanderMate maintains a cordial and respectful travel environment and aims to provide all participants
                with a hassle-free and memorable experience.
              </li>
              <li>
                Travelers must care for their personal belongings. WanderMate shall not be held responsible for loss
                or theft.
              </li>
              <li>
                Travelers must report at the pickup point 30 minutes before the scheduled departure and update their
                status with the Trip Coordinators.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Payment &amp; booking</h3>
            <ul className="mt-2 list-inside list-disc space-y-2 marker:text-[var(--accent)]/55">
              <li>The advance amount is strictly non-refundable under any circumstances.</li>
              <li>Full payment must be made before the trip begins.</li>
              <li>Failure to pay the remaining balance may result in cancellation without any refund.</li>
              <li>No refund will be provided for any part of the trip missed or for any inclusions not availed.</li>
              <li>
                Transfer of bookings is not allowed. Only the person whose name is mentioned during confirmation will
                be permitted to travel.
              </li>
              <li>Government-issued ID verification is mandatory before boarding. No traveler without valid ID.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Itinerary &amp; schedule</h3>
            <ul className="mt-2 list-inside list-disc space-y-2 marker:text-[var(--accent)]/55">
              <li>The departure time is fixed. All travelers are expected to be punctual.</li>
              <li>
                The itinerary is subject to change based on weather, road conditions, or the physical ability of
                participants.
              </li>
              <li>
                WanderMate reserves the right to make such adjustments in the interest of safety and overall
                experience.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Liability</h3>
            <ul className="mt-2 list-inside list-disc space-y-2 marker:text-[var(--accent)]/55">
              <li>
                WanderMate will not be responsible for delays, program changes, or extra costs due to natural hazards,
                accidents, landslides, vehicle breakdowns, political issues, weather conditions, or any untoward
                incidents.
              </li>
              <li>
                No insurance is provided by WanderMate. We are not liable for any expenses incurred due to sickness,
                accidents, theft, or loss of property.
              </li>
            </ul>
          </div>
        </div>
        </section>
      </Reveal>

      <Reveal>
        {/* Page 8 — things to carry */}
        <section aria-labelledby="carry-heading" className="scroll-mt-8 rounded-sm card-surface p-6 sm:p-8">
        <SectionTitle id="carry-heading">Things to carry for the trip</SectionTitle>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Documents &amp; IDs</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-[var(--muted)] marker:text-[var(--accent)]">
              <li>Valid ID proof (Aadhar / college / any govt. ID)</li>
              <li>Digital booking confirmation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Toiletries &amp; personal care</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-[var(--muted)] marker:text-[var(--accent)]">
              <li>Toothbrush, toothpaste, soap, shampoo</li>
              <li>Hand sanitizer, face wash, wet wipes</li>
              <li>Sunscreen</li>
              <li>Mosquito repellent / Odomos</li>
              <li>Any personal medication</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Gadgets &amp; accessories</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-[var(--muted)] marker:text-[var(--accent)]">
              <li>Phone + charger + power bank</li>
              <li>Plastic clip bags / waterproof pouches for phone and wallet</li>
              <li>Earphones / small speaker (optional), sunglasses</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Clothing &amp; footwear</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-[var(--muted)] marker:text-[var(--accent)]">
              <li>Temple wear (mandatory)</li>
              <li>Easy slip-on shoes</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-xs text-[var(--muted)]">
          <strong className="text-[var(--foreground)]/80">Special note:</strong> Avoid carrying heavy luggage. Pack smart, light
          &amp; waterproof.
        </p>
        </section>
      </Reveal>

      <Reveal>
        {/* Page 9 — payment */}
        <section aria-labelledby="payment-heading" className="scroll-mt-8">
        <SectionTitle id="payment-heading">Payment details</SectionTitle>
        <p className="mt-3 text-sm text-[var(--muted)]">
          For Delhi NCR: <strong className="text-[var(--foreground)]">₹8,999</strong> per person. Pay{" "}
          <strong className="text-[var(--accent)]">₹3,999</strong> to confirm booking (or use online checkout below).
        </p>
        </section>
      </Reveal>

      <Reveal>
        {/* Page 10 — why us */}
        <section aria-labelledby="why-heading" className="scroll-mt-8">
        <SectionTitle id="why-heading">Why choose us</SectionTitle>
        <ul className="mt-6 space-y-6 text-sm leading-relaxed text-[var(--muted)]">
          <li>
            <strong className="text-[var(--foreground)]">Built by IIT Delhi alumni.</strong> We understand the NCR
            corporate grind because we&apos;ve been part of it. WanderMate was founded by IIT graduates to solve the
            weekend burnout we saw in tech and startup circles—and we know what a premium, hassle-free experience looks
            like for a busy professional.
          </li>
          <li>
            <strong className="text-[var(--foreground)]">The &quot;zero PTO&quot; guarantee.</strong> This itinerary is
            timed for the busy NCR professional: a full cultural and spiritual reset without burning a work day.
          </li>
          <li>
            <strong className="text-[var(--foreground)]">We are the locals (no middlemen).</strong> Our operational HQ
            is in the heart of Varanasi at Bhelupur. Our on-ground team manages hotel check-ins, boat rides, and
            temple logistics directly—less miscommunication, instant local support.
          </li>
          <li>
            <strong className="text-[var(--foreground)]">Tech-driven, seamless execution.</strong> From booking to
            digital itineraries, the experience is designed to feel as frictionless as the apps you use daily—no endless
            paperwork.
          </li>
          <li>
            <strong className="text-[var(--foreground)]">Aesthetic &amp; culturally curated.</strong> Boutique stays,
            rooftop cafes, and the best light for Ganga Aarti—details chosen to feel as good as they look on camera.
          </li>
          <li>
            <strong className="text-[var(--foreground)]">Flawless on-ground execution.</strong> Your Tour Captain travels
            with you; the Varanasi team tracks arrivals, VIP Sugam Darshan passes, and private boat at the ghat—no
            faceless bots.
          </li>
        </ul>
        </section>
      </Reveal>

      <Reveal>
        {/* Page 11 — contact */}
        <footer id="contact" className="scroll-mt-8 border-t border-[var(--border)] pt-10 text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">WanderMate</p>
        <p className="mt-2 font-display text-xl font-semibold text-[var(--foreground)]">
          Want to book this trip?
        </p>
        <div className="mt-6 grid gap-4 text-sm text-[var(--muted)] sm:grid-cols-2">
          <div>
            <p>
              <span className="text-[var(--muted)]">Phone</span>{" "}
              <a href="tel:+919214313559" className="font-medium text-[var(--foreground)] hover:text-[var(--accent)]">
                +91 9214313559
              </a>
            </p>
            <p className="mt-1">
              <span className="text-[var(--muted)]">Email</span>{" "}
              <a
                href="mailto:info@wandermate.in"
                className="font-medium text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                info@wandermate.in
              </a>
            </p>
            <p className="mt-1">
              <span className="text-[var(--muted)]">Website</span>{" "}
              <a
                href="https://www.wandermate.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--accent)] hover:underline"
              >
                www.wandermate.co.in
              </a>
            </p>
          </div>
          <div>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              GSTIN <span className="font-mono text-[var(--foreground)]/70">09NTTPS7465C1ZL</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">
              First floor, Jawahar Nagar, B27/92-13, Durgakund Rd, Jawahar Nagar Colony, Bhelupur, Varanasi, Uttar
              Pradesh 221005
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          Ready to travel?{" "}
          <a href="#book" className="font-semibold text-[var(--accent)] underline-offset-4 hover:underline">
            Book your seat below
          </a>
          .
        </p>
        </footer>
      </Reveal>
    </div>
  );
}
