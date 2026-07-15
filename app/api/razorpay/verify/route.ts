/**
 * POST /api/razorpay/verify
 * Verifies Razorpay payment signature to confirm payment is authentic.
 * IMPORTANT: Never skip this step — without verification anyone could
 * fake a payment and get a booking confirmed.
 *
 * Razorpay signature = HMAC-SHA256(orderId + "|" + paymentId, keySecret)
 */

import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationToGuest, sendNewBookingAlertToOwner } from "@/lib/email";

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
    await request.json();

  // Verify signature
  const expectedSignature = createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.error("Razorpay signature mismatch — possible fraud attempt");
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  // Signature valid — confirm the booking
  const confirmed = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "CONFIRMED",
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    },
  });

  // Send emails (non-blocking)
  const emailData = {
    id: confirmed.id,
    bookingNumber: confirmed.bookingNumber,
    propertyId: confirmed.propertyId,
    propertyName: confirmed.propertyName,
    guestName: confirmed.guestName,
    guestEmail: confirmed.guestEmail,
    guestPhone: confirmed.guestPhone,
    checkIn: confirmed.checkIn,
    checkOut: confirmed.checkOut,
    nights: confirmed.nights,
    guests: confirmed.guests,
    baseAmount: confirmed.baseAmount,
    cleaningFee: confirmed.cleaningFee,
    taxes: confirmed.taxes,
    totalAmount: confirmed.totalAmount,
    status: "CONFIRMED" as const,
    paymentId: confirmed.paymentId,
    razorpayOrderId: confirmed.razorpayOrderId,
    specialRequests: confirmed.specialRequests,
    createdAt: confirmed.createdAt,
  };

  Promise.allSettled([
    sendBookingConfirmationToGuest(emailData),
    sendNewBookingAlertToOwner(emailData),
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === "rejected")
        console.error(`Email ${i} failed:`, r.reason);
    });
  });

  return NextResponse.json({ success: true, bookingNumber: confirmed.bookingNumber });
}
