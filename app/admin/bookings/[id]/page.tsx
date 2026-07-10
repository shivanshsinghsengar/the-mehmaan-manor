"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  Users,
  IndianRupee,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockBookings, mockProperties } from "@/lib/mock-data";
import {
  formatDate,
  formatCurrency,
  calculateNights,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_STEPS = [
  { key: "PENDING", label: "Inquiry", icon: Clock },
  { key: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
  { key: "CHECKED_IN", label: "Checked In", icon: CheckCircle },
  { key: "CHECKED_OUT", label: "Checked Out", icon: CheckCircle },
];

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();

  const booking =
    mockBookings.find((b) => b.id === params.id) ?? mockBookings[0];
  const property =
    mockProperties.find((p) => p.id === booking.propertyId) ??
    mockProperties[0];

  const [status, setStatus] = useState(booking.status);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>(
    booking.notes ? [booking.notes] : []
  );

  const nights = calculateNights(booking.checkIn, booking.checkOut);
  const cleaningFee = property.cleaningFee ?? 500;
  const subtotal = booking.totalAmount - cleaningFee;

  const statusIndex = STATUS_STEPS.findIndex((s) => s.key === status);

  const handleAddNote = () => {
    if (!note.trim()) return;
    setNotes((prev) => [...prev, note]);
    setNote("");
  };

  const handleDelete = () => {
    if (confirm("Cancel this booking? This action cannot be undone.")) {
      setStatus("CANCELLED");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/bookings">
              <ArrowLeft size={16} className="mr-2" />
              Bookings
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display text-forest">
                {booking.guestName}
              </h1>
              <span
                className={cn(
                  "text-xs px-3 py-1 rounded-full font-medium",
                  status === "CONFIRMED" && "bg-green-100 text-green-700",
                  status === "PENDING" && "bg-yellow-100 text-yellow-700",
                  status === "CHECKED_IN" && "bg-blue-100 text-blue-700",
                  status === "CHECKED_OUT" && "bg-neutral-100 text-neutral-600",
                  status === "CANCELLED" && "bg-red-100 text-red-700"
                )}
              >
                {status}
              </span>
            </div>
            <p className="font-mono text-sm text-ink/50">
              #{booking.bookingNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleDelete}
          >
            <XCircle size={14} className="mr-2" />
            Cancel Booking
          </Button>
          <Button variant="gold" size="sm">
            <Edit size={14} className="mr-2" />
            Edit Booking
          </Button>
        </div>
      </div>

      {/* Booking Timeline */}
      <div className="bg-white border border-neutral-200 p-6">
        <p className="text-xs font-mono text-ink/50 uppercase mb-4">
          Booking Status
        </p>
        <div className="flex items-center">
          {STATUS_STEPS.map((step, i) => {
            const isCompleted = i < statusIndex;
            const isCurrent = i === statusIndex;
            const Icon = step.icon;
            return (
              <div key={step.key} className="flex items-center flex-1">
                <button
                  onClick={() => setStatus(step.key as typeof status)}
                  className="flex flex-col items-center group"
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-colors border-2",
                      isCompleted
                        ? "bg-forest border-forest text-cream"
                        : isCurrent
                        ? "bg-gold border-gold text-ink"
                        : "bg-white border-neutral-300 text-neutral-400 group-hover:border-forest"
                    )}
                  >
                    <Icon size={14} />
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1.5 font-medium",
                      isCurrent ? "text-forest" : "text-ink/40"
                    )}
                  >
                    {step.label}
                  </span>
                </button>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2 mb-5",
                      i < statusIndex ? "bg-forest" : "bg-neutral-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-ink/40 mt-2">
          Click a step to update booking status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Info */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">
              Guest Information
            </p>
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-2xl text-forest">
                  {booking.guestName[0]}
                </span>
              </div>
              <div>
                <p className="text-xl font-display text-forest">
                  {booking.guestName}
                </p>
                <p className="text-sm text-ink/60">
                  Booked {formatDate(booking.createdAt)} via{" "}
                  {booking.source}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a
                href={`tel:${booking.guestPhone}`}
                className="flex items-center space-x-2 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group"
              >
                <Phone size={14} className="text-gold group-hover:text-cream" />
                <span className="font-mono text-sm">{booking.guestPhone}</span>
              </a>
              <a
                href={`mailto:${booking.guestEmail}`}
                className="flex items-center space-x-2 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group col-span-1 md:col-span-2"
              >
                <Mail size={14} className="text-gold group-hover:text-cream" />
                <span className="font-mono text-sm truncate">
                  {booking.guestEmail}
                </span>
              </a>
            </div>
          </div>

          {/* Stay Details */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">
              Stay Details
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-neutral-50">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar size={14} className="text-gold" />
                  <span className="text-xs font-mono text-ink/50">
                    CHECK-IN
                  </span>
                </div>
                <p className="font-mono text-sm font-medium">
                  {formatDate(booking.checkIn)}
                </p>
                <p className="text-xs text-ink/40">{property.checkInTime}</p>
              </div>
              <div className="p-4 bg-neutral-50">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar size={14} className="text-gold" />
                  <span className="text-xs font-mono text-ink/50">
                    CHECK-OUT
                  </span>
                </div>
                <p className="font-mono text-sm font-medium">
                  {formatDate(booking.checkOut)}
                </p>
                <p className="text-xs text-ink/40">{property.checkOutTime}</p>
              </div>
              <div className="p-4 bg-neutral-50">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock size={14} className="text-gold" />
                  <span className="text-xs font-mono text-ink/50">NIGHTS</span>
                </div>
                <p className="font-mono text-sm font-medium">{nights}</p>
              </div>
              <div className="p-4 bg-neutral-50">
                <div className="flex items-center space-x-2 mb-2">
                  <Users size={14} className="text-gold" />
                  <span className="text-xs font-mono text-ink/50">GUESTS</span>
                </div>
                <p className="font-mono text-sm font-medium">
                  {booking.guestsCount}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border border-forest/10 bg-forest/5">
              <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-forest">{property.name}</p>
                <p className="text-sm text-ink/60 font-mono">
                  {property.address}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">
              Internal Notes
            </p>
            {notes.map((n, i) => (
              <div
                key={i}
                className="flex items-start space-x-3 mb-3 p-3 bg-yellow-50 border border-yellow-100"
              >
                <FileText
                  size={14}
                  className="text-yellow-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-ink/70">{n}</p>
              </div>
            ))}
            <div className="space-y-3">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note for this booking..."
                rows={3}
                className="text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddNote}
                disabled={!note.trim()}
              >
                Add Note
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column — Invoice & Actions */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">
              Payment Summary
            </p>
            <div className="space-y-2 text-sm font-mono mb-4">
              <div className="flex justify-between text-ink/60">
                <span>
                  {formatCurrency(property.baseRate)} × {nights}n
                </span>
                <span>{formatCurrency(subtotal - cleaningFee)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Cleaning fee</span>
                <span>{formatCurrency(cleaningFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-forest border-t border-neutral-200 pt-2 mt-1">
                <span>Total</span>
                <span>{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-neutral-100">
              <span className="text-sm text-ink/70">Payment Status</span>
              <span
                className={cn(
                  "text-xs px-3 py-1 rounded-full font-medium",
                  booking.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                {booking.paymentStatus}
              </span>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4">
              <FileText size={14} className="mr-2" />
              Download Invoice
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-neutral-200 p-6">
            <p className="text-xs font-mono text-ink/50 uppercase mb-4">
              Quick Actions
            </p>
            <div className="space-y-3">
              <a
                href={`https://wa.me/91${booking.guestPhone}?text=${encodeURIComponent(
                  `Hi ${booking.guestName}! Confirming your stay at ${property.name} from ${formatDate(booking.checkIn)} to ${formatDate(booking.checkOut)}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 transition-colors w-full text-left"
              >
                <MessageCircle size={16} className="text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  WhatsApp Guest
                </span>
              </a>
              <a
                href={`tel:${booking.guestPhone}`}
                className="flex items-center space-x-3 p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors w-full text-left"
              >
                <Phone size={16} className="text-ink/60" />
                <span className="text-sm text-ink/70">Call Guest</span>
              </a>
              <a
                href={`mailto:${booking.guestEmail}`}
                className="flex items-center space-x-3 p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors w-full text-left"
              >
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
