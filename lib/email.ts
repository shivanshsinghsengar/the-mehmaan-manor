/**
 * Email utility using Resend.
 * All email templates live here — keeps API routes clean.
 *
 * Setup: add RESEND_API_KEY and FROM_EMAIL to your environment variables.
 * Get a free key at https://resend.com (3,000 emails/month free).
 *
 * FROM_EMAIL must be a verified domain on Resend. While testing you can
 * use "onboarding@resend.dev" as the from address (sends to your own email only).
 */

import { Resend } from "resend";
import type { BookingRecord } from "@/lib/bookings-store";

// Lazy init — only instantiated when actually sending (not at module load time)
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = process.env.FROM_EMAIL || "onboarding@resend.dev";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "simran@mehmaanmanor.com";
const SITE_NAME = "The Mehmaan Manor";

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

        <!-- Header -->
        <tr>
          <td style="background:#1a3328;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:11px;color:#c9a84c;letter-spacing:4px;text-transform:uppercase;">The Mehmaan Manor</p>
            <p style="margin:8px 0 0;font-family:Georgia,serif;font-size:13px;color:rgba(240,235,224,0.6);letter-spacing:2px;">Gurugram · India</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#1a3328;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-family:Georgia,serif;font-size:11px;color:rgba(240,235,224,0.5);letter-spacing:1px;">
              "Come as a guest, leave as family."
            </p>
            <p style="margin:8px 0 0;font-family:monospace;font-size:10px;color:rgba(240,235,224,0.3);">
              © ${new Date().getFullYear()} The Mehmaan Manor · Gurugram, Haryana
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function heading(text: string) {
  return `<h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:28px;color:#1a3328;font-weight:400;">${text}</h1>`;
}

function subheading(text: string) {
  return `<p style="margin:0 0 24px;font-family:monospace;font-size:11px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">${text}</p>`;
}

function para(text: string) {
  return `<p style="margin:0 0 16px;font-size:15px;color:#3a3a3a;line-height:1.7;">${text}</p>`;
}

function divider() {
  return `<hr style="border:none;border-top:1px solid #e8e0d0;margin:24px 0;" />`;
}

function detail(label: string, value: string) {
  return `
  <tr>
    <td style="padding:8px 0;font-family:monospace;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;width:40%;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:#1a3328;font-weight:bold;">${value}</td>
  </tr>`;
}

function button(text: string, href: string) {
  return `
  <div style="text-align:center;margin:32px 0;">
    <a href="${href}" style="display:inline-block;background:#c9a84c;color:#1a1a1a;font-family:Georgia,serif;font-size:14px;font-weight:bold;padding:14px 36px;text-decoration:none;letter-spacing:1px;">
      ${text}
    </a>
  </div>`;
}

// ── Email: Booking Confirmation (to guest) ───────────────────────────────────

export async function sendBookingConfirmationToGuest(booking: BookingRecord) {
  if (!process.env.RESEND_API_KEY) return { skipped: true };

  const html = wrap(`
    ${subheading("Booking Confirmed")}
    ${heading("Your stay is confirmed.")}
    ${divider()}
    ${para(`Dear ${booking.guestName},`)}
    ${para(`Thank you for booking with The Mehmaan Manor. We're delighted to welcome you. Here are your booking details:`)}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      ${detail("Booking No.", booking.bookingNumber)}
      ${detail("Property", booking.propertyName)}
      ${detail("Check-in", new Date(booking.checkIn).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))}
      ${detail("Check-out", new Date(booking.checkOut).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))}
      ${detail("Nights", String(booking.nights))}
      ${detail("Guests", String(booking.guests))}
      ${detail("Total Paid", `₹${booking.totalAmount.toLocaleString("en-IN")}`)}
    </table>

    ${divider()}
    ${para("Simran will reach out on WhatsApp to share the exact address, check-in instructions, and any details you need before arrival.")}
    ${para("If you have any questions, call or WhatsApp us at <strong>+91 88283 52311</strong>.")}
    ${para(`<em style="color:#c9a84c;font-size:16px;">"Come as a guest, leave as family."</em>`)}
  `);

  return getResend()!.emails.send({
    from: FROM,
    to: booking.guestEmail,
    subject: `Booking Confirmed — ${booking.bookingNumber} · ${booking.propertyName}`,
    html,
  });
}

// ── Email: New Booking Alert (to owner) ─────────────────────────────────────

export async function sendNewBookingAlertToOwner(booking: BookingRecord) {
  if (!process.env.RESEND_API_KEY) return { skipped: true };

  const html = wrap(`
    ${subheading("New Booking")}
    ${heading("A new booking has been made.")}
    ${divider()}

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
      ${detail("Total", `₹${booking.totalAmount.toLocaleString("en-IN")}`)}
      ${detail("Status", booking.status)}
      ${booking.specialRequests ? detail("Special Requests", booking.specialRequests) : ""}
    </table>

    ${divider()}
    ${para(`Booked on: ${new Date(booking.createdAt).toLocaleString("en-IN")}`)}
  `);

  return getResend()!.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    subject: `New Booking: ${booking.guestName} · ${booking.propertyName} · ${booking.bookingNumber}`,
    html,
  });
}

// ── Email: Contact Form Inquiry (to owner) ───────────────────────────────────

export interface InquiryData {
  name: string;
  email: string;
  phone: string;
  property: string;
  dates: string;
  message: string;
}

export async function sendInquiryToOwner(data: InquiryData) {
  if (!process.env.RESEND_API_KEY) return { skipped: true };

  const propertyLabel = {
    "sushant-lok": "Sushant Lok",
    "jharsa-village": "Jharsa Village",
    "either": "Either works",
    "": "Not specified",
  }[data.property] || data.property;

  const html = wrap(`
    ${subheading("New Inquiry")}
    ${heading("Someone wants to stay.")}
    ${divider()}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      ${detail("Name", data.name)}
      ${detail("Email", data.email)}
      ${detail("Phone", data.phone)}
      ${detail("Property", propertyLabel)}
      ${data.dates ? detail("Preferred Dates", data.dates) : ""}
    </table>

    ${divider()}
    <p style="margin:0 0 8px;font-family:monospace;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Message</p>
    <p style="margin:0;font-size:15px;color:#3a3a3a;line-height:1.7;white-space:pre-wrap;">${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    ${divider()}
    ${para(`Reply directly to <a href="mailto:${data.email}" style="color:#c9a84c;">${data.email}</a> or call <strong>${data.phone}</strong>.`)}
  `);

  return getResend()!.emails.send({
    from: FROM,
    to: OWNER_EMAIL,
    reply_to: data.email,
    subject: `Inquiry from ${data.name} — ${propertyLabel}`,
    html,
  });
}

// ── Email: Inquiry Auto-reply (to guest) ─────────────────────────────────────

export async function sendInquiryAutoReply(data: InquiryData) {
  if (!process.env.RESEND_API_KEY) return { skipped: true };

  const html = wrap(`
    ${subheading("We received your inquiry")}
    ${heading(`Thank you, ${data.name}.`)}
    ${divider()}
    ${para("We've received your message and will get back to you within a few hours.")}
    ${para("In the meantime, feel free to reach us directly:")}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      ${detail("WhatsApp", "+91 88283 52311")}
      ${detail("Phone", "+91 88283 52311")}
      ${detail("Instagram", "@themehmaanmanor")}
    </table>

    ${divider()}
    ${para(`<em style="color:#c9a84c;font-size:16px;">"Come as a guest, leave as family."</em>`)}
  `);

  return getResend()!.emails.send({
    from: FROM,
    to: data.email,
    subject: `We got your inquiry — The Mehmaan Manor`,
    html,
  });
}
