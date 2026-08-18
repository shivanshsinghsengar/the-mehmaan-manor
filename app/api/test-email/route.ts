import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  const owner = process.env.OWNER_EMAIL;

  if (!pass) {
    return NextResponse.json({ error: "GMAIL_APP_PASSWORD not set", user, owner });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    const result = await transporter.sendMail({
      from: `"The Mehmaan Manor" <${user}>`,
      to: owner,
      subject: "✅ Email Test — The Mehmaan Manor",
      text: "Gmail SMTP is working correctly. Emails will be sent for all bookings.",
    });

    return NextResponse.json({ success: true, messageId: result.messageId, to: owner });
  } catch (err: unknown) {
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : "Unknown error",
      user,
      passLength: pass.length,
      owner
    }, { status: 500 });
  }
}
