import { NextResponse } from "next/server";
import { getBookingById, saveBooking } from "@/lib/bookings-store";

export async function POST(request: Request) {
  const { bookingId, paymentId } = await request.json();

  const booking = getBookingById(bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Mark as confirmed with payment ID
  const updated = {
    ...booking,
    status: "CONFIRMED" as const,
    paymentId,
  };
  saveBooking(updated);

  // In production: send confirmation email via Resend, WhatsApp via Twilio here

  return NextResponse.json({ success: true, booking: updated });
}
