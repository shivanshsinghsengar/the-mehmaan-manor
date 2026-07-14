import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInquiryToOwner, sendInquiryAutoReply, type InquiryData } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json() as InquiryData;

    if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Save to database
    await prisma.inquiry.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        property: body.property || "",
        dates: body.dates || "",
        message: body.message.trim(),
        status: "NEW",
        createdAt: new Date().toISOString(),
      },
    });

    // Send emails in parallel (non-blocking on failure)
    Promise.allSettled([
      sendInquiryToOwner(body),
      sendInquiryAutoReply(body),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === "rejected")
          console.error(`Email ${i === 0 ? "owner" : "auto-reply"} failed:`, r.reason);
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
