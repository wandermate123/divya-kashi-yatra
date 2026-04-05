export const PACKAGE_TOTAL_PER_PERSON_PAISE = 899_900;
export const ADVANCE_PER_PERSON_PAISE = 399_900;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Human-readable range from ISO date strings (YYYY-MM-DD), no timezone shift. */
export function formatBatchDateRange(isoStart: string, isoEnd: string): string {
  const [ys, ms, ds] = isoStart.split("-").map(Number);
  const [ye, me, de] = isoEnd.split("-").map(Number);
  const mName = (m: number) => MONTH_NAMES[m - 1] ?? "";
  if (ys === ye && ms === me) {
    return `${ds}–${de} ${mName(ms)} ${ys}`;
  }
  return `${ds} ${mName(ms)} ${ys} – ${de} ${mName(me)} ${ye}`;
}

/** Keys kept stable for existing bookings. Update start/end/labels when you publish new departures. */
export const BATCH_OPTIONS = [
  {
    key: "2026-04-10_2026-04-12",
    label: "10–12 April 2026",
    start: "2026-04-10",
    end: "2026-04-12",
  },
  {
    key: "2026-04-17_2026-04-19",
    label: "17–19 April 2026",
    start: "2026-04-17",
    end: "2026-04-19",
  },
  {
    key: "2026-04-24_2026-04-27",
    label: "24–27 April 2026",
    start: "2026-04-24",
    end: "2026-04-27",
  },
] as const;

export type BatchKey = (typeof BATCH_OPTIONS)[number]["key"];

export const PICKUP_OPTIONS = [
  { key: "delhi", label: "Delhi" },
  { key: "gurgaon", label: "Gurgaon" },
  { key: "noida", label: "Noida" },
] as const;

export type PickupKey = (typeof PICKUP_OPTIONS)[number]["key"];

export const GENDER_OPTIONS = [
  { key: "female", label: "Female" },
  { key: "male", label: "Male" },
  { key: "other", label: "Other" },
  { key: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export type GenderKey = (typeof GENDER_OPTIONS)[number]["key"];

export function getGenderByKey(key: string) {
  return GENDER_OPTIONS.find((g) => g.key === key);
}

export function isValidTravelerAge(age: number) {
  return Number.isInteger(age) && age >= 1 && age <= 120;
}

export function getBatchByKey(key: string) {
  return BATCH_OPTIONS.find((b) => b.key === key);
}

export function getPickupByKey(key: string) {
  return PICKUP_OPTIONS.find((p) => p.key === key);
}

export function computeAmounts(travelerCount: number) {
  const totalPackagePaise = PACKAGE_TOTAL_PER_PERSON_PAISE * travelerCount;
  const advancePaise = ADVANCE_PER_PERSON_PAISE * travelerCount;
  const balancePaise = totalPackagePaise - advancePaise;
  return { totalPackagePaise, advancePaise, balancePaise };
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidIndianPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return true;
  if (digits.length === 10 && /^[6-9]/.test(digits)) return true;
  return false;
}
