"use client";

import { useState } from "react";
import { Search, UserPlus, Phone, Mail, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockGuests, mockBookings } from "@/lib/mock-data";
import { formatDate, formatCurrency } from "@/lib/utils";

type Guest = (typeof mockGuests)[0];

export default function GuestsPage() {
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = mockGuests.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search)
  );

  const guestBookings = selectedGuest
    ? mockBookings.filter((b) => b.guestEmail === selectedGuest.email)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Guests</h1>
          <p className="text-ink/60">
            {mockGuests.length} guests in your database
          </p>
        </div>
        <Button variant="gold" onClick={() => setShowAdd(true)}>
          <UserPlus size={16} className="mr-2" />
          Add Guest
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="bg-white border border-neutral-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink/60 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink/60 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink/60 uppercase tracking-wider">
                    Stays
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink/60 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-ink/60 uppercase tracking-wider">
                    Last Stay
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((guest) => (
                  <tr
                    key={guest.id}
                    onClick={() => setSelectedGuest(guest)}
                    className={`cursor-pointer transition-colors hover:bg-neutral-50 ${
                      selectedGuest?.id === guest.id ? "bg-gold/5" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-display text-forest text-sm">
                            {guest.name[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-forest">
                            {guest.name}
                          </p>
                          {guest.notes && (
                            <p className="text-xs text-ink/40 truncate max-w-[160px]">
                              {guest.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-xs text-ink/60">
                          <Mail size={10} />
                          <span className="font-mono truncate max-w-[140px]">
                            {guest.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-ink/60">
                          <Phone size={10} />
                          <span className="font-mono">{guest.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-forest">
                        {guest.totalStays}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-forest">
                      {formatCurrency(guest.totalSpent)}
                    </td>
                    <td className="px-5 py-4 font-mono text-sm text-ink/60">
                      {formatDate(guest.lastStay)}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-ink/40"
                    >
                      <Search
                        size={32}
                        className="mx-auto mb-3 text-neutral-300"
                      />
                      <p>No guests found for "{search}"</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guest Detail Panel */}
        <div className="lg:col-span-1">
          {selectedGuest ? (
            <div className="bg-white border border-neutral-200 overflow-hidden sticky top-20">
              <div className="p-6 bg-forest text-cream">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="font-display text-gold text-2xl">
                      {selectedGuest.name[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedGuest(null)}
                    className="text-cream/60 hover:text-cream transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <h3 className="text-xl font-display">{selectedGuest.name}</h3>
                <p className="text-cream/70 text-sm font-mono mt-1">
                  Guest since {new Date().getFullYear()}
                </p>
              </div>

              <div className="p-5 space-y-4">
                {/* Contact */}
                <div className="space-y-2">
                  <a
                    href={`tel:+91${selectedGuest.phone}`}
                    className="flex items-center space-x-3 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group"
                  >
                    <Phone
                      size={16}
                      className="text-gold group-hover:text-cream"
                    />
                    <span className="font-mono text-sm">
                      {selectedGuest.phone}
                    </span>
                  </a>
                  <a
                    href={`mailto:${selectedGuest.email}`}
                    className="flex items-center space-x-3 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group"
                  >
                    <Mail
                      size={16}
                      className="text-gold group-hover:text-cream"
                    />
                    <span className="font-mono text-sm truncate">
                      {selectedGuest.email}
                    </span>
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-50 text-center">
                    <p className="text-2xl font-display text-forest">
                      {selectedGuest.totalStays}
                    </p>
                    <p className="text-xs font-mono text-ink/50">STAYS</p>
                  </div>
                  <div className="p-3 bg-neutral-50 text-center">
                    <p className="text-lg font-display text-forest">
                      {formatCurrency(selectedGuest.totalSpent)}
                    </p>
                    <p className="text-xs font-mono text-ink/50">SPENT</p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-xs font-mono text-ink/50 mb-2 uppercase">
                    Notes & Preferences
                  </p>
                  <Textarea
                    defaultValue={selectedGuest.notes ?? ""}
                    placeholder="Add notes about this guest..."
                    rows={3}
                    className="text-sm"
                  />
                </div>

                {/* Booking History */}
                {guestBookings.length > 0 && (
                  <div>
                    <p className="text-xs font-mono text-ink/50 mb-2 uppercase">
                      Booking History
                    </p>
                    <div className="space-y-2">
                      {guestBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-3 bg-neutral-50 border border-neutral-100"
                        >
                          <p className="text-sm font-medium text-forest">
                            {b.propertyName}
                          </p>
                          <p className="text-xs font-mono text-ink/50">
                            {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                          </p>
                          <p className="text-xs font-mono text-forest mt-1">
                            {formatCurrency(b.totalAmount)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button variant="gold" size="sm" className="w-full">
                  Save Notes
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 p-12 text-center sticky top-20">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus size={24} className="text-neutral-400" />
              </div>
              <p className="text-ink/60 text-sm">
                Select a guest to view their profile and booking history
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Guest Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-display text-forest">Add Guest</h2>
              <button onClick={() => setShowAdd(false)}>
                <X size={20} className="text-ink/40 hover:text-ink" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Full Name *
                </label>
                <Input placeholder="Priya Sharma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Email *
                </label>
                <Input type="email" placeholder="priya@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Phone *
                </label>
                <Input type="tel" placeholder="9876543210" className="font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Notes
                </label>
                <Textarea placeholder="Any preferences or notes..." rows={3} />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-neutral-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                className="flex-1"
                onClick={() => {
                  setShowAdd(false);
                  alert("Guest added! (connects to API in production)");
                }}
              >
                Add Guest
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
