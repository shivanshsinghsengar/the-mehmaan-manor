import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationToGuest, sendNewBookingAlertToOwner } from "@/lib/email";

export async function POST(request: Request) {
  const { bookingId, paymentId } = await request.json();

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const confirmed = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED", paymentId: paymentId || null },
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
      if (r.status === "rejected") console.error(`Email ${i} failed:`, r.reason);
    });
  });

  return NextResponse.json({ success: true, booking: confirmed });
}
