"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Eye, Calendar, BarChart2, ArrowUp, ArrowDown, Minus } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DayData {
  date: string;    // "YYYY-MM-DD"
  views: number;
}

interface TopPage {
  page: string;
  views: number;
}

interface Stats {
  totalViews: number;
  todayViews: number;
  yesterdayViews: number;
  avgPerDay: number;
  days: number;
}

interface AnalyticsData {
  dailyData: DayData[];
  topPages: TopPage[];
  stats: Stats;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const [, month, day] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[Number(month) - 1]} ${Number(day)}`;
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  trend,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  sub?: string;
  trend?: "up" | "down" | "flat";
}) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-mono font-semibold text-ink">{value}</p>
          {sub && (
            <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
              {trend === "up" && <ArrowUp size={11} className="text-green-500" />}
              {trend === "down" && <ArrowDown size={11} className="text-red-400" />}
              {trend === "flat" && <Minus size={11} className="text-neutral-400" />}
              {sub}
            </p>
          )}
        </div>
        <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
          <Icon size={18} className="text-gold" />
        </div>
      </div>
    </div>
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-200 rounded shadow-md px-3 py-2 text-sm">
      <p className="text-neutral-500 text-xs">{label}</p>
      <p className="font-semibold text-ink">{payload[0].value} visits</p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const RANGE_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "14 days", value: 14 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${range}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range]);

  const trend =
    !data ? "flat"
    : data.stats.todayViews > data.stats.yesterdayViews ? "up"
    : data.stats.todayViews < data.stats.yesterdayViews ? "down"
    : "flat";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-ink">Analytics</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Site visits and page performance</p>
        </div>

        {/* Range selector */}
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                range === opt.value
                  ? "bg-white text-ink shadow-sm"
                  : "text-neutral-500 hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-neutral-200 p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Today"
              value={data.stats.todayViews}
              icon={Eye}
              sub={`Yesterday: ${data.stats.yesterdayViews}`}
              trend={trend}
            />
            <StatCard
              label={`Total (${range}d)`}
              value={data.stats.totalViews.toLocaleString()}
              icon={TrendingUp}
            />
            <StatCard
              label="Daily Average"
              value={data.stats.avgPerDay}
              icon={BarChart2}
              sub="visits / day"
            />
            <StatCard
              label="Tracking Since"
              value={range}
              icon={Calendar}
              sub="days of data"
            />
          </div>

          {/* Area chart */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-sm font-semibold text-ink mb-4">Daily Visits</h2>
            {data.dailyData.every((d) => d.views === 0) ? (
              <div className="h-52 flex items-center justify-center text-neutral-400 text-sm">
                No visit data yet. Visits will appear here once pages are loaded by real users.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={data.dailyData.map((d) => ({
                    ...d,
                    date: formatDate(d.date),
                  }))}
                  margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    interval={range <= 14 ? 0 : range <= 30 ? 4 : 9}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#C9A84C"
                    strokeWidth={2}
                    fill="url(#viewsGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#C9A84C" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top pages */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6">
            <h2 className="text-sm font-semibold text-ink mb-4">Top Pages</h2>
            {data.topPages.length === 0 ? (
              <p className="text-sm text-neutral-400">No page data yet.</p>
            ) : (
              <div className="space-y-3">
                {data.topPages.map((item, i) => {
                  const maxViews = data.topPages[0].views;
                  const pct = maxViews > 0 ? (item.views / maxViews) * 100 : 0;
                  return (
                    <div key={item.page} className="flex items-center gap-3">
                      <span className="text-xs text-neutral-400 w-4 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-ink truncate font-mono">{item.page}</span>
                          <span className="text-sm font-semibold text-ink ml-4 shrink-0">
                            {item.views.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-neutral-500 text-sm">Failed to load analytics.</p>
      )}
    </div>
  );
}
