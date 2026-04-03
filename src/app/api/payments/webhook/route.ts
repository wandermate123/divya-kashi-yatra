import { NextResponse } from "next/server";
import { confirmAdvancePaid } from "@/lib/confirm-booking";
import { verifyWebhookSignature } from "@/lib/razorpay-verify";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RazorpayPaymentEntity = {
  id?: string;
  order_id?: string;
  status?: string;
};

function extractPayment(payload: unknown): RazorpayPaymentEntity | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  const payWrap = p.payment;
  if (!payWrap || typeof payWrap !== "object") return null;
  const ent = (payWrap as Record<string, unknown>).entity;
  if (!ent || typeof ent !== "object") return null;
  return ent as RazorpayPaymentEntity;
}

export async function POST(request: Request) {
  const raw = await request.text();
  const sig =
    request.headers.get("x-razorpay-signature") ??
    request.headers.get("X-Razorpay-Signature");

  if (!verifyWebhookSignature(raw, sig)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let parsed: { event?: string; payload?: unknown };
  try {
    parsed = JSON.parse(raw) as { event?: string; payload?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = parsed.event;
  if (event !== "payment.captured" && event !== "order.paid") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const payment = extractPayment(parsed.payload);
  const orderId = payment?.order_id;
  const paymentId = payment?.id;
  if (!orderId || !paymentId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const booking = await prisma.booking.findFirst({
    where: { razorpayOrderId: orderId },
  });
  if (!booking) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const result = await confirmAdvancePaid({
    bookingId: booking.id,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
