"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  TrendingUp,
  Users,
  IndianRupee,
} from "lucide-react";
import { mockBookings, mockRevenueData } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const kpis = [
  {
    label: "Today's Check-ins",
    value: "2",
    change: "+1 from yesterday",
    icon: Calendar,
    trend: "up",
  },
  {
    label: "Occupancy Rate",
    value: "78%",
    change: "+5% from last week",
    icon: TrendingUp,
    trend: "up",
  },
  {
    label: "New Inquiries",
    value: "5",
    change: "+2 from yesterday",
    icon: Users,
    trend: "up",
  },
  {
    label: "Revenue (MTD)",
    value: "₹72,000",
    change: "+18% from last month",
    icon: IndianRupee,
    trend: "up",
  },
];

export default function AdminDashboard() {
  const upcomingBookings = mockBookings.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display text-forest mb-2">Dashboard</h1>
        <p className="text-ink/60">
          Welcome back, Simran. Here's what's happening today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white p-6 border border-neutral-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-forest/5 flex items-center justify-center group-hover:bg-forest group-hover:text-cream transition-all">
                <kpi.icon size={20} />
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  kpi.trend === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {kpi.trend === "up" ? (
                  <ArrowUpRight size={12} className="inline" />
                ) : (
                  <ArrowDownRight size={12} className="inline" />
                )}
              </span>
            </div>
            <p className="text-sm text-ink/50 mb-1">{kpi.label}</p>
            <p className="text-3xl font-display text-forest mb-2 group-hover:scale-105 transition-transform origin-left">
              {kpi.value}
            </p>
            <p className="text-xs text-ink/40">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 bg-white p-6 border border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display text-forest">
              Upcoming Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-sm text-gold hover:text-forest transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="flex items-center justify-between p-4 hover:bg-forest/5 transition-colors border border-transparent hover:border-forest/10"
              >
                <div className="flex-1">
                  <p className="font-medium text-forest">
                    {booking.guestName}
                  </p>
                  <p className="text-sm text-ink/60 font-mono">
                    {booking.propertyName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-ink">
                    {formatDate(booking.checkIn)}
                  </p>
                  <p className="text-xs text-ink/50">
                    {booking.guestsCount} guests
                  </p>
                </div>
                <div className="ml-6">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Property Status */}
          <div className="bg-white p-6 border border-neutral-200">
            <h2 className="text-xl font-display text-forest mb-4">
              Property Status
            </h2>
            <div className="space-y-4">
              <div className="pb-4 border-b border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-forest">Sushant Lok</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    OCCUPIED
                  </span>
                </div>
                <p className="text-sm text-ink/60">
                  Guest: Arjun Mehta
                  <br />
                  <span className="font-mono text-xs">
                    Check-out: {formatDate(new Date("2024-07-18"))}
                  </span>
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-forest">
                    Jharsa Village
                  </span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                    CLEANING
                  </span>
                </div>
                <p className="text-sm text-ink/60">
                  Next check-in: Priya Sharma
                  <br />
                  <span className="font-mono text-xs">
                    {formatDate(new Date("2024-07-20"))}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 border border-neutral-200">
            <h2 className="text-xl font-display text-forest mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold rounded-full mt-2" />
                <div>
                  <p className="text-forest">New booking confirmed</p>
                  <p className="text-xs text-ink/50 font-mono">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-forest rounded-full mt-2" />
                <div>
                  <p className="text-forest">Inquiry received</p>
                  <p className="text-xs text-ink/50 font-mono">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-forest/30 rounded-full mt-2" />
                <div>
                  <p className="text-forest">Payment received</p>
                  <p className="text-xs text-ink/50 font-mono">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white p-6 border border-neutral-200">
        <h2 className="text-xl font-display text-forest mb-6">
          Revenue Trend (Last 6 Months)
        </h2>
        <div className="h-64 flex items-end space-x-4">
          {mockRevenueData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-forest hover:bg-gold transition-all cursor-pointer"
                style={{
                  height: `${(data.revenue / 80000) * 100}%`,
                }}
              />
              <p className="text-xs text-ink/50 mt-2 font-mono">{data.month}</p>
              <p className="text-xs text-ink/70 font-mono">
                {formatCurrency(data.revenue)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
