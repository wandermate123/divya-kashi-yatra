import { NextResponse } from "next/server";
import { confirmAdvancePaid } from "@/lib/confirm-booking";
import { verifyPaymentSignature } from "@/lib/razorpay-verify";

export const runtime = "nodejs";

type Body = {
  bookingId?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const bookingId = body.bookingId?.trim();
    const orderId = body.razorpay_order_id?.trim();
    const paymentId = body.razorpay_payment_id?.trim();
    const signature = body.razorpay_signature?.trim();

    if (!bookingId || !orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment verification fields." }, { status: 400 });
    }

    let valid: boolean;
    try {
      valid = verifyPaymentSignature(orderId, paymentId, signature);
    } catch {
      return NextResponse.json(
        { error: "Payment verification is not configured (missing RAZORPAY_KEY_SECRET)." },
        { status: 503 },
      );
    }
    if (!valid) {
      return NextResponse.json(
        {
          error:
            "Invalid payment signature. Confirm RAZORPAY_KEY_SECRET matches the key used for RAZORPAY_KEY_ID (same test/live mode as the dashboard).",
        },
        { status: 400 },
      );
    }

    const result = await confirmAdvancePaid({
      bookingId,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      alreadyConfirmed: "alreadyConfirmed" in result ? result.alreadyConfirmed : false,
    });
  } catch (e) {
    console.error("[payments/verify]", e);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
