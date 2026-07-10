# Quick Start — The Mehmaan Manor

Get the website running locally in **5 minutes**.

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version
```

Don't have Node.js? Download from [nodejs.org](https://nodejs.org)

---

## Option A: Quick Start (No Database)

Perfect for viewing the UI and design.

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

**That's it!** Visit:
- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login (any credentials work)

> **Note**: Bookings, guests, and properties will show mock data. Perfect for demo and design review.

---

## Option B: Full Start (With Database)

For testing full CRUD functionality.

### Using Supabase (Easiest)

```bash
# 1. Install dependencies
npm install

# 2. Create free Supabase account
# Visit https://supabase.com and create a project

# 3. Get connection string
# Go to Settings → Database → Connection String (URI)

# 4. Create .env file
cp .env.example .env

# 5. Edit .env and add your Supabase URL
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# 6. Push database schema
npx prisma db push

# 7. Generate Prisma Client
npx prisma generate

# 8. Start server
npm run dev
```

### Using Local PostgreSQL

```bash
# 1. Install PostgreSQL (if not already installed)
# Mac: brew install postgresql
# Windows: Download from postgresql.org
# Linux: sudo apt-get install postgresql

# 2. Start PostgreSQL service
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# 3. Create database
createdb mehmaan_manor

# 4. Install dependencies
npm install

# 5. Create .env
cp .env.example .env

# 6. Edit .env
# DATABASE_URL="postgresql://localhost:5432/mehmaan_manor"

# 7. Run migrations
npx prisma migrate dev

# 8. Start server
npm run dev
```

---

## Verify Installation

### Public Site Checklist
- [ ] Homepage loads at http://localhost:3000
- [ ] Navigation menu works
- [ ] "Our Homes" page shows two properties
- [ ] Individual property pages load
- [ ] Contact form displays
- [ ] Footer has team contact info

### Admin Panel Checklist
- [ ] Login page loads at http://localhost:3000/admin/login
- [ ] Can login with any credentials (demo mode)
- [ ] Dashboard shows KPI cards
- [ ] Bookings page displays list
- [ ] Sidebar navigation works
- [ ] Can logout

---

## Common Issues

### "npm install" fails
```bash
# Clear npm cache
npm cache clean --force
npm install
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Database connection error
```bash
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
# For Supabase: check project isn't paused
```

### Prisma Client errors
```bash
# Regenerate client
npx prisma generate
npm run dev
```

### Styles not loading
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## What to Explore

### Public Site
1. **Homepage**: See the hero animation, taglines, property teasers
2. **Sushant Lok**: Click property to see full detail page with sticky booking sidebar
3. **Experience**: Editorial amenity presentation
4. **About**: Team profiles with cultural storytelling
5. **Contact**: Form with WhatsApp quick links

### Admin Panel
1. **Dashboard**: KPIs, upcoming bookings, revenue chart
2. **Bookings**: List view with filters (calendar view is placeholder)
3. **Properties**: View property cards
4. **Navigation**: Try the mobile menu (resize browser)

---

## Next Steps

1. **Replace Images**: Update `PlaceholderImage` components with real photos
2. **Connect Database**: Set up Supabase for persistence
3. **Customize Content**: Edit property descriptions, amenities, team info
4. **Test Responsively**: Check on mobile, tablet, desktop
5. **Deploy**: Push to Vercel (see SETUP.md)

---

## Need Help?

Check these files:
- **README.md** — Full project documentation
- **SETUP.md** — Detailed installation guide
- **PROJECT_SUMMARY.md** — What's included and why

Or contact the development team.

---

**Enjoy exploring The Mehmaan Manor!** 🏠✨
