"use client";

import { useState } from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Home,
  CheckCircle,
  X,
  Send,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockInquiries } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type StatusType = "NEW" | "REPLIED" | "BOOKED" | "CLOSED";
type Inquiry = (typeof mockInquiries)[0];

const STATUS_CONFIG: Record<StatusType, { label: string; color: string }> = {
  NEW: { label: "New", color: "bg-blue-100 text-blue-700" },
  REPLIED: { label: "Replied", color: "bg-yellow-100 text-yellow-700" },
  BOOKED: { label: "Booked", color: "bg-green-100 text-green-700" },
  CLOSED: { label: "Closed", color: "bg-neutral-100 text-neutral-600" },
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [selected, setSelected] = useState<Inquiry | null>(inquiries[0]);
  const [filter, setFilter] = useState<"ALL" | StatusType>("ALL");
  const [replyText, setReplyText] = useState(selected?.reply ?? "");
  const [sending, setSending] = useState(false);

  const filtered = inquiries.filter((i) =>
    filter === "ALL" ? true : i.status === filter
  );

  const handleSelect = (inq: Inquiry) => {
    setSelected(inq);
    setReplyText(inq.reply ?? "");
  };

  const handleStatusChange = (id: string, status: StatusType) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleSendReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setInquiries((prev) =>
      prev.map((i) =>
        i.id === selected.id ? { ...i, reply: replyText, status: "REPLIED" } : i
      )
    );
    setSelected((prev) =>
      prev ? { ...prev, reply: replyText, status: "REPLIED" } : null
    );
    setSending(false);
  };

  const handleConvertToBooking = () => {
    if (!selected) return;
    handleStatusChange(selected.id, "BOOKED");
    alert(
      `Inquiry from ${selected.name} converted to booking!\n\nIn production, this opens the New Booking form pre-filled with their details.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Inquiries</h1>
          <p className="text-ink/60">
            {inquiries.filter((i) => i.status === "NEW").length} new inquiries
          </p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["ALL", "NEW", "REPLIED", "BOOKED", "CLOSED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-4 py-1.5 text-sm font-medium transition-colors border",
              filter === s
                ? "bg-forest text-cream border-forest"
                : "bg-white text-ink/60 border-neutral-200 hover:border-neutral-400"
            )}
          >
            {s === "ALL" ? "All" : STATUS_CONFIG[s].label}
            <span className="ml-1.5 font-mono text-xs opacity-60">
              {s === "ALL"
                ? inquiries.length
                : inquiries.filter((i) => i.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[600px]">
        {/* Inquiry List */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <MessageSquare
                  size={32}
                  className="mx-auto text-neutral-300 mb-3"
                />
                <p className="text-ink/50 text-sm">No inquiries found</p>
              </div>
            )}
            {filtered.map((inq) => {
              const cfg = STATUS_CONFIG[inq.status as StatusType];
              return (
                <button
                  key={inq.id}
                  onClick={() => handleSelect(inq)}
                  className={cn(
                    "w-full text-left p-5 transition-colors hover:bg-neutral-50",
                    selected?.id === inq.id && "bg-gold/5 border-l-2 border-gold"
                  )}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-forest text-sm">
                      {inq.name}
                      {inq.status === "NEW" && (
                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-ink/50 font-mono mb-2">
                    {formatDate(inq.createdAt)}
                  </p>
                  <p className="text-sm text-ink/70 line-clamp-2">
                    {inq.message}
                  </p>
                  {inq.propertyName && (
                    <p className="text-xs text-gold mt-2 font-mono">
                      → {inq.propertyName}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3 bg-white border border-neutral-200">
          {selected ? (
            <div className="h-full flex flex-col">
              {/* Inquiry Header */}
              <div className="p-6 border-b border-neutral-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-display text-forest">
                      {selected.name}
                    </h2>
                    <p className="text-xs font-mono text-ink/50">
                      Received {formatDate(selected.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selected.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selected.id,
                          e.target.value as StatusType
                        )
                      }
                      className="text-xs border border-neutral-200 px-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                    >
                      <option value="NEW">New</option>
                      <option value="REPLIED">Replied</option>
                      <option value="BOOKED">Booked</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:+91${selected.phone}`}
                    className="flex items-center space-x-2 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group text-sm"
                  >
                    <Phone
                      size={14}
                      className="text-gold group-hover:text-cream"
                    />
                    <span className="font-mono">{selected.phone}</span>
                  </a>
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex items-center space-x-2 p-3 bg-neutral-50 hover:bg-forest hover:text-cream transition-all group text-sm"
                  >
                    <Mail
                      size={14}
                      className="text-gold group-hover:text-cream"
                    />
                    <span className="font-mono truncate">{selected.email}</span>
                  </a>
                </div>

                {/* Inquiry Details */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {selected.propertyName && (
                    <div className="flex items-center space-x-2 text-sm text-ink/70">
                      <Home size={14} className="text-gold" />
                      <span>{selected.propertyName}</span>
                    </div>
                  )}
                  {selected.dates && (
                    <div className="flex items-center space-x-2 text-sm text-ink/70">
                      <Calendar size={14} className="text-gold" />
                      <span className="font-mono">{selected.dates}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {/* Guest message */}
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-ink/60">
                      {selected.name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-neutral-50 p-4">
                      <p className="text-sm text-ink/80 leading-relaxed">
                        {selected.message}
                      </p>
                    </div>
                    <p className="text-xs text-ink/40 mt-1 font-mono">
                      {formatDate(selected.createdAt)} · Guest
                    </p>
                  </div>
                </div>

                {/* Reply thread */}
                {selected.reply && (
                  <div className="flex items-start space-x-3 flex-row-reverse">
                    <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-cream">S</span>
                    </div>
                    <div className="flex-1 text-right">
                      <div className="bg-forest/5 border border-forest/10 p-4 text-left">
                        <p className="text-sm text-ink/80 leading-relaxed">
                          {selected.reply}
                        </p>
                      </div>
                      <p className="text-xs text-ink/40 mt-1 font-mono">
                        You · Team Mehmaan
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Box */}
              <div className="p-5 border-t border-neutral-100 space-y-3">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                  className="text-sm resize-none"
                />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConvertToBooking}
                    disabled={selected.status === "BOOKED"}
                  >
                    <ArrowRight size={14} className="mr-2" />
                    Convert to Booking
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sending}
                  >
                    <Send size={14} className="mr-2" />
                    {sending ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-center">
              <div>
                <MessageSquare
                  size={40}
                  className="mx-auto text-neutral-300 mb-4"
                />
                <p className="text-ink/50">Select an inquiry to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
