import { prisma } from "@/lib/prisma";

export async function confirmAdvancePaid(params: {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: params.bookingId,
      razorpayOrderId: params.razorpayOrderId,
    },
  });
  if (!booking) {
    return { ok: false as const, error: "Booking not found or order does not match." };
  }
  if (booking.paymentStatus === "Advance Paid") {
    return { ok: true as const, bookingId: booking.id, alreadyConfirmed: true as const };
  }
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      paymentStatus: "Advance Paid",
      razorpayPaymentId: params.razorpayPaymentId,
    },
  });
  return { ok: true as const, bookingId: booking.id, alreadyConfirmed: false as const };
}
