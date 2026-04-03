import crypto from "crypto";
import Razorpay from "razorpay";

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Missing RAZORPAY_KEY_SECRET");
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/**
 * Validates `X-Razorpay-Signature` using the secret from the Razorpay **Webhook** setup
 * (Dashboard → Webhooks → your endpoint secret). This is not the same as `RAZORPAY_KEY_SECRET`.
 * Uses the same HMAC-SHA256 logic as the official Razorpay Node SDK.
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret || !signatureHeader?.trim()) return false;
  try {
    return Razorpay.validateWebhookSignature(rawBody, signatureHeader.trim(), secret);
  } catch {
    return false;
  }
}
