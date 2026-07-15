/**
 * POST /api/razorpay/order
 * Creates a Razorpay order server-side.
 * Razorpay requires orders to be created on the server — never from the browser.
 *
 * Env vars needed:
 *   RAZORPAY_KEY_ID      — your Razorpay Key ID (rzp_test_... or rzp_live_...)
 *   RAZORPAY_KEY_SECRET  — your Razorpay Key Secret
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
  }

  try {
    const { bookingId } = await request.json();

    // Fetch booking from DB
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Create Razorpay order via REST API
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: Math.round(booking.totalAmount * 100), // paise
        currency: "INR",
        receipt: booking.bookingNumber,
        notes: {
          bookingId: booking.id,
          guestName: booking.guestName,
          property: booking.propertyName,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Razorpay order error:", err);
      return NextResponse.json({ error: "Failed to create payment order" }, { status: 502 });
    }

    const order = await response.json();

    // Save the Razorpay order ID to the booking
    await prisma.booking.update({
      where: { id: bookingId },
      data: { razorpayOrderId: order.id },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // send public key to frontend
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
