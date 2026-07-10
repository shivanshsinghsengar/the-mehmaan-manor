import { NextResponse } from "next/server";

// In-memory booking store (replace with Prisma in production)
declare global {
  // eslint-disable-next-line no-var
  var __bookings: BookingRecord[] | undefined;
}

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

function generateBookingNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "MM-";
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      propertyId, propertyName, guestName, guestEmail, guestPhone,
      checkIn, checkOut, nights, guests, baseAmount, cleaningFee, taxes,
      totalAmount, specialRequests,
    } = body;

    // Validate required fields
    if (!propertyId || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking: BookingRecord = {
      id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      bookingNumber: generateBookingNumber(),
      propertyId, propertyName, guestName, guestEmail, guestPhone,
      checkIn, checkOut, nights, guests,
      baseAmount, cleaningFee, taxes, totalAmount,
      status: "PENDING_PAYMENT",
      paymentId: null,
      razorpayOrderId: null,
      specialRequests: specialRequests || "",
      createdAt: new Date().toISOString(),
    };

    saveBooking(booking);

    // In production: create Razorpay order here
    // const razorpay = new Razorpay({ key_id, key_secret });
    // const order = await razorpay.orders.create({ amount: totalAmount * 100, currency: "INR" });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      // razorpayOrderId: order.id,  ← uncomment when Razorpay is live
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
