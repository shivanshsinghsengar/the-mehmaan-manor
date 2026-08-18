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

  // Awaited — Vercel must not terminate before emails are sent
  try {
    await Promise.allSettled([
      sendBookingConfirmationToGuest(emailData),
      sendNewBookingAlertToOwner(emailData),
    ]);
  } catch (e) {
    console.error("Email send error:", e);
  }

  return NextResponse.json({ success: true, booking: confirmed });
}
