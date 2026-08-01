"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "photos", label: "Photos" },
  { key: "amenities", label: "Amenities" },
  { key: "pricing", label: "Pricing" },
  { key: "availability", label: "Availability" },
  { key: "policies", label: "Policies" },
];

const ALL_AMENITIES = [
  "High-Speed Wi-Fi", "Smart TV with Netflix", "Fully Equipped Kitchen",
  "Air Conditioning", "Dedicated Workspace", "24/7 Hot Water",
  "Free Parking", "Garden Access", "Security System",
  "Spacious Living Area", "Local Market Nearby", "Safe Neighborhood",
  "Street Parking", "Work-Friendly Setup",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const DEFAULT_GUEST_RULES: Record<string, boolean> = {
  "Pets allowed": false,
  "Smoking allowed": false,
  "Events allowed": false,
  "Children welcome": true,
  "Late check-in available": true,
};

export default function PropertyEditorPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [customAmenity, setCustomAmenity] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const [form, setForm] = useState<any>({
    name: "", address: "", coordinates: "", description: "", vibe: "",
    baseRate: 0, weekendRate: 0, cleaningFee: 0,
    checkInTime: "14:00", checkOutTime: "11:00", maxGuests: 4,
    policies: "", amenities: [], blockedDates: [],
    cancellationPolicy: "Moderate", guestRules: { ...DEFAULT_GUEST_RULES },
  });

  useEffect(() => {
    fetch(`/api/properties/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setProperty(data);
          let guestRules = { ...DEFAULT_GUEST_RULES };
          try { guestRules = data.guestRules ? JSON.parse(data.guestRules) : guestRules; } catch {}
          setForm({
            name: data.name || "", address: data.address || "",
            coordinates: data.coordinates || "", description: data.description || "",
            vibe: data.vibe || "", baseRate: data.baseRate || 0,
            weekendRate: data.weekendRate || 0, cleaningFee: data.cleaningFee || 0,
            checkInTime: data.checkInTime || "14:00", checkOutTime: data.checkOutTime || "11:00",
            maxGuests: data.maxGuests || 4, policies: data.policies || "",
            amenities: data.amenities || [], blockedDates: data.blockedDates || [],
            cancellationPolicy: data.cancellationPolicy || "Moderate",
            guestRules,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/photos?propertyId=${params.id}`)
      .then((r) => r.json())
      .then((data) => setPhotos(Array.isArray(data) ? data : []))
      .catch(() => setPhotos([]));
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, guestRules: JSON.stringify(form.guestRules) };
      const res = await fetch(`/api/properties/${params.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const toggleAmenity = (amenity: string) => {
    setForm((f: any) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a: string) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (!trimmed || form.amenities.includes(trimmed)) return;
    setForm((f: any) => ({ ...f, amenities: [...f.amenities, trimmed] }));
    setCustomAmenity("");
  };

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      for (const file of Array.from(files)) formData.append("files", file);
      formData.append("propertyId", String(params.id));
      formData.append("section", "gallery");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.photos) setPhotos((prev) => [...prev, ...data.photos]);
      }
    } catch { /* silent */ }
    finally { setUploadingPhoto(false); }
  };

  const deletePhoto = async (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    try { await fetch(`/api/photos/${photoId}`, { method: "DELETE" }); } catch {}
  };

  const toggleBlockedDate = (dateStr: string) => {
    setForm((f: any) => ({
      ...f,
      blockedDates: f.blockedDates.includes(dateStr)
        ? f.blockedDates.filter((d: string) => d !== dateStr)
        : [...f.blockedDates, dateStr],
    }));
  };

  // Build calendar days for current month/year
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const formatDateStr = (day: number) =>
    `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-forest" />
      </div>
    );
  }

  if (!property) {
    return <p className="text-ink/60">Property not found.</p>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/properties">
              <ArrowLeft size={16} className="mr-2" />Properties
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-display text-forest">{form.name}</h1>
            <p className="text-ink/60 text-sm font-mono">{property.address}</p>
          </div>
        </div>
        <Button variant="gold" onClick={handleSave} disabled={saving}
          className={cn(saved && "bg-green-500")}>
          {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <div className="flex border-b border-neutral-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-gold text-forest bg-gold/5"
                  : "text-ink/50 hover:text-ink"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Property Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Coordinates</label>
                  <Input value={form.coordinates} onChange={(e) => setForm({ ...form, coordinates: e.target.value })}
                    className="font-mono" placeholder="28.4212° N, 77.0761° E" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Full Address</label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Short Description</label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Your peaceful retreat..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">Vibe Writeup</label>
                <Textarea value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })}
                  rows={4} placeholder="Describe the neighborhood character and feel..." />
              </div>
            </div>
          )}

          {/* PHOTOS TAB */}
          {activeTab === "photos" && (
            <div className="space-y-6">
              <p className="text-sm text-ink/60">
                Manage photos for {form.name}. The first photo is used as the hero image.
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => handlePhotoUpload(e.target.files)} />
              <div
                className="border-2 border-dashed border-neutral-300 p-12 text-center hover:border-gold transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingPhoto ? (
                  <Loader2 size={32} className="mx-auto text-gold mb-3 animate-spin" />
                ) : (
                  <Upload size={32} className="mx-auto text-neutral-400 mb-3" />
                )}
                <p className="text-sm font-medium text-ink/70">
                  {uploadingPhoto ? "Uploading..." : "Drop photos here or click to upload"}
                </p>
                <p className="text-xs text-ink/50 mt-1">PNG, JPG, WEBP up to 10MB each</p>
              </div>
              {photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, i) => (
                    <div key={photo.id} className="relative group">
                      <div className="aspect-square overflow-hidden bg-neutral-100">
                        <img src={photo.url} alt={photo.alt || "Photo"} className="w-full h-full object-cover" />
                      </div>
                      {i === 0 && (
                        <span className="absolute top-2 left-2 bg-gold text-ink text-xs px-2 py-0.5 font-mono">HERO</span>
                      )}
                      <button onClick={() => deletePhoto(photo.id)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink/50 text-center py-8">No photos uploaded yet.</p>
              )}
            </div>
          )}

          {/* AMENITIES TAB */}
          {activeTab === "amenities" && (
            <div className="space-y-4">
              <p className="text-sm text-ink/60">Toggle amenities available at this property.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ALL_AMENITIES.map((amenity) => {
                  const active = form.amenities.includes(amenity);
                  return (
                    <button key={amenity} onClick={() => toggleAmenity(amenity)}
                      className={`p-3 border text-sm text-left transition-all ${
                        active ? "border-forest bg-forest/5 text-forest font-medium" : "border-neutral-200 text-ink/50 hover:border-neutral-400"
                      }`}>
                      {active ? "✓ " : ""}{amenity}
                    </button>
                  );
                })}
                {form.amenities.filter((a: string) => !ALL_AMENITIES.includes(a)).map((amenity: string) => (
                  <button key={amenity} onClick={() => toggleAmenity(amenity)}
                    className="p-3 border border-forest bg-forest/5 text-forest text-sm text-left font-medium">
                    ✓ {amenity}
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <label className="block text-sm font-medium text-forest mb-2">Add Custom Amenity</label>
                <div className="flex gap-2">
                  <Input value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)}
                    placeholder="e.g., Rooftop terrace"
                    onKeyDown={(e) => e.key === "Enter" && addCustomAmenity()} />
                  <Button variant="outline" size="sm" onClick={addCustomAmenity}>
                    <Plus size={16} className="mr-2" />Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Base Nightly Rate (₹)</label>
                  <Input type="number" value={form.baseRate} onChange={(e) => setForm({ ...form, baseRate: +e.target.value })} className="font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Weekend Rate (₹)</label>
                  <Input type="number" value={form.weekendRate} onChange={(e) => setForm({ ...form, weekendRate: +e.target.value })} className="font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Cleaning Fee (₹)</label>
                  <Input type="number" value={form.cleaningFee} onChange={(e) => setForm({ ...form, cleaningFee: +e.target.value })} className="font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Max Guests</label>
                  <Input type="number" value={form.maxGuests} onChange={(e) => setForm({ ...form, maxGuests: +e.target.value })} className="font-mono" />
                </div>
              </div>
              <div className="bg-neutral-50 p-4 border border-neutral-200">
                <p className="text-sm font-medium text-forest mb-3">Pricing Preview</p>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-ink/60">1 night (weekday)</span>
                    <span>₹{form.baseRate.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">1 night (weekend)</span>
                    <span>₹{form.weekendRate.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink/60">Cleaning fee</span>
                    <span>₹{form.cleaningFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t border-neutral-200 pt-2 font-medium">
                    <span className="text-ink/60">Example: 2 nights weekday</span>
                    <span className="text-forest">₹{(form.baseRate * 2 + form.cleaningFee).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AVAILABILITY TAB */}
          {activeTab === "availability" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Check-in Time</label>
                  <Input type="time" value={form.checkInTime} onChange={(e) => setForm({ ...form, checkInTime: e.target.value })} className="font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">Check-out Time</label>
                  <Input type="time" value={form.checkOutTime} onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })} className="font-mono" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-forest mb-4">Block Dates (click to toggle)</p>
                <div className="border border-neutral-200 p-6 bg-neutral-50">
                  {/* Month navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => { const d = new Date(calYear, calMonth - 1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); }}
                      className="px-2 py-1 text-sm border border-neutral-200 hover:border-forest">‹</button>
                    <span className="font-medium text-sm text-forest">{MONTHS[calMonth]} {calYear}</span>
                    <button onClick={() => { const d = new Date(calYear, calMonth + 1); setCalYear(d.getFullYear()); setCalMonth(d.getMonth()); }}
                      className="px-2 py-1 text-sm border border-neutral-200 hover:border-forest">›</button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 max-w-xs mx-auto text-xs">
                    {DAYS.map((d) => (
                      <div key={d} className="text-center py-1 font-mono text-ink/40">{d}</div>
                    ))}
                    {calCells.map((day, i) => {
                      if (!day) return <div key={i} />;
                      const dateStr = formatDateStr(day);
                      const isBlocked = form.blockedDates.includes(dateStr);
                      return (
                        <button key={i} onClick={() => toggleBlockedDate(dateStr)}
                          className={`text-center py-1.5 rounded text-xs transition-colors ${
                            isBlocked ? "bg-red-100 text-red-600 font-medium" : "hover:bg-gold/20 text-ink/70"
                          }`}>
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs text-ink/40 mt-3">
                    <span><span className="inline-block w-3 h-3 bg-red-100 rounded mr-1" />Blocked</span>
                    <span>{form.blockedDates.length} date(s) blocked</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* POLICIES TAB */}
          {activeTab === "policies" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">House Rules</label>
                <Textarea value={form.policies} onChange={(e) => setForm({ ...form, policies: e.target.value })} rows={5} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-neutral-200 space-y-3">
                  <p className="text-sm font-medium text-forest">Cancellation Policy</p>
                  {["Flexible", "Moderate", "Strict"].map((policy) => (
                    <label key={policy} className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="cancellation" value={policy}
                        checked={form.cancellationPolicy === policy}
                        onChange={() => setForm({ ...form, cancellationPolicy: policy })}
                        className="accent-gold" />
                      <div>
                        <p className="text-sm font-medium">{policy}</p>
                        <p className="text-xs text-ink/50">
                          {policy === "Flexible" && "Full refund up to 24 hours before"}
                          {policy === "Moderate" && "Full refund up to 5 days before"}
                          {policy === "Strict" && "50% refund up to 7 days before"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="p-4 border border-neutral-200 space-y-3">
                  <p className="text-sm font-medium text-forest">Guest Rules</p>
                  {Object.entries(form.guestRules as Record<string, boolean>).map(([rule, val]) => (
                    <label key={rule} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-ink/80">{rule}</span>
                      <input type="checkbox" checked={val as boolean}
                        onChange={(e) => setForm({ ...form, guestRules: { ...form.guestRules, [rule]: e.target.checked } })}
                        className="accent-gold w-4 h-4" />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
