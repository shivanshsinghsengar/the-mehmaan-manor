import { NextResponse } from "next/server";
import { getBookingById, saveBooking } from "@/lib/bookings-store";
import { sendBookingConfirmationToGuest, sendNewBookingAlertToOwner } from "@/lib/email";

export async function POST(request: Request) {
  const { bookingId, paymentId } = await request.json();

  const booking = getBookingById(bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Mark as confirmed
  const confirmed = {
    ...booking,
    status: "CONFIRMED" as const,
    paymentId: paymentId || null,
  };
  saveBooking(confirmed);

  // Send emails in parallel — don't let email failures block the response
  Promise.allSettled([
    sendBookingConfirmationToGuest(confirmed),
    sendNewBookingAlertToOwner(confirmed),
  ]).then((results) => {
    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`Email ${i === 0 ? "guest confirmation" : "owner alert"} failed:`, r.reason);
      }
    });
  });

  return NextResponse.json({ success: true, booking: confirmed });
}
