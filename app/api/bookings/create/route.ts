import { NextResponse } from "next/server";
import { saveBooking, type BookingRecord } from "@/lib/bookings-store";
import { sendNewBookingAlertToOwner } from "@/lib/email";

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

    // Notify owner immediately on booking creation (before payment)
    sendNewBookingAlertToOwner(booking).catch((err) =>
      console.error("Owner alert email failed:", err)
    );

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
