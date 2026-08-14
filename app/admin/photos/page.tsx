"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Trash2, Star, StarOff, RefreshCw, Image as ImageIcon, CheckCircle2, ChevronDown } from "lucide-react";
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

// ── What each section looks like / where it appears ───────────────────────
const SECTIONS = [
  { key: "hero",          label: "Hero Background",    desc: "Full-screen image behind the homepage headline", example: "Best shot — wide, atmospheric, dark-toned" },
  { key: "property-card", label: "Homepage Card",      desc: "Property preview cards on the homepage",        example: "Exterior or living room — landscape" },
  { key: "property-hero", label: "Property Page Hero", desc: "Large top image on each property's detail page", example: "Exterior front shot — wide" },
  { key: "gallery",       label: "Gallery Page",       desc: "Grid of photos on the /gallery page",           example: "Any interior / exterior / detail shots" },
  { key: "instagram",     label: "Instagram Strip",    desc: "6 square tiles on the homepage bottom",         example: "Square-ish crop — mood / lifestyle shots" },
];

const PROPERTIES = [
  { id: null, label: "Both / General" },
  { id: "1",  label: "Sector 57 — Sushant Lok" },
  { id: "2",  label: "Sector 39 — Jharsa Village" },
];

// ── Inline photo assignment card ──────────────────────────────────────────
function PhotoCard({
  photo,
  onDelete,
  onToggleFeatured,
  onAssign,
}: {
  photo: Photo;
  onDelete: (id: string) => void;
  onToggleFeatured: (photo: Photo) => void;
  onAssign: (photo: Photo, section: string, propertyId: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const currentSection = SECTIONS.find((s) => s.key === photo.section);
  const currentProp    = PROPERTIES.find((p) => p.id === photo.propertyId);

  return (
    <div className="bg-white border border-neutral-200 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-video bg-neutral-100 overflow-hidden">
        <img src={photo.url} alt={photo.alt || "photo"} className="w-full h-full object-cover" loading="lazy" />
        {photo.isFeatured && (
          <span className="absolute top-2 left-2 bg-gold text-ink text-[9px] font-mono px-2 py-0.5">★ FEATURED</span>
        )}
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button onClick={() => onToggleFeatured(photo)}
            className="p-1.5 bg-white/90 hover:bg-gold transition-colors" title="Toggle featured">
            {photo.isFeatured ? <StarOff size={12} /> : <Star size={12} />}
          </button>
          <button onClick={() => onDelete(photo.id)}
            className="p-1.5 bg-white/90 hover:bg-red-500 hover:text-white transition-colors" title="Delete">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Assignment panel */}
      <div className="p-3 space-y-2">

        {/* Current assignment badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-forest/10 text-forest px-2 py-0.5 font-mono">
            {currentSection?.label ?? photo.section}
          </span>
          {currentProp && (
            <span className="text-xs bg-gold/10 text-ink/70 px-2 py-0.5 font-mono">
              {currentProp.label}
            </span>
          )}
        </div>

        {/* Reassign toggle */}
        <button onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between text-xs text-ink/50 hover:text-forest transition-colors py-1 border-t border-neutral-100">
          <span>Change assignment</span>
          <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="space-y-3 pt-1">
            {/* Section picker */}
            <div>
              <p className="text-[10px] font-mono text-ink/40 uppercase mb-1.5">Where does this photo go?</p>
              <div className="grid grid-cols-1 gap-1">
                {SECTIONS.map((s) => (
                  <button key={s.key}
                    onClick={() => onAssign(photo, s.key, photo.propertyId)}
                    className={cn(
                      "text-left px-3 py-2 text-xs border transition-all",
                      photo.section === s.key
                        ? "border-forest bg-forest/5 text-forest font-medium"
                        : "border-neutral-200 text-ink/60 hover:border-forest/50"
                    )}>
                    <span className="font-medium">{s.label}</span>
                    <span className="text-ink/40 ml-1">— {s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Property picker */}
            <div>
              <p className="text-[10px] font-mono text-ink/40 uppercase mb-1.5">Which property?</p>
              <div className="flex gap-1.5 flex-wrap">
                {PROPERTIES.map((p) => (
                  <button key={String(p.id)}
                    onClick={() => onAssign(photo, photo.section, p.id)}
                    className={cn(
                      "px-3 py-1.5 text-xs border transition-all",
                      photo.propertyId === p.id
                        ? "border-forest bg-forest text-cream"
                        : "border-neutral-200 text-ink/60 hover:border-forest"
                    )}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function PhotosPage() {
  const [photos, setPhotos]       = useState<Photo[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [filterSection, setFilterSection] = useState<string>("all");
  const [filterProp, setFilterProp]       = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch {/* ignore */}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Upload handler — no section/property required; defaults to gallery/null
  // User assigns them after seeing the preview
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadMsg(`Uploading ${files.length} photo(s)…`);

    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    fd.append("section", "gallery"); // default — user reassigns below
    // no propertyId → null

    try {
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setUploadMsg(`✓ ${data.photos.length} photo(s) uploaded — now assign them below`);
        setPhotos((prev) => [...data.photos, ...prev]);
        setTimeout(() => setUploadMsg(""), 5000);
      } else {
        setUploadMsg(`✗ ${data.error || "Upload failed"}`);
        setTimeout(() => setUploadMsg(""), 4000);
      }
    } catch {
      setUploadMsg("✗ Network error");
      setTimeout(() => setUploadMsg(""), 4000);
    } finally {
      setUploading(false);
    }
  };

  // Reassign a photo's section + property in the DB
  const handleAssign = async (photo: Photo, section: string, propertyId: string | null) => {
    const updated = { ...photo, section, propertyId };
    await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, propertyId }),
    });
    setPhotos((prev) => prev.map((p) => p.id === photo.id ? updated : p));
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

  // Filter
  const visible = photos.filter((p) => {
    if (filterSection !== "all" && p.section !== filterSection) return false;
    if (filterProp === "null"  && p.propertyId !== null) return false;
    if (filterProp !== "all" && filterProp !== "null" && p.propertyId !== filterProp) return false;
    return true;
  });

  // Stats
  const unassigned = photos.filter((p) => !p.propertyId && p.section === "gallery").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-1">Photos</h1>
          <p className="text-ink/60 text-sm">
            Upload all photos at once — then assign each one to the right place below.
            {photos.length > 0 && ` · ${photos.length} total`}
          </p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 text-sm text-ink/50 hover:text-forest transition-colors">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
        {[
          { n: "1", t: "Upload",  d: "Drop all photos here — labelled or not" },
          { n: "2", t: "Preview", d: "See every photo as a card below" },
          { n: "3", t: "Assign",  d: "Click 'Change assignment' on each card" },
          { n: "4", t: "Section", d: "Pick where it appears (Hero, Gallery…)" },
          { n: "5", t: "Live",    d: "Saves instantly — no build needed" },
        ].map(({ n, t, d }) => (
          <div key={n} className="flex items-start gap-2 bg-forest/5 border border-forest/10 p-3">
            <span className="font-mono text-gold font-bold text-base leading-none mt-0.5">{n}</span>
            <div>
              <p className="font-medium text-forest">{t}</p>
              <p className="text-ink/50 leading-snug">{d}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed p-10 text-center cursor-pointer transition-all",
          uploading
            ? "border-gold bg-gold/5 cursor-not-allowed"
            : "border-neutral-300 hover:border-gold hover:bg-neutral-50"
        )}
      >
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={(e) => handleUpload(e.target.files)} />
        <Upload size={32} className={cn("mx-auto mb-3", uploading ? "text-gold animate-bounce" : "text-neutral-400")} />
        <p className="text-base font-medium text-ink/70">
          {uploading ? uploadMsg : "Drop all your photos here — or click to browse"}
        </p>
        <p className="text-sm text-ink/40 mt-1">
          No need to rename or sort them first · JPG, PNG, WEBP · Multiple files at once
        </p>
      </div>

      {uploadMsg && !uploading && (
        <p className={cn("text-sm font-mono px-1", uploadMsg.startsWith("✓") ? "text-green-600" : "text-red-600")}>
          {uploadMsg}
        </p>
      )}

      {/* Unassigned warning */}
      {unassigned > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          <CheckCircle2 size={16} className="text-yellow-500 flex-shrink-0" />
          <span>
            <strong>{unassigned} photo{unassigned !== 1 ? "s" : ""}</strong> are unassigned (showing in Gallery as default).
            Use the assignment panel on each card to place them correctly.
          </span>
        </div>
      )}

      {/* Section guide */}
      <div className="bg-neutral-50 border border-neutral-200 p-4">
        <p className="text-xs font-mono text-ink/50 uppercase mb-3">Where does each section appear?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SECTIONS.map((s) => {
            const count = photos.filter((p) => p.section === s.key).length;
            return (
              <div key={s.key} className="text-xs space-y-0.5">
                <p className="font-medium text-forest">{s.label}
                  {count > 0 && <span className="ml-1.5 text-gold font-mono">({count})</span>}
                </p>
                <p className="text-ink/50">{s.desc}</p>
                <p className="text-ink/40 italic">{s.example}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink/50 uppercase">Section:</span>
            <div className="flex gap-1.5 flex-wrap">
              {([{ key: "all", label: "All" }, ...SECTIONS] as { key: string; label: string }[]).map((s) => (
                <button key={s.key}
                  onClick={() => setFilterSection(s.key)}
                  className={cn(
                    "px-3 py-1 text-xs border transition-all",
                    filterSection === s.key
                      ? "border-forest bg-forest text-cream"
                      : "border-neutral-200 text-ink/60 hover:border-forest"
                  )}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink/50 uppercase">Property:</span>
            <div className="flex gap-1.5">
              {[{ id: "all", label: "All" }, ...PROPERTIES].map((p) => (
                <button key={String(p.id)}
                  onClick={() => setFilterProp(p.id === null ? "null" : String(p.id))}
                  className={cn(
                    "px-3 py-1 text-xs border transition-all",
                    (filterProp === String(p.id) || (filterProp === "null" && p.id === null))
                      ? "border-forest bg-forest text-cream"
                      : "border-neutral-200 text-ink/60 hover:border-forest"
                  )}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-ink/40 font-mono ml-auto">{visible.length} shown</span>
        </div>
      )}

      {/* Photo grid */}
      {loading ? (
        <div className="py-24 text-center text-ink/40 font-mono text-sm">Loading…</div>
      ) : photos.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-neutral-200">
          <ImageIcon size={40} className="mx-auto text-neutral-300 mb-4" />
          <p className="text-ink/50">No photos yet — upload above to get started</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="py-12 text-center text-ink/40 text-sm">No photos match the current filter.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              onAssign={handleAssign}
            />
          ))}
        </div>
      )}
    </div>
  );
}
