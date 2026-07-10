/**
 * WhatsApp settings API
 * GET  → returns current WhatsApp number
 * PUT  → updates WhatsApp number (admin only)
 */

declare global {
  // eslint-disable-next-line no-var
  var __waPhone: string | undefined;
}

if (!global.__waPhone) {
  global.__waPhone = "918828352311"; // default: Simran
}

export async function GET() {
  return Response.json({ phone: global.__waPhone });
}

export async function PUT(request: Request) {
  const { phone } = await request.json();
  if (!phone || typeof phone !== "string") {
    return Response.json({ error: "phone required" }, { status: 400 });
  }
  // Strip non-digits, ensure country code
  const cleaned = phone.replace(/\D/g, "");
  global.__waPhone = cleaned;
  return Response.json({ success: true, phone: cleaned });
}
