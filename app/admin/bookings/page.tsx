"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Calendar, List, Search, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency, calculateNights } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { BookingRecord } from "@/lib/bookings-store";

type ViewMode = "list";

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      // silently fail — shows empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = bookings.filter((b) => {
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    const matchSearch =
      !search ||
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.guestEmail.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = filtered.reduce((s, b) => s + b.totalAmount, 0);
  const confirmed = filtered.filter((b) => b.status === "CONFIRMED").length;
  const pending = filtered.filter((b) => b.status === "PENDING_PAYMENT").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Bookings</h1>
          <p className="text-ink/60">All reservations from the website</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw size={14} className={cn("mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="gold" asChild>
            <Link href="/admin/bookings/new">
              <Plus size={18} className="mr-2" />
              New Booking
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-neutral-200">
          <p className="text-xs text-ink/50 mb-1 font-mono">TOTAL</p>
          <p className="text-2xl font-display text-forest">{filtered.length}</p>
        </div>
        <div className="bg-white p-4 border border-neutral-200">
          <p className="text-xs text-ink/50 mb-1 font-mono">CONFIRMED</p>
          <p className="text-2xl font-display text-green-600">{confirmed}</p>
        </div>
        <div className="bg-white p-4 border border-neutral-200">
          <p className="text-xs text-ink/50 mb-1 font-mono">PENDING</p>
          <p className="text-2xl font-display text-yellow-600">{pending}</p>
        </div>
        <div className="bg-white p-4 border border-neutral-200">
          <p className="text-xs text-ink/50 mb-1 font-mono">REVENUE</p>
          <p className="text-2xl font-display text-forest">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 border border-neutral-200 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search guest, email, booking number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="all">All Statuses</option>
          <option value="PENDING_PAYMENT">Pending Payment</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 overflow-x-auto">
        {loading ? (
          <div className="py-24 text-center text-ink/40 font-mono text-sm">Loading bookings…</div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <Calendar size={40} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-lg font-display text-forest mb-2">No bookings yet</p>
            <p className="text-sm text-ink/50">
              {search || filterStatus !== "all"
                ? "No bookings match your filters."
                : "Bookings from the website will appear here automatically."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {["Booking #", "Guest", "Property", "Check-in", "Check-out", "Nights", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((b) => {
                const nights = calculateNights(b.checkIn, b.checkOut);
                return (
                  <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-ink whitespace-nowrap">{b.bookingNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-forest">{b.guestName}</p>
                      <p className="text-xs text-ink/50">{b.guestEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-ink whitespace-nowrap">{b.propertyName}</td>
                    <td className="px-6 py-4 font-mono text-sm whitespace-nowrap">{formatDate(b.checkIn)}</td>
                    <td className="px-6 py-4 font-mono text-sm whitespace-nowrap">{formatDate(b.checkOut)}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">{nights}</td>
                    <td className="px-6 py-4 font-mono text-sm font-medium text-forest whitespace-nowrap">{formatCurrency(b.totalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn("px-3 py-1 text-xs rounded-full font-medium", STATUS_COLORS[b.status] || "bg-neutral-100 text-neutral-600")}>
                        {b.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/admin/bookings/${b.id}`} className="text-gold hover:text-forest transition-colors font-medium">
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
