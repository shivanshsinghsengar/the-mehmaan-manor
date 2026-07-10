"use client";

import { useEffect, useState } from "react";

export function WhatsAppButton() {
  const [phone, setPhone] = useState("8796568002"); // default
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    // Fetch the number from admin settings API
    fetch("/api/settings/whatsapp")
      .then((r) => r.json())
      .then((d) => { if (d.phone) setPhone(d.phone); })
      .catch(() => {}); // silently use default

    // Show after slight delay for polish
    const t = setTimeout(() => setVisible(true), 1200);
    // Stop pulse after 5s
    const p = setTimeout(() => setPulse(false), 5000);
    return () => { clearTimeout(t); clearTimeout(p); };
  }, []);

  const message = encodeURIComponent(
    "Hi! I'd like to know more about The Mehmaan Manor. Can you help me?"
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`
        fixed bottom-6 right-6 z-50 flex items-center justify-center
        w-14 h-14 rounded-full shadow-lg
        transition-all duration-500
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
        hover:scale-110 active:scale-95
        group
      `}
      style={{
        background: "linear-gradient(135deg, oklch(0.32 0.05 155) 0%, oklch(0.22 0.04 155) 100%)",
        boxShadow: "0 4px 20px oklch(0.32 0.05 155 / 0.35)",
      }}
    >
      {/* Pulse ring — matches forest green */}
      {pulse && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ background: "oklch(0.32 0.05 155)", opacity: 0.35 }}
        />
      )}

      {/* Gold ring on hover */}
      <span
        className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-gold transition-all duration-300"
        style={{ borderColor: "transparent" }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "oklch(0.75 0.12 85)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
      />

      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-7 h-7 relative z-10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.5L4 29l7.7-1.813A11.94 11.94 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z"
          fill="oklch(0.75 0.12 85)"
          opacity="0.15"
        />
        <path
          d="M16 4.5C10.201 4.5 5.5 9.201 5.5 15c0 2.22.648 4.288 1.764 6.023L5.5 27.5l6.63-1.74A11.46 11.46 0 0016 26.5c5.799 0 10.5-4.701 10.5-10.5S21.799 4.5 16 4.5z"
          fill="oklch(0.97 0.015 85)"
        />
        <path
          d="M21.5 18.8c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.49-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.22 1.36.19 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"
          fill="oklch(0.22 0.04 155)"
        />
      </svg>

      {/* Tooltip */}
      <span
        className="absolute right-16 bottom-1/2 translate-y-1/2 whitespace-nowrap px-3 py-1.5 text-xs font-medium
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          background: "oklch(0.22 0.04 155)",
          color: "oklch(0.97 0.015 85)",
          fontFamily: "var(--font-jetbrains), monospace",
        }}
      >
        Chat with us
      </span>
    </a>
  );
}
