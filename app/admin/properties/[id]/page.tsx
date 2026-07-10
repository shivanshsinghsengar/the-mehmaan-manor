"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlaceholderImage } from "@/components/placeholder-image";
import { mockProperties } from "@/lib/mock-data";
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
  "High-Speed Wi-Fi",
  "Smart TV with Netflix",
  "Fully Equipped Kitchen",
  "Air Conditioning",
  "Dedicated Workspace",
  "24/7 Hot Water",
  "Free Parking",
  "Garden Access",
  "Security System",
  "Spacious Living Area",
  "Local Market Nearby",
  "Safe Neighborhood",
  "Street Parking",
  "Work-Friendly Setup",
];

export default function PropertyEditorPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);

  const property = mockProperties.find((p) => p.id === params.id) ?? mockProperties[0];

  const [form, setForm] = useState({
    name: property.name,
    address: property.address,
    coordinates: property.coordinates ?? "",
    description: property.description,
    vibe: property.vibe,
    baseRate: property.baseRate,
    weekendRate: property.weekendRate ?? 0,
    cleaningFee: property.cleaningFee ?? 0,
    checkInTime: property.checkInTime,
    checkOutTime: property.checkOutTime,
    maxGuests: property.maxGuests,
    policies: property.policies,
    amenities: [...property.amenities],
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleAmenity = (amenity: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/properties">
              <ArrowLeft size={16} className="mr-2" />
              Properties
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-display text-forest">{form.name}</h1>
            <p className="text-ink/60 text-sm font-mono">{property.address}</p>
          </div>
        </div>
        <Button
          variant="gold"
          onClick={handleSave}
          className={cn(saved && "bg-green-500")}
        >
          <Save size={16} className="mr-2" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border border-neutral-200 overflow-hidden">
        <div className="flex border-b border-neutral-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-gold text-forest bg-gold/5"
                  : "text-ink/50 hover:text-ink"
              }`}
            >
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
                  <label className="block text-sm font-medium text-forest mb-2">
                    Property Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Coordinates
                  </label>
                  <Input
                    value={form.coordinates}
                    onChange={(e) =>
                      setForm({ ...form, coordinates: e.target.value })
                    }
                    className="font-mono"
                    placeholder="28.4212° N, 77.0761° E"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Full Address
                </label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Short Description
                </label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Your peaceful retreat..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Vibe Writeup
                </label>
                <Textarea
                  value={form.vibe}
                  onChange={(e) => setForm({ ...form, vibe: e.target.value })}
                  rows={4}
                  placeholder="Describe the neighborhood character and feel..."
                />
              </div>
            </div>
          )}

          {/* PHOTOS TAB */}
          {activeTab === "photos" && (
            <div className="space-y-6">
              <p className="text-sm text-ink/60">
                Manage photos for {form.name}. The first photo is used as the
                hero image.
              </p>
              <div
                className="border-2 border-dashed border-neutral-300 p-12 text-center hover:border-gold transition-colors cursor-pointer"
                onClick={() => alert("In production: opens file upload dialog")}
              >
                <Plus size={32} className="mx-auto text-neutral-400 mb-3" />
                <p className="text-sm font-medium text-ink/70">
                  Drop photos here or click to upload
                </p>
                <p className="text-xs text-ink/50 mt-1">
                  PNG, JPG, WEBP up to 10MB each
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "HERO — Exterior dusk view",
                  "INTERIOR — Living room light",
                  "DETAIL — Brass fixture",
                  "BEDROOM — Clean, warm",
                  "KITCHEN — Modern setup",
                  "LIFESTYLE — Morning coffee",
                ].map((caption, i) => (
                  <div key={i} className="relative group">
                    <PlaceholderImage
                      caption={caption}
                      aspectRatio="square"
                    />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 bg-gold text-ink text-xs px-2 py-0.5 font-mono">
                        HERO
                      </span>
                    )}
                    <button className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AMENITIES TAB */}
          {activeTab === "amenities" && (
            <div className="space-y-4">
              <p className="text-sm text-ink/60">
                Toggle amenities available at this property.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ALL_AMENITIES.map((amenity) => {
                  const active = form.amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 border text-sm text-left transition-all ${
                        active
                          ? "border-forest bg-forest/5 text-forest font-medium"
                          : "border-neutral-200 text-ink/50 hover:border-neutral-400"
                      }`}
                    >
                      {active ? "✓ " : ""}
                      {amenity}
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-neutral-100">
                <label className="block text-sm font-medium text-forest mb-2">
                  Add Custom Amenity
                </label>
                <div className="flex gap-2">
                  <Input placeholder="e.g., Rooftop terrace" />
                  <Button variant="outline" size="sm">
                    <Plus size={16} className="mr-2" />
                    Add
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
                  <label className="block text-sm font-medium text-forest mb-2">
                    Base Nightly Rate (₹)
                  </label>
                  <Input
                    type="number"
                    value={form.baseRate}
                    onChange={(e) =>
                      setForm({ ...form, baseRate: +e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Weekend Rate (₹)
                  </label>
                  <Input
                    type="number"
                    value={form.weekendRate}
                    onChange={(e) =>
                      setForm({ ...form, weekendRate: +e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Cleaning Fee (₹)
                  </label>
                  <Input
                    type="number"
                    value={form.cleaningFee}
                    onChange={(e) =>
                      setForm({ ...form, cleaningFee: +e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Max Guests
                  </label>
                  <Input
                    type="number"
                    value={form.maxGuests}
                    onChange={(e) =>
                      setForm({ ...form, maxGuests: +e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="bg-neutral-50 p-4 border border-neutral-200">
                <p className="text-sm font-medium text-forest mb-3">
                  Pricing Preview
                </p>
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
                    <span className="text-ink/60">
                      Example: 2 nights weekday
                    </span>
                    <span className="text-forest">
                      ₹{(form.baseRate * 2 + form.cleaningFee).toLocaleString("en-IN")}
                    </span>
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
                  <label className="block text-sm font-medium text-forest mb-2">
                    Check-in Time
                  </label>
                  <Input
                    type="time"
                    value={form.checkInTime}
                    onChange={(e) =>
                      setForm({ ...form, checkInTime: e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-2">
                    Check-out Time
                  </label>
                  <Input
                    type="time"
                    value={form.checkOutTime}
                    onChange={(e) =>
                      setForm({ ...form, checkOutTime: e.target.value })
                    }
                    className="font-mono"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-forest mb-4">
                  Block Dates (Calendar)
                </p>
                <div className="border border-neutral-200 p-6 bg-neutral-50 text-center">
                  <p className="text-ink/60 text-sm mb-2">
                    Interactive availability calendar
                  </p>
                  <p className="text-xs text-ink/40 font-mono">
                    Click dates to block / unblock
                  </p>
                  <div className="mt-4 grid grid-cols-7 gap-1 max-w-xs mx-auto text-xs">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <div
                        key={d}
                        className="text-center py-1 font-mono text-ink/40"
                      >
                        {d}
                      </div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <button
                        key={day}
                        className={`text-center py-1.5 rounded text-xs transition-colors ${
                          [8, 9, 10, 15, 22, 23].includes(day)
                            ? "bg-red-100 text-red-600"
                            : "hover:bg-gold/20 text-ink/70"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-ink/40 mt-3">
                    <span className="inline-block w-3 h-3 bg-red-100 rounded mr-1" />
                    Blocked dates
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* POLICIES TAB */}
          {activeTab === "policies" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  House Rules
                </label>
                <Textarea
                  value={form.policies}
                  onChange={(e) =>
                    setForm({ ...form, policies: e.target.value })
                  }
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-neutral-200 space-y-3">
                  <p className="text-sm font-medium text-forest">
                    Cancellation Policy
                  </p>
                  {["Flexible", "Moderate", "Strict"].map((policy) => (
                    <label
                      key={policy}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="cancellation"
                        defaultChecked={policy === "Moderate"}
                        className="accent-gold"
                      />
                      <div>
                        <p className="text-sm font-medium">{policy}</p>
                        <p className="text-xs text-ink/50">
                          {policy === "Flexible" &&
                            "Full refund up to 24 hours before"}
                          {policy === "Moderate" &&
                            "Full refund up to 5 days before"}
                          {policy === "Strict" &&
                            "50% refund up to 7 days before"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="p-4 border border-neutral-200 space-y-3">
                  <p className="text-sm font-medium text-forest">
                    Guest Rules
                  </p>
                  {[
                    { label: "Pets allowed", default: false },
                    { label: "Smoking allowed", default: false },
                    { label: "Events allowed", default: false },
                    { label: "Children welcome", default: true },
                    { label: "Late check-in available", default: true },
                  ].map((rule) => (
                    <label
                      key={rule.label}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-sm text-ink/80">{rule.label}</span>
                      <input
                        type="checkbox"
                        defaultChecked={rule.default}
                        className="accent-gold w-4 h-4"
                      />
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
