import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
      totalAmount, specialRequests, status, paymentId,
    } = body;

    if (!propertyId || !guestName || !guestEmail || !guestPhone || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),
        propertyId: String(propertyId),
        propertyName: propertyName || "",
        guestName,
        guestEmail,
        guestPhone,
        checkIn,
        checkOut,
        nights: Number(nights) || 1,
        guests: Number(guests) || 1,
        baseAmount: Number(baseAmount) || 0,
        cleaningFee: Number(cleaningFee) || 0,
        taxes: Number(taxes) || 0,
        totalAmount: Number(totalAmount) || 0,
        status: status || "PENDING_PAYMENT",
        paymentId: paymentId || null,
        specialRequests: specialRequests || "",
        createdAt: new Date().toISOString(),
      },
    });

    // Notify owner (non-blocking)
    sendNewBookingAlertToOwner({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      propertyId: booking.propertyId,
      propertyName: booking.propertyName,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      guests: booking.guests,
      baseAmount: booking.baseAmount,
      cleaningFee: booking.cleaningFee,
      taxes: booking.taxes,
      totalAmount: booking.totalAmount,
      status: booking.status as "PENDING_PAYMENT",
      paymentId: booking.paymentId,
      razorpayOrderId: booking.razorpayOrderId,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
