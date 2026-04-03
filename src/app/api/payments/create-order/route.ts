import { NextResponse } from "next/server";
import {
  computeAmounts,
  getBatchByKey,
  getPickupByKey,
  isValidEmail,
  isValidIndianPhone,
} from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { getRazorpay, getRazorpayKeyId } from "@/lib/razorpay-server";

export const runtime = "nodejs";

type Body = {
  fullName?: string;
  email?: string;
  phone?: string;
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

    if (!fullName || fullName.length < 2) return bad("Please enter your full name.");
    if (!email || !isValidEmail(email)) return bad("Please enter a valid email address.");
    if (!phone || !isValidIndianPhone(phone)) return bad("Please enter a valid Indian phone / WhatsApp number.");
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
    console.error("[payments/create-order]", e);
    return NextResponse.json({ error: "Could not create payment order." }, { status: 500 });
  }
}
