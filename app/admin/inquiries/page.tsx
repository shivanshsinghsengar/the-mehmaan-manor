"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Phone, Mail, Calendar, Home, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  dates: string;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NEW:     { label: "New",     color: "bg-blue-100 text-blue-700" },
  READ:    { label: "Read",    color: "bg-neutral-100 text-neutral-600" },
  REPLIED: { label: "Replied", color: "bg-yellow-100 text-yellow-700" },
  BOOKED:  { label: "Booked",  color: "bg-green-100 text-green-700" },
};

const PROPERTY_LABELS: Record<string, string> = {
  "sushant-lok": "Sushant Lok",
  "jharsa-village": "Jharsa Village",
  "either": "Either works",
  "": "Not specified",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [filter, setFilter] = useState("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      const list = data.inquiries || [];
      setInquiries(list);
      if (!selected && list.length > 0) setSelected(list[0]);
    } catch {/* ignore */}
    finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { load(); }, []); // eslint-disable-line

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  };

  const filtered = inquiries.filter((i) => filter === "ALL" || i.status === filter);
  const newCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Inquiries</h1>
          <p className="text-ink/60">{newCount} new {newCount === 1 ? "inquiry" : "inquiries"}</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-ink/50 hover:text-forest transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {["ALL", "NEW", "READ", "REPLIED", "BOOKED"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium transition-colors border",
              filter === s ? "bg-forest text-cream border-forest" : "bg-white text-ink/60 border-neutral-200 hover:border-neutral-400"
            )}>
            {s === "ALL" ? "All" : (STATUS_CONFIG[s]?.label || s)}
            <span className="ml-1.5 font-mono text-xs opacity-60">
              {s === "ALL" ? inquiries.length : inquiries.filter((i) => i.status === s).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[500px]">
        {/* List */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-ink/40 font-mono text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare size={32} className="mx-auto text-neutral-300 mb-3" />
              <p className="text-ink/50 text-sm">
                {filter === "ALL" ? "No inquiries yet. They appear when guests submit the contact form." : `No ${filter.toLowerCase()} inquiries.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filtered.map((inq) => {
                const cfg = STATUS_CONFIG[inq.status] || { label: inq.status, color: "bg-neutral-100 text-neutral-600" };
                return (
                  <button key={inq.id} onClick={() => { setSelected(inq); if (inq.status === "NEW") updateStatus(inq.id, "READ"); }}
                    className={cn(
                      "w-full text-left p-5 transition-colors hover:bg-neutral-50",
                      selected?.id === inq.id && "bg-gold/5 border-l-2 border-gold"
                    )}>
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-forest text-sm">
                        {inq.name}
                        {inq.status === "NEW" && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-ink/50 font-mono mb-2">{formatDate(inq.createdAt)}</p>
                    <p className="text-sm text-ink/70 line-clamp-2">{inq.message}</p>
                    {inq.property && inq.property !== "" && (
                      <p className="text-xs text-gold mt-2 font-mono">→ {PROPERTY_LABELS[inq.property] || inq.property}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 bg-white border border-neutral-200">
          {selected ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-display text-forest">{selected.name}</h2>
                    <p className="text-xs font-mono text-ink/50">Received {formatDate(selected.createdAt)}</p>
                  </div>
                  <select value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                    className="text-xs border border-neutral-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gold">
                    {["NEW","READ","REPLIED","BOOKED"].map((s) => (
                      <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a href={`tel:+91${selected.phone}`}
                    className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group text-sm">
                    <Phone size={14} className="text-gold group-hover:text-cream" />
                    <span className="font-mono">{selected.phone}</span>
                  </a>
                  <a href={`mailto:${selected.email}`}
                    className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group text-sm">
                    <Mail size={14} className="text-gold group-hover:text-cream" />
                    <span className="font-mono truncate">{selected.email}</span>
                  </a>
                </div>

                <div className="flex flex-wrap gap-4 mt-3">
                  {selected.property && selected.property !== "" && (
                    <div className="flex items-center gap-2 text-sm text-ink/70">
                      <Home size={14} className="text-gold" />
                      <span>{PROPERTY_LABELS[selected.property] || selected.property}</span>
                    </div>
                  )}
                  {selected.dates && (
                    <div className="flex items-center gap-2 text-sm text-ink/70">
                      <Calendar size={14} className="text-gold" />
                      <span className="font-mono">{selected.dates}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 p-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-ink/60">{selected.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-neutral-50 p-4">
                      <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                    </div>
                    <p className="text-xs text-ink/40 mt-1 font-mono">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-neutral-100 flex items-center gap-3">
                <a href={`https://wa.me/91${selected.phone}?text=${encodeURIComponent(`Hi ${selected.name}! Thank you for your inquiry about The Mehmaan Manor. `)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors">
                  Reply via WhatsApp
                </a>
                <a href={`mailto:${selected.email}?subject=Re: Your Mehmaan Manor Inquiry`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-deep text-cream text-sm font-medium transition-colors">
                  Reply via Email
                </a>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/bookings/new`}>
                    <ArrowRight size={14} className="mr-1" /> Book
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center">
              <div>
                <MessageSquare size={40} className="mx-auto text-neutral-300 mb-4" />
                <p className="text-ink/50">Select an inquiry to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
