"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Phone, Mail, MessageCircle, MapPin,
  Calendar, Users, Clock, CheckCircle, XCircle, FileText, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatCurrency, calculateNights } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { BookingRecord } from "@/lib/bookings-store";

const STATUS_STEPS = [
  { key: "PENDING_PAYMENT", label: "Pending", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "CANCELLED", label: "Cancelled", icon: XCircle },
];

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const PROPERTY_ADDRESSES: Record<string, string> = {
  "1": "Sector 57, Phase 2, Sushant Lok, Gurugram, Haryana - 122011",
  "2": "593, Durga Colony, Jharsa Village, Sector 39, Gurugram - 122003",
};

export default function BookingDetailPage() {
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.bookings as BookingRecord[]).find((b) => b.id === bookingId);
        setBooking(found || null);
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  const updateStatus = async (status: string) => {
    if (!booking) return;
    setSaving(true);
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: booking.id, status }),
    });
    const data = await res.json();
    setBooking(data.booking);
    setSaving(false);
    setSuccessMsg("Status updated");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const addNote = async () => {
    if (!booking || !note.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: booking.id, note }),
    });
    const data = await res.json();
    setBooking(data.booking);
    setNote("");
    setSaving(false);
    setSuccessMsg("Note saved");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-ink/40 gap-2">
        <RefreshCw size={16} className="animate-spin" />
        <span className="font-mono text-sm">Loading booking…</span>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-32 text-center">
        <p className="text-lg font-display text-forest mb-4">Booking not found</p>
        <p className="text-sm text-ink/50 mb-6">This booking may no longer exist or the server restarted.</p>
        <Button asChild variant="outline">
          <Link href="/admin/bookings"><ArrowLeft size={14} className="mr-2" />Back to Bookings</Link>
        </Button>
      </div>
    );
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);
  const address = PROPERTY_ADDRESSES[booking.propertyId] || "";
  const statusIndex = STATUS_STEPS.findIndex((s) => s.key === booking.status);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/bookings"><ArrowLeft size={16} className="mr-2" />Bookings</Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display text-forest">{booking.guestName}</h1>
              <span className={cn("text-xs px-3 py-1 rounded-full font-medium", STATUS_COLORS[booking.status] || "bg-neutral-100 text-neutral-600")}>
                {booking.status.replace("_", " ")}
              </span>
            </div>
            <p className="font-mono text-sm text-ink/50">#{booking.bookingNumber}</p>
          </div>
        </div>
        {successMsg && (
          <span className="text-sm text-green-600 font-mono bg-green-50 px-3 py-1 border border-green-200">
            ✓ {successMsg}
          </span>
        )}
      </div>

      {/* Status stepper */}
      <div className="bg-white border border-neutral-200 p-6">
        <p className="text-xs font-mono text-ink/50 uppercase mb-4">Update Status</p>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_STEPS.map((step) => {
            const isCurrent = booking.status === step.key;
            const Icon = step.icon;
            return (
              <button
                key={step.key}
                onClick={() => updateStatus(step.key)}
                disabled={saving || isCurrent}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium border transition-all",
                  isCurrent
                    ? "bg-forest text-cream border-forest cursor-default"
                    : "bg-white text-ink/60 border-neutral-200 hover:border-forest hover:text-forest"
                )}
              >
                <Icon size={14} />
                {step.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">Guest Information</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-2xl text-forest">{booking.guestName[0]}</span>
              </div>
              <div>
                <p className="text-xl font-display text-forest">{booking.guestName}</p>
                <p className="text-sm text-ink/50 font-mono">Booked {formatDate(booking.createdAt)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href={`tel:${booking.guestPhone}`}
                className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group">
                <Phone size={14} className="text-gold group-hover:text-cream" />
                <span className="font-mono text-sm">{booking.guestPhone}</span>
              </a>
              <a href={`mailto:${booking.guestEmail}`}
                className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group">
                <Mail size={14} className="text-gold group-hover:text-cream" />
                <span className="font-mono text-sm truncate">{booking.guestEmail}</span>
              </a>
            </div>
          </div>

          {/* Stay */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">Stay Details</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: Calendar, label: "CHECK-IN", value: formatDate(booking.checkIn) },
                { icon: Calendar, label: "CHECK-OUT", value: formatDate(booking.checkOut) },
                { icon: Clock, label: "NIGHTS", value: String(nights) },
                { icon: Users, label: "GUESTS", value: String(booking.guests) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-4 bg-neutral-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className="text-gold" />
                    <span className="text-xs font-mono text-ink/50">{label}</span>
                  </div>
                  <p className="font-mono text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
            {address && (
              <div className="flex items-start gap-3 p-4 border border-forest/10 bg-forest/5">
                <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-forest">{booking.propertyName}</p>
                  <p className="text-sm text-ink/60 font-mono">{address}</p>
                </div>
              </div>
            )}
            {booking.specialRequests && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-100">
                <p className="text-xs font-mono text-amber-600 uppercase mb-1">Special Requests / Notes</p>
                <p className="text-sm text-ink/70 whitespace-pre-wrap">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">Add Internal Note</p>
            <div className="space-y-3">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note…"
                rows={3}
                className="text-sm"
              />
              <Button variant="outline" size="sm" onClick={addNote} disabled={!note.trim() || saving}>
                <FileText size={14} className="mr-2" />
                {saving ? "Saving…" : "Save Note"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">Payment</p>
            <div className="space-y-2 text-sm font-mono mb-4">
              <div className="flex justify-between text-ink/60">
                <span>Base ({nights} nights)</span>
                <span>{formatCurrency(booking.baseAmount)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Cleaning fee</span>
                <span>{formatCurrency(booking.cleaningFee)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Taxes (GST)</span>
                <span>{formatCurrency(booking.taxes)}</span>
              </div>
              <div className="flex justify-between font-bold text-forest border-t border-neutral-200 pt-2">
                <span>Total</span>
                <span>{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-neutral-100 text-sm">
              <span className="text-ink/60">Payment ID</span>
              <span className="font-mono text-xs text-ink/50">{booking.paymentId || "—"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">Quick Actions</p>
            <div className="space-y-3">
              <a
                href={`https://wa.me/91${booking.guestPhone}?text=${encodeURIComponent(
                  `Hi ${booking.guestName}! Your booking at ${booking.propertyName} (${booking.bookingNumber}) is confirmed. Check-in: ${formatDate(booking.checkIn)}. Looking forward to hosting you!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 transition-colors w-full text-left"
              >
                <MessageCircle size={16} className="text-green-600" />
                <span className="text-sm text-green-700 font-medium">WhatsApp Guest</span>
              </a>
              <a href={`tel:${booking.guestPhone}`}
                className="flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors w-full">
                <Phone size={16} className="text-ink/60" />
                <span className="text-sm text-ink/70">Call Guest</span>
              </a>
              <a href={`mailto:${booking.guestEmail}`}
                className="flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors w-full">
                <Mail size={16} className="text-ink/60" />
                <span className="text-sm text-ink/70">Email Guest</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
