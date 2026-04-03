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

    const valid = verifyPaymentSignature(orderId, paymentId, signature);
    if (!valid) {
      return NextResponse.json({ error: "Invalid payment signature." }, { status: 400 });
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
