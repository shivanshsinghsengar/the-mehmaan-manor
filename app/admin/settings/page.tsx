"use client";

import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, AlertTriangle, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "brand", label: "Brand" },
  { key: "team", label: "Team" },
  { key: "notifications", label: "Notifications" },
  { key: "integrations", label: "Integrations" },
  { key: "danger", label: "Danger Zone" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // WhatsApp state
  const [waPhone, setWaPhone] = useState("918828352311");
  const [waName, setWaName] = useState("Simran");
  const [waSaving, setWaSaving] = useState(false);
  const [waSaved, setWaSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings/whatsapp")
      .then((r) => r.json())
      .then((d) => { if (d.phone) setWaPhone(d.phone); })
      .catch(() => {});
  }, []);

  const saveWhatsApp = async () => {
    setWaSaving(true);
    try {
      await fetch("/api/settings/whatsapp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: waPhone }),
      });
      setWaSaved(true);
      setTimeout(() => setWaSaved(false), 3000);
    } catch {
      alert("Save failed. Try again.");
    } finally {
      setWaSaving(false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Settings</h1>
          <p className="text-ink/60">Configure your Mehmaan Manor account</p>
        </div>
        {activeTab !== "danger" && (
          <Button
            variant="gold"
            onClick={handleSave}
            className={cn(saved && "bg-green-500")}
          >
            {saved ? (
              <>
                <Check size={16} className="mr-2" /> Saved!
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" /> Save Changes
              </>
            )}
          </Button>
        )}
      </div>

      {/* Tab Bar */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <div className="flex border-b border-neutral-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.key
                  ? "border-b-2 border-gold text-forest bg-gold/5"
                  : "text-ink/50 hover:text-ink",
                tab.key === "danger" && "text-red-500 hover:text-red-600"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* WHATSAPP TAB */}
          {activeTab === "whatsapp" && (
            <div className="space-y-6 max-w-lg">
              {/* Live preview */}
              <div className="flex items-center gap-4 p-4 bg-forest/5 border border-forest/15 rounded">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, oklch(0.32 0.05 155), oklch(0.22 0.04 155))" }}
                >
                  <MessageCircle size={24} className="text-gold" />
                </div>
                <div>
                  <p className="font-medium text-forest text-sm">Floating WhatsApp Button</p>
                  <p className="text-xs text-ink/60 mt-0.5">
                    Visible on every page — bottom right corner. Clicking it opens WhatsApp with the number below.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-forest mb-1">
                  WhatsApp Number
                </label>
                <p className="text-xs text-ink/50 mb-3">
                  Enter with country code, digits only. E.g. <span className="font-mono">918828352311</span> for +91 88283 52311
                </p>
                <div className="flex gap-3">
                  <Input
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="918828352311"
                    className="font-mono flex-1"
                    maxLength={15}
                  />
                  <Button
                    variant="gold"
                    onClick={saveWhatsApp}
                    disabled={waSaving}
                    className={cn(waSaved && "bg-green-500")}
                  >
                    {waSaved ? <><Check size={14} className="mr-1.5" /> Saved!</> :
                     waSaving ? "Saving…" : <><Save size={14} className="mr-1.5" /> Save</>}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-forest mb-1">
                  Name Label (display only)
                </label>
                <Input
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                  placeholder="Simran"
                  className="max-w-xs"
                />
                <p className="text-xs text-ink/40 mt-1">Used internally — not shown to guests yet.</p>
              </div>

              {/* Quick presets */}
              <div>
                <p className="text-xs font-mono text-ink/50 uppercase mb-3">Quick Switch</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Simran", phone: "918828352311" },
                    { name: "Vipin", phone: "918796568003" },
                    { name: "Jyoti", phone: "918796568002" },
                  ].map((m) => (
                    <button
                      key={m.phone}
                      onClick={() => { setWaPhone(m.phone); setWaName(m.name); }}
                      className={cn(
                        "p-3 border text-sm text-left transition-all",
                        waPhone === m.phone
                          ? "border-forest bg-forest/5 text-forest font-medium"
                          : "border-neutral-200 text-ink/60 hover:border-forest/40"
                      )}
                    >
                      <p className="font-medium">{m.name}</p>
                      <p className="font-mono text-xs text-ink/40 mt-0.5">+{m.phone.slice(0, 2)} {m.phone.slice(2, 7)} {m.phone.slice(7)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Test link */}
              {waPhone && (
                <div className="pt-2 border-t border-neutral-100">
                  <p className="text-xs text-ink/50 mb-2">Test it:</p>
                  <a
                    href={`https://wa.me/${waPhone}?text=Test%20from%20Mehmaan%20Manor%20admin`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-forest hover:text-gold transition-colors"
                  >
                    <MessageCircle size={14} />
                    Open WhatsApp with +{waPhone}
                  </a>
                </div>
              )}
            </div>
          )}
          {activeTab === "brand" && (
            <div className="space-y-6">
              <SectionTitle>Brand Identity</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Brand Name
                  </label>
                  <Input defaultValue="The Mehmaan Manor" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Instagram Handle
                  </label>
                  <Input defaultValue="@themehmaanmanor" className="font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Primary Tagline
                </label>
                <Input defaultValue="Not just a stay — it's the Mehmaan experience." />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Secondary Tagline
                </label>
                <Input defaultValue="Two homes. One promise. Endless memories." />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Footer Sign-off
                </label>
                <Input defaultValue="Thoughtful stays. Warm hospitality. Memories that stay." />
              </div>

              <hr className="border-neutral-100" />
              <SectionTitle>Contact Info</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Primary Phone (Simran)
                  </label>
                  <Input
                    defaultValue="+91 88283 52311"
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Primary Email
                  </label>
                  <Input
                    type="email"
                    defaultValue="simran@mehmaanmanor.com"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <SectionTitle>Team Members</SectionTitle>
              {[
                {
                  name: "Simran",
                  role: "Owner",
                  phone: "8828352311",
                  email: "simran@mehmaanmanor.com",
                },
                {
                  name: "Vipin",
                  role: "Manager",
                  phone: "8796568003",
                  email: "vipin@mehmaanmanor.com",
                },
                {
                  name: "Jyoti",
                  role: "Staff",
                  phone: "8796568002",
                  email: "jyoti@mehmaanmanor.com",
                },
              ].map((member, i) => (
                <div
                  key={i}
                  className="border border-neutral-200 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
                        <span className="font-display text-forest">
                          {member.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-forest">{member.name}</p>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            member.role === "Owner"
                              ? "bg-gold/20 text-gold"
                              : member.role === "Manager"
                              ? "bg-forest/10 text-forest"
                              : "bg-neutral-100 text-ink/60"
                          )}
                        >
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-ink/50 mb-1">
                        PHONE
                      </label>
                      <Input
                        defaultValue={member.phone}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-ink/50 mb-1">
                        EMAIL
                      </label>
                      <Input
                        type="email"
                        defaultValue={member.email}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                + Invite Team Member
              </Button>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <SectionTitle>Notification Preferences</SectionTitle>
              <p className="text-sm text-ink/60">
                Choose how you'd like to be notified about bookings, inquiries,
                and guest activity.
              </p>

              {[
                {
                  group: "Bookings",
                  items: [
                    "New booking received",
                    "Booking confirmed",
                    "Payment received",
                    "Booking cancelled",
                    "Check-in reminder (24h before)",
                    "Check-out reminder",
                  ],
                },
                {
                  group: "Inquiries",
                  items: [
                    "New inquiry received",
                    "Inquiry converted to booking",
                  ],
                },
                {
                  group: "Operations",
                  items: [
                    "Cleaning schedule reminder",
                    "Low occupancy alerts",
                    "Weekly revenue summary",
                  ],
                },
              ].map(({ group, items }) => (
                <div key={group} className="space-y-3">
                  <p className="text-sm font-semibold text-forest">{group}</p>
                  {items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between py-2 border-b border-neutral-50"
                    >
                      <span className="text-sm text-ink/80">{item}</span>
                      <div className="flex items-center gap-4">
                        {["Email", "SMS", "WhatsApp"].map((channel) => (
                          <label
                            key={channel}
                            className="flex items-center gap-1.5 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              defaultChecked={
                                channel === "WhatsApp" || channel === "Email"
                              }
                              className="accent-gold w-3.5 h-3.5"
                            />
                            <span className="text-xs text-ink/50">
                              {channel}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              <SectionTitle>Integrations</SectionTitle>
              <p className="text-sm text-ink/60">
                Connect external services to automate your operations.
              </p>

              {[
                {
                  name: "Razorpay",
                  description: "Payment gateway for collecting bookings",
                  keyLabel: "Key ID",
                  keyPlaceholder: "rzp_live_...",
                  secretLabel: "Key Secret",
                  secretPlaceholder: "rzp_secret_...",
                  badge: "Payments",
                },
                {
                  name: "Airbnb",
                  description: "Sync bookings and availability",
                  keyLabel: "API Key",
                  keyPlaceholder: "airbnb_api_...",
                  secretLabel: "Calendar URL",
                  secretPlaceholder: "https://www.airbnb.com/calendar/...",
                  badge: "Channel",
                },
                {
                  name: "Cloudinary",
                  description: "Store and optimize property images",
                  keyLabel: "Cloud Name",
                  keyPlaceholder: "your-cloud-name",
                  secretLabel: "API Key",
                  secretPlaceholder: "123456789",
                  badge: "Storage",
                },
                {
                  name: "Resend",
                  description: "Transactional email for booking confirmations",
                  keyLabel: "API Key",
                  keyPlaceholder: "re_...",
                  secretLabel: "From Email",
                  secretPlaceholder: "noreply@mehmaanmanor.com",
                  badge: "Email",
                },
                {
                  name: "Twilio",
                  description: "SMS and WhatsApp notifications",
                  keyLabel: "Account SID",
                  keyPlaceholder: "AC...",
                  secretLabel: "Auth Token",
                  secretPlaceholder: "your_auth_token",
                  badge: "SMS",
                },
              ].map((integration) => (
                <div
                  key={integration.name}
                  className="border border-neutral-200 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-forest">
                          {integration.name}
                        </h3>
                        <span className="text-xs bg-neutral-100 text-ink/60 px-2 py-0.5 rounded-full font-mono">
                          {integration.badge}
                        </span>
                      </div>
                      <p className="text-xs text-ink/50 mt-0.5">
                        {integration.description}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-ink/50">Enable</span>
                      <input
                        type="checkbox"
                        className="accent-gold w-4 h-4"
                        defaultChecked={false}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-ink/50 mb-1">
                        {integration.keyLabel.toUpperCase()}
                      </label>
                      <Input
                        placeholder={integration.keyPlaceholder}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-mono text-ink/50 mb-1">
                        {integration.secretLabel.toUpperCase()}
                      </label>
                      <div className="relative">
                        <Input
                          type={showSecrets[integration.name] ? "text" : "password"}
                          placeholder={integration.secretPlaceholder}
                          className="font-mono text-sm pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => toggleSecret(integration.name)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink"
                        >
                          {showSecrets[integration.name] ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DANGER ZONE TAB */}
          {activeTab === "danger" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle size={18} className="text-red-500" />
                <SectionTitle className="text-red-600">Danger Zone</SectionTitle>
              </div>
              <p className="text-sm text-ink/60">
                These actions are irreversible. Please proceed with caution.
              </p>

              <div className="space-y-4">
                <DangerAction
                  title="Export All Data"
                  description="Download all bookings, guests, and property data as a CSV/JSON archive."
                  buttonLabel="Export Data"
                  buttonVariant="outline"
                  onClick={() => alert("Exporting... (connects to API in production)")}
                />
                <DangerAction
                  title="Change Password"
                  description="Update the password for your admin account."
                  buttonLabel="Change Password"
                  buttonVariant="outline"
                  onClick={() => alert("Password change modal (connects to auth in production)")}
                />
                <div className="border-2 border-red-200 p-5">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="font-medium text-red-700">
                        Delete All Bookings
                      </p>
                      <p className="text-sm text-red-500/70 mt-1">
                        Permanently delete all booking records. Guest data is
                        retained.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50 shrink-0"
                      onClick={() =>
                        confirm(
                          "This will permanently delete ALL bookings. Are you absolutely sure?"
                        ) && alert("Deleted (mock)")
                      }
                    >
                      Delete All
                    </Button>
                  </div>
                </div>
                <div className="border-2 border-red-400 p-5 bg-red-50">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="font-bold text-red-700">Delete Account</p>
                      <p className="text-sm text-red-600/70 mt-1">
                        Permanently delete your Mehmaan Manor account, all
                        properties, bookings, guests, and data. This cannot be
                        undone.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white border-0 shrink-0"
                      onClick={() =>
                        confirm(
                          "FINAL WARNING: This deletes everything. Type DELETE to confirm."
                        )
                      }
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn("text-lg font-display text-forest", className)}>
      {children}
    </h2>
  );
}

function DangerAction({
  title,
  description,
  buttonLabel,
  buttonVariant,
  onClick,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  buttonVariant: "outline" | "default";
  onClick: () => void;
}) {
  return (
    <div className="border border-neutral-200 p-5 flex items-start justify-between gap-6">
      <div>
        <p className="font-medium text-forest">{title}</p>
        <p className="text-sm text-ink/60 mt-1">{description}</p>
      </div>
      <Button
        variant={buttonVariant}
        size="sm"
        onClick={onClick}
        className="shrink-0"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
