"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, calculateNights } from "@/lib/utils";

interface Property {
  id: string;
  name: string;
  baseRate: number;
  weekendRate: number;
  cleaningFee: number;
  maxGuests: number;
}

function generateBookingNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "MM-";
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export default function NewBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    propertyId: "1",
    checkIn: "",
    checkOut: "",
    guests: 2,
    specialRequests: "",
  });

  const property = properties.find((p) => p.id === form.propertyId) || properties[0];
  const nights = form.checkIn && form.checkOut
    ? calculateNights(form.checkIn, form.checkOut)
    : 0;
  const baseAmount = nights * (property?.baseRate || 0);
  const cleaningFee = property?.cleaningFee || 500;
  const taxes = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + cleaningFee + taxes;

  const canNext1 = form.guestName.trim() && form.guestEmail.trim() && form.guestPhone.trim();
  const canNext2 = form.checkIn && form.checkOut && nights > 0;

  const handleSubmit = async () => {
    if (!property) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          propertyName: property.name,
          guestName: form.guestName,
          guestEmail: form.guestEmail,
          guestPhone: form.guestPhone,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          nights,
          guests: form.guests,
          baseAmount,
          cleaningFee,
          taxes,
          totalAmount,
          specialRequests: form.specialRequests,
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Mark as confirmed immediately since admin is creating it
        await fetch("/api/bookings/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: data.bookingId, paymentId: "MANUAL" }),
        });
        router.push("/admin/bookings");
      } else {
        setError(data.error || "Failed to create booking");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/bookings"><ArrowLeft size={16} className="mr-2" />Bookings</Link>
        </Button>
        <h1 className="text-3xl font-display text-forest">New Booking</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center space-x-2">
        {[{ n: 1, label: "Guest" }, { n: 2, label: "Dates" }, { n: 3, label: "Confirm" }].map(({ n, label }) => (
          <div key={n} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step > n ? "bg-green-500 text-white" : step === n ? "bg-forest text-cream" : "bg-neutral-200 text-ink/40"
            }`}>
              {step > n ? <Check size={14} /> : n}
            </div>
            <span className={`ml-2 text-sm ${step === n ? "text-forest font-medium" : "text-ink/50"}`}>{label}</span>
            {n < 3 && <div className="mx-4 h-px bg-neutral-200 w-8" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div className="bg-white border border-neutral-200">
        {/* Step 1 — Guest */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <h2 className="text-xl font-display text-forest">Guest Details</h2>
            <div>
              <label className="block text-sm font-medium text-forest mb-2">Full Name *</label>
              <Input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} placeholder="Arjun Mehta" autoFocus />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Email *</label>
                <Input type="email" value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} placeholder="arjun@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Phone *</label>
                <Input type="tel" value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} placeholder="9876543210" className="font-mono" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Dates */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <h2 className="text-xl font-display text-forest">Stay Details</h2>
            <div>
              <label className="block text-sm font-medium text-forest mb-2">Property *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {properties.map((p) => (
                  <button key={p.id} onClick={() => setForm({ ...form, propertyId: p.id })}
                    className={`p-4 border text-left transition-all ${form.propertyId === p.id ? "border-forest bg-forest/5" : "border-neutral-200 hover:border-neutral-400"}`}>
                    <p className="font-medium text-forest">{p.name}</p>
                    <p className="text-xs text-ink/50 font-mono mt-1">Max {p.maxGuests} guests · from {formatCurrency(p.baseRate)}/night</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Check-in *</label>
                <Input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} className="font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Check-out *</label>
                <Input type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} className="font-mono" min={form.checkIn} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-2">Number of Guests</label>
              <Input type="number" min={1} max={property?.maxGuests || 6} value={form.guests}
                onChange={(e) => setForm({ ...form, guests: +e.target.value })} className="font-mono w-32" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-2">Special Requests</label>
              <Textarea value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                placeholder="Early check-in, extra pillows, etc." rows={3} />
            </div>
            {nights > 0 && property && (
              <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-1.5 text-sm font-mono">
                <p className="font-medium text-forest mb-2 font-sans">Pricing</p>
                <div className="flex justify-between text-ink/70"><span>{formatCurrency(property.baseRate)} × {nights} nights</span><span>{formatCurrency(baseAmount)}</span></div>
                <div className="flex justify-between text-ink/70"><span>Cleaning fee</span><span>{formatCurrency(cleaningFee)}</span></div>
                <div className="flex justify-between text-ink/70"><span>GST 18%</span><span>{formatCurrency(taxes)}</span></div>
                <div className="flex justify-between font-bold text-forest border-t border-neutral-200 pt-2"><span>Total</span><span>{formatCurrency(totalAmount)}</span></div>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && property && (
          <div className="p-6 space-y-5">
            <h2 className="text-xl font-display text-forest">Review & Confirm</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-4">
                <p className="text-xs font-mono text-ink/50 uppercase mb-2">Guest</p>
                <p className="font-medium text-forest">{form.guestName}</p>
                <p className="text-sm text-ink/60 font-mono">{form.guestEmail}</p>
                <p className="text-sm text-ink/60 font-mono">{form.guestPhone}</p>
              </div>
              <div className="bg-neutral-50 p-4">
                <p className="text-xs font-mono text-ink/50 uppercase mb-2">Stay</p>
                <p className="font-medium text-forest">{property.name}</p>
                <p className="text-sm text-ink/60 font-mono">{form.checkIn} → {form.checkOut}</p>
                <p className="text-sm text-ink/60">{nights} nights · {form.guests} guests</p>
              </div>
            </div>
            <div className="bg-forest/5 border border-forest/10 p-4 space-y-1.5 text-sm font-mono">
              <div className="flex justify-between text-ink/70"><span>{nights} nights base</span><span>{formatCurrency(baseAmount)}</span></div>
              <div className="flex justify-between text-ink/70"><span>Cleaning</span><span>{formatCurrency(cleaningFee)}</span></div>
              <div className="flex justify-between text-ink/70"><span>GST</span><span>{formatCurrency(taxes)}</span></div>
              <div className="flex justify-between font-bold text-forest border-t border-forest/10 pt-2 text-base"><span>Total</span><span>{formatCurrency(totalAmount)}</span></div>
            </div>
            <p className="text-xs text-ink/50">This booking will be marked as <strong>CONFIRMED</strong> immediately.</p>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex justify-between px-6 pb-6">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep((s) => (s - 1) as 1|2|3)}>← Back</Button>
          ) : (
            <Button variant="ghost" asChild><Link href="/admin/bookings">Cancel</Link></Button>
          )}
          {step < 3 ? (
            <Button variant="gold" onClick={() => setStep((s) => (s + 1) as 1|2|3)}
              disabled={step === 1 ? !canNext1 : !canNext2}>
              Next →
            </Button>
          ) : (
            <Button variant="gold" onClick={handleSubmit} disabled={submitting || !property}>
              {submitting ? "Creating…" : "✓ Confirm Booking"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
