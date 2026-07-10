# Setup Guide for The Mehmaan Manor

## Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)
- **Git** for version control

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Prisma
- UI components (Radix UI, Lucide icons)

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Required
DATABASE_URL="postgresql://username:password@localhost:5432/mehmaan_manor"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"

# Optional (for production features)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
RESEND_API_KEY="your-resend-api-key"
TWILIO_ACCOUNT_SID="your-twilio-sid"
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="your-twilio-number"
```

### 3. Set Up Database

#### Option A: Local PostgreSQL

Install PostgreSQL locally, then:

```bash
# Create database
createdb mehmaan_manor

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

#### Option B: Supabase (Recommended for Quick Start)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings → Database
4. Update `DATABASE_URL` in `.env`
5. Run migrations:

```bash
npx prisma db push
npx prisma generate
```

### 4. Seed Demo Data (Optional)

To populate the database with mock bookings and properties:

```bash
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Admin panel**: http://localhost:3000/admin/login
  - Use any credentials (prototype mode)
  - Suggested: `demo@mehmaanmanor.com` / `demo123`

## Vercel Deployment

### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Environment Variables on Vercel

1. Go to your project on Vercel dashboard
2. Settings → Environment Variables
3. Add all variables from `.env`
4. Redeploy

### Database Setup for Production

1. Use **Supabase** (free tier available):
   - Create production database
   - Copy connection string
   - Add to Vercel environment variables

2. Or use **Railway**:
   - Create PostgreSQL database
   - Copy connection string
   - Add to Vercel environment variables

## File Structure Quick Reference

```
the-mehmaan-manor/
├── app/
│   ├── page.tsx              # Homepage
│   ├── homes/                # Property pages
│   ├── experience/           # Amenities
│   ├── gallery/              # Photos
│   ├── about/                # Team & story
│   ├── contact/              # Contact form
│   └── admin/                # Admin panel
├── components/               # Reusable UI
├── lib/                      # Utilities & data
├── prisma/                   # Database schema
└── public/                   # Static assets
```

## Common Issues & Solutions

### Issue: Prisma Client not generated
```bash
npx prisma generate
```

### Issue: Database connection fails
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify credentials

### Issue: Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Issue: Tailwind styles not loading
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Next Steps After Setup

1. **Replace placeholder images**: Update `PlaceholderImage` components with real photos
2. **Connect Instagram**: Integrate Instagram API for real feed
3. **Set up authentication**: Configure NextAuth.js with proper credentials
4. **Enable payments**: Integrate Razorpay for real transactions
5. **Configure email**: Set up Resend for booking confirmations
6. **Add WhatsApp**: Connect WhatsApp Business API

## Development Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Need Help?

Contact the development team or refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
