-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "idDocumentUrl" TEXT,
    "travelerCount" INTEGER NOT NULL,
    "batchKey" TEXT NOT NULL,
    "batchLabel" TEXT NOT NULL,
    "pickupKey" TEXT NOT NULL,
    "pickupLabel" TEXT NOT NULL,
    "advancePaidPaise" INTEGER NOT NULL,
    "totalPackagePaise" INTEGER NOT NULL,
    "balancePaise" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending_payment',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_razorpayPaymentId_key" ON "Booking"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "Booking_email_idx" ON "Booking"("email");

-- CreateIndex
CREATE INDEX "Booking_razorpayOrderId_idx" ON "Booking"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");
