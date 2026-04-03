import { NextResponse } from "next/server";
import { confirmAdvancePaid } from "@/lib/confirm-booking";
import { getRazorpay } from "@/lib/razorpay-server";
import { verifyWebhookSignature } from "@/lib/razorpay-verify";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RazorpayPaymentEntity = {
  id?: string;
  order_id?: string;
  status?: string;
};

function extractPaymentEntity(payload: unknown): RazorpayPaymentEntity | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  const payWrap = p.payment;
  if (!payWrap || typeof payWrap !== "object") return null;
  const ent = (payWrap as Record<string, unknown>).entity;
  if (!ent || typeof ent !== "object") return null;
  return ent as RazorpayPaymentEntity;
}

function extractOrderEntityId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  const ord = p.order;
  if (!ord || typeof ord !== "object") return null;
  const ent = (ord as Record<string, unknown>).entity;
  if (!ent || typeof ent !== "object") return null;
  const id = (ent as Record<string, unknown>).id;
  return typeof id === "string" ? id : null;
}

async function resolvePaymentIdForOrder(orderId: string): Promise<string | null> {
  try {
    const rzp = getRazorpay();
    const data = await rzp.orders.fetchPayments(orderId);
    const items = data.items ?? [];
    const captured = items.find((x) => x.status === "captured");
    const authorized = items.find((x) => x.status === "authorized");
    const chosen = captured ?? authorized ?? items[items.length - 1];
    return typeof chosen?.id === "string" ? chosen.id : null;
  } catch (e) {
    console.error("[payments/webhook] orders.fetchPayments failed", orderId, e);
    return null;
  }
}

/**
 * Razorpay → HTTPS POST `YOUR_ORIGIN/api/payments/webhook`
 * Subscribed events (recommended): `payment.captured`, `payment.authorized`, `order.paid`.
 * Set `RAZORPAY_WEBHOOK_SECRET` to the secret shown for that webhook in the dashboard.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    console.error(
      "[payments/webhook] RAZORPAY_WEBHOOK_SECRET is not set. Add it from Razorpay Dashboard → Webhooks.",
    );
    return NextResponse.json({ error: "Webhook not configured on server" }, { status: 503 });
  }

  const raw = await request.text();
  const sig =
    request.headers.get("x-razorpay-signature") ?? request.headers.get("X-Razorpay-Signature");

  if (!verifyWebhookSignature(raw, sig)) {
    console.warn("[payments/webhook] Invalid X-Razorpay-Signature (check RAZORPAY_WEBHOOK_SECRET matches dashboard).");
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let parsed: { event?: string; payload?: unknown };
  try {
    parsed = JSON.parse(raw) as { event?: string; payload?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = parsed.event;
  if (event !== "payment.captured" && event !== "payment.authorized" && event !== "order.paid") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  let orderId: string | undefined;
  let paymentId: string | undefined;

  if (event === "payment.captured" || event === "payment.authorized") {
    const ent = extractPaymentEntity(parsed.payload);
    orderId = ent?.order_id;
    paymentId = ent?.id;
  } else if (event === "order.paid") {
    const oid = extractOrderEntityId(parsed.payload);
    orderId = oid ?? undefined;
  }

  if (!orderId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (!paymentId) {
    paymentId = (await resolvePaymentIdForOrder(orderId)) ?? undefined;
  }

  if (!paymentId) {
    if (event === "order.paid") {
      return NextResponse.json({ error: "Could not resolve payment for order" }, { status: 500 });
    }
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
