import { NextResponse } from "next/server";
import { getAllBookings, saveBooking, type BookingRecord } from "@/lib/bookings-store";

// GET /api/admin/bookings — list all bookings
export async function GET() {
  const bookings = getAllBookings().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json({ bookings });
}

// PATCH /api/admin/bookings — update status or add note
export async function PATCH(request: Request) {
  const { id, status, note } = await request.json();

  const bookings = getAllBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const updated: BookingRecord = {
    ...booking,
    ...(status ? { status } : {}),
    ...(note !== undefined ? { specialRequests: booking.specialRequests ? `${booking.specialRequests}\n---\n${note}` : note } : {}),
  };

  saveBooking(updated);
  return NextResponse.json({ booking: updated });
}
