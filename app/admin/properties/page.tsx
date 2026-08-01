"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, X, Save, Edit, MapPin, Users, IndianRupee, Wifi, Tv, UtensilsCrossed, AirVent, Car, TreePine, Shield, Droplets, Monitor, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlaceholderImage } from "@/components/placeholder-image";
import { formatCurrency } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  "High-Speed Wi-Fi": Wifi, "Smart TV with Netflix": Tv, "Smart TV with streaming": Tv,
  "Fully Equipped Kitchen": UtensilsCrossed, "Fully equipped kitchen": UtensilsCrossed,
  "Modern Kitchen": UtensilsCrossed, "Modern kitchen": UtensilsCrossed,
  "Air Conditioning": AirVent, "Air conditioning": AirVent,
  "Dedicated Workspace": Monitor, "Work-Friendly Setup": Monitor,
  "24/7 Hot Water": Droplets, "Free Parking": Car, "Street Parking": Car,
  "Garden Access": TreePine, "Security System": Shield, "Spacious Living Area": Home,
  "Local Market Nearby": ShoppingBag, "Safe Neighborhood": Shield,
};

const DEFAULT_AMENITIES = ["High-Speed Wi-Fi", "Air Conditioning", "24/7 Hot Water"];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newProp, setNewProp] = useState({
    name: "", slug: "", address: "", coordinates: "", description: "",
    vibe: "", baseRate: 3500, weekendRate: 4500, cleaningFee: 500,
    maxGuests: 4, checkInTime: "14:00", checkOutTime: "11:00",
    amenities: [...DEFAULT_AMENITIES], policies: "No smoking indoors. Quiet hours 10 PM â€“ 8 AM.",
  });

  const load = () => {
    setLoading(true);
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => setProperties(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAddProperty = async () => {
    if (!newProp.name.trim() || !newProp.slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProp),
      });
      const data = await res.json();
      if (data.success) {
        setShowAdd(false);
        load();
        setNewProp({ name: "", slug: "", address: "", coordinates: "", description: "", vibe: "", baseRate: 3500, weekendRate: 4500, cleaningFee: 500, maxGuests: 4, checkInTime: "14:00", checkOutTime: "11:00", amenities: [...DEFAULT_AMENITIES], policies: "No smoking indoors. Quiet hours 10 PM â€“ 8 AM." });
      } else {
        setError(data.error || "Failed to add property");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Properties</h1>
          <p className="text-ink/60">Manage your homes</p>
        </div>
        <Button variant="gold" onClick={() => setShowAdd(true)}>
          <Plus size={16} className="mr-2" /> Add New Property
        </Button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-ink/40 font-mono text-sm">Loading propertiesâ€¦</div>
      ) : properties.length === 0 ? (
        <div className="py-24 text-center text-ink/40">No properties found.</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-start justify-center overflow-y-auto p-6">
          <div className="bg-white w-full max-w-2xl my-8 shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-display text-forest">Add New Property</h2>
              <button onClick={() => { setShowAdd(false); setError(""); }}><X size={20} className="text-ink/40 hover:text-ink" /></button>
            </div>
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Property Name *</label>
                  <Input value={newProp.name} onChange={(e) => setNewProp({ ...newProp, name: e.target.value })} placeholder="Cyber Hub Residency" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">URL Slug *</label>
                  <Input value={newProp.slug} onChange={(e) => setNewProp({ ...newProp, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="cyber-hub-residency" className="font-mono" />
                  <p className="text-xs text-ink/40 mt-1">Used in URL: /homes/{newProp.slug || "your-slug"}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Full Address</label>
                <Input value={newProp.address} onChange={(e) => setNewProp({ ...newProp, address: e.target.value })} placeholder="Sector 29, DLF Phase 3, Gurugram" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Coordinates</label>
                  <Input value={newProp.coordinates} onChange={(e) => setNewProp({ ...newProp, coordinates: e.target.value })} placeholder="28.4595Â° N, 77.0266Â° E" className="font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Max Guests</label>
                  <Input type="number" min={1} max={20} value={newProp.maxGuests} onChange={(e) => setNewProp({ ...newProp, maxGuests: +e.target.value })} className="font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Short Description</label>
                <Input value={newProp.description} onChange={(e) => setNewProp({ ...newProp, description: e.target.value })} placeholder="Your modern retreat in the heart of Gurugram" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Vibe / Neighborhood Story</label>
                <Textarea value={newProp.vibe} rows={3} onChange={(e) => setNewProp({ ...newProp, vibe: e.target.value })} placeholder="Describe the neighborhood character and feel..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Base Rate (â‚¹)</label>
                  <Input type="number" value={newProp.baseRate} onChange={(e) => setNewProp({ ...newProp, baseRate: +e.target.value })} className="font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Weekend Rate (â‚¹)</label>
                  <Input type="number" value={newProp.weekendRate} onChange={(e) => setNewProp({ ...newProp, weekendRate: +e.target.value })} className="font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Cleaning Fee (â‚¹)</label>
                  <Input type="number" value={newProp.cleaningFee} onChange={(e) => setNewProp({ ...newProp, cleaningFee: +e.target.value })} className="font-mono" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Check-in Time</label>
                  <Input type="time" value={newProp.checkInTime} onChange={(e) => setNewProp({ ...newProp, checkInTime: e.target.value })} className="font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Check-out Time</label>
                  <Input type="time" value={newProp.checkOutTime} onChange={(e) => setNewProp({ ...newProp, checkOutTime: e.target.value })} className="font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">House Policies</label>
                <Textarea value={newProp.policies} rows={2} onChange={(e) => setNewProp({ ...newProp, policies: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-neutral-100">
              <Button variant="outline" className="flex-1" onClick={() => { setShowAdd(false); setError(""); }}>Cancel</Button>
              <Button variant="gold" className="flex-1" onClick={handleAddProperty} disabled={saving}>
                <Save size={14} className="mr-2" />{saving ? "Addingâ€¦" : "Add Property"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function PropertyCard({ property }: { property: any }) {
  const [activeTab, setActiveTab] = useState<"overview" | "amenities" | "pricing" | "policies">("overview");

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "amenities", label: "Amenities" },
    { key: "pricing", label: "Pricing" },
    { key: "policies", label: "Policies" },
  ];

  return (
    <div className="bg-white border border-neutral-200 overflow-hidden">
      <div className="relative h-48 bg-forest/10">
        <PlaceholderImage caption={`${property.name.toUpperCase()} â€” Property exterior`} className="h-full" aspectRatio="landscape" />
        <div className="absolute top-3 left-3">
          <span className="bg-forest text-cream text-xs font-mono px-3 py-1">HOME {String(property.id).padStart(2, "0")}</span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Active</span>
        </div>
      </div>

      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-display text-forest mb-1">{property.name}</h2>
            <div className="flex items-center space-x-1 text-ink/60 text-sm">
              <MapPin size={14} className="text-gold" />
              <span className="font-mono text-xs">{property.address}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/properties/${property.id}`}>
              <Edit size={14} className="mr-2" />Edit
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-neutral-50">
            <div className="flex items-center justify-center mb-1"><Users size={14} className="text-gold mr-1" /><span className="text-sm font-mono text-ink/60">MAX</span></div>
            <p className="text-xl font-display text-forest">{property.maxGuests}</p>
          </div>
          <div className="text-center p-3 bg-neutral-50">
            <div className="flex items-center justify-center mb-1"><IndianRupee size={14} className="text-gold mr-1" /><span className="text-sm font-mono text-ink/60">BASE</span></div>
            <p className="text-xl font-display text-forest">{formatCurrency(property.baseRate)}</p>
          </div>
          <div className="text-center p-3 bg-neutral-50">
            <div className="flex items-center justify-center mb-1"><IndianRupee size={14} className="text-gold mr-1" /><span className="text-sm font-mono text-ink/60">WKND</span></div>
            <p className="text-xl font-display text-forest">{formatCurrency(property.weekendRate ?? 0)}</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-neutral-100">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab.key ? "border-b-2 border-gold text-forest" : "text-ink/50 hover:text-ink"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div><p className="text-xs font-mono text-ink/50 uppercase mb-1">Vibe</p><p className="text-sm text-ink/80 leading-relaxed">{property.vibe}</p></div>
            <div><p className="text-xs font-mono text-ink/50 uppercase mb-1">Coordinates</p><p className="font-mono text-sm text-ink/70">{property.coordinates}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs font-mono text-ink/50 uppercase mb-1">Check-in</p><p className="font-mono text-sm">{property.checkInTime}</p></div>
              <div><p className="text-xs font-mono text-ink/50 uppercase mb-1">Check-out</p><p className="font-mono text-sm">{property.checkOutTime}</p></div>
            </div>
          </div>
        )}
        {activeTab === "amenities" && (
          <div className="grid grid-cols-2 gap-2">
            {(property.amenities || []).map((amenity: string, i: number) => {
              const Icon = iconMap[amenity] || Home;
              return (
                <div key={i} className="flex items-center space-x-2 p-2 rounded hover:bg-neutral-50">
                  <Icon size={14} className="text-gold flex-shrink-0" />
                  <span className="text-sm text-ink/80">{amenity}</span>
                </div>
              );
            })}
          </div>
        )}
        {activeTab === "pricing" && (
          <div className="space-y-3">
            {[
              { label: "Base nightly rate", value: property.baseRate },
              { label: "Weekend rate", value: property.weekendRate ?? 0 },
              { label: "Cleaning fee", value: property.cleaningFee ?? 0 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-sm text-ink/70">{item.label}</span>
                <span className="font-mono font-medium text-forest">{formatCurrency(item.value)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-ink/50">Taxes (GST)</span>
              <span className="font-mono text-sm text-ink/50">18%</span>
            </div>
          </div>
        )}
        {activeTab === "policies" && (
          <div className="space-y-4">
            <p className="text-sm text-ink/80 leading-relaxed">{property.policies}</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-neutral-50"><p className="text-xs font-mono text-ink/50 mb-1">MIN STAY</p><p className="text-sm font-medium">1 night</p></div>
              <div className="p-3 bg-neutral-50"><p className="text-xs font-mono text-ink/50 mb-1">MAX GUESTS</p><p className="text-sm font-medium">{property.maxGuests}</p></div>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 flex gap-3">
        <Button variant="default" size="sm" className="flex-1" asChild>
          <Link href={`/homes/${property.slug}`} target="_blank">View Public Page â†—</Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/admin/properties/${property.id}`}>Edit Property</Link>
        </Button>
      </div>
    </div>
  );
}
