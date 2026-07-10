/**
 * In-memory booking store.
 * Shared between /api/bookings/create and /api/bookings/confirm routes.
 * Replace with Prisma in production.
 */

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  baseAmount: number;
  cleaningFee: number;
  taxes: number;
  totalAmount: number;
  status: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED";
  paymentId: string | null;
  razorpayOrderId: string | null;
  specialRequests: string;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __bookings: BookingRecord[] | undefined;
}

if (!global.__bookings) global.__bookings = [];

export function getAllBookings(): BookingRecord[] {
  return global.__bookings || [];
}

export function getBookingById(id: string): BookingRecord | undefined {
  return (global.__bookings || []).find((b) => b.id === id);
}

export function saveBooking(b: BookingRecord) {
  if (!global.__bookings) global.__bookings = [];
  const idx = global.__bookings.findIndex((x) => x.id === b.id);
  if (idx >= 0) global.__bookings[idx] = b;
  else global.__bookings.push(b);
}
