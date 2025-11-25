# PROMME Website Migration to Next.js

## Overview
This document outlines the migration from vanilla HTML/CSS/JS to Next.js with TypeScript and Tailwind CSS.

## Why Migrate?

### Current Issues
- ❌ Manual DOM manipulation is complex
- ❌ CSS caching issues frustrating development
- ❌ Hard to maintain state across pages
- ❌ No hot reload - constant hard refreshes needed
- ❌ Difficult to scale and add features

### Benefits of Next.js
- ✅ Component-based architecture (easier maintenance)
- ✅ Built-in routing
- ✅ Hot reload (no cache issues!)
- ✅ TypeScript for type safety
- ✅ Better SEO with SSR
- ✅ Optimized performance out of the box
- ✅ Easy deployment to Vercel

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Hooks** - State management

### Backend/Database
- **Supabase** - PostgreSQL database + Authentication
- **@supabase/supabase-js** - Supabase client
- **@supabase/ssr** - Server-side rendering support

## Project Structure

```
next-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── auth/              # Authentication pages
│   ├── profile/           # Profile pages
│   └── vacancy/           # Vacancy pages
├── components/
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Hero section
│   ├── AIChat.tsx         # AI Chat modal
│   ├── VacancyCard.tsx    # Vacancy cards
│   └── Map.tsx            # Yandex Maps
├── lib/
│   └── supabase/
│       ├── client.ts      # Client-side Supabase
│       └── server.ts      # Server-side Supabase
├── types/
│   └── index.ts           # TypeScript types
└── public/                # Static assets
```

## Migration Status

### ✅ Completed
1. Next.js project initialized
2. Supabase client configured
3. TypeScript types defined
4. Header component created
5. Project structure set up

### 🔄 In Progress
- Main page components
- AI Chat component
- Profile page

### ⏳ To Do
- Vacancy page
- Auth page
- Yandex Maps integration
- CSS migration to Tailwind
- Testing
- Deployment

## Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mskikoksudxjhpnpsoal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_APP_NAME=PROMME
NEXT_PUBLIC_APP_VERSION=2.0.0
```

## How to Run

### Development
```bash
cd next-app
npm run dev
```

Visit `http://localhost:3000`

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## API Integration

All API calls now use Supabase:

```typescript
import { supabase } from '@/lib/supabase/client';

// Fetch vacancies
const { data, error } = await supabase
  .from('vacancies')
  .select('*')
  .limit(10);
```

## Key Improvements

1. **No More Cache Issues** - Hot reload updates instantly
2. **Type Safety** - TypeScript catches errors at compile time
3. **Better Code Organization** - Components are reusable
4. **Modern Tooling** - ESLint, Prettier, etc.
5. **Optimized Performance** - Automatic code splitting
6. **Easy Deployment** - One command to Vercel

## Next Steps

1. Continue migrating components
2. Test all functionality
3. Deploy to Vercel
4. Update DNS settings

## Notes

- Old files preserved in root directory
- New app in `next-app/` directory
- Database schema unchanged
- All Supabase credentials migrated

