import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = requireAdmin();
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const days = Math.min(Number(searchParams.get("days") ?? 30), 90);

  // Build the date range (last N days)
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const startDate = dates[0];

  // Daily totals
  const rawViews = await prisma.pageView.findMany({
    where: { date: { gte: startDate } },
    select: { date: true, page: true },
  });

  // Aggregate by date
  const byDate: Record<string, number> = {};
  dates.forEach((d) => (byDate[d] = 0));
  for (const v of rawViews) {
    if (byDate[v.date] !== undefined) byDate[v.date]++;
  }

  const dailyData = dates.map((date) => ({
    date,
    views: byDate[date],
  }));

  // Top pages
  const pageCount: Record<string, number> = {};
  for (const v of rawViews) {
    pageCount[v.page] = (pageCount[v.page] ?? 0) + 1;
  }
  const topPages = Object.entries(pageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }));

  // Summary stats
  const totalViews = rawViews.length;
  const today = new Date().toISOString().slice(0, 10);
  const todayViews = byDate[today] ?? 0;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const yesterdayViews = byDate[yesterday] ?? 0;
  const avgPerDay = days > 0 ? Math.round(totalViews / days) : 0;

  return NextResponse.json({
    dailyData,
    topPages,
    stats: {
      totalViews,
      todayViews,
      yesterdayViews,
      avgPerDay,
      days,
    },
  });
}
