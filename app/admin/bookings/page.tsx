"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, List, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBookings } from "@/lib/mock-data";
import { formatDate, formatCurrency, calculateNights } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ViewMode = "calendar" | "list";

export default function BookingsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredBookings = mockBookings.filter((b) =>
    filterStatus === "all" ? true : b.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Bookings</h1>
          <p className="text-ink/60">
            Manage reservations and guest check-ins
          </p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/admin/bookings/new">
            <Plus size={18} className="mr-2" />
            New Booking
          </Link>
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 border border-neutral-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-forest text-cream"
                  : "text-ink/60 hover:text-ink"
              )}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "calendar"
                  ? "bg-forest text-cream"
                  : "text-ink/60 hover:text-ink"
              )}
            >
              <Calendar size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search guest name..."
                className="pl-9 pr-4 py-2 w-64 border border-neutral-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button className="flex items-center space-x-2 px-4 py-2 border border-neutral-200 rounded text-sm hover:bg-neutral-50 transition-colors">
              <Filter size={16} />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Nights
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ink/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredBookings.map((booking) => {
                const nights = calculateNights(
                  booking.checkIn,
                  booking.checkOut
                );
                return (
                  <tr
                    key={booking.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-ink">
                      {booking.bookingNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-forest">
                          {booking.guestName}
                        </p>
                        <p className="text-xs text-ink/50">
                          {booking.guestEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                      {booking.propertyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-ink">
                      {formatDate(booking.checkIn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-ink">
                      {formatDate(booking.checkOut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ink">
                      {nights}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-forest font-medium">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-3 py-1 text-xs rounded-full font-medium",
                          booking.status === "CONFIRMED" &&
                            "bg-green-100 text-green-700",
                          booking.status === "PENDING" &&
                            "bg-yellow-100 text-yellow-700",
                          booking.status === "CANCELLED" &&
                            "bg-red-100 text-red-700"
                        )}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-gold hover:text-forest transition-colors font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="bg-white p-6 border border-neutral-200">
          <div className="text-center py-20">
            <Calendar size={48} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="text-xl font-display text-forest mb-2">
              Calendar View
            </h3>
            <p className="text-ink/60 mb-6">
              Interactive calendar with drag-and-drop booking management
            </p>
            <p className="text-sm text-ink/50 font-mono">
              Coming soon in full implementation
            </p>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-neutral-200">
          <p className="text-xs text-ink/50 mb-1">TOTAL BOOKINGS</p>
          <p className="text-2xl font-display text-forest">
            {filteredBookings.length}
          </p>
        </div>
        <div className="bg-white p-4 border border-neutral-200">
          <p className="text-xs text-ink/50 mb-1">CONFIRMED</p>
          <p className="text-2xl font-display text-green-600">
            {
              filteredBookings.filter((b) => b.status === "CONFIRMED").length
            }
          </p>
        </div>
        <div className="bg-white p-4 border border-neutral-200">
          <p className="text-xs text-ink/50 mb-1">PENDING</p>
          <p className="text-2xl font-display text-yellow-600">
            {filteredBookings.filter((b) => b.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white p-4 border border-neutral-200">
          <p className="text-xs text-ink/50 mb-1">TOTAL REVENUE</p>
          <p className="text-2xl font-display text-forest">
            {formatCurrency(
              filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
