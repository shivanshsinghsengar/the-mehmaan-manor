"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Trash2, Star, StarOff, X, Check, RefreshCw, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  url: string;
  alt: string;
  propertyId: string | null;
  section: string;
  isFeatured: boolean;
  order: number;
}

const SECTIONS = [
  { key: "hero",          label: "🏠 Hero Background",       desc: "Full-screen homepage background" },
  { key: "property-card", label: "📸 Homepage Cards",         desc: "Property cards on homepage" },
  { key: "property-hero", label: "🖼️ Property Hero",          desc: "Top image on property pages" },
  { key: "gallery",       label: "🎨 Gallery",                desc: "Photo gallery page" },
  { key: "instagram",     label: "📱 Instagram Strip",        desc: "6 squares on homepage" },
];

const PROPERTIES = [
  { id: null,  label: "Both / General" },
  { id: "1",   label: "Sushant Lok" },
  { id: "2",   label: "Jharsa Village" },
];

function UploadZone({
  onUploaded,
  propertyId,
  section,
}: {
  onUploaded: (photos: Photo[]) => void;
  propertyId: string | null;
  section: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setProgress(`Uploading ${files.length} file(s)…`);

    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    if (propertyId) fd.append("propertyId", propertyId);
    fd.append("section", section);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setProgress(`✓ ${data.photos.length} photo(s) uploaded!`);
        onUploaded(data.photos);
        setTimeout(() => setProgress(""), 3000);
      } else {
        setProgress(`✗ ${data.error || "Upload failed"}`);
        setTimeout(() => setProgress(""), 4000);
      }
    } catch {
      setProgress("✗ Network error");
      setTimeout(() => setProgress(""), 4000);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed p-6 text-center cursor-pointer transition-all",
          dragging ? "border-gold bg-gold/10" : "border-neutral-300 hover:border-gold hover:bg-neutral-50",
          uploading && "opacity-60 cursor-not-allowed"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <Upload size={24} className={cn("mx-auto mb-2", dragging ? "text-gold" : "text-neutral-400")} />
        <p className="text-sm font-medium text-ink/70">
          {uploading ? progress : "Drop photos here or click to upload"}
        </p>
        <p className="text-xs text-ink/40 mt-1">JPG, PNG, WEBP · Multiple files allowed</p>
      </div>
      {progress && !uploading && (
        <p className={cn("text-xs mt-2 font-mono", progress.startsWith("✓") ? "text-green-600" : "text-red-600")}>
          {progress}
        </p>
      )}
    </div>
  );
}

function PhotoGrid({
  photos,
  onDelete,
  onToggleFeatured,
}: {
  photos: Photo[];
  onDelete: (id: string) => void;
  onToggleFeatured: (photo: Photo) => void;
}) {
  if (photos.length === 0) {
    return (
      <div className="py-8 text-center border border-dashed border-neutral-200">
        <Image size={24} className="mx-auto text-neutral-300 mb-2" />
        <p className="text-xs text-ink/40">No photos yet — upload above</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group border border-neutral-200 bg-neutral-50">
          {/* Preview */}
          <div className="aspect-square overflow-hidden bg-neutral-100">
            <img
              src={photo.url}
              alt={photo.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Featured badge */}
          {photo.isFeatured && (
            <div className="absolute top-1.5 left-1.5 bg-gold text-ink text-[9px] font-mono px-1.5 py-0.5">
              ★ FEATURED
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => onToggleFeatured(photo)}
              className="p-1.5 bg-white hover:bg-gold transition-colors"
              title="Toggle featured"
            >
              {photo.isFeatured ? <StarOff size={13} /> : <Star size={13} />}
            </button>
            <button
              onClick={() => onDelete(photo.id)}
              className="p-1.5 bg-white hover:bg-red-500 hover:text-white transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Alt text */}
          <p className="px-2 py-1 text-[10px] text-ink/50 font-mono truncate border-t border-neutral-100">
            {photo.alt || photo.section}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const [activeProp, setActiveProp] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch {/* ignore */}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUploaded = (newPhotos: Photo[]) => {
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleFeatured = async (photo: Photo) => {
    const updated = { ...photo, isFeatured: !photo.isFeatured };
    await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: updated.isFeatured }),
    });
    setPhotos((prev) => prev.map((p) => p.id === photo.id ? updated : p));
  };

  // Filter photos for current view
  const filteredPhotos = photos.filter((p) => {
    const matchSection = p.section === activeSection;
    const matchProp = activeProp === null
      ? true
      : p.propertyId === activeProp;
    return matchSection && matchProp;
  });

  // Section needs property selector
  const needsProperty = ["property-card", "property-hero", "gallery"].includes(activeSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Photos</h1>
          <p className="text-ink/60">
            Upload photos — they go live on the public site instantly.
            {photos.length > 0 && ` · ${photos.length} photos uploaded`}
          </p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-sm text-ink/50 hover:text-forest transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* How it works */}
      <div className="bg-forest/5 border border-forest/15 p-4 text-sm text-forest/80">
        <strong>How it works:</strong> Select a section below → upload photos → they instantly replace the SVG placeholders on the live website. No code needed.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left — Section selector */}
        <div className="lg:col-span-1 space-y-2">
          <p className="text-xs font-mono text-ink/50 uppercase mb-3">Select Section</p>
          {SECTIONS.map((s) => {
            const count = photos.filter((p) => p.section === s.key).length;
            return (
              <button
                key={s.key}
                onClick={() => { setActiveSection(s.key); setActiveProp(null); }}
                className={cn(
                  "w-full text-left p-3 border transition-all",
                  activeSection === s.key
                    ? "border-forest bg-forest/5 text-forest"
                    : "border-neutral-200 text-ink/60 hover:border-neutral-400"
                )}
              >
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-xs text-ink/40 mt-0.5">{s.desc}</p>
                {count > 0 && (
                  <p className="text-xs text-gold font-mono mt-1">{count} photo{count !== 1 ? "s" : ""}</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Right — Upload + Preview */}
        <div className="lg:col-span-3 space-y-5">
          {/* Section title */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display text-forest">
                {SECTIONS.find((s) => s.key === activeSection)?.label}
              </h2>
              <p className="text-sm text-ink/50">
                {SECTIONS.find((s) => s.key === activeSection)?.desc}
              </p>
            </div>
          </div>

          {/* Property selector for property-specific sections */}
          {needsProperty && (
            <div>
              <p className="text-xs font-mono text-ink/50 uppercase mb-2">For which property?</p>
              <div className="flex gap-2">
                {PROPERTIES.map((p) => (
                  <button
                    key={String(p.id)}
                    onClick={() => setActiveProp(p.id)}
                    className={cn(
                      "px-4 py-2 text-sm border transition-all",
                      activeProp === p.id
                        ? "border-forest bg-forest text-cream"
                        : "border-neutral-200 text-ink/60 hover:border-neutral-400"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upload zone */}
          <div className="bg-white border border-neutral-200 p-5">
            <p className="text-xs font-mono text-ink/50 uppercase mb-3">Upload New Photos</p>
            <UploadZone
              onUploaded={handleUploaded}
              propertyId={needsProperty ? activeProp : null}
              section={activeSection}
            />
          </div>

          {/* Photo preview grid */}
          <div className="bg-white border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-ink/50 uppercase">
                Current Photos
                {filteredPhotos.length > 0 && ` · ${filteredPhotos.length}`}
              </p>
              {filteredPhotos.length > 0 && (
                <p className="text-xs text-ink/40">Hover to delete or feature</p>
              )}
            </div>
            {loading ? (
              <div className="py-8 text-center text-ink/40 font-mono text-sm">Loading…</div>
            ) : (
              <PhotoGrid
                photos={filteredPhotos}
                onDelete={handleDelete}
                onToggleFeatured={handleToggleFeatured}
              />
            )}
          </div>

          {/* Tips */}
          <div className="bg-neutral-50 border border-neutral-200 p-4 text-xs text-ink/60 space-y-1">
            <p className="font-medium text-ink/70 mb-2">Tips for best results:</p>
            <p>→ <strong>Hero Background:</strong> Use landscape photos, 1920×1080px minimum</p>
            <p>→ <strong>Homepage Cards:</strong> One photo per property, landscape format</p>
            <p>→ <strong>Property Hero:</strong> Wide shot of exterior or main living area</p>
            <p>→ <strong>Gallery:</strong> Mix of interior, exterior, detail, lifestyle shots</p>
            <p>→ <strong>Instagram Strip:</strong> 6 square photos, 1:1 ratio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
