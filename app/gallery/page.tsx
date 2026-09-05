"use client";

import { useEffect, useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PlaceholderImage } from "@/components/placeholder-image";
import { cn } from "@/lib/utils";
import { X, ZoomIn } from "lucide-react";

type Photo = {
  id: string;
  url: string;
  alt: string;
  section: string;
  propertyId: string | null;
  isFeatured: boolean;
  tags: string[];
};

/** Human-readable label for a raw section slug */
function sectionLabel(section: string): string {
  const MAP: Record<string, string> = {
    "sushant-lok": "Sushant Lok",
    "jharsa-village": "Jharsa Village",
    "property-hero": "Properties",
    "property-card": "Properties",
    "interiors": "Interiors",
    "interior": "Interiors",
    "details": "Details",
    "detail": "Details",
    "lifestyle": "Lifestyle",
    "hero": "Hero",
    "instagram": "Instagram",
    "gallery": "Gallery",
  };
  if (MAP[section]) return MAP[section];
  return section
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const FALLBACK_IMAGES = [
  { id: "f1", caption: "SUSHANT LOK — Exterior dusk view", section: "sushant-lok" },
  { id: "f2", caption: "INTERIOR — Living room warmth", section: "interiors" },
  { id: "f3", caption: "DETAIL — Brass fixture close-up", section: "details" },
  { id: "f4", caption: "JHARSA — Cozy exterior", section: "jharsa-village" },
  { id: "f5", caption: "LIFESTYLE — Morning coffee moment", section: "lifestyle" },
  { id: "f6", caption: "INTERIOR — Bedroom sanctuary", section: "interiors" },
  { id: "f7", caption: "DETAIL — Ceramic vessel, textile", section: "details" },
  { id: "f8", caption: "SUSHANT LOK — Garden area", section: "sushant-lok" },
  { id: "f9", caption: "LIFESTYLE — Guest reading by window", section: "lifestyle" },
  { id: "f10", caption: "INTERIOR — Kitchen modern", section: "interiors" },
  { id: "f11", caption: "JHARSA — Neighborhood character", section: "jharsa-village" },
  { id: "f12", caption: "DETAIL — Textured throws, plants", section: "details" },
];

/**
 * Returns a layout pattern for a batch of photos.
 * Pattern repeats every 7 items to create varied sizing:
 *   0 → col-span-2 row-span-2 (big feature)
 *   1 → normal portrait
 *   2 → normal portrait
 *   3 → col-span-2 landscape
 *   4 → normal portrait
 *   5 → normal portrait
 *   6 → normal portrait
 */
function getLayout(index: number): {
  colSpan: string;
  aspect: string;
} {
  const pos = index % 7;
  if (pos === 0) return { colSpan: "md:col-span-2 md:row-span-2", aspect: "aspect-square md:aspect-auto md:h-full" };
  if (pos === 3) return { colSpan: "md:col-span-2", aspect: "aspect-[16/9]" };
  return { colSpan: "", aspect: "aspect-[4/5]" };
}

/* ── Lightbox ──────────────────────────────────────────────────── */
function Lightbox({
  photo,
  onClose,
}: {
  photo: { url?: string; alt?: string; caption?: string } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!photo) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={18} />
      </button>
      <div
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {photo.url ? (
          <img
            src={photo.url}
            alt={photo.alt || "Gallery photo"}
            className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
        ) : (
          <div className="w-full aspect-video bg-[#eee9df] rounded-xl flex items-center justify-center">
            <span className="text-ink/40 font-mono text-sm">{photo.caption}</span>
          </div>
        )}
        {(photo.alt || photo.caption) && (
          <p className="mt-3 text-center text-sm text-white/60 font-mono">
            {photo.alt || photo.caption}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Photo tile ─────────────────────────────────────────────────── */
function PhotoTile({
  url,
  alt,
  caption,
  index,
  onClick,
}: {
  url?: string;
  alt?: string;
  caption?: string;
  index: number;
  onClick: () => void;
}) {
  const { colSpan, aspect } = getLayout(index);
  const label = alt || caption || "";
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        "reveal group relative overflow-hidden rounded-2xl cursor-zoom-in bg-[#eee9df]",
        colSpan
      )}
      style={{ transitionDelay: `${(index % 7) * 55}ms` }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={label || `View photo ${index + 1}`}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Image */}
      <div className={cn("w-full overflow-hidden", aspect)}>
        {url ? (
          <img
            src={url}
            alt={alt || "Gallery photo"}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 ease-out",
              hovered ? "scale-[1.06]" : "scale-100"
            )}
            loading="lazy"
          />
        ) : (
          <PlaceholderImage caption={caption || ""} aspectRatio="portrait" variant="light" />
        )}
      </div>

      {/* Hover overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Caption + zoom icon on hover */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between transition-all duration-300",
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        {label && (
          <p className="text-white text-xs font-mono leading-snug line-clamp-2 pr-2">{label}</p>
        )}
        <div className="shrink-0 w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm">
          <ZoomIn size={13} className="text-white" />
        </div>
      </div>

      {/* Featured gold corner accent */}
      {index % 7 === 0 && (
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/20">
          <span className="text-[10px] font-mono text-gold tracking-widest">FEATURED</span>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────── */
export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<{
    url?: string; alt?: string; caption?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPhotos(data.filter((p: { section: string }) => !["hero"].includes(p.section)));
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("active")),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [photos, loaded, activeCategory]);

  const useReal = loaded && photos.length > 0;

  const categories = useMemo(() => {
    if (!useReal) {
      return ["All", "Sushant Lok", "Jharsa Village", "Interiors", "Details", "Lifestyle"];
    }
    const labelSet = new Set<string>();
    for (const photo of photos) {
      const label = sectionLabel(photo.section);
      if (["Hero", "Instagram"].includes(label)) continue;
      labelSet.add(label);
    }
    return ["All", ...Array.from(labelSet).sort()];
  }, [photos, useReal]);

  useEffect(() => {
    if (activeCategory !== "All" && !categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [categories, activeCategory]);

  const filteredReal = useMemo(() => {
    if (!useReal) return [];
    if (activeCategory === "All") return photos;
    return photos.filter((p) => sectionLabel(p.section) === activeCategory);
  }, [photos, useReal, activeCategory]);

  const filteredFallback = useMemo(() => {
    if (useReal) return [];
    if (activeCategory === "All") return FALLBACK_IMAGES;
    return FALLBACK_IMAGES.filter((img) => sectionLabel(img.section) === activeCategory);
  }, [useReal, activeCategory]);

  const totalCount = useReal ? filteredReal.length : filteredFallback.length;

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Navigation />

      <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />

      <main id="main-content">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="pt-28 md:pt-36 pb-8 md:pb-12 px-4 md:px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <span className="label-badge text-gold">Gallery</span>
            <h1 className="font-display text-display text-forest mt-3 mb-3 font-bold">
              A Visual Story
            </h1>
            <p className="text-base text-ink/60 max-w-xl mx-auto">
              Every corner, every detail, every moment captured.
            </p>
          </div>
        </section>

        {/* ── Filter Tabs ───────────────────────────────────────── */}
        <section className="py-5 px-4 md:px-6 bg-white border-b border-forest/8 sticky top-[64px] z-20 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 min-h-[34px]",
                    activeCategory === category
                      ? "bg-forest text-cream shadow-sm"
                      : "bg-[#faf8f4] text-ink/60 border border-forest/10 hover:border-gold/40 hover:text-forest"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
            {loaded && (
              <span className="font-mono text-xs text-ink/35 shrink-0">
                {totalCount} photo{totalCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </section>

        {/* ── Gallery Grid ──────────────────────────────────────── */}
        <section className="py-8 md:py-14 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">

            {/* Loading */}
            {!loaded && (
              <div className="py-32 text-center">
                <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-mono text-sm text-ink/40">Loading photos…</p>
              </div>
            )}

            {/* Real photos — editorial masonry grid */}
            {useReal && filteredReal.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[220px] md:auto-rows-[200px]">
                {filteredReal.map((photo, i) => (
                  <PhotoTile
                    key={photo.id}
                    url={photo.url}
                    alt={photo.alt}
                    index={i}
                    onClick={() => setLightboxPhoto({ url: photo.url, alt: photo.alt })}
                  />
                ))}
              </div>
            )}

            {/* Fallback placeholder grid */}
            {loaded && !useReal && filteredFallback.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[220px] md:auto-rows-[200px]">
                {filteredFallback.map((image, i) => (
                  <PhotoTile
                    key={image.id}
                    caption={image.caption}
                    index={i}
                    onClick={() => setLightboxPhoto({ caption: image.caption })}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {loaded && totalCount === 0 && (
              <div className="py-32 text-center">
                <div className="w-14 h-14 bg-[#eee9df] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🖼️</span>
                </div>
                <h3 className="font-display text-xl text-forest mb-2 font-semibold">Photos coming soon</h3>
                <p className="text-ink/45 text-sm max-w-xs mx-auto">
                  {activeCategory === "All"
                    ? "No photos uploaded yet. Check back soon."
                    : `No photos in "${activeCategory}" yet.`}
                </p>
                {activeCategory !== "All" && (
                  <button
                    onClick={() => setActiveCategory("All")}
                    className="mt-5 font-mono text-sm text-gold hover:underline"
                  >
                    ← View all photos
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────── */}
        {loaded && totalCount > 0 && (
          <section className="pb-16 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="rounded-2xl bg-[#eee9df] border border-forest/8 p-8 md:p-12 text-center">
                <span className="label-badge text-gold">Like What You See?</span>
                <h2 className="font-display text-2xl md:text-3xl text-forest mt-3 mb-3 font-bold">
                  Come experience it in person.
                </h2>
                <p className="text-ink/60 text-sm mb-6 max-w-sm mx-auto">
                  These photos only tell half the story. The other half is waiting for you.
                </p>
                <a
                  href="https://wa.me/918828352311"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#4caf6e] text-white font-semibold text-sm hover:bg-[#3d9d5e] transition-colors shadow-md"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Plan Your Stay on WhatsApp
                </a>
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
