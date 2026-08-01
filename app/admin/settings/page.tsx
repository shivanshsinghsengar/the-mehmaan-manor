"use client";

import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, AlertTriangle, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "brand", label: "Brand" },
  { key: "team", label: "Team" },
  { key: "notifications", label: "Notifications" },
  { key: "integrations", label: "Integrations" },
  { key: "danger", label: "Danger Zone" },
];

const NOTIF_GROUPS = [
  { group: "Bookings", items: ["New booking received","Booking confirmed","Payment received","Booking cancelled","Check-in reminder (24h before)","Check-out reminder"] },
  { group: "Inquiries", items: ["New inquiry received","Inquiry converted to booking"] },
  { group: "Operations", items: ["Cleaning schedule reminder","Low occupancy alerts","Weekly revenue summary"] },
];

type NotifPrefs = Record<string, Record<string, boolean>>;

function buildDefaultNotifPrefs(): NotifPrefs {
  const prefs: NotifPrefs = {};
  for (const g of NOTIF_GROUPS) {
    for (const item of g.items) {
      prefs[item] = { Email: true, SMS: false, WhatsApp: true };
    }
  }
  return prefs;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // WhatsApp state
  const [waPhone, setWaPhone] = useState("918828352311");
  const [waName, setWaName] = useState("Simran");
  const [waSaving, setWaSaving] = useState(false);
  const [waSaved, setWaSaved] = useState(false);

  // Brand state
  const [brand, setBrand] = useState({ instagramHandle: "@themehmaanmanor", taglinePrimary: "", taglineSecondary: "", heroHeadline: "", heroSubtitle: "" });
  const [brandSaving, setBrandSaving] = useState(false);
  const [brandSaved, setBrandSaved] = useState(false);

  // Team state
  const [teamPhones, setTeamPhones] = useState({ simran: "8828352311", vipin: "8796568003", jyoti: "8796568002" });
  const [teamSaving, setTeamSaving] = useState(false);
  const [teamSaved, setTeamSaved] = useState(false);

  // Notifications state
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(buildDefaultNotifPrefs());
  const [notifSaved, setNotifSaved] = useState(false);

  // Danger zone state
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/settings/whatsapp")
      .then((r) => r.json())
      .then((d) => { if (d.phone) setWaPhone(d.phone); })
      .catch(() => {});

    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => {
        setBrand({
          instagramHandle: d.instagramHandle || "@themehmaanmanor",
          taglinePrimary: d.taglinePrimary || "",
          taglineSecondary: d.taglineSecondary || "",
          heroHeadline: d.heroHeadline || "",
          heroSubtitle: d.heroSubtitle || "",
        });
        setTeamPhones({
          simran: d.teamSimranPhone || "8828352311",
          vipin: d.teamVipinPhone || "8796568003",
          jyoti: d.teamJyotiPhone || "8796568002",
        });
      })
      .catch(() => {});

    try {
      const stored = localStorage.getItem("mm_notification_prefs");
      if (stored) setNotifPrefs(JSON.parse(stored));
    } catch {}
  }, []);

  const saveWhatsApp = async () => {
    setWaSaving(true);
    try {
      await fetch("/api/settings/whatsapp", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: waPhone }) });
      setWaSaved(true); setTimeout(() => setWaSaved(false), 3000);
    } catch {} finally { setWaSaving(false); }
  };

  const saveBrand = async () => {
    setBrandSaving(true);
    try {
      await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(brand) });
      setBrandSaved(true); setTimeout(() => setBrandSaved(false), 3000);
    } catch {} finally { setBrandSaving(false); }
  };

  const saveTeam = async () => {
    setTeamSaving(true);
    try {
      await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ teamSimranPhone: teamPhones.simran, teamVipinPhone: teamPhones.vipin, teamJyotiPhone: teamPhones.jyoti }) });
      setTeamSaved(true); setTimeout(() => setTeamSaved(false), 3000);
    } catch {} finally { setTeamSaving(false); }
  };

  const saveNotifs = () => {
    try { localStorage.setItem("mm_notification_prefs", JSON.stringify(notifPrefs)); } catch {}
    setNotifSaved(true); setTimeout(() => setNotifSaved(false), 3000);
  };

  const toggleNotif = (item: string, channel: string, val: boolean) => {
    setNotifPrefs((prev) => ({ ...prev, [item]: { ...prev[item], [channel]: val } }));
  };

  const handleExport = async () => {
    const res = await fetch("/api/admin/export");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mehmaan-manor-bookings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllBookings = async () => {
    if (deleteConfirmText !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/bookings/all", { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirmText("");
        window.location.reload();
      }
    } catch {} finally { setDeleting(false); }
  };

  const toggleSecret = (key: string) => setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Settings</h1>
          <p className="text-ink/60">Configure your Mehmaan Manor account</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 overflow-hidden">
        <div className="flex border-b border-neutral-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn("px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.key ? "border-b-2 border-gold text-forest bg-gold/5" : "text-ink/50 hover:text-ink",
                tab.key === "danger" && "text-red-500 hover:text-red-600")}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {/* WHATSAPP TAB */}
          {activeTab === "whatsapp" && (
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center gap-4 p-4 bg-forest/5 border border-forest/15 rounded">
                <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, oklch(0.32 0.05 155), oklch(0.22 0.04 155))" }}>
                  <MessageCircle size={24} className="text-gold" />
                </div>
                <div>
                  <p className="font-medium text-forest text-sm">Floating WhatsApp Button</p>
                  <p className="text-xs text-ink/60 mt-0.5">Visible on every page — bottom right. Clicking opens WhatsApp with the number below.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">WhatsApp Number</label>
                <p className="text-xs text-ink/50 mb-3">Enter with country code, digits only. E.g. <span className="font-mono">918828352311</span></p>
                <div className="flex gap-3">
                  <Input value={waPhone} onChange={(e) => setWaPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="918828352311" className="font-mono flex-1" maxLength={15} />
                  <Button variant="gold" onClick={saveWhatsApp} disabled={waSaving} className={cn(waSaved && "bg-green-500")}>
                    {waSaved ? <><Check size={14} className="mr-1.5" />Saved!</> : waSaving ? "Saving…" : <><Save size={14} className="mr-1.5" />Save</>}
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Name Label</label>
                <Input value={waName} onChange={(e) => setWaName(e.target.value)} placeholder="Simran" className="max-w-xs" />
              </div>
              <div>
                <p className="text-xs font-mono text-ink/50 uppercase mb-3">Quick Switch</p>
                <div className="grid grid-cols-3 gap-2">
                  {[{ name: "Simran", phone: "918828352311" },{ name: "Vipin", phone: "918796568003" },{ name: "Jyoti", phone: "918796568002" }].map((m) => (
                    <button key={m.phone} onClick={() => { setWaPhone(m.phone); setWaName(m.name); }}
                      className={cn("p-3 border text-sm text-left transition-all",
                        waPhone === m.phone ? "border-forest bg-forest/5 text-forest font-medium" : "border-neutral-200 text-ink/60 hover:border-forest/40")}>
                      <p className="font-medium">{m.name}</p>
                      <p className="font-mono text-xs text-ink/40 mt-0.5">+{m.phone.slice(0,2)} {m.phone.slice(2,7)} {m.phone.slice(7)}</p>
                    </button>
                  ))}
                </div>
              </div>
              {waPhone && (
                <div className="pt-2 border-t border-neutral-100">
                  <p className="text-xs text-ink/50 mb-2">Test it:</p>
                  <a href={`https://wa.me/${waPhone}?text=Test%20from%20Mehmaan%20Manor%20admin`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-forest hover:text-gold transition-colors">
                    <MessageCircle size={14} />Open WhatsApp with +{waPhone}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* BRAND TAB */}
          {activeTab === "brand" && (
            <div className="space-y-6">
              <h2 className="text-lg font-display text-forest">Brand Identity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Instagram Handle</label>
                  <Input value={brand.instagramHandle} onChange={(e) => setBrand({ ...brand, instagramHandle: e.target.value })} className="font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Hero Headline</label>
                  <Input value={brand.heroHeadline} onChange={(e) => setBrand({ ...brand, heroHeadline: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Primary Tagline</label>
                <Input value={brand.taglinePrimary} onChange={(e) => setBrand({ ...brand, taglinePrimary: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Secondary Tagline</label>
                <Input value={brand.taglineSecondary} onChange={(e) => setBrand({ ...brand, taglineSecondary: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Hero Subtitle</label>
                <Input value={brand.heroSubtitle} onChange={(e) => setBrand({ ...brand, heroSubtitle: e.target.value })} />
              </div>
              <Button variant="gold" onClick={saveBrand} disabled={brandSaving} className={cn(brandSaved && "bg-green-500")}>
                {brandSaved ? <><Check size={14} className="mr-2" />Saved!</> : brandSaving ? "Saving…" : <><Save size={14} className="mr-2" />Save Brand</>}
              </Button>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <h2 className="text-lg font-display text-forest">Team Members</h2>
              {[
                { key: "simran", name: "Simran", role: "Owner" },
                { key: "vipin", name: "Vipin", role: "Manager" },
                { key: "jyoti", name: "Jyoti", role: "Staff" },
              ].map((member) => (
                <div key={member.key} className="border border-neutral-200 p-5 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center">
                      <span className="font-display text-forest">{member.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-forest">{member.name}</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full",
                        member.role === "Owner" ? "bg-gold/20 text-gold" : member.role === "Manager" ? "bg-forest/10 text-forest" : "bg-neutral-100 text-ink/60")}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-ink/50 mb-1">PHONE</label>
                    <Input value={teamPhones[member.key as keyof typeof teamPhones]}
                      onChange={(e) => setTeamPhones({ ...teamPhones, [member.key]: e.target.value })}
                      className="font-mono text-sm" />
                  </div>
                </div>
              ))}
              <p className="text-xs text-ink/50">To add team members, contact support.</p>
              <Button variant="gold" onClick={saveTeam} disabled={teamSaving} className={cn(teamSaved && "bg-green-500")}>
                {teamSaved ? <><Check size={14} className="mr-2" />Saved!</> : teamSaving ? "Saving…" : <><Save size={14} className="mr-2" />Save Team</>}
              </Button>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-display text-forest">Notification Preferences</h2>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                Notification delivery requires Twilio/Resend setup in the Integrations tab.
              </div>
              {NOTIF_GROUPS.map(({ group, items }) => (
                <div key={group} className="space-y-3">
                  <p className="text-sm font-semibold text-forest">{group}</p>
                  {items.map((item) => (
                    <div key={item} className="flex items-center justify-between py-2 border-b border-neutral-50">
                      <span className="text-sm text-ink/80">{item}</span>
                      <div className="flex items-center gap-4">
                        {["Email", "SMS", "WhatsApp"].map((channel) => (
                          <label key={channel} className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox"
                              checked={!!(notifPrefs[item]?.[channel])}
                              onChange={(e) => toggleNotif(item, channel, e.target.checked)}
                              className="accent-gold w-3.5 h-3.5" />
                            <span className="text-xs text-ink/50">{channel}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <Button variant="gold" onClick={saveNotifs} className={cn(notifSaved && "bg-green-500")}>
                {notifSaved ? <><Check size={14} className="mr-2" />Saved!</> : <><Save size={14} className="mr-2" />Save Preferences</>}
              </Button>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === "integrations" && (
            <div className="space-y-6">
              <h2 className="text-lg font-display text-forest">Integrations</h2>
              <p className="text-sm text-ink/60">Connect external services to automate your operations.</p>
              {[
                { name: "Razorpay", description: "Payment gateway", keyLabel: "Key ID", keyPlaceholder: "rzp_live_...", secretLabel: "Key Secret", secretPlaceholder: "rzp_secret_...", badge: "Payments" },
                { name: "Cloudinary", description: "Store and optimize property images", keyLabel: "Cloud Name", keyPlaceholder: "your-cloud-name", secretLabel: "API Key", secretPlaceholder: "123456789", badge: "Storage" },
                { name: "Resend", description: "Transactional email", keyLabel: "API Key", keyPlaceholder: "re_...", secretLabel: "From Email", secretPlaceholder: "noreply@mehmaanmanor.com", badge: "Email" },
                { name: "Twilio", description: "SMS and WhatsApp notifications", keyLabel: "Account SID", keyPlaceholder: "AC...", secretLabel: "Auth Token", secretPlaceholder: "your_auth_token", badge: "SMS" },
              ].map((integration) => (
                <div key={integration.name} className="border border-neutral-200 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-forest">{integration.name}</h3>
                        <span className="text-xs bg-neutral-100 text-ink/60 px-2 py-0.5 rounded-full font-mono">{integration.badge}</span>
                      </div>
                      <p className="text-xs text-ink/50 mt-0.5">{integration.description}</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-ink/50">Enable</span>
                      <input type="checkbox" className="accent-gold w-4 h-4" defaultChecked={false} />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-ink/50 mb-1">{integration.keyLabel.toUpperCase()}</label>
                      <Input placeholder={integration.keyPlaceholder} className="font-mono text-sm" />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-mono text-ink/50 mb-1">{integration.secretLabel.toUpperCase()}</label>
                      <div className="relative">
                        <Input type={showSecrets[integration.name] ? "text" : "password"}
                          placeholder={integration.secretPlaceholder} className="font-mono text-sm pr-10" />
                        <button type="button" onClick={() => toggleSecret(integration.name)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink">
                          {showSecrets[integration.name] ? <EyeOff size={14} /> : <Eye size={14} />}
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
                <h2 className="text-lg font-display text-red-600">Danger Zone</h2>
              </div>
              <p className="text-sm text-ink/60">These actions are irreversible. Please proceed with caution.</p>

              {/* Export */}
              <div className="border border-neutral-200 p-5 flex items-start justify-between gap-6">
                <div>
                  <p className="font-medium text-forest">Export All Data</p>
                  <p className="text-sm text-ink/60 mt-1">Download all bookings as a JSON archive.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport} className="shrink-0">Export Data</Button>
              </div>

              {/* Change Password */}
              <div className="border border-neutral-200 p-5">
                <p className="font-medium text-forest mb-2">Change Password</p>
                <p className="text-sm text-ink/60">
                  To change the admin password, update the <span className="font-mono bg-neutral-100 px-1">ADMIN_PASSWORD</span> environment variable in your Vercel dashboard and redeploy.
                </p>
              </div>

              {/* Delete All Bookings */}
              <div className="border-2 border-red-200 p-5">
                <p className="font-medium text-red-700 mb-1">Delete All Bookings</p>
                <p className="text-sm text-red-500/70 mb-4">Permanently delete all booking records. Guest data is retained.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-red-400 mb-1">Type DELETE to confirm</label>
                    <Input value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE" className="font-mono max-w-xs border-red-200" />
                  </div>
                  <Button variant="outline" size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-40"
                    disabled={deleteConfirmText !== "DELETE" || deleting}
                    onClick={handleDeleteAllBookings}>
                    {deleting ? "Deleting..." : "Delete All Bookings"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
