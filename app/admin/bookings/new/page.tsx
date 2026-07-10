"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockProperties } from "@/lib/mock-data";
import { formatCurrency, calculateNights } from "@/lib/utils";

export default function NewBookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    // Guest
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    // Booking
    propertyId: "1",
    checkIn: "",
    checkOut: "",
    guestsCount: 2,
    source: "DIRECT",
    notes: "",
    // Payment
    paymentStatus: "PENDING",
  });

  const property = mockProperties.find((p) => p.id === form.propertyId)!;
  const nights =
    form.checkIn && form.checkOut
      ? calculateNights(new Date(form.checkIn), new Date(form.checkOut))
      : 0;
  const subtotal = nights * property.baseRate;
  const cleaningFee = property.cleaningFee ?? 500;
  const taxes = Math.round(subtotal * 0.18);
  const total = subtotal + cleaningFee + taxes;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    router.push("/admin/bookings");
  };

  const canNext1 = form.guestName && form.guestEmail && form.guestPhone;
  const canNext2 = form.checkIn && form.checkOut && nights > 0;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/bookings">
            <ArrowLeft size={16} className="mr-2" />
            Bookings
          </Link>
        </Button>
        <h1 className="text-3xl font-display text-forest">New Booking</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center space-x-4">
        {[
          { n: 1, label: "Guest Details" },
          { n: 2, label: "Stay Dates" },
          { n: 3, label: "Review & Confirm" },
        ].map(({ n, label }) => (
          <div key={n} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step > n
                  ? "bg-green-500 text-white"
                  : step === n
                  ? "bg-forest text-cream"
                  : "bg-neutral-200 text-ink/40"
              }`}
            >
              {step > n ? <Check size={14} /> : n}
            </div>
            <span
              className={`ml-2 text-sm ${
                step === n ? "text-forest font-medium" : "text-ink/50"
              }`}
            >
              {label}
            </span>
            {n < 3 && <div className="mx-4 flex-1 h-px bg-neutral-200 w-8" />}
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200">
        {/* STEP 1 — Guest Details */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-display text-forest">Guest Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Full Name *
                </label>
                <Input
                  value={form.guestName}
                  onChange={(e) =>
                    setForm({ ...form, guestName: e.target.value })
                  }
                  placeholder="Arjun Mehta"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={form.guestEmail}
                    onChange={(e) =>
                      setForm({ ...form, guestEmail: e.target.value })
                    }
                    placeholder="arjun@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Phone *
                  </label>
                  <Input
                    type="tel"
                    value={form.guestPhone}
                    onChange={(e) =>
                      setForm({ ...form, guestPhone: e.target.value })
                    }
                    placeholder="9876543210"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Stay Details */}
        {step === 2 && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-display text-forest">Stay Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Property *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mockProperties.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setForm({ ...form, propertyId: p.id })}
                      className={`p-4 border text-left transition-all ${
                        form.propertyId === p.id
                          ? "border-forest bg-forest/5"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <p className="font-medium text-forest">{p.name}</p>
                      <p className="text-xs text-ink/50 font-mono mt-1">
                        Max {p.maxGuests} guests · from{" "}
                        {formatCurrency(p.baseRate)}/night
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Check-in *
                  </label>
                  <Input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) =>
                      setForm({ ...form, checkIn: e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Check-out *
                  </label>
                  <Input
                    type="date"
                    value={form.checkOut}
                    onChange={(e) =>
                      setForm({ ...form, checkOut: e.target.value })
                    }
                    className="font-mono"
                    min={form.checkIn}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Number of Guests
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={property.maxGuests}
                    value={form.guestsCount}
                    onChange={(e) =>
                      setForm({ ...form, guestsCount: +e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Booking Source
                  </label>
                  <select
                    value={form.source}
                    onChange={(e) =>
                      setForm({ ...form, source: e.target.value })
                    }
                    className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="DIRECT">Direct</option>
                    <option value="AIRBNB">Airbnb</option>
                    <option value="MAKEMYTRIP">MakeMyTrip</option>
                    <option value="REFERRAL">Referral</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Notes (optional)
                </label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Early check-in requested, vegetarian guest..."
                  rows={3}
                />
              </div>

              {/* Pricing Preview */}
              {nights > 0 && (
                <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-2">
                  <p className="text-sm font-medium text-forest mb-3">
                    Pricing Preview
                  </p>
                  <div className="space-y-1.5 text-sm font-mono">
                    <div className="flex justify-between text-ink/70">
                      <span>
                        {formatCurrency(property.baseRate)} × {nights} nights
                      </span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-ink/70">
                      <span>Cleaning fee</span>
                      <span>{formatCurrency(cleaningFee)}</span>
                    </div>
                    <div className="flex justify-between text-ink/70">
                      <span>GST (18%)</span>
                      <span>{formatCurrency(taxes)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-forest border-t border-neutral-200 pt-2 mt-2">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 — Review & Confirm */}
        {step === 3 && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-display text-forest">
              Review & Confirm
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-50 p-4">
                <p className="text-xs font-mono text-ink/50 uppercase mb-3">
                  Guest
                </p>
                <p className="font-medium text-forest">{form.guestName}</p>
                <p className="text-sm text-ink/60 font-mono">{form.guestEmail}</p>
                <p className="text-sm text-ink/60 font-mono">{form.guestPhone}</p>
              </div>
              <div className="bg-neutral-50 p-4">
                <p className="text-xs font-mono text-ink/50 uppercase mb-3">
                  Property
                </p>
                <p className="font-medium text-forest">{property.name}</p>
                <p className="text-sm text-ink/60 font-mono">
                  {form.checkIn} → {form.checkOut}
                </p>
                <p className="text-sm text-ink/60">
                  {nights} nights · {form.guestsCount} guests
                </p>
              </div>
            </div>

            <div className="bg-forest/5 border border-forest/10 p-4 space-y-2">
              <p className="text-sm font-medium text-forest mb-3">
                Final Pricing
              </p>
              <div className="space-y-1.5 text-sm font-mono">
                <div className="flex justify-between text-ink/70">
                  <span>
                    {formatCurrency(property.baseRate)} × {nights} nights
                  </span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink/70">
                  <span>Cleaning fee</span>
                  <span>{formatCurrency(cleaningFee)}</span>
                </div>
                <div className="flex justify-between text-ink/70">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(taxes)}</span>
                </div>
                <div className="flex justify-between font-bold text-forest border-t border-forest/10 pt-2 mt-1 text-base">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Payment Status
              </label>
              <select
                value={form.paymentStatus}
                onChange={(e) =>
                  setForm({ ...form, paymentStatus: e.target.value })
                }
                className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="PENDING">Pending — to be collected</option>
                <option value="PAID">Paid — already received</option>
              </select>
            </div>

            {form.notes && (
              <div className="bg-yellow-50 border border-yellow-200 p-4">
                <p className="text-xs font-mono text-ink/50 uppercase mb-1">
                  Notes
                </p>
                <p className="text-sm text-ink/70">{form.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between px-6 pb-6">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
            >
              ← Back
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/admin/bookings">Cancel</Link>
            </Button>
          )}

          {step < 3 ? (
            <Button
              variant="gold"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              disabled={step === 1 ? !canNext1 : !canNext2}
            >
              Next →
            </Button>
          ) : (
            <Button
              variant="gold"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "✓ Confirm Booking"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
