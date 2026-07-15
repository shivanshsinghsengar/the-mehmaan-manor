"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Phone, Mail, MessageCircle, RefreshCw, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BookingRecord } from "@/lib/bookings-store";

interface GuestSummary {
  name: string;
  email: string;
  phone: string;
  totalStays: number;
  totalSpent: number;
  lastStay: string;
  bookings: BookingRecord[];
}

function buildGuestList(bookings: BookingRecord[]): GuestSummary[] {
  const map = new Map<string, GuestSummary>();
  bookings.forEach((b) => {
    const key = b.guestEmail.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.totalStays += 1;
      existing.totalSpent += b.status === "CONFIRMED" ? b.totalAmount : 0;
      if (b.checkIn > existing.lastStay) existing.lastStay = b.checkIn;
      existing.bookings.push(b);
    } else {
      map.set(key, {
        name: b.guestName,
        email: b.guestEmail,
        phone: b.guestPhone,
        totalStays: 1,
        totalSpent: b.status === "CONFIRMED" ? b.totalAmount : 0,
        lastStay: b.checkIn,
        bookings: [b],
      });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.lastStay.localeCompare(a.lastStay));
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<GuestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GuestSummary | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setGuests(buildGuestList(data.bookings || []));
    } catch {/* ignore */}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = guests.filter((g) =>
    !search ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Guests</h1>
          <p className="text-ink/60">{guests.length} unique guests from bookings</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-ink/50 hover:text-forest transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..." className="pl-10" />
          </div>

          <div className="bg-white border border-neutral-200 overflow-hidden">
            {loading ? (
              <div className="py-16 text-center text-ink/40 font-mono text-sm">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Users size={32} className="mx-auto text-neutral-300 mb-3" />
                <p className="text-ink/50 text-sm">
                  {search ? `No guests matching "${search}"` : "No guests yet — they appear after first booking."}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    {["Guest", "Contact", "Stays", "Total Spent", "Last Stay"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-ink/60 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((g) => (
                    <tr key={g.email} onClick={() => setSelected(g)}
                      className={`cursor-pointer transition-colors hover:bg-neutral-50 ${selected?.email === g.email ? "bg-gold/5" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0">
                            <span className="font-display text-forest text-sm">{g.name[0]}</span>
                          </div>
                          <p className="text-sm font-medium text-forest">{g.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs text-ink/60"><Mail size={10} /><span className="font-mono truncate max-w-[140px]">{g.email}</span></div>
                          <div className="flex items-center gap-1 text-xs text-ink/60"><Phone size={10} /><span className="font-mono">{g.phone}</span></div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className="text-sm font-medium text-forest">{g.totalStays}</span></td>
                      <td className="px-5 py-4 font-mono text-sm text-forest">{formatCurrency(g.totalSpent)}</td>
                      <td className="px-5 py-4 font-mono text-sm text-ink/60">{formatDate(g.lastStay)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white border border-neutral-200 overflow-hidden sticky top-20">
              <div className="p-6 bg-forest text-cream">
                <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                  <span className="font-display text-gold text-2xl">{selected.name[0]}</span>
                </div>
                <h3 className="text-xl font-display">{selected.name}</h3>
                <p className="text-cream/70 text-sm font-mono mt-1">{selected.totalStays} stay{selected.totalStays !== 1 ? "s" : ""}</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <a href={`tel:+91${selected.phone}`}
                    className="flex items-center gap-3 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group">
                    <Phone size={16} className="text-gold group-hover:text-cream" />
                    <span className="font-mono text-sm">{selected.phone}</span>
                  </a>
                  <a href={`mailto:${selected.email}`}
                    className="flex items-center gap-3 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group">
                    <Mail size={16} className="text-gold group-hover:text-cream" />
                    <span className="font-mono text-sm truncate">{selected.email}</span>
                  </a>
                  <a href={`https://wa.me/91${selected.phone}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 transition-all">
                    <MessageCircle size={16} className="text-green-600" />
                    <span className="text-sm text-green-700">WhatsApp</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-50 text-center">
                    <p className="text-2xl font-display text-forest">{selected.totalStays}</p>
                    <p className="text-xs font-mono text-ink/50">STAYS</p>
                  </div>
                  <div className="p-3 bg-neutral-50 text-center">
                    <p className="text-lg font-display text-forest">{formatCurrency(selected.totalSpent)}</p>
                    <p className="text-xs font-mono text-ink/50">SPENT</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-mono text-ink/50 mb-2 uppercase">Booking History</p>
                  <div className="space-y-2">
                    {selected.bookings.map((b) => (
                      <div key={b.id} className="p-3 bg-neutral-50 border border-neutral-100">
                        <p className="text-sm font-medium text-forest">{b.propertyName}</p>
                        <p className="text-xs font-mono text-ink/50">{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs font-mono text-forest">{formatCurrency(b.totalAmount)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {b.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 p-12 text-center sticky top-20">
              <Users size={24} className="mx-auto text-neutral-300 mb-3" />
              <p className="text-ink/60 text-sm">Select a guest to view their profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
