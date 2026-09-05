"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, MapPin, Users,
  Calendar, IndianRupee, Phone, MessageCircle, Shield
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  name: string;
  slug: string;
  address: string;
  baseRate: number;
  weekendRate: number;
  cleaningFee: number;
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;
}

type Step = 1 | 2 | 3 | 4;

// Room types config — same as property page
const ROOM_TYPES: Record<string, {
  key: string; label: string; shortLabel: string;
  baseRate: number; weekendRate: number; maxGuests: number; description: string;
}[]> = {
  "jharsa-village": [
    { key: "1rk", shortLabel: "1RK Studio", label: "1RK Studio",
      baseRate: 1999, weekendRate: 2299, maxGuests: 2,
      description: "Compact studio — perfect for solo travelers & couples." },
    { key: "2bhk", shortLabel: "2BHK Apartment", label: "2BHK Apartment",
      baseRate: 2999, weekendRate: 3299, maxGuests: 5,
      description: "Spacious 2-bedroom — ideal for families & groups." },
  ],
};

function calcNights(from: string, to: string) {
  if (!from || !to) return 0;
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function isWeekend(dateStr: string) {
  const d = new Date(dateStr).getDay();
  return d === 0 || d === 5 || d === 6;
}

function calcPriceFromRates(baseRate: number, weekendRate: number, cleaningFee: number, checkIn: string, checkOut: string) {
  const nights = calcNights(checkIn, checkOut);
  if (!nights) return { subtotal: 0, nights: 0, cleaningFee: 0, taxes: 0, total: 0, rate: baseRate };
  const rate = isWeekend(checkIn) ? weekendRate : baseRate;
  const subtotal = rate * nights;
  const taxes = Math.round(subtotal * 0.18);
  return { subtotal, nights, cleaningFee, taxes, total: subtotal + cleaningFee + taxes, rate };
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

declare global {
  interface Window {
    Razorpay: new (opts: object) => { open(): void };
  }
}

export default function BookPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  const [step, setStep] = useState<Step>(1);
  const [propId, setPropId] = useState("");
  const [selectedRoomKey, setSelectedRoomKey] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [form, setForm] = useState({ name: "", email: "", phone: "", requests: "" });
  const [booking, setBooking] = useState<{ bookingNumber: string; bookingId: string } | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  // Fetch properties from DB on mount + read query params for pre-fill
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preProperty = params.get("property");
    const preCheckIn = params.get("checkIn");
    const preCheckOut = params.get("checkOut");

    fetch("/api/properties")
      .then((r) => r.json())
      .then((data: Property[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data);
          // Pre-fill from query params if provided, else default to first
          if (preProperty) {
            const found = data.find((p) => p.id === preProperty || p.slug === preProperty);
            setPropId(found?.id ?? data[0].id);
          } else {
            setPropId(data[0].id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setPropertiesLoading(false));

    if (preCheckIn) setCheckIn(preCheckIn);
    if (preCheckOut) setCheckOut(preCheckOut);
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  const prop = properties.find((p) => p.id === propId);
  
  // Room types for selected property
  const roomTypes = prop ? (ROOM_TYPES[prop.slug] ?? null) : null;
  const selectedRoom = roomTypes?.find((r) => r.key === selectedRoomKey) ?? null;

  // Auto-select first room type when property changes
  useEffect(() => {
    if (roomTypes && roomTypes.length > 0) {
      setSelectedRoomKey(roomTypes[0].key);
    } else {
      setSelectedRoomKey(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propId]);

  // Effective rates — use room type rates if selected, else property DB rates
  const effectiveBaseRate = selectedRoom?.baseRate ?? prop?.baseRate ?? 0;
  const effectiveWeekendRate = selectedRoom?.weekendRate ?? prop?.weekendRate ?? 0;
  const effectiveMaxGuests = selectedRoom?.maxGuests ?? prop?.maxGuests ?? 1;
  const effectiveCleaningFee = prop?.cleaningFee ?? 0;

  const pricing = prop
    ? calcPriceFromRates(effectiveBaseRate, effectiveWeekendRate, effectiveCleaningFee, checkIn, checkOut)
    : { subtotal: 0, nights: 0, cleaningFee: 0, taxes: 0, total: 0, rate: 0 };

  const today = new Date().toISOString().split("T")[0];
  const canStep1 = propId && checkIn && checkOut && pricing.nights > 0 && guests >= 1;
  const canStep2 = form.name.trim() && form.email.trim() && form.phone.trim();

  // Booking property name includes room type if applicable
  const bookingPropertyName = selectedRoom
    ? `${prop?.name ?? ""} — ${selectedRoom.label}`
    : prop?.name ?? "";

  // Create booking + trigger payment
  const handlePay = async () => {
    if (!prop) return;
    setError("");
    setPaying(true);
    try {
      // 1. Create booking record in DB
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: propId,
          propertyName: bookingPropertyName,
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
          checkIn, checkOut,
          nights: pricing.nights,
          guests,
          baseAmount: pricing.subtotal,
          cleaningFee: pricing.cleaningFee,
          taxes: pricing.taxes,
          totalAmount: pricing.total,
          specialRequests: form.requests,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error + (data.detail ? `: ${data.detail}` : ""));

      // 2. Create Razorpay order server-side
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: data.bookingId }),
      });
      const orderData = await orderRes.json();

      // 3. If Razorpay not configured → demo mode (skip payment)
      if (orderRes.status === 503 || !orderData.orderId) {
        await fetch("/api/bookings/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: data.bookingId, paymentId: "DEMO" }),
        });
        setBooking({ bookingNumber: data.bookingNumber, bookingId: data.bookingId });
        setStep(4);
        setPaying(false);
        return;
      }

      // 4. Open Razorpay checkout modal
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "The Mehmaan Manor",
        description: `${prop.name} · ${pricing.nights} night${pricing.nights > 1 ? "s" : ""}`,
        order_id: orderData.orderId,
        prefill: {
          name: form.name,
          email: form.email,
          contact: `+91${form.phone}`,
        },
        theme: { color: "#c9a84c" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // 5. Verify signature on server
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: data.bookingId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setBooking({ bookingNumber: data.bookingNumber, bookingId: data.bookingId });
            setStep(4);
          } else {
            setError("Payment verification failed. Please contact us.");
          }
          setPaying(false);
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            setError("Payment was cancelled. Your booking is saved — try again when ready.");
          },
        },
      });
      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Navigation />
      <main id="main-content" className="pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-forest/60 hover:text-forest text-sm mb-6 transition-colors">
              <ArrowLeft size={14} /> Back to home
            </Link>
            <h1 className="font-display text-forest mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Reserve Your Stay
            </h1>
            <p className="text-ink/60">Book directly with us — no middlemen, no hidden fees.</p>
          </div>

          {/* Step indicator */}
          {step < 4 && (
            <div className="flex items-center gap-0 mb-10">
              {[
                { n: 1, label: "Dates" },
                { n: 2, label: "Your Info" },
                { n: 3, label: "Review" },
              ].map(({ n, label }, i) => (
                <div key={n} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                      step > n ? "bg-forest text-cream" :
                      step === n ? "bg-gold text-ink" :
                      "bg-neutral-200 text-ink/40"
                    )}>
                      {step > n ? <Check size={14} /> : n}
                    </div>
                    <span className={cn(
                      "text-xs mt-1.5 font-medium",
                      step === n ? "text-forest" : "text-ink/40"
                    )}>{label}</span>
                  </div>
                  {i < 2 && <div className={cn("flex-1 h-0.5 mx-3 mb-4", step > n ? "bg-forest" : "bg-neutral-200")} />}
                </div>
              ))}
            </div>
          )}

          <div className="bg-white border border-forest/8 rounded-2xl overflow-hidden shadow-sm">

            {/* ── STEP 1: Property + Dates ── */}
            {step === 1 && (
              <div className="p-8 space-y-7">
                <h2 className="font-display text-xl text-forest">Choose your home & dates</h2>

                {/* Property selector — fully dynamic */}
                {propertiesLoading ? (
                  <div className="flex items-center justify-center py-8 gap-3 text-ink/50">
                    <div className="w-5 h-5 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-sm">Loading properties…</span>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="py-8 text-center text-ink/50 font-mono text-sm">
                    No properties available at the moment.
                  </div>
                ) : (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {properties.map((p) => (
                      <button key={p.id} onClick={() => setPropId(p.id)}
                        className={cn(
                          "text-left p-5 border-2 transition-all",
                          propId === p.id ? "border-forest bg-forest/5" : "border-neutral-200 hover:border-neutral-400"
                        )}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-display text-lg text-forest">{p.name}</p>
                          {propId === p.id && <Check size={16} className="text-forest mt-1" />}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-ink/50 font-mono mb-3">
                          <MapPin size={11} /> {p.address}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-forest font-medium">
                            from {fmt(ROOM_TYPES[p.slug]?.[0]?.baseRate ?? p.baseRate)}
                            <span className="text-ink/40 text-xs">/night</span>
                          </span>
                          <span className="text-ink/40 text-xs">·</span>
                          <span className="text-ink/60 flex items-center gap-1">
                            <Users size={11} /> max {p.maxGuests}
                          </span>
                        </div>
                        {ROOM_TYPES[p.slug] && (
                          <p className="text-xs font-mono text-gold mt-2">
                            {ROOM_TYPES[p.slug].map(r => r.shortLabel).join(" · ")} available
                          </p>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Room type selector — shown when property has multiple room types */}
                  {prop && roomTypes && (
                    <div className="border border-forest/20 bg-forest/5 p-4 space-y-3">
                      <p className="text-xs font-mono text-ink/50 uppercase">Select Room Type</p>
                      <div className="grid grid-cols-2 gap-3">
                        {roomTypes.map((room) => (
                          <button
                            key={room.key}
                            onClick={() => { setSelectedRoomKey(room.key); setGuests(Math.min(guests, room.maxGuests)); }}
                            className={cn(
                              "p-4 border-2 text-left transition-all",
                              selectedRoomKey === room.key
                                ? "border-forest bg-forest/5"
                                : "border-neutral-200 hover:border-forest/50"
                            )}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-display text-base text-forest">{room.shortLabel}</p>
                              {selectedRoomKey === room.key && <Check size={14} className="text-forest mt-0.5" />}
                            </div>
                            <p className="text-xs text-ink/60 mb-2">{room.description}</p>
                            <p className="font-mono text-sm text-forest font-medium">
                              {fmt(room.baseRate)}<span className="text-ink/40 text-xs">/night</span>
                            </p>
                            <p className="font-mono text-xs text-ink/50">max {room.maxGuests} guests</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  </>
                )}

                {/* Dates */}
                {prop && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono text-ink/50 uppercase mb-2">Check-in Date *</label>
                        <Input type="date" min={today} value={checkIn}
                          onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(""); }}
                          className="font-mono" />
                        {checkIn && <p className="text-xs text-ink/50 mt-1 font-mono">From {prop.checkInTime}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-ink/50 uppercase mb-2">Check-out Date *</label>
                        <Input type="date" min={checkIn || today} value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="font-mono" disabled={!checkIn} />
                        {checkOut && <p className="text-xs text-ink/50 mt-1 font-mono">By {prop.checkOutTime}</p>}
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="block text-xs font-mono text-ink/50 uppercase mb-2">Number of Guests *</label>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-10 h-10 border border-neutral-300 flex items-center justify-center text-xl hover:border-forest transition-colors">−</button>
                        <span className="font-display text-2xl text-forest w-8 text-center">{guests}</span>
                        <button onClick={() => setGuests(Math.min(effectiveMaxGuests, guests + 1))}
                          className="w-10 h-10 border border-neutral-300 flex items-center justify-center text-xl hover:border-forest transition-colors">+</button>
                        <span className="text-sm text-ink/50">max {effectiveMaxGuests}</span>
                      </div>
                    </div>

                    {/* Pricing preview */}
                    {pricing.nights > 0 && (
                      <div className="bg-forest/5 border border-forest/10 p-5 space-y-2">
                        <p className="text-xs font-mono text-ink/50 uppercase mb-3">Price Summary</p>
                        <div className="space-y-1.5 text-sm font-mono">
                          <div className="flex justify-between text-ink/70">
                            <span>{fmt(pricing.rate)} × {pricing.nights} night{pricing.nights > 1 ? "s" : ""}</span>
                            <span>{fmt(pricing.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-ink/70">
                            <span>Cleaning fee</span><span>{fmt(pricing.cleaningFee)}</span>
                          </div>
                          <div className="flex justify-between text-ink/70">
                            <span>GST (18%)</span><span>{fmt(pricing.taxes)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-forest border-t border-forest/10 pt-2 mt-1">
                            <span>Total</span><span>{fmt(pricing.total)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <button onClick={() => setStep(2)} disabled={!canStep1}
                  className={cn(
                    "w-full py-4 font-medium text-base flex items-center justify-center gap-2 transition-all",
                    canStep1 ? "bg-gold text-ink hover:bg-gold/90" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                  )}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* ── STEP 2: Guest Info ── */}
            {step === 2 && (
              <div className="p-8 space-y-5">
                <h2 className="font-display text-xl text-forest">Your details</h2>
                <div>
                  <label className="block text-xs font-mono text-ink/50 uppercase mb-2">Full Name *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Arjun Mehta" autoFocus />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-ink/50 uppercase mb-2">Email *</label>
                    <Input type="email" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="arjun@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-ink/50 uppercase mb-2">Phone *</label>
                    <Input type="tel" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="9876543210" className="font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink/50 uppercase mb-2">Special Requests</label>
                  <Textarea value={form.requests}
                    onChange={(e) => setForm({ ...form, requests: e.target.value })}
                    placeholder="Early check-in, dietary preferences, anything we should know..."
                    rows={3} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-4 border-2 border-forest/15 rounded-xl font-medium text-ink/70 hover:border-forest transition-all">
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} disabled={!canStep2}
                    className={cn(
                      "flex-1 py-4 font-medium text-base flex items-center justify-center gap-2 transition-all",
                      canStep2 ? "bg-gold text-ink hover:bg-gold/90" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    )}>
                    Review Booking <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Review + Pay ── */}
            {step === 3 && prop && (
              <div className="p-8 space-y-6">
                <h2 className="font-display text-xl text-forest">Review & Pay</h2>

                {/* Stay summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#faf8f4] rounded-xl p-4 border border-forest/6">
                    <p className="text-xs font-mono text-ink/40 uppercase mb-2">Property</p>
                    <p className="font-display text-lg text-forest">{prop.name}</p>
                    {selectedRoom && (
                      <p className="text-xs font-mono text-gold mt-1">{selectedRoom.label}</p>
                    )}
                    <p className="text-xs text-ink/45 font-mono">{prop.address}</p>
                  </div>
                  <div className="bg-[#faf8f4] rounded-xl p-4 border border-forest/6">
                    <p className="text-xs font-mono text-ink/40 uppercase mb-2">Dates</p>
                    <p className="font-mono text-sm text-forest">{checkIn} → {checkOut}</p>
                    <p className="text-xs text-ink/55">{pricing.nights} nights · {guests} guests</p>
                  </div>
                  <div className="bg-[#faf8f4] rounded-xl p-4 border border-forest/6">
                    <p className="text-xs font-mono text-ink/40 uppercase mb-2">Guest</p>
                    <p className="font-medium text-forest">{form.name}</p>
                    <p className="text-xs font-mono text-ink/55">{form.email}</p>
                    <p className="text-xs font-mono text-ink/55">+91 {form.phone}</p>
                  </div>
                  <div className="bg-[#eee9df] rounded-xl border border-gold/20 p-4">
                    <p className="text-xs font-mono text-ink/40 uppercase mb-2">Total to Pay</p>
                    <p className="font-display text-2xl text-forest">{fmt(pricing.total)}</p>
                    <p className="text-xs text-ink/45">Incl. cleaning & GST</p>
                  </div>
                </div>

                {form.requests && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 text-sm text-ink/70">
                    <span className="font-mono text-xs text-ink/50 uppercase block mb-1">Special Requests</span>
                    {form.requests}
                  </div>
                )}

                {/* Trust signals */}
                <div className="flex flex-wrap gap-4 text-xs text-ink/60">
                  <div className="flex items-center gap-1.5">
                    <Shield size={13} className="text-forest" />
                    Secure payment via Razorpay
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check size={13} className="text-forest" />
                    Instant booking confirmation
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-forest" />
                    24/7 host support
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)}
                    className="flex-1 py-4 border-2 border-forest/15 rounded-xl font-medium text-ink/70 hover:border-forest transition-all">
                    ← Back
                  </button>
                  <button onClick={handlePay} disabled={paying}
                    className="flex-1 py-4 bg-forest text-cream font-medium text-base hover:bg-forest/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 rounded-xl">
                    {paying ? "Processing…" : <>Pay {fmt(pricing.total)} <ArrowRight size={18} /></>}
                  </button>
                </div>

                {/* WhatsApp alternative */}
                <p className="text-center text-xs text-ink/50">
                  Prefer to book via WhatsApp?{" "}
                  <a href={`https://wa.me/918828352311?text=${encodeURIComponent(
                    `Hi! I'd like to book ${prop.name} from ${checkIn} to ${checkOut} for ${guests} guests. Total: ${fmt(pricing.total)}`
                  )}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-forest hover:text-gold underline transition-colors">
                    Message Simran
                  </a>
                </p>
              </div>
            )}

            {/* ── STEP 4: Confirmed ── */}
            {step === 4 && booking && prop && (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto">
                  <Check size={28} className="text-cream" />
                </div>
                <div>
                  <h2 className="font-display text-3xl text-forest mb-2">Booking Confirmed!</h2>
                  <p className="text-ink/70">A confirmation will be sent to <strong>{form.email}</strong></p>
                </div>

                <div className="bg-[#faf8f4] border border-forest/8 rounded-xl p-5 text-left space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-ink/40 uppercase text-xs">Booking Ref</span>
                    <span className="font-mono font-bold text-forest text-lg">{booking.bookingNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/55">Property</span>
                    <span className="font-medium text-forest">{prop.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/55">Check-in</span>
                    <span className="font-mono text-forest">{checkIn} · {prop.checkInTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/55">Check-out</span>
                    <span className="font-mono text-forest">{checkOut} · {prop.checkOutTime}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-forest/8 pt-3">
                    <span className="text-ink/55">Amount Paid</span>
                    <span className="font-display text-xl text-forest">{fmt(pricing.total)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-ink/70">
                    Our host Simran will WhatsApp you with check-in details.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a href="https://wa.me/918828352311" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1fb558] transition-colors min-h-[48px]">
                      <MessageCircle size={15} /> WhatsApp Simran
                    </a>
                    <Link href="/"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-forest text-forest font-semibold text-sm hover:bg-forest hover:text-cream transition-all min-h-[48px]">
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Need help */}
          {step < 4 && (
            <div className="mt-6 text-center text-sm text-ink/50">
              Need help booking?{" "}
              <a href="tel:+918828352311" className="text-forest hover:text-gold transition-colors">
                Call Simran: +91 88283 52311
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
