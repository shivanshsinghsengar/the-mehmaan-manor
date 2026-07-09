# The Mehmaan Manor

**A boutique dual-property homestay brand in Gurugram, India**

Award-worthy marketing website + functional admin panel built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

---

## 🏆 Design Philosophy

This project was built to Awwwards/Godly.website/SiteInspire standards:

### Typography
- **Display**: Cormorant Garamond — High-contrast old-style serif for architectural elegance
- **Body**: Inter — Humanist grotesque with tight tracking for warmth
- **Mono**: JetBrains Mono — Editorial texture for coordinates, booking codes, data tables

### Color System (OKLCH for perceptual uniformity)
- **Forest Green**: `oklch(0.32 0.05 155)` — Deep, moody, premium
- **Gold**: `oklch(0.75 0.12 85)` — Warm brass accent (used sparingly)
- **Cream**: `oklch(0.97 0.015 85)` — Off-white background with warmth
- **Ink**: `oklch(0.20 0.02 155)` — Near-black with green undertone

**70% cream / 20% forest / 8% ink / 2% gold** — Gold is a spice, not a sauce.

### Moments of Delight
- **Public Site**: Hero headline word-by-word stagger reveal at 150ms intervals
- **Pull-quote hover**: Each word gently shifts hue toward gold
- **Navigation**: Arch underline animation matching logo motif
- **Admin Panel**: KPI cards "breathe" on hover (103% scale over 600ms)
- **Bookings calendar**: Subtle paper-texture SVG pattern

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd the-mehmaan-manor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin/login

---

## 📁 Project Structure

```
the-mehmaan-manor/
├── app/
│   ├── (public)/               # Public website pages
│   │   ├── page.tsx            # Homepage
│   │   ├── homes/              # Properties
│   │   │   ├── page.tsx        # All homes overview
│   │   │   ├── sushant-lok/
│   │   │   └── jharsa-village/
│   │   ├── experience/         # Amenities & philosophy
│   │   ├── gallery/            # Photo gallery
│   │   ├── about/              # Team & story
│   │   └── contact/            # Booking & contact
│   ├── admin/                  # Admin panel
│   │   ├── login/              # Authentication
│   │   ├── page.tsx            # Dashboard
│   │   ├── bookings/           # Booking management
│   │   ├── properties/         # Property editor
│   │   ├── guests/             # Guest database
│   │   ├── inquiries/          # Contact form inbox
│   │   ├── gallery/            # Photo manager
│   │   └── settings/           # Configuration
│   ├── layout.tsx              # Root layout with SEO
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Base UI components
│   ├── navigation.tsx          # Public nav
│   ├── footer.tsx              # Public footer
│   └── placeholder-image.tsx   # Editorial image placeholders
├── lib/
│   ├── utils.ts                # Utility functions
│   └── mock-data.ts            # Prototype mock data
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
├── .env.example                # Environment template
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind + color system
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🔐 Admin Login

### Demo Credentials
For the prototype, **any credentials work**. Suggested:

```
Email: demo@mehmaanmanor.com
Password: demo123
```

In production, implement proper authentication via NextAuth.js.

---

## 📄 Database Schema

### Core Models
- **User**: Admin staff (Owner / Manager / Staff roles)
- **Property**: The two homes (Sushant Lok, Jharsa Village)
- **Photo**: Property images with tags and ordering
- **Guest**: Guest contact database
- **Booking**: Reservations with status and payment tracking
- **Inquiry**: Contact form submissions

### Key Features
- Role-based access control
- Booking status workflow (Pending → Confirmed → Checked In → Checked Out)
- Payment status tracking
- Multi-source booking attribution (Direct / Airbnb / MakeMyTrip)

---

## 🎨 Public Site Pages

### 1. Home (`/`)
- Full-viewport hero with logo arch + staggered headline reveal
- Philosophy manifesto
- Three pillars triptych
- Two homes split-screen teaser
- Amenities preview with icons
- Pull-quote full-bleed moment
- Instagram feed strip
- Final CTA section

### 2. Our Homes (`/homes`)
- Side-by-side property overview
- Equal dignity for both homes
- Map section with coordinates
- Direct links to individual property pages

### 3. Property Detail Pages
- `/homes/sushant-lok`
- `/homes/jharsa-village`

Each includes:
- Hero image with overlay title
- Property overview with coordinates
- Photo gallery (masonry grid)
- Full amenities list
- Neighborhood connectivity
- House policies
- Sticky booking sidebar (desktop) / bottom bar (mobile)
- WhatsApp quick reserve CTA

### 4. Experience (`/experience`)
- Editorial layout for four core amenities
- Alternating text/image sections
- "The Mehmaan Promise" statistics
- CTA to contact

### 5. Gallery (`/gallery`)
- Filter tabs: All / Sushant Lok / Jharsa / Interiors / Details / Lifestyle
- Masonry grid with hover effects
- Placeholder images with editorial captions

### 6. About (`/about`)
- Origin story explaining "Mehmaan" (guest in Hindi)
- Brand values triptych
- Team profiles with contact cards (Simran, Vipin, Jyoti)
- Pull-quote finale

### 7. Contact & Book (`/contact`)
- Team contact cards with WhatsApp links
- Inquiry form with property selection
- Property addresses with coordinates
- Instagram CTA

---

## 🛠️ Admin Panel Pages

### 1. Dashboard (`/admin`)
- KPI cards (check-ins, occupancy, inquiries, revenue)
- Upcoming bookings list
- Property status (occupied / available / cleaning)
- Recent activity feed
- Revenue trend chart (last 6 months)

### 2. Bookings (`/admin/bookings`)
- Calendar view (monthly grid with booking blocks)
- List view (data table with filters)
- Create / edit / cancel bookings
- Guest details & payment tracking
- Booking timeline & notes

### 3. Properties (`/admin/properties`)
- Property cards for both homes
- Editor with tabs:
  - Overview (name, description, address)
  - Photos (drag-drop upload, reorder, set hero)
  - Amenities (toggle list + custom additions)
  - Pricing (base rate, weekend rate, cleaning fee, seasonal overrides)
  - Availability (calendar blocking)
  - Policies (check-in/out times, house rules)

### 4. Guests (`/admin/guests`)
- Guest database with search
- Total stays & spend tracking
- Booking history per guest
- Notes & preferences

### 5. Inquiries (`/admin/inquiries`)
- Contact form submissions inbox
- Status workflow (New / Replied / Booked / Closed)
- Reply interface
- Convert inquiry → booking

### 6. Gallery (`/admin/gallery`)
- Unified photo library
- Bulk upload with drag-drop
- Tag management
- Filter by property
- "Featured on homepage" toggle

### 7. Settings (`/admin/settings`)
- Brand info (taglines, contact, socials)
- Notification preferences
- API integrations (Airbnb, Razorpay, Twilio)
- Team management

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Connect Supabase or Railway PostgreSQL database
```

### Environment Variables Needed
```
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
RAZORPAY_KEY_ID="..."
RESEND_API_KEY="..."
```

---

## 🧪 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom OKLCH colors
- **UI Components**: shadcn/ui + Radix UI primitives
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (ready for production setup)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Cormorant Garamond, Inter, JetBrains Mono)

---

## ✅ Quality Checklist

### Design
- [x] Award-worthy visual design (Awwwards standard)
- [x] Consistent brand voice (warm, elevated, specific)
- [x] Editorial typography with proper hierarchy
- [x] OKLCH color system for perceptual uniformity
- [x] Moments of delight on both surfaces
- [x] Responsive mobile-first design

### Accessibility
- [x] WCAG AA compliance
- [x] Semantic HTML5 landmarks
- [x] Proper heading hierarchy
- [x] Focus states visible (gold ring)
- [x] Skip-to-content link
- [x] Alt text on images
- [x] Keyboard navigation
- [x] `prefers-reduced-motion` support

### Performance
- [x] Lazy-load below-fold images
- [x] Optimized font loading (`font-display: swap`)
- [x] Minimal initial JavaScript
- [x] Efficient scroll reveal observers
- [x] No heavy parallax or scroll-jacking

### SEO
- [x] Meta descriptions
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured data (LodgingBusiness schema × 2)
- [x] Sitemap-ready structure
- [x] Semantic URLs

---

## 🎯 Future Enhancements

### Public Site
- [ ] Real photography (replace placeholder images)
- [ ] Actual Instagram feed integration
- [ ] WhatsApp Business API for automated responses
- [ ] Multi-language support (English + Hindi)
- [ ] Blog/Journal section for local guides

### Admin Panel
- [ ] Real-time booking sync with Airbnb/MakeMyTrip
- [ ] Automated email confirmations (Resend)
- [ ] SMS notifications (Twilio)
- [ ] Razorpay payment integration
- [ ] Advanced analytics dashboard
- [ ] Housekeeping task management
- [ ] Guest review management
- [ ] Dynamic pricing engine

---

## 📞 Contact

**The Mehmaan Manor**

- **Simran** (Host): +91 88283 52311
- **Vipin** (Property Manager): +91 87965 68003
- **Jyoti** (Guest Relations): +91 87965 68002

Instagram: [@themehmaanmanor](https://www.instagram.com/themehmaanmanor)

---

## 📄 License

Private project for The Mehmaan Manor. All rights reserved.

---

*"Come as a guest, leave as family."* — The Mehmaan Manor Promise
#   t h e - m e h m a a n - m a n o r  
 