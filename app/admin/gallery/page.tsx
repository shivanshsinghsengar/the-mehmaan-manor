"use client";

import { useState } from "react";
import {
  Upload,
  Tag,
  Trash2,
  Star,
  StarOff,
  Filter,
  Grid,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/placeholder-image";
import { cn } from "@/lib/utils";

type Photo = {
  id: string;
  propertyId: string;
  propertyName: string;
  caption: string;
  tags: string[];
  isFeatured: boolean;
  uploadDate: string;
};

const INITIAL_PHOTOS: Photo[] = [
  {
    id: "1",
    propertyId: "1",
    propertyName: "Sushant Lok",
    caption: "PROPERTY HERO — Sushant Lok dusk exterior",
    tags: ["hero", "exterior", "sushant-lok"],
    isFeatured: true,
    uploadDate: "2024-06-01",
  },
  {
    id: "2",
    propertyId: "1",
    propertyName: "Sushant Lok",
    caption: "INTERIOR — Living room natural light",
    tags: ["interior", "living-room", "sushant-lok"],
    isFeatured: false,
    uploadDate: "2024-06-01",
  },
  {
    id: "3",
    propertyId: "1",
    propertyName: "Sushant Lok",
    caption: "DETAIL — Brass fixture close-up",
    tags: ["detail", "sushant-lok"],
    isFeatured: false,
    uploadDate: "2024-06-02",
  },
  {
    id: "4",
    propertyId: "2",
    propertyName: "Jharsa Village",
    caption: "PROPERTY HERO — Jharsa Village cozy exterior",
    tags: ["hero", "exterior", "jharsa"],
    isFeatured: true,
    uploadDate: "2024-06-03",
  },
  {
    id: "5",
    propertyId: "2",
    propertyName: "Jharsa Village",
    caption: "INTERIOR — Bedroom warm tones",
    tags: ["interior", "bedroom", "jharsa"],
    isFeatured: false,
    uploadDate: "2024-06-03",
  },
  {
    id: "6",
    propertyId: "1",
    propertyName: "Sushant Lok",
    caption: "LIFESTYLE — Morning coffee moment",
    tags: ["lifestyle", "sushant-lok"],
    isFeatured: false,
    uploadDate: "2024-06-04",
  },
  {
    id: "7",
    propertyId: "2",
    propertyName: "Jharsa Village",
    caption: "DETAIL — Ceramic vessel, textile",
    tags: ["detail", "jharsa"],
    isFeatured: false,
    uploadDate: "2024-06-05",
  },
  {
    id: "8",
    propertyId: "1",
    propertyName: "Sushant Lok",
    caption: "KITCHEN — Modern, fully equipped",
    tags: ["kitchen", "interior", "sushant-lok"],
    isFeatured: false,
    uploadDate: "2024-06-05",
  },
];

const ALL_TAGS = ["all", "hero", "exterior", "interior", "bedroom", "kitchen", "lifestyle", "detail"];

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [filterProperty, setFilterProperty] = useState("all");
  const [filterTag, setFilterTag] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const filtered = photos.filter((p) => {
    const matchProp =
      filterProperty === "all" || p.propertyId === filterProperty;
    const matchTag =
      filterTag === "all" || p.tags.includes(filterTag);
    return matchProp && matchTag;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleFeatured = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
      )
    );
  };

  const deleteSelected = () => {
    if (!confirm(`Delete ${selected.size} photo(s)?`)) return;
    setPhotos((prev) => prev.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display text-forest mb-2">Gallery</h1>
          <p className="text-ink/60">
            {photos.length} photos across both properties
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={deleteSelected}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} className="mr-2" />
              Delete {selected.size}
            </Button>
          )}
          <Button
            variant="gold"
            onClick={() => setShowUpload(true)}
          >
            <Upload size={16} className="mr-2" />
            Upload Photos
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-neutral-400" />
            <span className="text-sm text-ink/60">Property:</span>
            <div className="flex gap-1">
              {[
                { v: "all", label: "All" },
                { v: "1", label: "Sushant Lok" },
                { v: "2", label: "Jharsa Village" },
              ].map((opt) => (
                <button
                  key={opt.v}
                  onClick={() => setFilterProperty(opt.v)}
                  className={cn(
                    "px-3 py-1 text-xs transition-colors border",
                    filterProperty === opt.v
                      ? "bg-forest text-cream border-forest"
                      : "bg-white text-ink/60 border-neutral-200 hover:border-neutral-400"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tag size={14} className="text-neutral-400" />
            <span className="text-sm text-ink/60">Tag:</span>
            <div className="flex flex-wrap gap-1">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={cn(
                    "px-3 py-1 text-xs transition-colors border",
                    filterTag === tag
                      ? "bg-gold text-ink border-gold"
                      : "bg-white text-ink/60 border-neutral-200 hover:border-neutral-400"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Photos", value: photos.length },
          { label: "Sushant Lok", value: photos.filter((p) => p.propertyId === "1").length },
          { label: "Jharsa Village", value: photos.filter((p) => p.propertyId === "2").length },
          { label: "Featured", value: photos.filter((p) => p.isFeatured).length },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-neutral-200 p-4">
            <p className="text-xs font-mono text-ink/50 mb-1">{s.label.toUpperCase()}</p>
            <p className="text-2xl font-display text-forest">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Photo Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className={cn(
                "relative group bg-white border transition-all",
                selected.has(photo.id)
                  ? "border-gold ring-2 ring-gold"
                  : "border-neutral-200"
              )}
            >
              {/* Image */}
              <div
                className="cursor-pointer"
                onClick={() => toggleSelect(photo.id)}
              >
                <PlaceholderImage
                  caption={photo.caption}
                  aspectRatio="square"
                />
              </div>

              {/* Checkbox */}
              <button
                onClick={() => toggleSelect(photo.id)}
                className={cn(
                  "absolute top-2 left-2 w-5 h-5 border-2 transition-all",
                  selected.has(photo.id)
                    ? "bg-gold border-gold"
                    : "bg-white/80 border-white opacity-0 group-hover:opacity-100"
                )}
              >
                {selected.has(photo.id) && (
                  <span className="text-ink text-xs leading-none flex items-center justify-center h-full">
                    ✓
                  </span>
                )}
              </button>

              {/* Featured star */}
              <button
                onClick={() => toggleFeatured(photo.id)}
                className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white transition-colors"
                title="Toggle homepage feature"
              >
                {photo.isFeatured ? (
                  <Star size={14} className="text-gold fill-gold" />
                ) : (
                  <StarOff
                    size={14}
                    className="text-neutral-400 opacity-0 group-hover:opacity-100"
                  />
                )}
              </button>

              {/* Info */}
              <div className="p-2">
                <p className="text-xs font-mono text-gold truncate">
                  {photo.propertyName}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {photo.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-neutral-100 text-ink/50 px-1.5 py-0.5 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 py-20 text-center">
          <Grid size={40} className="mx-auto text-neutral-300 mb-4" />
          <p className="text-ink/60 mb-4">No photos match the current filters</p>
          <Button variant="outline" onClick={() => { setFilterProperty("all"); setFilterTag("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-display text-forest">Upload Photos</h2>
              <button onClick={() => setShowUpload(false)}>
                <X size={20} className="text-ink/40 hover:text-ink" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Property select */}
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Property
                </label>
                <select className="w-full border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
                  <option value="1">Sushant Lok</option>
                  <option value="2">Jharsa Village</option>
                </select>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); alert("In production: uploads files"); }}
                className={cn(
                  "border-2 border-dashed p-12 text-center transition-colors cursor-pointer",
                  dragOver
                    ? "border-gold bg-gold/5"
                    : "border-neutral-300 hover:border-gold"
                )}
              >
                <Upload
                  size={32}
                  className={cn(
                    "mx-auto mb-3",
                    dragOver ? "text-gold" : "text-neutral-400"
                  )}
                />
                <p className="text-sm font-medium text-ink/70">
                  Drop photos here or click to browse
                </p>
                <p className="text-xs text-ink/40 mt-1">
                  PNG, JPG, WEBP · Up to 10MB each · Multiple allowed
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-forest mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., interior, bedroom, sushant-lok"
                  className="w-full border border-neutral-200 px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Featured toggle */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" className="accent-gold w-4 h-4" />
                <div>
                  <p className="text-sm font-medium text-forest">
                    Feature on homepage
                  </p>
                  <p className="text-xs text-ink/50">
                    Show in the Instagram strip on the homepage
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-3 p-6 border-t border-neutral-100">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowUpload(false)}
              >
                Cancel
              </Button>
              <Button
                variant="gold"
                className="flex-1"
                onClick={() => {
                  setShowUpload(false);
                  alert("Upload complete! (connects to Cloudinary in production)");
                }}
              >
                <Upload size={14} className="mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
