"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Edit,
  MapPin,
  Users,
  IndianRupee,
  Wifi,
  Tv,
  UtensilsCrossed,
  AirVent,
  Car,
  TreePine,
  Shield,
  Droplets,
  Monitor,
  Home,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/placeholder-image";
import { formatCurrency } from "@/lib/utils";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => {
        setProperties(data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Properties</h1>
          <p className="text-ink/60">Manage your two homes</p>
        </div>
      </div>

      {/* Property Cards */}
      {loading ? (
        <div className="py-24 text-center text-ink/40 font-mono text-sm">Loading properties…</div>
      ) : properties.length === 0 ? (
        <div className="py-24 text-center text-ink/40">No properties found.</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property }: { property: any }) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "amenities" | "pricing" | "policies"
  >("overview");

  const iconMap: Record<string, React.ElementType> = {
    "High-Speed Wi-Fi": Wifi,
    "Smart TV with Netflix": Tv,
    "Smart TV with streaming": Tv,
    "Fully Equipped Kitchen": UtensilsCrossed,
    "Fully equipped kitchen": UtensilsCrossed,
    "Modern Kitchen": UtensilsCrossed,
    "Modern kitchen": UtensilsCrossed,
    "Air Conditioning": AirVent,
    "Air conditioning": AirVent,
    "Dedicated Workspace": Monitor,
    "Dedicated workspace": Monitor,
    "Work-Friendly Setup": Monitor,
    "Work-friendly setup": Monitor,
    "24/7 Hot Water": Droplets,
    "Free Parking": Car,
    "Street Parking": Car,
    "Street parking": Car,
    "Garden Access": TreePine,
    "Garden access": TreePine,
    "Security System": Shield,
    "Security system": Shield,
    "Spacious Living Area": Home,
    "Spacious living area": Home,
    "Local Market Nearby": ShoppingBag,
    "Local market nearby": ShoppingBag,
    "Safe Neighborhood": Shield,
    "Safe neighborhood": Shield,
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "amenities", label: "Amenities" },
    { key: "pricing", label: "Pricing" },
    { key: "policies", label: "Policies" },
  ];

  return (
    <div className="bg-white border border-neutral-200 overflow-hidden">
      {/* Property Hero */}
      <div className="relative h-48 bg-forest/10">
        <PlaceholderImage
          caption={`${property.name.toUpperCase()} — Property exterior`}
          className="h-full"
          aspectRatio="landscape"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-forest text-cream text-xs font-mono px-3 py-1">
            HOME {property.id === "1" ? "01" : "02"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
            Active
          </span>
        </div>
      </div>

      {/* Property Header */}
      <div className="p-6 border-b border-neutral-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-display text-forest mb-1">
              {property.name}
            </h2>
            <div className="flex items-center space-x-1 text-ink/60 text-sm">
              <MapPin size={14} className="text-gold" />
              <span className="font-mono">{property.address}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/properties/${property.id}`}>
              <Edit size={14} className="mr-2" />
              Edit
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-neutral-50">
            <div className="flex items-center justify-center mb-1">
              <Users size={14} className="text-gold mr-1" />
              <span className="text-sm font-mono text-ink/60">MAX</span>
            </div>
            <p className="text-xl font-display text-forest">
              {property.maxGuests}
            </p>
          </div>
          <div className="text-center p-3 bg-neutral-50">
            <div className="flex items-center justify-center mb-1">
              <IndianRupee size={14} className="text-gold mr-1" />
              <span className="text-sm font-mono text-ink/60">BASE</span>
            </div>
            <p className="text-xl font-display text-forest">
              {formatCurrency(property.baseRate)}
            </p>
          </div>
          <div className="text-center p-3 bg-neutral-50">
            <div className="flex items-center justify-center mb-1">
              <IndianRupee size={14} className="text-gold mr-1" />
              <span className="text-sm font-mono text-ink/60">WKND</span>
            </div>
            <p className="text-xl font-display text-forest">
              {formatCurrency(property.weekendRate ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setActiveTab(
                tab.key as "overview" | "amenities" | "pricing" | "policies"
              )
            }
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-gold text-forest"
                : "text-ink/50 hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-mono text-ink/50 uppercase mb-1">
                Vibe
              </p>
              <p className="text-sm text-ink/80 leading-relaxed">
                {property.vibe}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-ink/50 uppercase mb-1">
                Coordinates
              </p>
              <p className="font-mono text-sm text-ink/70">
                {property.coordinates}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-mono text-ink/50 uppercase mb-1">
                  Check-in
                </p>
                <p className="font-mono text-sm">{property.checkInTime}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-ink/50 uppercase mb-1">
                  Check-out
                </p>
                <p className="font-mono text-sm">{property.checkOutTime}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "amenities" && (
          <div className="grid grid-cols-2 gap-2">
            {property.amenities.map((amenity: string, i: number) => {
              const Icon = iconMap[amenity] || Home;
              return (
                <div
                  key={i}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-neutral-50"
                >
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
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-neutral-100"
              >
                <span className="text-sm text-ink/70">{item.label}</span>
                <span className="font-mono font-medium text-forest">
                  {formatCurrency(item.value)}
                </span>
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
            <p className="text-sm text-ink/80 leading-relaxed">
              {property.policies}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-neutral-50">
                <p className="text-xs font-mono text-ink/50 mb-1">MIN STAY</p>
                <p className="text-sm font-medium">1 night</p>
              </div>
              <div className="p-3 bg-neutral-50">
                <p className="text-xs font-mono text-ink/50 mb-1">MAX GUESTS</p>
                <p className="text-sm font-medium">{property.maxGuests}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 pb-6 flex gap-3">
        <Button variant="default" size="sm" className="flex-1" asChild>
          <Link href={`/homes/${property.slug}`} target="_blank">
            View Public Page ↗
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/admin/properties/${property.id}`}>
            Edit Property
          </Link>
        </Button>
      </div>
    </div>
  );
}
