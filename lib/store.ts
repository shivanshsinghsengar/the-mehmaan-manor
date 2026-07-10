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
    name: "Sushant Lok",
    slug: "sushant-lok",
    address: "Sector 57, Phase 2, Sushant Lok, Gurugram, Haryana",
    coordinates: "28.4212° N, 77.0761° E",
    description: "Your peaceful retreat in the heart of Gurugram",
    vibe: "Peaceful surroundings, great connectivity — perfect for work or to unwind. This home combines the calm of a residential neighborhood with easy access to Gurugram's business districts and dining scene.",
    baseRate: 4500,
    weekendRate: 5500,
    cleaningFee: 500,
    maxGuests: 6,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: ["High-Speed Wi-Fi","Smart TV with Netflix","Fully Equipped Kitchen","Air Conditioning","Dedicated Workspace","24/7 Hot Water","Free Parking","Garden Access","Security System","Spacious Living Area"],
    policies: "No smoking indoors. Pets negotiable. Quiet hours 10 PM – 8 AM. Events require prior approval.",
    isActive: true,
    heroPhotoId: null,
  },
  {
    id: "2",
    name: "Jharsa Village",
    slug: "jharsa-village",
    address: "593, Durga Colony, Jharsa Village, Sector 39, Gurugram, Haryana - 122003",
    coordinates: "28.4594° N, 77.0266° E",
    description: "Your cozy neighborhood escape",
    vibe: "Cozy neighborhood, close to everything — your happy place in the city. Experience authentic local life while staying minutes away from Cyber Hub, malls, and metro connectivity.",
    baseRate: 4000,
    weekendRate: 5000,
    cleaningFee: 500,
    maxGuests: 4,
    checkInTime: "14:00",
    checkOutTime: "11:00",
    amenities: ["High-Speed Wi-Fi","Smart TV with Netflix","Modern Kitchen","Air Conditioning","Work-Friendly Setup","24/7 Hot Water","Street Parking","Local Market Nearby","Safe Neighborhood","Cozy Living Space"],
    policies: "No smoking indoors. Pets negotiable. Quiet hours 10 PM – 8 AM. Please respect the neighborhood.",
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
