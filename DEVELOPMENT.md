# Development Guide — The Mehmaan Manor

Guide for developers working on this project.

---

## 📁 Project Structure Explained

```
the-mehmaan-manor/
│
├── app/                          # Next.js 14 App Router
│   ├── (public)/                 # Route group (doesn't affect URL)
│   │   └── layout.tsx            # Optional layout for public pages
│   ├── page.tsx                  # Homepage (/)
│   ├── homes/                    # Property pages
│   │   ├── page.tsx              # All homes overview (/homes)
│   │   ├── sushant-lok/
│   │   │   └── page.tsx          # Property detail (/homes/sushant-lok)
│   │   └── jharsa-village/
│   │       └── page.tsx          # Property detail (/homes/jharsa-village)
│   ├── experience/               # Amenities page
│   ├── gallery/                  # Photo gallery
│   ├── about/                    # About & team
│   ├── contact/                  # Contact form
│   ├── admin/                    # Admin panel
│   │   ├── layout.tsx            # Admin-specific layout (sidebar, topbar)
│   │   ├── login/                # Authentication
│   │   ├── page.tsx              # Dashboard
│   │   ├── bookings/             # Booking management
│   │   └── [other admin pages]
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   ├── globals.css               # Global styles
│   ├── robots.ts                 # SEO robots.txt
│   └── sitemap.ts                # SEO sitemap
│
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── navigation.tsx            # Public site navigation
│   ├── footer.tsx                # Public site footer
│   └── placeholder-image.tsx     # Editorial image placeholders
│
├── lib/                          # Utilities and data
│   ├── utils.ts                  # Helper functions
│   └── mock-data.ts              # Prototype data (remove in production)
│
├── prisma/                       # Database
│   └── schema.prisma             # Data model
│
├── public/                       # Static assets
│   └── (images, logos, etc.)
│
├── .env.example                  # Environment variable template
├── .gitignore                    # Git exclusions
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind + color system
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 🎨 Adding a New Public Page

### 1. Create Page File

```typescript
// app/new-page/page.tsx
"use client";

import { useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function NewPage() {
  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("active")
        ),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />

      <main id="main-content">
        <section className="pt-40 pb-24 px-6">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-display font-display text-forest mb-6 animate-fade-up">
              Page Title
            </h1>
            <p className="text-lg text-ink/80">Content here</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
```

### 2. Add to Navigation

```typescript
// components/navigation.tsx
const navLinks = [
  // ... existing links
  { href: "/new-page", label: "New Page" },
];
```

### 3. Add to Sitemap

```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ... existing pages
    {
      url: `${baseUrl}/new-page`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

---

## 🔐 Adding a New Admin Page

### 1. Create Page File

```typescript
// app/admin/new-section/page.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function NewAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-forest mb-2">
          Section Title
        </h1>
        <p className="text-ink/60">Description</p>
      </div>

      <div className="bg-white p-6 border border-neutral-200">
        {/* Content here */}
      </div>
    </div>
  );
}
```

### 2. Add to Admin Navigation

```typescript
// app/admin/layout.tsx
const navigation = [
  // ... existing items
  { name: "New Section", href: "/admin/new-section", icon: YourIcon },
];
```

---

## 🎨 Design System Usage

### Colors

```typescript
// Tailwind classes
<div className="bg-forest text-cream">Forest green background</div>
<div className="bg-gold text-ink">Gold background</div>
<div className="bg-cream text-ink">Cream background (default)</div>

// Forest variations
<div className="bg-forest-deep">Darker forest</div>
<div className="text-forest">Forest text</div>
```

### Typography

```typescript
// Display (Cormorant Garamond)
<h1 className="text-hero font-display">Hero headline</h1>
<h2 className="text-display font-display">Section title</h2>
<h3 className="text-title font-display">Subsection</h3>

// Body (Inter)
<p className="text-base">Body text</p>
<p className="text-lg">Larger body</p>

// Mono (JetBrains Mono)
<span className="font-mono text-sm">Booking ID</span>
```

### Spacing

```typescript
// Container
<div className="container mx-auto max-w-7xl px-6">
  {/* Content */}
</div>

// Sections
<section className="py-24 px-6">
  {/* Content */}
</section>

// Card spacing
<div className="p-6 space-y-4">
  {/* Content */}
</div>
```

### Animations

```typescript
// Scroll reveal
<div className="reveal">
  {/* Content fades up on scroll into view */}
</div>

// Staggered reveal
<div className="reveal" style={{ animationDelay: "150ms" }}>
  {/* Delayed entrance */}
</div>

// Image hover
<div className="image-hover">
  <img src="..." alt="..." />
</div>
```

---

## 🗄️ Working with Database

### Adding a New Model

```prisma
// prisma/schema.prisma
model Review {
  id         String   @id @default(cuid())
  bookingId  String
  rating     Int
  comment    String   @db.Text
  createdAt  DateTime @default(now())
  
  booking    Booking  @relation(fields: [bookingId], references: [id])
  
  @@index([bookingId])
}

// Add relation to Booking model
model Booking {
  // ... existing fields
  reviews    Review[]
}
```

Then migrate:

```bash
npx prisma migrate dev --name add_reviews
npx prisma generate
```

### Querying Data (When API Routes Added)

```typescript
// app/api/bookings/route.ts
import { prisma } from "@/lib/prisma";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      property: true,
      guest: true,
    },
    orderBy: {
      checkIn: 'desc',
    },
  });
  
  return Response.json(bookings);
}
```

---

## 🔌 Adding API Routes

### Example: Contact Form Submission

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const inquiry = await prisma.inquiry.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        propertyId: body.property || null,
        dates: body.dates,
        message: body.message,
        status: "NEW",
      },
    });
    
    // TODO: Send email notification
    
    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
```

### Update Contact Form to Use API

```typescript
// app/contact/page.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  
  const data = await response.json();
  
  if (data.success) {
    setSubmitted(true);
  } else {
    // Handle error
  }
  
  setIsSubmitting(false);
};
```

---

## 🖼️ Replacing Placeholder Images

### Option 1: Direct Image Files

```typescript
// Replace PlaceholderImage with Next.js Image
import Image from "next/image";

<Image
  src="/images/sushant-lok-hero.jpg"
  alt="Sushant Lok dusk exterior"
  width={1200}
  height={800}
  className="w-full object-cover"
  priority // For above-fold images
/>
```

### Option 2: Cloudinary Integration

```typescript
// lib/cloudinary.ts
export function getCloudinaryUrl(publicId: string, transformations?: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

// Usage
<Image
  src={getCloudinaryUrl("sushant-lok-hero", "w_1200,h_800,c_fill")}
  alt="..."
  width={1200}
  height={800}
/>
```

---

## 🔐 Adding Real Authentication

### Install NextAuth

```bash
npm install next-auth
```

### Configure NextAuth

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user) {
          return null;
        }
        
        const isValid = await compare(credentials.password, user.password);
        
        if (!isValid) {
          return null;
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
```

### Protect Admin Routes

```typescript
// middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/:path*"],
};
```

---

## 🧪 Testing Checklist

### Before Every Commit

- [ ] Run `npm run lint` — No errors
- [ ] Test responsive breakpoints (375px, 768px, 1024px, 1440px)
- [ ] Verify keyboard navigation works
- [ ] Check console for errors
- [ ] Test with screen reader (if accessibility changes)

### Before Deployment

- [ ] Run `npm run build` — Builds successfully
- [ ] Test production build locally: `npm start`
- [ ] Verify all environment variables are set
- [ ] Test database connection
- [ ] Check all forms submit correctly
- [ ] Verify all links work
- [ ] Test mobile menu on actual device

---

## 🚀 Deployment Workflow

### 1. Push to GitHub

```bash
git add .
git commit -m "feat: your feature description"
git push origin main
```

### 2. Deploy to Vercel

```bash
# First time
vercel --prod

# Subsequent deploys (auto from GitHub)
# Just push to main branch
```

### 3. Post-Deployment Checks

- [ ] Visit production URL
- [ ] Test critical user paths (booking flow)
- [ ] Check admin login works
- [ ] Verify database connectivity
- [ ] Test contact form submission
- [ ] Check Lighthouse scores

---

## 📝 Code Style Guide

### Naming Conventions

```typescript
// Components: PascalCase
export function NavigationMenu() {}

// Files: kebab-case
// navigation-menu.tsx

// Functions: camelCase
function calculateNights() {}

// Constants: SCREAMING_SNAKE_CASE
const MAX_GUESTS = 6;
```

### Component Structure

```typescript
"use client"; // If client component

import { /* imports */ } from "...";

// Types
interface Props {
  title: string;
}

// Component
export default function ComponentName({ title }: Props) {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Tailwind Best Practices

```typescript
// ✅ Good: Compose with cn()
<div className={cn(
  "base classes",
  condition && "conditional-class",
  className
)}>

// ❌ Avoid: String concatenation
<div className={"base " + (condition ? "active" : "")}>

// ✅ Good: Extract complex classes
const buttonClasses = cn(
  "px-4 py-2 rounded",
  variant === "primary" && "bg-forest text-cream",
  variant === "secondary" && "bg-gold text-ink"
);
```

---

## 🐛 Common Issues & Solutions

### Issue: TypeScript errors with Prisma types

```bash
npx prisma generate
```

### Issue: Tailwind classes not working

```bash
# Restart dev server
# Clear .next cache
rm -rf .next
npm run dev
```

### Issue: Scroll reveal not working

```typescript
// Ensure element has "reveal" class
<div className="reveal">Content</div>

// Check useEffect dependency array
useEffect(() => {
  // observer setup
}, []); // Empty array = run once
```

---

## 📚 Helpful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Docs](https://react.dev)

---

**Happy coding!** 🚀
