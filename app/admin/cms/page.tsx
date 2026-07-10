"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload, Save, Trash2, Star, StarOff, Eye, EyeOff,
  Plus, X, Edit3, Check, RefreshCw, Image, Type,
  Home, Globe, ChevronDown, ChevronUp, GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { SitePhoto, SiteProperty, SiteContent } from "@/lib/store";

type Tab = "hero" | "properties" | "gallery" | "content";

/* ─── Toast ──────────────────────────────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const show = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

/* ─── Upload zone ────────────────────────────────────────────────────── */
function UploadZone({
  onUploaded,
  propertyId,
  section,
  label,
}: {
  onUploaded: (photos: SitePhoto[]) => void;
  propertyId?: string;
  section: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    if (propertyId) fd.append("propertyId", propertyId);
    fd.append("section", section);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) onUploaded(data.photos);
      else alert("Upload failed: " + data.error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "border-2 border-dashed p-8 text-center cursor-pointer transition-all",
        dragging ? "border-gold bg-gold/10" : "border-neutral-300 hover:border-gold hover:bg-neutral-50"
      )}
    >
      <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
        onChange={(e) => upload(e.target.files)} />
      <Upload size={28} className={cn("mx-auto mb-3", dragging ? "text-gold" : "text-neutral-400")} />
      <p className="text-sm font-medium text-ink/70">
        {uploading ? "Uploading…" : (label || "Drop images here or click to upload")}
      </p>
      <p className="text-xs text-ink/40 mt-1">JPG, PNG, WEBP · Multiple allowed</p>
    </div>
  );
}

/* ─── Photo card ─────────────────────────────────────────────────────── */
function PhotoCard({
  photo, onUpdate, onDelete,
}: {
  photo: SitePhoto;
  onUpdate: (p: SitePhoto) => void;
  onDelete: (id: string) => void;
}) {
  const [editAlt, setEditAlt] = useState(false);
  const [alt, setAlt] = useState(photo.alt);

  const toggle = (field: keyof SitePhoto) =>
    onUpdate({ ...photo, [field]: !photo[field as keyof SitePhoto] });

  const saveAlt = async () => {
    const updated = { ...photo, alt };
    await fetch(`/api/photos/${photo.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt }),
    });
    onUpdate(updated);
    setEditAlt(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/photos/${photo.id}`, { method: "DELETE" });
    onDelete(photo.id);
  };

  return (
    <div className="bg-white border border-neutral-200 overflow-hidden group">
      <div className="relative aspect-square">
        <img src={photo.url} alt={photo.alt}
          className="w-full h-full object-cover" />
        {photo.isFeatured && (
          <div className="absolute top-2 left-2 bg-gold text-ink text-[10px] font-mono px-2 py-0.5">
            FEATURED
          </div>
        )}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button onClick={() => toggle("isFeatured")}
            className="p-2 bg-white/90 hover:bg-gold transition-colors" title="Toggle featured">
            {photo.isFeatured ? <StarOff size={14} /> : <Star size={14} />}
          </button>
          <button onClick={() => setEditAlt(true)}
            className="p-2 bg-white/90 hover:bg-gold transition-colors" title="Edit alt text">
            <Edit3 size={14} />
          </button>
          <button onClick={handleDelete}
            className="p-2 bg-white/90 hover:bg-red-500 hover:text-white transition-colors" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {editAlt ? (
        <div className="p-2 flex gap-1">
          <Input value={alt} onChange={(e) => setAlt(e.target.value)}
            className="text-xs h-8 flex-1" onKeyDown={(e) => e.key === "Enter" && saveAlt()} />
          <button onClick={saveAlt} className="p-1 text-forest hover:text-gold">
            <Check size={14} />
          </button>
          <button onClick={() => { setAlt(photo.alt); setEditAlt(false); }} className="p-1 text-ink/40">
            <X size={14} />
          </button>
        </div>
      ) : (
        <p className="px-2 py-1.5 text-[10px] text-ink/50 font-mono truncate">{photo.alt}</p>
      )}
    </div>
  );
}

/* ─── Main CMS Page ──────────────────────────────────────────────────── */
export default function CMSPage() {
  const [tab, setTab] = useState<Tab>("hero");
  const [photos, setPhotos] = useState<SitePhoto[]>([]);
  const [properties, setProperties] = useState<SiteProperty[]>([]);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast, show } = useToast();

  // Load all data
  const loadAll = async () => {
    const [photosRes, propsRes, contentRes] = await Promise.all([
      fetch("/api/photos").then((r) => r.json()),
      fetch("/api/properties").then((r) => r.json()),
      fetch("/api/content").then((r) => r.json()),
    ]);
    setPhotos(photosRes);
    setProperties(propsRes);
    setContent(contentRes);
  };

  useEffect(() => { loadAll(); }, []);

  const photosBySection = (section: string, propertyId?: string) =>
    photos.filter((p) =>
      p.section === section &&
      (propertyId === undefined || p.propertyId === propertyId)
    );

  const handleNewPhotos = (newPhotos: SitePhoto[]) => {
    setPhotos((prev) => [...prev, ...newPhotos]);
    show(`${newPhotos.length} photo(s) uploaded successfully!`);
  };

  const handleUpdatePhoto = (updated: SitePhoto) =>
    setPhotos((prev) => prev.map((p) => p.id === updated.id ? updated : p));

  const handleDeletePhoto = (id: string) =>
    setPhotos((prev) => prev.filter((p) => p.id !== id));

  const savePropertyData = async (property: SiteProperty) => {
    setSaving(true);
    try {
      await fetch(`/api/properties/${property.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property),
      });
      setProperties((prev) => prev.map((p) => p.id === property.id ? property : p));
      show("Property saved!");
    } catch {
      show("Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  const saveContentData = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      show("Content saved! Reload public site to see changes.");
    } catch {
      show("Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "hero", label: "Hero & Homepage", icon: Globe },
    { key: "properties", label: "Property Details", icon: Home },
    { key: "gallery", label: "Photo Gallery", icon: Image },
    { key: "content", label: "Text & Content", icon: Type },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-1">Site Manager</h1>
          <p className="text-ink/60 text-sm">
            All changes here reflect live on the public website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadAll}>
            <RefreshCw size={14} className="mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye size={14} className="mr-2" /> View Site
            </a>
          </Button>
        </div>
      </div>

      {/* How it works banner */}
      <div className="bg-forest/5 border border-forest/15 p-4 text-sm text-forest/80 flex items-start gap-3">
        <div className="text-gold mt-0.5">✦</div>
        <div>
          <strong>How this works:</strong> Upload photos → they appear on the public site immediately.
          Edit property details → public property pages update. Change text → homepage updates.
          <strong className="text-forest"> No code needed.</strong>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-neutral-200">
        <div className="flex border-b border-neutral-100 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors",
                tab === key
                  ? "border-b-2 border-gold text-forest bg-gold/5"
                  : "text-ink/50 hover:text-ink"
              )}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ═══ HERO TAB ════════════════════════════════════════════ */}
          {tab === "hero" && (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-display text-forest mb-2">Hero Background Image</h2>
                <p className="text-sm text-ink/60 mb-4">
                  This is the full-screen image visitors see first. Upload one photo — it replaces the current SVG illustration.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {photosBySection("hero").map((p) => (
                    <PhotoCard key={p.id} photo={p}
                      onUpdate={handleUpdatePhoto} onDelete={handleDeletePhoto} />
                  ))}
                </div>
                <UploadZone onUploaded={handleNewPhotos} section="hero"
                  label="Upload hero background (recommended: 1920×1080px or larger)" />
              </section>

              <section>
                <h2 className="text-lg font-display text-forest mb-2">Homepage Property Cards</h2>
                <p className="text-sm text-ink/60 mb-4">
                  The two property card images on the homepage. Upload one per property.
                </p>
                {properties.map((prop) => (
                  <div key={prop.id} className="mb-6 border border-neutral-100 p-4">
                    <p className="font-medium text-forest mb-3">
                      Home 0{prop.id} — {prop.name}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      {photosBySection("property-card", prop.id).map((p) => (
                        <PhotoCard key={p.id} photo={p}
                          onUpdate={handleUpdatePhoto} onDelete={handleDeletePhoto} />
                      ))}
                    </div>
                    <UploadZone onUploaded={handleNewPhotos}
                      propertyId={prop.id} section="property-card"
                      label={`Upload ${prop.name} card image`} />
                  </div>
                ))}
              </section>

              <section>
                <h2 className="text-lg font-display text-forest mb-2">Instagram Strip Photos</h2>
                <p className="text-sm text-ink/60 mb-4">
                  The 6 square photos in the Instagram section. Upload up to 6.
                </p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                  {photosBySection("instagram").map((p) => (
                    <PhotoCard key={p.id} photo={p}
                      onUpdate={handleUpdatePhoto} onDelete={handleDeletePhoto} />
                  ))}
                </div>
                <UploadZone onUploaded={handleNewPhotos} section="instagram"
                  label="Upload Instagram strip photos (square 1:1 ratio)" />
              </section>
            </div>
          )}

          {/* ═══ PROPERTIES TAB ══════════════════════════════════════ */}
          {tab === "properties" && (
            <div className="space-y-10">
              {properties.map((prop) => (
                <PropertyEditor key={prop.id} property={prop}
                  photos={photos.filter((p) => p.propertyId === prop.id)}
                  onSave={savePropertyData}
                  onNewPhotos={handleNewPhotos}
                  onUpdatePhoto={handleUpdatePhoto}
                  onDeletePhoto={handleDeletePhoto}
                />
              ))}
            </div>
          )}

          {/* ═══ GALLERY TAB ══════════════════════════════════════════ */}
          {tab === "gallery" && (
            <GalleryTab photos={photos} properties={properties}
              onNewPhotos={handleNewPhotos}
              onUpdatePhoto={handleUpdatePhoto}
              onDeletePhoto={handleDeletePhoto}
            />
          )}

          {/* ═══ CONTENT TAB ══════════════════════════════════════════ */}
          {tab === "content" && content && (
            <ContentTab content={content}
              onChange={(c) => setContent(c)}
              onSave={saveContentData}
              saving={saving}
            />
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-50 px-5 py-3 text-sm font-medium shadow-lg transition-all",
          toast.type === "ok" ? "bg-forest text-cream" : "bg-red-600 text-white"
        )}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─── Property Editor sub-component ─────────────────────────────────── */
function PropertyEditor({
  property, photos, onSave, onNewPhotos, onUpdatePhoto, onDeletePhoto,
}: {
  property: SiteProperty;
  photos: SitePhoto[];
  onSave: (p: SiteProperty) => void;
  onNewPhotos: (p: SitePhoto[]) => void;
  onUpdatePhoto: (p: SitePhoto) => void;
  onDeletePhoto: (id: string) => void;
}) {
  const [form, setForm] = useState(property);
  const [open, setOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<"details" | "photos" | "amenities">("details");
  const [newAmenity, setNewAmenity] = useState("");

  const update = (field: keyof SiteProperty, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addAmenity = () => {
    if (!newAmenity.trim()) return;
    update("amenities", [...form.amenities, newAmenity.trim()]);
    setNewAmenity("");
  };

  const removeAmenity = (i: number) =>
    update("amenities", form.amenities.filter((_, idx) => idx !== i));

  const galleryPhotos = photos.filter((p) => p.section === "gallery");
  const heroPhoto = photos.find((p) => p.section === "property-hero");

  return (
    <div className="border border-neutral-200">
      {/* Property header */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-neutral-50 hover:bg-neutral-100 transition-colors">
        <div className="flex items-center gap-3">
          <span className="font-mono text-gold text-xs bg-forest text-cream px-2 py-0.5">
            HOME 0{property.id}
          </span>
          <span className="font-display text-xl text-forest">{form.name}</span>
          <span className="text-xs text-ink/50 font-mono">{form.address}</span>
        </div>
        {open ? <ChevronUp size={18} className="text-ink/40" /> : <ChevronDown size={18} className="text-ink/40" />}
      </button>

      {open && (
        <div className="p-5">
          {/* Sub-tabs */}
          <div className="flex gap-0 mb-6 border-b border-neutral-100">
            {(["details", "photos", "amenities"] as const).map((s) => (
              <button key={s} onClick={() => setActiveSection(s)}
                className={cn(
                  "px-5 py-2.5 text-sm capitalize transition-colors",
                  activeSection === s
                    ? "border-b-2 border-gold text-forest font-medium"
                    : "text-ink/50 hover:text-ink"
                )}>
                {s}
              </button>
            ))}
          </div>

          {/* DETAILS */}
          {activeSection === "details" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Property Name</label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Coordinates</label>
                  <Input value={form.coordinates} onChange={(e) => update("coordinates", e.target.value)} className="font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Full Address</label>
                <Input value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Short Description</label>
                <Input value={form.description} onChange={(e) => update("description", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">
                  Vibe / Neighborhood Story
                </label>
                <Textarea value={form.vibe} rows={4}
                  onChange={(e) => update("vibe", e.target.value)}
                  placeholder="Describe the neighborhood feel, what makes it special..." />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Base Rate (₹)</label>
                  <Input type="number" value={form.baseRate} className="font-mono"
                    onChange={(e) => update("baseRate", +e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Weekend Rate (₹)</label>
                  <Input type="number" value={form.weekendRate} className="font-mono"
                    onChange={(e) => update("weekendRate", +e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Cleaning Fee (₹)</label>
                  <Input type="number" value={form.cleaningFee} className="font-mono"
                    onChange={(e) => update("cleaningFee", +e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Max Guests</label>
                  <Input type="number" value={form.maxGuests} className="font-mono"
                    onChange={(e) => update("maxGuests", +e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Check-in Time</label>
                  <Input type="time" value={form.checkInTime} className="font-mono"
                    onChange={(e) => update("checkInTime", e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Check-out Time</label>
                  <Input type="time" value={form.checkOutTime} className="font-mono"
                    onChange={(e) => update("checkOutTime", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">House Rules / Policies</label>
                <Textarea value={form.policies} rows={3}
                  onChange={(e) => update("policies", e.target.value)} />
              </div>
              <Button variant="gold" onClick={() => onSave(form)} className="w-full">
                <Save size={15} className="mr-2" /> Save Property Details
              </Button>
            </div>
          )}

          {/* PHOTOS */}
          {activeSection === "photos" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-forest mb-3">Hero Photo</h3>
                <p className="text-xs text-ink/50 mb-3">The main large photo shown at the top of this property's page.</p>
                {heroPhoto && (
                  <div className="w-48 mb-3">
                    <PhotoCard photo={heroPhoto} onUpdate={onUpdatePhoto} onDelete={onDeletePhoto} />
                  </div>
                )}
                <UploadZone onUploaded={onNewPhotos} propertyId={form.id} section="property-hero"
                  label={`Upload ${form.name} hero photo (recommended: landscape)`} />
              </div>
              <div>
                <h3 className="font-medium text-forest mb-3">Gallery Photos</h3>
                <p className="text-xs text-ink/50 mb-3">All photos shown in the gallery section of this property's page.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                  {galleryPhotos.map((p) => (
                    <PhotoCard key={p.id} photo={p} onUpdate={onUpdatePhoto} onDelete={onDeletePhoto} />
                  ))}
                </div>
                <UploadZone onUploaded={onNewPhotos} propertyId={form.id} section="gallery"
                  label={`Upload ${form.name} gallery photos`} />
              </div>
            </div>
          )}

          {/* AMENITIES */}
          {activeSection === "amenities" && (
            <div className="space-y-4">
              <p className="text-sm text-ink/60">Add or remove amenities. These appear on the property page and booking cards.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {form.amenities.map((a, i) => (
                  <div key={i} className="flex items-center justify-between border border-neutral-100 px-3 py-2">
                    <span className="text-sm text-ink/80">{a}</span>
                    <button onClick={() => removeAmenity(i)}
                      className="text-neutral-400 hover:text-red-500 transition-colors ml-2">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="e.g., Rooftop terrace"
                  onKeyDown={(e) => e.key === "Enter" && addAmenity()} />
                <Button variant="outline" onClick={addAmenity}>
                  <Plus size={15} className="mr-1" /> Add
                </Button>
              </div>
              <Button variant="gold" onClick={() => onSave(form)} className="w-full">
                <Save size={15} className="mr-2" /> Save Amenities
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Gallery Tab ────────────────────────────────────────────────────── */
function GalleryTab({
  photos, properties, onNewPhotos, onUpdatePhoto, onDeletePhoto,
}: {
  photos: SitePhoto[];
  properties: SiteProperty[];
  onNewPhotos: (p: SitePhoto[]) => void;
  onUpdatePhoto: (p: SitePhoto) => void;
  onDeletePhoto: (id: string) => void;
}) {
  const [filterProp, setFilterProp] = useState("all");
  const [filterSec, setFilterSec] = useState("all");

  const sections = [...new Set(photos.map((p) => p.section))];
  const filtered = photos.filter((p) => {
    if (filterProp !== "all" && p.propertyId !== filterProp) return false;
    if (filterSec !== "all" && p.section !== filterSec) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div>
        <h2 className="text-lg font-display text-forest mb-3">Upload to Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Property</label>
            <select id="gal-prop" className="w-full border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
              <option value="">Both / General</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase">Category</label>
            <select id="gal-sec" className="w-full border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
              {["gallery","interior","exterior","detail","lifestyle","bedroom","kitchen"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <UploadZone
          onUploaded={onNewPhotos}
          propertyId={(document.getElementById("gal-prop") as HTMLSelectElement)?.value || undefined}
          section={(document.getElementById("gal-sec") as HTMLSelectElement)?.value || "gallery"}
          label="Upload gallery photos — multiple allowed"
        />
      </div>

      {/* Filter + grid */}
      <div>
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <span className="text-xs font-mono text-ink/50 uppercase mr-1">Property:</span>
          {["all", ...properties.map((p) => p.id)].map((v) => (
            <button key={v} onClick={() => setFilterProp(v)}
              className={cn(
                "px-3 py-1 text-xs border transition-colors",
                filterProp === v ? "bg-forest text-cream border-forest" : "bg-white text-ink/60 border-neutral-200 hover:border-neutral-400"
              )}>
              {v === "all" ? "All" : properties.find((p) => p.id === v)?.name}
            </button>
          ))}
          <span className="text-xs font-mono text-ink/50 uppercase ml-3 mr-1">Section:</span>
          {["all", ...sections].map((s) => (
            <button key={s} onClick={() => setFilterSec(s)}
              className={cn(
                "px-3 py-1 text-xs border transition-colors",
                filterSec === s ? "bg-gold text-ink border-gold" : "bg-white text-ink/60 border-neutral-200 hover:border-neutral-400"
              )}>
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink/40 mb-3 font-mono">{filtered.length} photos</p>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Image size={32} className="mx-auto text-neutral-300 mb-3" />
            <p className="text-ink/50 text-sm">No photos yet. Upload some above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((p) => (
              <PhotoCard key={p.id} photo={p} onUpdate={onUpdatePhoto} onDelete={onDeletePhoto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Content Tab ────────────────────────────────────────────────────── */
function ContentTab({
  content, onChange, onSave, saving,
}: {
  content: SiteContent;
  onChange: (c: SiteContent) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const set = (field: keyof SiteContent, value: string) =>
    onChange({ ...content, [field]: value });

  const fields: { key: keyof SiteContent; label: string; multiline?: boolean; hint?: string }[] = [
    { key: "heroHeadline", label: "Hero Headline", hint: "Main headline visitors see first" },
    { key: "heroSubtitle", label: "Hero Subtitle", hint: "Small line below the headline" },
    { key: "philosophyText", label: "Philosophy / Manifesto", multiline: true, hint: "The paragraph in the dark green section" },
    { key: "taglinePrimary", label: "Primary Tagline" },
    { key: "taglineSecondary", label: "Secondary Tagline" },
    { key: "taglineCloser", label: "Closing Tagline (pull quote)", hint: '"Come as a guest, leave as family."' },
    { key: "instagramHandle", label: "Instagram Handle" },
    { key: "teamSimranPhone", label: "Simran's Phone (digits only)", hint: "e.g. 8828352311" },
    { key: "teamVipinPhone", label: "Vipin's Phone (digits only)" },
    { key: "teamJyotiPhone", label: "Jyoti's Phone (digits only)" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 rounded">
        ✦ Changes here update the public site text. Click "Save All Text" when done.
      </div>
      {fields.map(({ key, label, multiline, hint }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-forest mb-1">{label}</label>
          {hint && <p className="text-xs text-ink/50 mb-2">{hint}</p>}
          {multiline ? (
            <Textarea value={content[key]} rows={4}
              onChange={(e) => set(key, e.target.value)} />
          ) : (
            <Input value={content[key]} onChange={(e) => set(key, e.target.value)} />
          )}
        </div>
      ))}
      <Button variant="gold" size="lg" onClick={onSave} disabled={saving} className="w-full">
        <Save size={16} className="mr-2" />
        {saving ? "Saving…" : "Save All Text"}
      </Button>
    </div>
  );
}
