import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  computeAmounts,
  getBatchByKey,
  getGenderByKey,
  getPickupByKey,
  isValidEmail,
  isValidIndianPhone,
  isValidTravelerAge,
} from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { getRazorpay, getRazorpayKeyId } from "@/lib/razorpay-server";

export const runtime = "nodejs";

function isRazorpaySdkError(e: unknown): e is { statusCode?: number; error?: { description?: string; code?: string } } {
  return typeof e === "object" && e !== null && ("statusCode" in e || "error" in e);
}

function createOrderErrorResponse(e: unknown) {
  console.error("[payments/create-order]", e);

  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (["P1000", "P1001", "P1002", "P1003", "P1010", "P1017"].includes(e.code)) {
      return NextResponse.json(
        {
          error:
            "Cannot reach the database. Check DATABASE_URL / DIRECT_URL on the server (and SSL / IP allowlists).",
        },
        { status: 503 },
      );
    }
    if (e.code === "P2021") {
      return NextResponse.json(
        { error: "Database tables are missing. Run `npm run db:migrate` (or redeploy so migrations run)." },
        { status: 503 },
      );
    }
    if (e.code === "P2022") {
      return NextResponse.json(
        { error: "Database schema is out of date (missing columns). Run `npx prisma migrate deploy` on the server." },
        { status: 503 },
      );
    }
  }

  if (e instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json(
      {
        error:
          "Database connection failed. Supabase: DATABASE_URL = :6543 + ?pgbouncer=true; DIRECT_URL = :5432 session pooler (same host). Local: set both to the same URL.",
      },
      { status: 503 },
    );
  }

  if (e instanceof Error && /Missing RAZORPAY_KEY_(ID|SECRET)/.test(e.message)) {
    return NextResponse.json({ error: "Razorpay is not configured (set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)." }, { status: 503 });
  }

  if (isRazorpaySdkError(e)) {
    const sc = e.statusCode;
    if (sc === 401 || sc === 403) {
      return NextResponse.json(
        {
          error:
            "Razorpay rejected authentication. Use test keys in test mode (or live keys in live mode) and verify RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET.",
        },
        { status: 502 },
      );
    }
    const desc = e.error && typeof e.error === "object" && "description" in e.error ? String((e.error as { description: string }).description) : "";
    if (sc === 400 && desc) {
      return NextResponse.json({ error: `Razorpay: ${desc.slice(0, 200)}` }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "Could not create payment order." }, { status: 500 });
}

type Body = {
  fullName?: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: string;
  termsAccepted?: boolean;
  idDocumentUrl?: string;
  travelerCount?: number;
  batchKey?: string;
  pickupKey?: string;
};

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const idRaw = body.idDocumentUrl?.trim();
    const idDocumentUrl =
      idRaw && /^https?:\/\//i.test(idRaw) ? idRaw : null;
    const travelerCount = body.travelerCount;
    const batchKey = body.batchKey?.trim();
    const pickupKeyRaw = body.pickupKey?.trim().toLowerCase();
    const age = body.age;
    const genderKey = body.gender?.trim().toLowerCase();
    const termsAccepted = body.termsAccepted === true;

    if (!fullName || fullName.length < 2) return bad("Please enter your full name.");
    if (!email || !isValidEmail(email)) return bad("Please enter a valid email address.");
    if (!phone || !isValidIndianPhone(phone)) return bad("Please enter a valid Indian phone / WhatsApp number.");
    if (typeof age !== "number" || !isValidTravelerAge(age)) return bad("Please enter a valid age (1–120).");
    if (!genderKey) return bad("Please select gender.");
    const genderRecord = getGenderByKey(genderKey);
    if (!genderRecord) return bad("Invalid gender selection.");
    if (!termsAccepted) return bad("You must accept the terms and conditions to book.");

    if (!batchKey) return bad("Please select a travel batch.");
    const batch = getBatchByKey(batchKey);
    if (!batch) return bad("Invalid batch selection.");

    if (!pickupKeyRaw) return bad("Please select a pickup location.");
    const pickup = getPickupByKey(pickupKeyRaw);
    if (!pickup) return bad("Invalid pickup location.");

    if (
      typeof travelerCount !== "number" ||
      !Number.isInteger(travelerCount) ||
      travelerCount < 1 ||
      travelerCount > 50
    ) {
      return bad("Traveler count must be between 1 and 50.");
    }

    const { totalPackagePaise, advancePaise, balancePaise } = computeAmounts(travelerCount);

    const booking = await prisma.booking.create({
      data: {
        fullName,
        email,
        phone,
        age,
        gender: genderRecord.key,
        termsAccepted: true,
        idDocumentUrl,
        travelerCount,
        batchKey: batch.key,
        batchLabel: batch.label,
        pickupKey: pickup.key,
        pickupLabel: pickup.label,
        advancePaidPaise: advancePaise,
        totalPackagePaise,
        balancePaise,
        paymentStatus: "pending_payment",
      },
    });

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: advancePaise,
      currency: "INR",
      receipt: booking.id.slice(0, 36),
      notes: {
        bookingId: booking.id,
        package: "Divya Kashi Yatra",
        pickup: pickup.label,
      },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { razorpayOrderId: order.id },
    });

    return NextResponse.json({
      bookingId: booking.id,
      orderId: order.id,
      amount: advancePaise,
      currency: order.currency ?? "INR",
      keyId: getRazorpayKeyId(),
      balancePaise,
      totalPackagePaise,
    });
  } catch (e) {
    return createOrderErrorResponse(e);
  }
}
