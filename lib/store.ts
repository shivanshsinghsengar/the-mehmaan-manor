/**
 * In-memory store with localStorage persistence.
 * Acts as a lightweight database until Prisma/Supabase is connected.
 * All admin changes write here → public pages read from here → live updates.
 */

export interface SitePhoto {
  id: string;
  url: string;           // "/uploads/filename.jpg" or external URL
  alt: string;
  propertyId: string | null; // "1", "2", or null for global/hero
  section: string;       // "hero" | "property-card" | "gallery" | "team" | "about"
  order: number;
  isFeatured: boolean;
  tags: string[];
  uploadedAt: string;
}

export interface SiteProperty {
  id: string;
  name: string;
  slug: string;
  address: string;
  coordinates: string;
  description: string;
  vibe: string;
  baseRate: number;
  weekendRate: number;
  cleaningFee: number;
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  policies: string;
  isActive: boolean;
  heroPhotoId: string | null;
}

export interface SiteContent {
  heroHeadline: string;
  heroSubtitle: string;
  philosophyText: string;
  taglinePrimary: string;
  taglineSecondary: string;
  taglineCloser: string;
  instagramHandle: string;
  teamSimranPhone: string;
  teamVipinPhone: string;
  teamJyotiPhone: string;
}

// ── Default data ────────────────────────────────────────────────────────────

export const DEFAULT_PROPERTIES: SiteProperty[] = [
  {
    id: "1",
    name: "The Mehmaan Manor — Sector 57",
    slug: "sushant-lok",
    address: "Building No. G-219, G-Block, Sushant Lok-2, Sector 57, Gurugram, Haryana — 122011",
    coordinates: "28.4233° N, 77.0890° E",
    description: "A warm, peaceful urban retreat with stylish interiors — feels like home from the moment you arrive.",
    vibe: "A warm, peaceful, and welcoming stay with a comfortable atmosphere, stylish interiors, and a relaxing environment that feels like a home away from home. Ideal for both short getaways and extended work stays in Gurugram.",
    baseRate: 2499,
    weekendRate: 2799,
    cleaningFee: 0,
    maxGuests: 3,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: ["High-Speed Wi-Fi","Smart TV with Netflix","Air Conditioning","24/7 Hot Water","Balcony","CCTV Security","24-Hour Power Backup","Street Parking"],
    policies: "Smoking outdoors only. No pets. No parties or events. Quiet hours after 10:00 PM. Visitors allowed 10:00 AM – 8:00 PM only. Please switch off lights and appliances when not in use. Extra charge for 3rd guest.",
    isActive: true,
    heroPhotoId: null,
  },
  {
    id: "2",
    name: "The Mehmaan Manor — Sector 39",
    slug: "jharsa-village",
    address: "Building No. 593, Durga Colony, Jharsa Road, Near Unitech Cyber Park, Sector 39, Gurugram, Haryana — 122003",
    coordinates: "28.4396° N, 77.0525° E",
    description: "Fully furnished, centrally located — your peaceful base near Medanta and the metro.",
    vibe: "A warm, peaceful, and welcoming stay with a comfortable atmosphere and a relaxing environment that feels like a home away from home. Conveniently located near Medanta Hospital and Millennium City Centre Metro Station. Available as a Studio (up to 3 guests) or a spacious 2.5 BHK (up to 5 guests) — ideal for families, working professionals, and corporate guests.",
    baseRate: 1999,
    weekendRate: 2299,
    cleaningFee: 0,
    maxGuests: 5,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: ["High-Speed Wi-Fi","Smart TV with Netflix","Air Conditioning","24/7 Hot Water","Basic Kitchen (Utensils Provided)","Balcony","CCTV Security","24-Hour Power Backup","Street Parking","Near Medanta Hospital","Near Metro Station"],
    policies: "Smoking outdoors only. No pets. No parties or events. Quiet hours after 10:00 PM. Visitors allowed 10:00 AM – 8:00 PM only. Please switch off lights and appliances when not in use. Extra charge for 3rd guest in Studio. Studio max 3 guests · 2.5 BHK max 5 guests.",
    isActive: true,
    heroPhotoId: null,
  },
];

export const DEFAULT_CONTENT: SiteContent = {
  heroHeadline: "The Mehmaan Experience",
  heroSubtitle: "Two homes in Gurugram. Endless ways to feel at home.",
  philosophyText: "Mehmaan — the Hindi word for guest — carries a cultural weight that no translation captures. It's not a transaction. It's a relationship. Two beautifully curated homes. One unforgettable promise. This isn't a hotel. This is your Mehmaan moment.",
  taglinePrimary: "Not just a stay — it's the Mehmaan experience.",
  taglineSecondary: "Two homes. One promise. Endless memories.",
  taglineCloser: "Come as a guest, leave as family.",
  instagramHandle: "@themehmaanmanor",
  teamSimranPhone: "8828352311",
  teamVipinPhone: "8796568003",
  teamJyotiPhone: "8796568002",
};

// ── Server-side store (Node.js global) ──────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __siteStore: {
    properties: SiteProperty[];
    photos: SitePhoto[];
    content: SiteContent;
  } | undefined;
}

function initStore() {
  if (!global.__siteStore) {
    global.__siteStore = {
      properties: [...DEFAULT_PROPERTIES],
      photos: [],
      content: { ...DEFAULT_CONTENT },
    };
  }
  return global.__siteStore;
}

export function getStore() {
  return initStore();
}

export function getProperties(): SiteProperty[] {
  return initStore().properties;
}

export function getProperty(id: string): SiteProperty | undefined {
  return initStore().properties.find((p) => p.id === id);
}

export function getPropertyBySlug(slug: string): SiteProperty | undefined {
  return initStore().properties.find((p) => p.slug === slug);
}

export function saveProperty(property: SiteProperty) {
  const store = initStore();
  const idx = store.properties.findIndex((p) => p.id === property.id);
  if (idx >= 0) {
    store.properties[idx] = property;
  } else {
    store.properties.push(property);
  }
}

export function getPhotos(propertyId?: string, section?: string): SitePhoto[] {
  const store = initStore();
  return store.photos.filter((p) => {
    if (propertyId !== undefined && p.propertyId !== propertyId) return false;
    if (section !== undefined && p.section !== section) return false;
    return true;
  }).sort((a, b) => a.order - b.order);
}

export function savePhoto(photo: SitePhoto) {
  const store = initStore();
  const idx = store.photos.findIndex((p) => p.id === photo.id);
  if (idx >= 0) {
    store.photos[idx] = photo;
  } else {
    store.photos.push(photo);
  }
}

export function deletePhoto(id: string) {
  const store = initStore();
  store.photos = store.photos.filter((p) => p.id !== id);
}

export function getContent(): SiteContent {
  return initStore().content;
}

export function saveContent(content: Partial<SiteContent>) {
  const store = initStore();
  store.content = { ...store.content, ...content };
}
