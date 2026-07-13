import { NextResponse } from "next/server";
import { sendInquiryToOwner, sendInquiryAutoReply, type InquiryData } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json() as InquiryData;

    // Validate required fields
    if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Send both emails in parallel
    const [ownerResult, autoReplyResult] = await Promise.allSettled([
      sendInquiryToOwner(body),
      sendInquiryAutoReply(body),
    ]);

    // Log any email failures but don't fail the request
    if (ownerResult.status === "rejected") {
      console.error("Failed to send inquiry to owner:", ownerResult.reason);
    }
    if (autoReplyResult.status === "rejected") {
      console.error("Failed to send auto-reply:", autoReplyResult.reason);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
