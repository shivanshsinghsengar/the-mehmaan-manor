/**
 * Email utility using Gmail SMTP via Nodemailer.
 * Permanent solution — no domain verification needed.
 *
 * Env vars needed (set in Vercel + .env.local):
 *   GMAIL_USER=shivansh99pp@gmail.com
 *   GMAIL_APP_PASSWORD=blyy uqco citv cvvc   (16-char App Password, spaces optional)
 *   OWNER_EMAIL=shivanshsingengar8@gmail.com
 */

import nodemailer from "nodemailer";
import type { BookingRecord } from "@/lib/bookings-store";

const OWNER_EMAIL = process.env.OWNER_EMAIL || "shivanshsingengar8@gmail.com";
const GMAIL_USER  = process.env.GMAIL_USER  || "shivansh99pp@gmail.com";
const SITE_NAME   = "The Mehmaan Manor";

function getTransporter() {
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (!pass) return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass },
  });
}

// ── Shared HTML wrapper ──────────────────────────────────────────────────────

function wrap(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${SITE_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">
        <tr>
          <td style="background:#1a3328;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:11px;color:#c9a84c;letter-spacing:4px;text-transform:uppercase;">The Mehmaan Manor</p>
            <p style="margin:8px 0 0;font-family:Georgia,serif;font-size:13px;color:rgba(240,235,224,0.6);letter-spacing:2px;">Gurugram · India</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">${body}</td>
        </tr>
        <tr>
          <td style="background:#1a3328;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:11px;color:rgba(240,235,224,0.5);letter-spacing:1px;">"Come as a guest, leave as family."</p>
            <p style="margin:8px 0 0;font-family:monospace;font-size:10px;color:rgba(240,235,224,0.3);">© ${new Date().getFullYear()} The Mehmaan Manor · Gurugram, Haryana</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function detail(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 0;font-family:monospace;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;width:40%;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:#1a3328;font-weight:bold;">${value}</td>
  </tr>`;
}

// ── Guest Booking Confirmation ───────────────────────────────────────────────

export async function sendBookingConfirmationToGuest(booking: BookingRecord) {
  const transporter = getTransporter();
  if (!transporter) { console.warn("Email skipped: GMAIL_APP_PASSWORD not set"); return { skipped: true }; }

  const html = wrap(`
    <p style="margin:0 0 4px;font-family:monospace;font-size:11px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">Booking Confirmed</p>
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;color:#1a3328;font-weight:400;">Your stay is confirmed.</h1>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:0 0 24px;" />
    <p style="margin:0 0 16px;font-size:15px;color:#3a3a3a;line-height:1.7;">Dear ${booking.guestName},</p>
    <p style="margin:0 0 16px;font-size:15px;color:#3a3a3a;line-height:1.7;">Thank you for booking with The Mehmaan Manor. Here are your booking details:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      ${detail("Booking No.", booking.bookingNumber)}
      ${detail("Property", booking.propertyName)}
      ${detail("Check-in", new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))}
      ${detail("Check-out", new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))}
      ${detail("Nights", String(booking.nights))}
      ${detail("Guests", String(booking.guests))}
      ${detail("Total Paid", "₹" + booking.totalAmount.toLocaleString("en-IN"))}
    </table>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;" />
    <p style="margin:0 0 16px;font-size:15px;color:#3a3a3a;line-height:1.7;">Simran will reach out on WhatsApp with check-in instructions before your arrival.</p>
    <p style="margin:0 0 16px;font-size:15px;color:#3a3a3a;line-height:1.7;">Questions? Call or WhatsApp: <strong>+91 88283 52311</strong></p>
    <p style="margin:0;font-size:16px;color:#c9a84c;font-style:italic;">"Come as a guest, leave as family."</p>
  `);

  return transporter.sendMail({
    from: `"The Mehmaan Manor" <${GMAIL_USER}>`,
    to: booking.guestEmail,
    subject: `Booking Confirmed — ${booking.bookingNumber} · ${booking.propertyName}`,
    html,
  });
}

// ── Owner Booking Alert ──────────────────────────────────────────────────────

export async function sendNewBookingAlertToOwner(booking: BookingRecord) {
  const transporter = getTransporter();
  if (!transporter) { console.warn("Email skipped: GMAIL_APP_PASSWORD not set"); return { skipped: true }; }

  const html = wrap(`
    <p style="margin:0 0 4px;font-family:monospace;font-size:11px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">New Booking</p>
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;color:#1a3328;font-weight:400;">A new booking has been made.</h1>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:0 0 24px;" />
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      ${detail("Booking No.", booking.bookingNumber)}
      ${detail("Guest", booking.guestName)}
      ${detail("Email", booking.guestEmail)}
      ${detail("Phone", booking.guestPhone)}
      ${detail("Property", booking.propertyName)}
      ${detail("Check-in", booking.checkIn)}
      ${detail("Check-out", booking.checkOut)}
      ${detail("Nights", String(booking.nights))}
      ${detail("Guests", String(booking.guests))}
      ${detail("Total", "₹" + booking.totalAmount.toLocaleString("en-IN"))}
      ${detail("Status", booking.status)}
      ${booking.specialRequests ? detail("Special Requests", booking.specialRequests) : ""}
    </table>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;" />
    <p style="margin:0;font-size:14px;color:#888;">Booked on: ${new Date(booking.createdAt).toLocaleString("en-IN")}</p>
  `);

  return transporter.sendMail({
    from: `"The Mehmaan Manor" <${GMAIL_USER}>`,
    to: OWNER_EMAIL,
    subject: `🏠 New Booking: ${booking.guestName} · ${booking.propertyName} · ${booking.bookingNumber}`,
    html,
  });
}

// ── Inquiry to Owner ─────────────────────────────────────────────────────────

export interface InquiryData {
  name: string;
  email: string;
  phone: string;
  property: string;
  dates: string;
  message: string;
}

export async function sendInquiryToOwner(data: InquiryData) {
  const transporter = getTransporter();
  if (!transporter) { console.warn("Email skipped: GMAIL_APP_PASSWORD not set"); return { skipped: true }; }

  const propertyLabel: Record<string, string> = {
    "sushant-lok": "Sector 57 — Sushant Lok",
    "jharsa-village": "Sector 39 — Jharsa Village",
    "either": "Either works",
    "": "Not specified",
  };

  const html = wrap(`
    <p style="margin:0 0 4px;font-family:monospace;font-size:11px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">New Inquiry</p>
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;color:#1a3328;font-weight:400;">Someone wants to stay.</h1>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:0 0 24px;" />
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      ${detail("Name", data.name)}
      ${detail("Email", data.email)}
      ${detail("Phone", data.phone)}
      ${detail("Property", propertyLabel[data.property] || data.property || "Not specified")}
      ${data.dates ? detail("Dates", data.dates) : ""}
    </table>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;" />
    <p style="margin:0 0 8px;font-family:monospace;font-size:11px;color:#888;text-transform:uppercase;">Message</p>
    <p style="margin:0;font-size:15px;color:#3a3a3a;line-height:1.7;white-space:pre-wrap;">${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;" />
    <p style="margin:0;font-size:14px;color:#3a3a3a;">Reply to: <a href="mailto:${data.email}" style="color:#c9a84c;">${data.email}</a> · ${data.phone}</p>
  `);

  return transporter.sendMail({
    from: `"The Mehmaan Manor" <${GMAIL_USER}>`,
    to: OWNER_EMAIL,
    replyTo: data.email,
    subject: `Inquiry from ${data.name} — ${propertyLabel[data.property] || data.property}`,
    html,
  });
}

// ── Inquiry Auto-reply to Guest ───────────────────────────────────────────────

export async function sendInquiryAutoReply(data: InquiryData) {
  const transporter = getTransporter();
  if (!transporter) { console.warn("Email skipped: GMAIL_APP_PASSWORD not set"); return { skipped: true }; }

  const html = wrap(`
    <p style="margin:0 0 4px;font-family:monospace;font-size:11px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">We received your inquiry</p>
    <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-size:28px;color:#1a3328;font-weight:400;">Thank you, ${data.name}.</h1>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:0 0 24px;" />
    <p style="margin:0 0 16px;font-size:15px;color:#3a3a3a;line-height:1.7;">We've received your message and will get back to you within a few hours.</p>
    <p style="margin:0 0 16px;font-size:15px;color:#3a3a3a;line-height:1.7;">In the meantime, reach us directly:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      ${detail("WhatsApp", "+91 88283 52311")}
      ${detail("Phone", "+91 88283 52311")}
      ${detail("Instagram", "@themehmaanmanor")}
    </table>
    <hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;" />
    <p style="margin:0;font-size:16px;color:#c9a84c;font-style:italic;">"Come as a guest, leave as family."</p>
  `);

  return transporter.sendMail({
    from: `"The Mehmaan Manor" <${GMAIL_USER}>`,
    to: data.email,
    subject: `We got your inquiry — The Mehmaan Manor`,
    html,
  });
}
