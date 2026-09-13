// This file auto-generates /og-image.png using Next.js ImageResponse.
// No external service needed — it renders at build time and is served as a static asset.
// Size is 1200x630 which is the standard for Open Graph images (Twitter, Facebook, WhatsApp).

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "The Mehmaan Manor – Boutique Homestay in Gurugram";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a3328 0%, #0d1f1a 60%, #2e1e0c 100%)",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Top gold line */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "4px",
          background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
        }} />

        {/* Bottom gold line */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "4px",
          background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
        }} />

        {/* Subtle background glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.10) 0%, transparent 70%)",
        }} />

        {/* Ornament top */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "32px" }}>
          <div style={{ height: "1px", width: "80px", background: "rgba(201,168,76,0.45)" }} />
          <div style={{ color: "#c9a84c", fontSize: "18px" }}>◆</div>
          <div style={{ height: "1px", width: "80px", background: "rgba(201,168,76,0.45)" }} />
        </div>

        {/* Brand name */}
        <div style={{
          color: "#f5f0e8",
          fontSize: "62px",
          fontWeight: "300",
          letterSpacing: "0.06em",
          lineHeight: 1.1,
          textAlign: "center",
          marginBottom: "16px",
        }}>
          The Mehmaan Manor
        </div>

        {/* Tagline */}
        <div style={{
          color: "#c9a84c",
          fontSize: "22px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontFamily: "monospace",
          marginBottom: "48px",
        }}>
          Boutique Homestay · Gurugram
        </div>

        {/* Two property pills */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "48px" }}>
          {["Sector 57 · Sushant Lok", "Sector 39 · Near Medanta"].map((label) => (
            <div key={label} style={{
              padding: "10px 28px",
              border: "1px solid rgba(201,168,76,0.40)",
              color: "rgba(245,240,232,0.75)",
              fontSize: "16px",
              letterSpacing: "0.12em",
              fontFamily: "monospace",
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Bottom promise */}
        <div style={{
          color: "rgba(245,240,232,0.40)",
          fontSize: "16px",
          fontStyle: "italic",
          letterSpacing: "0.05em",
        }}>
          Come as a guest, leave as family.
        </div>

        {/* Ornament bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "32px" }}>
          <div style={{ height: "1px", width: "60px", background: "rgba(201,168,76,0.30)" }} />
          <div style={{ color: "rgba(201,168,76,0.45)", fontSize: "12px" }}>◆</div>
          <div style={{ height: "1px", width: "60px", background: "rgba(201,168,76,0.30)" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
