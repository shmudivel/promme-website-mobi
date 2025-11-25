# 🚀 PROMME Next.js - Quick Start Guide

## What's Been Done

✅ **Next.js 15 with TypeScript** - Modern React framework  
✅ **Tailwind CSS** - Utility-first styling  
✅ **Supabase Integration** - Database + Authentication  
✅ **TypeScript Types** - Type-safe development  
✅ **Header Component** - With auth state  
✅ **Project Structure** - Clean and organized  

## Get Started in 3 Steps

### 1. Create Environment File

```bash
cd next-app
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://mskikoksudxjhpnpsoal.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2lrb2tzdWR4amhwbnBzb2FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTc5MjEsImV4cCI6MjA3OTEzMzkyMX0.A2I8TM58PG5PImrH6XQHPkDAUFSdFSHIRjnx5mvWytE
NEXT_PUBLIC_YANDEX_MAPS_API_KEY=YOUR_KEY_HERE
EOF
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open Browser

Visit: **http://localhost:3000**

**🎉 No more cache issues! Changes appear instantly!**

## What's Different from Old Version?

| Feature | Old (Vanilla JS) | New (Next.js) |
|---------|-----------------|---------------|
| **Hot Reload** | ❌ Constant hard refresh | ✅ Instant updates |
| **Type Safety** | ❌ No types | ✅ TypeScript |
| **Components** | ❌ Manual DOM | ✅ React components |
| **Styling** | ❌ Large CSS files | ✅ Tailwind utilities |
| **State** | ❌ localStorage hacks | ✅ React hooks |
| **Dev Experience** | ❌ Frustrating | ✅ Smooth & fast |

## Project Structure

```
next-app/
├── app/
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page (to be completed)
│   ├── auth/             # Login/signup pages (to do)
│   ├── profile/          # User profile (to do)
│   └── vacancy/[id]/     # Vacancy details (to do)
│
├── components/
│   ├── Header.tsx         # ✅ Navigation (done)
│   ├── Hero.tsx           # ⏳ Hero section (next)
│   ├── AIChat.tsx         # ⏳ AI chat modal (next)
│   ├── VacancyCard.tsx    # ⏳ Job listings (next)
│   └── Map.tsx            # ⏳ Yandex maps (next)
│
├── lib/
│   └── supabase/
│       ├── client.ts      # ✅ Client-side Supabase
│       └── server.ts      # ✅ Server-side Supabase
│
└── types/
    └── index.ts           # ✅ TypeScript types
```

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## API Usage Example

```typescript
import { supabase } from '@/lib/supabase/client';

// Fetch vacancies
const { data: vacancies } = await supabase
  .from('vacancies')
  .select('*')
  .limit(10);

// Create user
const { data: user } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});
```

## Next Steps for Development

1. **Complete Home Page Components**
   - Hero section with gradient
   - Vacancy cards
   - AI Chat modal
   - Industrial parks map

2. **Add More Pages**
   - `/auth` - Login/signup
   - `/profile` - User profile
   - `/vacancy/[id]` - Vacancy details

3. **Style with Tailwind**
   - Copy colors from old CSS
   - Use utility classes
   - Keep gradients and animations

4. **Test & Deploy**
   - Test all features
   - Deploy to Vercel
   - Connect custom domain

## Tips

- **No Cache Issues**: Changes appear instantly - no hard refresh needed!
- **TypeScript**: Hover over variables to see types
- **Tailwind**: Use VS Code extension for autocomplete
- **Components**: Keep them small and reusable

## Need Help?

- **Migration Plan**: `MIGRATION-PLAN.md`
- **Refactoring Status**: `../REFACTORING-STATUS.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

**You're all set! The foundation is solid. Time to build! 🚀**

