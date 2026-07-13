"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Calendar, TrendingUp, Users, IndianRupee, RefreshCw } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BookingRecord } from "@/lib/bookings-store";

function getMonthLabel(date: Date) {
  return date.toLocaleString("en-IN", { month: "short" });
}

function buildRevenueChart(bookings: BookingRecord[]) {
  const now = new Date();
  const months: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: getMonthLabel(d), revenue: 0 });
  }
  bookings.forEach((b) => {
    if (b.status !== "CONFIRMED") return;
    const bDate = new Date(b.createdAt);
    const diffMonths =
      (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth());
    if (diffMonths >= 0 && diffMonths <= 5) {
      months[5 - diffMonths].revenue += b.totalAmount;
    }
  });
  return months;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().slice(0, 10);
  const todayCheckIns = bookings.filter(
    (b) => b.checkIn.slice(0, 10) === today && b.status === "CONFIRMED"
  ).length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const totalBookings = bookings.length;
  const occupancy = totalBookings > 0 ? Math.round((confirmedCount / totalBookings) * 100) : 0;

  const now = new Date();
  const mtdRevenue = bookings
    .filter((b) => {
      if (b.status !== "CONFIRMED") return false;
      const d = new Date(b.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, b) => s + b.totalAmount, 0);

  const upcomingBookings = bookings
    .filter((b) => b.checkIn >= today && b.status === "CONFIRMED")
    .slice(0, 6);

  const revenueData = buildRevenueChart(bookings);
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1);

  const kpis = [
    { label: "Today's Check-ins", value: String(todayCheckIns), icon: Calendar, color: "text-forest" },
    { label: "Occupancy Rate", value: `${occupancy}%`, icon: TrendingUp, color: "text-forest" },
    { label: "Total Bookings", value: String(totalBookings), icon: Users, color: "text-forest" },
    { label: "Revenue (MTD)", value: formatCurrency(mtdRevenue), icon: IndianRupee, color: "text-forest" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Dashboard</h1>
          <p className="text-ink/60">Welcome back, Simran. Here's what's happening.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-ink/50 hover:text-forest transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 border border-neutral-200 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-forest/5 flex items-center justify-center group-hover:bg-forest group-hover:text-cream transition-all">
                <kpi.icon size={20} />
              </div>
            </div>
            <p className="text-sm text-ink/50 mb-1">{kpi.label}</p>
            <p className="text-3xl font-display text-forest group-hover:scale-105 transition-transform origin-left">
              {loading ? "—" : kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 bg-white p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display text-forest">Upcoming Confirmed Stays</h2>
            <Link href="/admin/bookings" className="text-sm text-gold hover:text-forest transition-colors">
              View All →
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-ink/40 font-mono py-8 text-center">Loading…</p>
          ) : upcomingBookings.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar size={32} className="mx-auto text-neutral-300 mb-3" />
              <p className="text-sm text-ink/50">No upcoming confirmed bookings</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingBookings.map((b) => (
                <Link key={b.id} href={`/admin/bookings/${b.id}`}
                  className="flex items-center justify-between p-4 hover:bg-forest/5 transition-colors border border-transparent hover:border-forest/10">
                  <div className="flex-1">
                    <p className="font-medium text-forest">{b.guestName}</p>
                    <p className="text-sm text-ink/60 font-mono">{b.propertyName}</p>
                  </div>
                  <div className="text-right mr-6">
                    <p className="text-sm font-mono text-ink">{formatDate(b.checkIn)}</p>
                    <p className="text-xs text-ink/50">{b.guests} guests</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                    CONFIRMED
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Property Snapshot */}
        <div className="bg-white p-6 border border-neutral-200">
          <h2 className="text-xl font-display text-forest mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50">
              <p className="text-xs font-mono text-ink/50 mb-1">TOTAL CONFIRMED</p>
              <p className="text-2xl font-display text-green-600">{loading ? "—" : confirmedCount}</p>
            </div>
            <div className="p-4 bg-neutral-50">
              <p className="text-xs font-mono text-ink/50 mb-1">PENDING PAYMENT</p>
              <p className="text-2xl font-display text-yellow-600">
                {loading ? "—" : bookings.filter((b) => b.status === "PENDING_PAYMENT").length}
              </p>
            </div>
            <div className="p-4 bg-neutral-50">
              <p className="text-xs font-mono text-ink/50 mb-1">ALL-TIME REVENUE</p>
              <p className="text-2xl font-display text-forest">
                {loading ? "—" : formatCurrency(bookings.filter((b) => b.status === "CONFIRMED").reduce((s, b) => s + b.totalAmount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 border border-neutral-200">
        <h2 className="text-xl font-display text-forest mb-6">Revenue Trend (Last 6 Months)</h2>
        <div className="h-48 flex items-end gap-4">
          {revenueData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-forest hover:bg-gold transition-colors cursor-pointer min-h-[4px]"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                title={formatCurrency(d.revenue)}
              />
              <p className="text-xs text-ink/50 mt-2 font-mono">{d.month}</p>
              <p className="text-xs text-ink/60 font-mono">{d.revenue > 0 ? formatCurrency(d.revenue) : "—"}</p>
            </div>
          ))}
        </div>
        {!loading && bookings.filter((b) => b.status === "CONFIRMED").length === 0 && (
          <p className="text-center text-sm text-ink/40 font-mono mt-4">
            Revenue data will appear here once bookings are confirmed.
          </p>
        )}
      </div>
    </div>
  );
}
