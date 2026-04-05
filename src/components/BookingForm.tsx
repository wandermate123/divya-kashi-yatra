"use client";

import {
  BATCH_OPTIONS,
  GENDER_OPTIONS,
  PICKUP_OPTIONS,
  computeAmounts,
  isValidEmail,
  isValidIndianPhone,
  isValidTravelerAge,
} from "@/lib/booking";
import type { RazorpaySuccessResponse } from "@/types/razorpay-checkout";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";

const STEPS = ["Your details", "Trip details", "Review & pay"] as const;

function formatINRFromPaise(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function BookingForm() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ageInput, setAgeInput] = useState("");
  const [genderKey, setGenderKey] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [travelerCount, setTravelerCount] = useState(1);
  const [batchKey, setBatchKey] = useState("");
  const [pickupKey, setPickupKey] = useState("");
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  const amounts = useMemo(() => computeAmounts(travelerCount), [travelerCount]);

  const ageNum = Number.parseInt(ageInput, 10);
  const ageValid = isValidTravelerAge(ageNum);

  const step0Valid =
    fullName.trim().length >= 2 &&
    isValidEmail(email.trim()) &&
    isValidIndianPhone(phone.trim()) &&
    ageValid &&
    Boolean(genderKey);
  const step1Valid =
    Boolean(batchKey) &&
    Boolean(pickupKey) &&
    travelerCount >= 1 &&
    travelerCount <= 50;
  const canPay = step0Valid && step1Valid && termsAccepted && !paying;

  const startPayment = useCallback(async () => {
    if (!canPay) return;
    setPaying(true);
    setError(null);
    setMessage(null);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setError("Could not load payment checkout. Check your connection or ad blocker.");
        setPaying(false);
        return;
      }

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          age: ageNum,
          gender: genderKey,
          termsAccepted: true,
          travelerCount,
          batchKey,
          pickupKey,
        }),
      });
      const orderJson = (await orderRes.json()) as {
        bookingId?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
        error?: string;
      };

      if (!orderRes.ok) {
        setError(orderJson.error ?? "Could not start payment.");
        setPaying(false);
        return;
      }

      const bookingId = orderJson.bookingId;
      const orderId = orderJson.orderId;
      const keyId = orderJson.keyId;
      const amount = orderJson.amount;
      const currency = orderJson.currency ?? "INR";

      if (!bookingId || !orderId || !keyId || typeof amount !== "number") {
        setError("Invalid response from payment server.");
        setPaying(false);
        return;
      }

      // Razorpay Standard Checkout expects amount in subunits as string when using orders.
      const rzp = new window.Razorpay({
        key: keyId,
        amount: String(amount),
        currency,
        order_id: orderId,
        name: "Divya Kashi Yatra",
        description: `Advance — ${travelerCount} traveler(s)`,
        theme: { color: "#001533" },
        prefill: {
          name: fullName.trim(),
          email: email.trim(),
          contact: phone.replace(/\D/g, "").slice(-10),
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyJson = (await verifyRes.json()) as { success?: boolean; error?: string; bookingId?: string };
            if (!verifyRes.ok) {
              setError(verifyJson.error ?? "Payment verification failed. Contact support with your payment ID.");
              setPaying(false);
              return;
            }
            setSuccessBookingId(verifyJson.bookingId ?? bookingId);
            setMessage("Payment successful. Your advance is confirmed. We will contact you on WhatsApp.");
          } catch {
            setError("Verification request failed. If money was debited, contact support.");
          } finally {
            setPaying(false);
          }
        },
      });

      rzp.open();
    } catch {
      setError("Something went wrong starting checkout.");
      setPaying(false);
    }
  }, [ageNum, batchKey, canPay, email, fullName, genderKey, phone, pickupKey, travelerCount]);

  if (successBookingId) {
    return (
      <div
        className="card-surface rounded-sm p-5 shadow-[0_32px_90px_-40px_rgba(0,0,0,0.9)] sm:p-8"
        role="status"
      >
        <h2 className="font-display text-2xl font-medium text-[var(--foreground)]">
          Booking confirmed
        </h2>
        <p className="mt-3 text-[var(--muted)]">
          Reference: <span className="font-mono text-sm text-[var(--foreground)]">{successBookingId}</span>
        </p>
        <p className="mt-4 text-[var(--foreground)]">{message}</p>
      </div>
    );
  }

  return (
    <div className="card-surface rounded-sm p-4 shadow-[0_32px_90px_-40px_rgba(0,0,0,0.9)] sm:p-8">
      <nav
        aria-label="Progress"
        className="mobile-nav-scroll mb-6 flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden pb-1 [-webkit-overflow-scrolling:touch] sm:mb-8 sm:flex-wrap sm:overflow-visible"
      >
        {STEPS.map((label, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setStep(i)}
              className={`shrink-0 snap-start rounded-full px-4 py-2.5 text-left text-xs font-medium transition-[background-color,color,box-shadow,transform] duration-300 sm:text-sm ${
                active
                  ? "bg-[linear-gradient(165deg,var(--accent-strong),#ffffff)] text-[#001533] shadow-[0_8px_24px_-12px_rgba(255,255,255,0.22)]"
                  : done
                    ? "border border-[var(--border-hover)] bg-[var(--accent-subtle)] text-[var(--foreground)]"
                    : "border border-[var(--border)] bg-[var(--background-mid)]/80 text-[var(--muted)] hover:border-[var(--border-hover)]"
              }`}
            >
              {i + 1}. {label}
            </button>
          );
        })}
      </nav>

      {error ? (
        <p className="mb-4 rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mb-4 rounded-md border border-emerald-900/50 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-100">
          {message}
        </p>
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        {step === 0 ? (
          <motion.div
            key="step-0"
            className="grid gap-4 sm:grid-cols-2"
            initial={reduceMotion ? false : { opacity: 0, x: -12 }}
            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-[var(--muted)]" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              className="input-luxury mt-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted)]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-luxury mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted)]" htmlFor="phone">
              Phone (WhatsApp)
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              className="input-luxury mt-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted)]" htmlFor="age">
              Age (years)
            </label>
            <input
              id="age"
              type="number"
              min={1}
              max={120}
              inputMode="numeric"
              className="input-luxury mt-2"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              required
            />
            {ageInput && !ageValid ? (
              <p className="mt-1 text-xs text-amber-200/90">Enter an age between 1 and 120.</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted)]" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              className="input-luxury mt-2"
              value={genderKey}
              onChange={(e) => setGenderKey(e.target.value)}
              required
            >
              <option value="">Select</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={!step0Valid}
              onClick={() => setStep(1)}
              className="btn-primary w-full sm:w-auto sm:min-w-[12rem]"
            >
              Continue
            </button>
          </div>
        </motion.div>
      ) : null}

      {step === 1 ? (
        <motion.div
          key="step-1"
          className="grid gap-4 sm:grid-cols-2"
          initial={reduceMotion ? false : { opacity: 0, x: -12 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <label className="block text-sm font-medium text-[var(--muted)]" htmlFor="batch">
              Departure dates
            </label>
            <select
              id="batch"
              className="input-luxury mt-2"
              value={batchKey}
              onChange={(e) => setBatchKey(e.target.value)}
              required
            >
              <option value="">Select dates</option>
              {BATCH_OPTIONS.map((b) => (
                <option key={b.key} value={b.key}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--muted)]" htmlFor="travelers">
              Number of travelers
            </label>
            <input
              id="travelers"
              type="number"
              min={1}
              max={50}
              className="input-luxury mt-2"
              value={travelerCount}
              onChange={(e) => setTravelerCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <span className="block text-sm font-medium text-[var(--muted)]" id="pickup-label">
              Pickup point
            </span>
            <select
              id="pickup"
              aria-labelledby="pickup-label"
              className="input-luxury mt-2 w-full sm:max-w-md"
              value={pickupKey}
              onChange={(e) => setPickupKey(e.target.value)}
              required
            >
              <option value="">Select city</option>
              {PICKUP_OPTIONS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Boarding / departure pickup for this trip (NCR).
            </p>
          </div>
          <div className="sm:col-span-2 flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:flex-wrap sm:justify-between">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="btn-ghost w-full sm:w-auto"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!step1Valid}
              onClick={() => setStep(2)}
              className="btn-primary w-full sm:w-auto sm:min-w-[12rem]"
            >
              Review
            </button>
          </div>
        </motion.div>
      ) : null}

      {step === 2 ? (
        <motion.div
          key="step-2"
          className="space-y-4"
          initial={reduceMotion ? false : { opacity: 0, x: -12 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rounded-sm border border-[var(--border)] bg-[var(--background-mid)]/60 p-4 text-sm">
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-[var(--muted)]">Name</dt>
                <dd className="font-medium text-[var(--foreground)]">{fullName}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Contact</dt>
                <dd className="font-medium text-[var(--foreground)]">{email}</dd>
                <dd className="text-[var(--foreground)]">{phone}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Age</dt>
                <dd className="font-medium text-[var(--foreground)]">{ageValid ? ageNum : "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Gender</dt>
                <dd className="font-medium text-[var(--foreground)]">
                  {GENDER_OPTIONS.find((g) => g.key === genderKey)?.label ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Batch</dt>
                <dd className="font-medium text-[var(--foreground)]">
                  {BATCH_OPTIONS.find((b) => b.key === batchKey)?.label ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Travelers</dt>
                <dd className="font-medium text-[var(--foreground)]">{travelerCount}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Pickup</dt>
                <dd className="font-medium text-[var(--foreground)]">
                  {PICKUP_OPTIONS.find((p) => p.key === pickupKey)?.label ?? "—"}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-col gap-1 border-t border-[var(--border)] pt-4 text-[var(--foreground)]">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted)]">Package total due</span>
                <span>{formatINRFromPaise(amounts.totalPackagePaise)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[var(--accent)]">
                <span>Advance due now</span>
                <span>{formatINRFromPaise(amounts.advancePaise)}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--muted)]">
                <span>Balance later</span>
                <span>{formatINRFromPaise(amounts.balancePaise)}</span>
              </div>
            </div>
          </div>
          <div className="rounded-sm border border-[var(--border)] bg-[var(--background-mid)]/40 px-4 py-3">
            <label className="flex cursor-pointer gap-3 text-sm leading-snug text-[var(--foreground)]">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--border)] accent-[var(--accent-strong)]"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>
                I have read and accept the{" "}
                <a href="#terms-heading" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
                  terms &amp; conditions
                </a>
                .
              </span>
            </label>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-ghost w-full sm:w-auto"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!canPay}
              onClick={() => void startPayment()}
              className="btn-primary w-full min-w-0 sm:min-w-[200px] sm:w-auto"
            >
              {paying ? "Opening checkout…" : `Pay ${formatINRFromPaise(amounts.advancePaise)}`}
            </button>
          </div>
          <p className="text-xs text-[var(--muted)]">
            UPI, cards, and netbanking are processed securely by Razorpay. You will receive a confirmation after
            verification.
          </p>
        </motion.div>
      ) : null}
      </AnimatePresence>
    </div>
  );
}
