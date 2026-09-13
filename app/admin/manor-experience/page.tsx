"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save, RefreshCw, Upload, X, Eye, Sparkles,
  Type, Image, Users, Home, ChevronDown, ChevronUp, ToggleLeft, ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────────────── */
interface MESettings {
  id: string;
  triggerLabel: string;
  introLine1Heading: string;
  introLine1Sub: string;
  introLine2Heading: string;
  introLine2Sub: string;
  exteriorLocationTag: string;
  exteriorStepLabel: string;
  exteriorImageUrl: string;
  receptionWelcome: string;
  receptionPlaque: string;
  receptionSub: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutBody: string;
  aboutHost1Name: string;
  aboutHost1Role: string;
  aboutHost2Name: string;
  aboutHost2Role: string;
  aboutStory1Title: string;
  aboutStory1Body: string;
  aboutStory2Title: string;
  aboutStory2Body: string;
  aboutStory3Title: string;
  aboutStory3Body: string;
  exteriorPhotos: string;
  aboutPhotos: string;
  isEnabled: boolean;
}

type Photo = { url: string; alt: string };

type SectionKey = "trigger" | "intro" | "exterior" | "reception" | "about";

/* ─── Toast ──────────────────────────────────────────────────────────── */
function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const show = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
}

/* ─── Section wrapper ────────────────────────────────────────────────── */
function Section({
  title, icon: Icon, children, defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-neutral-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className="text-gold" />
          <span className="font-display text-lg text-forest">{title}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-ink/40" /> : <ChevronDown size={16} className="text-ink/40" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 space-y-4 border-t border-neutral-100">{children}</div>}
    </div>
  );
}

/* ─── Field ──────────────────────────────────────────────────────────── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-ink/50 mb-1.5 uppercase tracking-wider">{label}</label>
      {hint && <p className="text-[11px] text-ink/35 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

/* ─── Image upload zone ──────────────────────────────────────────────── */
function ImageUpload({
  label, currentUrl, onUploaded, section,
}: {
  label: string;
  currentUrl: string;
  onUploaded: (url: string) => void;
  section: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("files", files[0]);
    fd.append("section", section);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success && data.photos?.[0]) {
        onUploaded(data.photos[0].url);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {currentUrl && (
        <div className="relative group w-full max-w-sm">
          <img src={currentUrl} alt="preview" className="w-full aspect-video object-cover border border-neutral-200" />
          <button
            onClick={() => onUploaded("")}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed p-6 text-center cursor-pointer transition-all",
          dragging ? "border-gold bg-gold/10" : "border-neutral-300 hover:border-gold hover:bg-neutral-50"
        )}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => upload(e.target.files)} />
        <Upload size={22} className={cn("mx-auto mb-2", dragging ? "text-gold" : "text-neutral-400")} />
        <p className="text-sm text-ink/60">
          {uploading ? "Uploading…" : (currentUrl ? "Replace image" : label)}
        </p>
      </div>
      {/* Or paste URL */}
      <div className="flex gap-2 items-center">
        <span className="text-xs text-ink/40 font-mono whitespace-nowrap">or URL:</span>
        <Input
          value={currentUrl}
          onChange={(e) => onUploaded(e.target.value)}
          placeholder="https://..."
          className="text-xs font-mono h-8"
        />
      </div>
    </div>
  );
}

/* ─── Multi-photo manager ────────────────────────────────────────────── */
function PhotosManager({
  photosJson, onChange, section, label,
}: {
  photosJson: string;
  onChange: (json: string) => void;
  section: string;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const photos: Photo[] = (() => { try { return JSON.parse(photosJson); } catch { return []; } })();

  const update = (newPhotos: Photo[]) => onChange(JSON.stringify(newPhotos));

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append("files", f));
    fd.append("section", section);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        update([...photos, ...data.photos.map((p: any) => ({ url: p.url, alt: p.alt || "" }))]);
      }
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (i: number) => update(photos.filter((_, idx) => idx !== i));
  const updateAlt = (i: number, alt: string) => {
    const next = [...photos];
    next[i] = { ...next[i], alt };
    update(next);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((p, i) => (
          <div key={i} className="relative group border border-neutral-200">
            <img src={p.url} alt={p.alt} className="w-full aspect-square object-cover" />
            <button onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={10} />
            </button>
            <input
              value={p.alt}
              onChange={(e) => updateAlt(i, e.target.value)}
              placeholder="Alt text…"
              className="w-full px-2 py-1 text-[10px] border-t border-neutral-200 focus:outline-none"
            />
          </div>
        ))}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-neutral-300 hover:border-gold flex flex-col items-center justify-center cursor-pointer aspect-square transition-colors"
        >
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => upload(e.target.files)} />
          <Upload size={18} className="text-neutral-400 mb-1" />
          <span className="text-[10px] text-ink/40">{uploading ? "Uploading…" : label}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function ManorExperiencePage() {
  const [settings, setSettings] = useState<MESettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast, show } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manor-experience");
      const data = await res.json();
      setSettings(data);
    } catch {
      show("Failed to load settings", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const set = (field: keyof MESettings, value: string | boolean) =>
    setSettings(s => s ? { ...s, [field]: value } : s);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/manor-experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) show("Saved! Changes live on site.");
      else show("Save failed: " + data.error, "err");
    } catch {
      show("Save failed", "err");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw size={24} className="animate-spin text-gold" />
    </div>
  );

  if (!settings) return (
    <div className="text-center py-20 text-ink/50">Failed to load. <button onClick={load} className="text-gold underline">Retry</button></div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display text-forest mb-1">Manor Experience</h1>
          <p className="text-ink/60 text-sm">
            Control all text, images, and settings for the interactive "Enter the Manor" experience.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="p-2 text-ink/40 hover:text-ink transition-colors" title="Refresh">
            <RefreshCw size={16} />
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-ink/50 hover:text-gold transition-colors">
            <Eye size={14} /> Preview
          </a>
          <Button variant="gold" onClick={save} disabled={saving}>
            <Save size={14} className="mr-2" />
            {saving ? "Saving…" : "Save All"}
          </Button>
        </div>
      </div>

      {/* Enable/Disable toggle */}
      <div className="bg-white border border-neutral-200 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-forest">Experience Enabled</p>
          <p className="text-xs text-ink/50 mt-0.5">Toggle to show/hide the "Enter the Manor" button on the homepage.</p>
        </div>
        <button onClick={() => set("isEnabled", !settings.isEnabled)}
          className="flex items-center gap-2 transition-colors">
          {settings.isEnabled
            ? <ToggleRight size={32} className="text-forest" />
            : <ToggleLeft size={32} className="text-ink/30" />}
          <span className={cn("text-sm font-medium", settings.isEnabled ? "text-forest" : "text-ink/40")}>
            {settings.isEnabled ? "On" : "Off"}
          </span>
        </button>
      </div>

      {/* ── TRIGGER BUTTON ── */}
      <Section title="Trigger Button" icon={Sparkles}>
        <Field label="Button Label" hint="Text on the button that opens the experience (homepage bottom-left).">
          <Input value={settings.triggerLabel} onChange={e => set("triggerLabel", e.target.value)} />
        </Field>
      </Section>

      {/* ── INTRO SCREEN ── */}
      <Section title="Intro Screen" icon={Type}>
        <p className="text-xs text-ink/40 -mt-2 mb-2">The cinematic text that fades in after entering — 2 lines shown in sequence.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Line 1 — Heading">
            <Input value={settings.introLine1Heading} onChange={e => set("introLine1Heading", e.target.value)} />
          </Field>
          <Field label="Line 1 — Subtitle">
            <Input value={settings.introLine1Sub} onChange={e => set("introLine1Sub", e.target.value)} />
          </Field>
          <Field label="Line 2 — Heading">
            <Input value={settings.introLine2Heading} onChange={e => set("introLine2Heading", e.target.value)} />
          </Field>
          <Field label="Line 2 — Subtitle">
            <Input value={settings.introLine2Sub} onChange={e => set("introLine2Sub", e.target.value)} />
          </Field>
        </div>
      </Section>

      {/* ── EXTERIOR SCREEN ── */}
      <Section title="Exterior Screen" icon={Home}>
        <p className="text-xs text-ink/40 -mt-2 mb-2">The outdoor view of the manor — the main entry screen.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Location Tag" hint="Shown in top-center pill.">
            <Input value={settings.exteriorLocationTag} onChange={e => set("exteriorLocationTag", e.target.value)} />
          </Field>
          <Field label="Step Inside Label" hint="Shown in bottom-center button.">
            <Input value={settings.exteriorStepLabel} onChange={e => set("exteriorStepLabel", e.target.value)} />
          </Field>
        </div>
        <Field label="Background Image" hint="Upload or paste URL of the exterior photo. Leave blank to use the animated SVG scene.">
          <ImageUpload
            label="Upload exterior background photo"
            currentUrl={settings.exteriorImageUrl}
            onUploaded={url => set("exteriorImageUrl", url)}
            section="manor-experience-exterior"
          />
        </Field>
      </Section>

      {/* ── RECEPTION HALL ── */}
      <Section title="Reception Hall" icon={Sparkles} defaultOpen={false}>
        <p className="text-xs text-ink/40 -mt-2 mb-2">The indoor hall with 3 gates (shown after entering the building).</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Manor Plaque Text">
            <Input value={settings.receptionPlaque} onChange={e => set("receptionPlaque", e.target.value)} />
          </Field>
          <Field label="Plaque Subtitle">
            <Input value={settings.receptionSub} onChange={e => set("receptionSub", e.target.value)} />
          </Field>
        </div>
        <Field label="Welcome Message" hint="Shown in the host welcome bubble at the top.">
          <Textarea value={settings.receptionWelcome} rows={2}
            onChange={e => set("receptionWelcome", e.target.value)} />
        </Field>
      </Section>

      {/* ── ABOUT ROOM ── */}
      <Section title="About Room (Center Gate)" icon={Users} defaultOpen={false}>
        <p className="text-xs text-ink/40 -mt-2 mb-2">Content shown in the center gate "About Us" room.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title">
            <Input value={settings.aboutTitle} onChange={e => set("aboutTitle", e.target.value)} />
          </Field>
          <Field label="Subtitle">
            <Input value={settings.aboutSubtitle} onChange={e => set("aboutSubtitle", e.target.value)} />
          </Field>
        </div>

        <Field label="Main Body Text">
          <Textarea value={settings.aboutBody} rows={4}
            onChange={e => set("aboutBody", e.target.value)} />
        </Field>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-xs font-mono text-ink/50 uppercase mb-3">Hosts</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Field label="Host 1 Name">
                <Input value={settings.aboutHost1Name} onChange={e => set("aboutHost1Name", e.target.value)} />
              </Field>
              <Field label="Host 1 Role">
                <Input value={settings.aboutHost1Role} onChange={e => set("aboutHost1Role", e.target.value)} />
              </Field>
            </div>
            <div className="space-y-2">
              <Field label="Host 2 Name">
                <Input value={settings.aboutHost2Name} onChange={e => set("aboutHost2Name", e.target.value)} />
              </Field>
              <Field label="Host 2 Role">
                <Input value={settings.aboutHost2Role} onChange={e => set("aboutHost2Role", e.target.value)} />
              </Field>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-xs font-mono text-ink/50 uppercase mb-3">Story Cards (3 cards shown in About room)</p>
          <div className="space-y-4">
            {([1, 2, 3] as const).map(n => (
              <div key={n} className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-neutral-100 p-3">
                <Field label={`Card ${n} Title`}>
                  <Input
                    value={settings[`aboutStory${n}Title` as keyof MESettings] as string}
                    onChange={e => set(`aboutStory${n}Title` as keyof MESettings, e.target.value)}
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label={`Card ${n} Body`}>
                    <Textarea
                      value={settings[`aboutStory${n}Body` as keyof MESettings] as string}
                      rows={2}
                      onChange={e => set(`aboutStory${n}Body` as keyof MESettings, e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <p className="text-xs font-mono text-ink/50 uppercase mb-3">About Room Photos</p>
          <PhotosManager
            photosJson={settings.aboutPhotos}
            onChange={json => set("aboutPhotos", json)}
            section="manor-experience-about"
            label="Add photo"
          />
        </div>
      </Section>

      {/* ── EXTERIOR PHOTOS ── */}
      <Section title="Exterior Scene Photos" icon={Image} defaultOpen={false}>
        <p className="text-xs text-ink/40 -mt-2 mb-2">
          Additional photos for the exterior screen slideshow. These rotate as background.
        </p>
        <PhotosManager
          photosJson={settings.exteriorPhotos}
          onChange={json => set("exteriorPhotos", json)}
          section="manor-experience-exterior"
          label="Add photo"
        />
      </Section>

      {/* Save bottom */}
      <div className="flex justify-end pb-8">
        <Button variant="gold" size="lg" onClick={save} disabled={saving}>
          <Save size={16} className="mr-2" />
          {saving ? "Saving…" : "Save All Changes"}
        </Button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-50 px-5 py-3 text-sm font-medium shadow-lg",
          toast.type === "ok" ? "bg-forest text-cream" : "bg-red-600 text-white"
        )}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
