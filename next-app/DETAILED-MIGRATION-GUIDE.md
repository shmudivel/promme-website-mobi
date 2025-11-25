# 📋 PROMME Website - Detailed Migration Guide for Developers

## Current Status: Foundation Complete, Components Need Migration

### ✅ What's Done:
- Next.js 15 + TypeScript + Tailwind CSS setup
- Supabase client configuration
- TypeScript types defined
- Basic Header component created
- Project structure organized

### ❌ What's NOT Done Yet:
- **All page content migration**
- **All component functionality**
- **All styling**
- **All JavaScript interactions**

---

## 📁 Complete File-by-File Migration Map

### **1. INDEX.HTML → app/page.tsx**

**Source:** `/index.html` (747 lines)
**Destination:** `/next-app/app/page.tsx`

#### Components to Extract:

##### 1.1 Hero Section (Lines 200-230)
```
FROM: index.html lines 200-230
TO: components/Hero.tsx

FUNCTIONALITY:
- Gradient background (#FF8C42 → #FF6B35 → #E94397)
- Main heading animation
- Search form with location/position inputs
- "Найти работу" button
- Background decorative shapes

STYLES TO MIGRATE:
- .hero class
- .hero-content
- .search-form
- .form-group
- .btn-search
- Gradient backgrounds
- Animations (fadeIn, slideUp)
```

##### 1.2 Stats Section (Lines 231-280)
```
FROM: index.html lines 231-280
TO: components/StatsSection.tsx

FUNCTIONALITY:
- 4 stat cards with numbers
- Counter animations
- Responsive grid layout

STYLES TO MIGRATE:
- .stats-section
- .stat-card
- .stat-number
- .stat-label
- Hover effects
```

##### 1.3 Features Section (Lines 281-350)
```
FROM: index.html lines 281-350
TO: components/FeaturesSection.tsx

FUNCTIONALITY:
- 3 feature cards (Соискатели, Компании, Фасилитаторы)
- Icons for each feature
- Description text
- Gradient card backgrounds

STYLES TO MIGRATE:
- .features-section
- .feature-card
- .feature-icon
- .feature-title
- Card hover animations
```

##### 1.4 Vacancies Section (Lines 351-450)
```
FROM: index.html lines 351-450
TO: components/VacanciesSection.tsx + components/VacancyCard.tsx

FUNCTIONALITY:
- Vacancy grid display
- Vacancy cards with:
  - Company logo
  - Job title
  - Location
  - Salary range
  - Match percentage
  - "Подробнее" button
- Load more button
- Filter by category

JAVASCRIPT DEPENDENCIES:
- assets/js/vacancies-api.js → lib/api/vacancies.ts
- Fetch from Supabase
- Real-time filtering

STYLES TO MIGRATE:
- .vacancies-section
- .vacancy-card
- .vacancy-header
- .vacancy-info
- .vacancy-match-badge
- .vacancy-salary
```

##### 1.5 Industrial Parks Map (Lines 451-500)
```
FROM: index.html lines 451-500
TO: components/IndustrialParksMap.tsx

FUNCTIONALITY:
- Yandex Maps integration
- Park markers with info
- Interactive map controls
- Park list sidebar

JAVASCRIPT DEPENDENCIES:
- assets/js/map.js → lib/yandex-maps.ts
- Yandex Maps API

STYLES TO MIGRATE:
- .map-section
- .map-container
- assets/css/ymaps.css
```

##### 1.6 AI Chat Modal (Lines 66-160)
```
FROM: index.html lines 66-160
TO: components/AIChat.tsx

FUNCTIONALITY:
- Floating AI button (bottom-right)
- Modal popup on click
- Chat interface:
  - AI avatar
  - Message bubbles
  - File upload (resume)
  - Text input
  - "Да, помогите заполнить" / "Нет, спасибо" buttons
  - Profile auto-fill from resume
- Close button

JAVASCRIPT DEPENDENCIES:
- assets/js/main.js → components/AIChat.tsx (handleAIChat function)
- assets/js/chat-api.js → lib/api/chat.ts
- File upload handling
- Resume parsing
- Profile data extraction

STYLES TO MIGRATE:
- .ai-chat-btn (floating button)
- .ai-chat-modal (360px width - already adjusted)
- .ai-chat-header (20px padding)
- .ai-chat-body (20px padding)
- .ai-chat-avatar
- .ai-message
- .ai-chat-upload-area (20px 12px padding)
- .ai-chat-textarea
- .ai-chat-send-btn
- .ai-action-btn
- Animations (slideUpModal, fadeIn)
```

---

### **2. PROFILE.HTML → app/profile/page.tsx**

**Source:** `/profile.html` (1110 lines)
**Destination:** `/next-app/app/profile/page.tsx`

#### Components to Extract:

##### 2.1 Profile Header (Lines 360-396)
```
FROM: profile.html lines 360-396
TO: components/profile/ProfileHeader.tsx

FUNCTIONALITY:
- User avatar (initials or photo)
- User name display
- Profile type badge (Соискатель/Компания/Фасилитатор)
- Edit profile button
- Back to home button
- Profile stats (3 cards):
  - Profile completion %
  - Years of experience
  - AI verified checkmark

STYLES TO MIGRATE:
- .profile-header
- .profile-avatar (100px circle)
- .profile-name
- .profile-type
- .btn-action
- .btn-edit
- .btn-back
- .profile-stats
- .stat-card
```

##### 2.2 Profile Video Section (Lines 340-357)
```
FROM: profile.html lines 340-357
TO: components/profile/ProfileVideo.tsx

FUNCTIONALITY:
- AI-generated video player
- Placeholder when no video
- "AI Generated" badge
- Responsive (16:9 desktop, 9:16 mobile)
- Autoplay, muted, loop

JAVASCRIPT DEPENDENCIES:
- showProfileVideo() function (line 772)
- Video URL from localStorage/Supabase

STYLES TO MIGRATE:
- .profile-video-container
- .profile-video
- .profile-video-badge
- Mobile responsive styles (lines 250-272)
```

##### 2.3 Profile Cards Section (Lines 399-461)
```
FROM: profile.html lines 399-461
TO: components/profile/ProfileInfo.tsx

FUNCTIONALITY:
- 2-column grid of cards:
  1. Personal Information:
     - Email
     - Phone
     - Position
     - Experience
  2. Education & Skills:
     - Education
     - Skills
  3. About (full width)
- Field labels and values
- Icon badges

STYLES TO MIGRATE:
- .profile-content (grid 2 columns)
- .profile-card
- .profile-card-title
- .profile-card-icon
- .profile-field
- .profile-field-label
- .profile-field-value
```

##### 2.4 AI Follow-Up Chat (Lines 572-770)
```
FROM: profile.html lines 572-770
TO: components/profile/ProfileAIChat.tsx

FUNCTIONALITY:
- Floating AI button
- Follow-up suggestions after profile save
- Vacancy recommendations
- Video generation offer
- Photo upload for avatar
- Video generation progress
- Video selection interface

JAVASCRIPT FUNCTIONS:
- openFollowUpChat() (line 572)
- openVideoGenerationChat() (line 794)
- showVacancies() (line 663)
- startVideoGeneration() (line 868)
- handlePhotoUpload() (line 903)
- showVideoProcessing() (line 1005)
- selectVideo() (line 1081)

STYLES TO MIGRATE:
- .ai-chat-btn-profile (60px circle, fixed bottom-right)
- Follow-up chat styles
- Upload area styles
- Progress animations
```

---

### **3. AUTH.HTML → app/auth/page.tsx**

**Source:** `/auth.html`
**Destination:** `/next-app/app/auth/page.tsx`

#### Components to Extract:

##### 3.1 Auth Form
```
TO: components/auth/AuthForm.tsx

FUNCTIONALITY:
- Email/password input
- Login/Signup toggle
- Profile type selection (Соискатель/Компания/Фасилитатор)
- Social auth buttons (optional)
- Form validation
- Supabase auth integration

JAVASCRIPT DEPENDENCIES:
- assets/js/auth.js → lib/api/auth.ts
- assets/js/auth-api.js → lib/api/auth.ts

STYLES TO MIGRATE:
- assets/css/auth.css (entire file)
- .auth-page
- .auth-container
- .auth-form
- .form-input
- .btn-auth
```

---

### **4. VACANCY.HTML → app/vacancy/[id]/page.tsx**

**Source:** `/vacancy.html`
**Destination:** `/next-app/app/vacancy/[id]/page.tsx`

#### Components to Extract:

##### 4.1 Vacancy Detail
```
TO: components/vacancy/VacancyDetail.tsx

FUNCTIONALITY:
- Company header with logo
- Job title and location
- Salary range
- Employment type
- Experience required
- Full description
- Requirements list
- Benefits list
- Apply button
- Save/bookmark button
- Share button
- Similar vacancies section

JAVASCRIPT DEPENDENCIES:
- assets/js/vacancies-api.js → lib/api/vacancies.ts
- Dynamic route with [id]
- Fetch vacancy by ID from Supabase

STYLES TO MIGRATE:
- Vacancy detail styles from main.css
```

---

## 📦 JavaScript Files Migration

### **1. assets/js/config.js → lib/config.ts**
```typescript
MIGRATE TO: Environment variables + lib/config.ts

FUNCTIONALITY:
- Supabase URL and keys → .env.local
- API endpoints
- App settings
- Feature flags

CURRENT: 91 lines
ACTION: Convert to TypeScript, use env variables
```

### **2. assets/js/supabase-client.js → lib/supabase/client.ts**
```typescript
STATUS: ✅ DONE
FILE: lib/supabase/client.ts already created
```

### **3. assets/js/auth-api.js → lib/api/auth.ts**
```typescript
MIGRATE TO: lib/api/auth.ts

FUNCTIONALITY:
- Sign up
- Sign in
- Sign out
- Get current user
- Update profile
- Password reset

DEPENDENCIES: @supabase/supabase-js
LINES: ~200
```

### **4. assets/js/profile-api.js → lib/api/profile.ts**
```typescript
MIGRATE TO: lib/api/profile.ts

FUNCTIONALITY:
- Fetch user profile
- Update profile data
- Upload profile photo
- Upload resume
- Generate AI video

DEPENDENCIES: @supabase/supabase-js
LINES: ~150
```

### **5. assets/js/vacancies-api.js → lib/api/vacancies.ts**
```typescript
MIGRATE TO: lib/api/vacancies.ts

FUNCTIONALITY:
- Fetch all vacancies
- Fetch vacancy by ID
- Filter vacancies
- Search vacancies
- Get recommended vacancies

DEPENDENCIES: @supabase/supabase-js
LINES: ~200
```

### **6. assets/js/chat-api.js → lib/api/chat.ts**
```typescript
MIGRATE TO: lib/api/chat.ts

FUNCTIONALITY:
- Send message to AI
- Parse resume file
- Extract profile data
- Fill form automatically

DEPENDENCIES: AI API integration
LINES: ~150
```

### **7. assets/js/main.js → Distributed across components**
```typescript
CURRENT: 1000+ lines of vanilla JS

DISTRIBUTE TO:
- components/AIChat.tsx (AI chat logic)
- components/SearchForm.tsx (search logic)
- components/VacancyCard.tsx (vacancy interactions)
- lib/utils.ts (utility functions)
- hooks/useAuth.ts (auth state)
- hooks/useVacancies.ts (vacancy data)

KEY FUNCTIONS TO MIGRATE:
- handleAIChat() → AIChat component
- openAIChat() → AIChat component
- closeAIChat() → AIChat component
- handleFileUpload() → AIChat component
- handleTextSubmit() → AIChat component
- fillProfile() → Profile page
- saveProfile() → Profile page
```

### **8. assets/js/map.js → components/Map.tsx**
```typescript
MIGRATE TO: components/IndustrialParksMap.tsx

FUNCTIONALITY:
- Initialize Yandex Map
- Add park markers
- Show park info on click
- Filter parks
- Zoom controls

DEPENDENCIES: 
- Yandex Maps API
- react-yandex-maps package (install)

LINES: ~300
```

### **9. assets/js/ui-utils.js → lib/utils.ts**
```typescript
MIGRATE TO: lib/utils.ts + lib/ui-utils.ts

FUNCTIONALITY:
- Show notifications
- Format dates
- Format currency
- Validate forms
- Generate initials
- etc.

LINES: ~100
```

---

## 🎨 CSS Files Migration

### **1. assets/css/main.css → Tailwind Classes**
```
SOURCE: 3457 lines of custom CSS
ACTION: Convert to Tailwind utility classes

KEY STYLES TO CONVERT:

COLORS (Create in tailwind.config.ts):
- Primary: #FF6B35 (orange-500)
- Secondary: #FF8C42 (orange-400)
- Purple: #E94397
- Accent: #8B5FD8
- Text: #1a1a1a
- Background: #FFFFFF

GRADIENTS:
- Hero: linear-gradient(135deg, #FF8C42 0%, #FF6B35 50%, #E94397 100%)
- Buttons: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)
- AI Badge: linear-gradient(135deg, #8B5FD8 0%, #FF6B35 100%)

COMPONENTS TO CONVERT:
- Header/Nav → Tailwind classes
- Hero section → Tailwind classes
- Buttons → Tailwind classes
- Cards → Tailwind classes
- Forms → Tailwind classes
- Modal → Tailwind classes
- AI Chat → Tailwind classes (narrowed: 360px)

KEEP AS CSS MODULES:
- Complex animations
- Yandex Maps styles
- Custom scrollbars
```

### **2. assets/css/ymaps.css → components/Map.module.css**
```
SOURCE: Yandex Maps specific styles
ACTION: Keep as CSS Module for map component

FILE: components/IndustrialParksMap.module.css
LINES: Keep all map-specific styles
```

### **3. assets/css/auth.css → Merge into Tailwind**
```
SOURCE: Auth page styles
ACTION: Convert to Tailwind in auth components

COMPONENTS:
- AuthForm.tsx
- LoginButton.tsx
- ProfileTypeSelector.tsx
```

---

## 🔧 New Files to Create

### **Utility Functions**
```typescript
lib/utils.ts                  - General utilities
lib/ui-utils.ts               - UI helper functions
lib/validators.ts             - Form validation
lib/format.ts                 - Date/currency formatting
```

### **API Functions**
```typescript
lib/api/auth.ts               - Authentication
lib/api/profile.ts            - Profile operations
lib/api/vacancies.ts          - Vacancy operations
lib/api/companies.ts          - Company operations
lib/api/chat.ts               - AI chat integration
```

### **React Hooks**
```typescript
hooks/useAuth.ts              - Auth state management
hooks/useProfile.ts           - Profile data
hooks/useVacancies.ts         - Vacancy data
hooks/useAIChat.ts            - AI chat state
hooks/useMap.ts               - Map interactions
```

### **Components**
```typescript
// Layout Components
components/Header.tsx         ✅ DONE
components/Footer.tsx         - Footer with links

// Home Page Components
components/Hero.tsx           - Hero section with search
components/StatsSection.tsx   - Statistics cards
components/FeaturesSection.tsx - 3 feature cards
components/VacanciesSection.tsx - Vacancy grid
components/VacancyCard.tsx    - Individual vacancy card
components/IndustrialParksMap.tsx - Yandex Map
components/AIChat.tsx         - AI chat modal

// Profile Page Components
components/profile/ProfileHeader.tsx    - User info header
components/profile/ProfileVideo.tsx     - Video section
components/profile/ProfileInfo.tsx      - Info cards
components/profile/ProfileAIChat.tsx    - Follow-up chat

// Auth Page Components
components/auth/AuthForm.tsx            - Login/signup form
components/auth/ProfileTypeSelector.tsx - Type selection

// Vacancy Page Components
components/vacancy/VacancyDetail.tsx    - Full vacancy info
components/vacancy/ApplyButton.tsx      - Apply action
components/vacancy/SimilarVacancies.tsx - Recommendations

// Shared Components
components/SearchForm.tsx     - Search with filters
components/Button.tsx         - Reusable button
components/Card.tsx           - Reusable card
components/Modal.tsx          - Reusable modal
components/Badge.tsx          - Reusable badge
components/LoadingSpinner.tsx - Loading state
components/ErrorMessage.tsx   - Error display
```

---

## 📋 Step-by-Step Migration Checklist

### Phase 1: Core Components (Week 1)
- [ ] 1.1 Migrate Hero section with search
- [ ] 1.2 Create VacancyCard component
- [ ] 1.3 Create VacanciesSection with grid
- [ ] 1.4 Migrate StatsSection
- [ ] 1.5 Migrate FeaturesSection
- [ ] 1.6 Create Footer component

### Phase 2: AI Chat (Week 1-2)
- [ ] 2.1 Create AIChat modal component
- [ ] 2.2 Implement chat interface
- [ ] 2.3 Add file upload functionality
- [ ] 2.4 Connect to AI API
- [ ] 2.5 Add profile auto-fill logic
- [ ] 2.6 Add animations and interactions

### Phase 3: Profile Page (Week 2)
- [ ] 3.1 Create ProfileHeader component
- [ ] 3.2 Create ProfileVideo component
- [ ] 3.3 Create ProfileInfo cards
- [ ] 3.4 Create profile edit form
- [ ] 3.5 Add ProfileAIChat component
- [ ] 3.6 Implement photo upload
- [ ] 3.7 Implement video generation flow

### Phase 4: Auth System (Week 2-3)
- [ ] 4.1 Create AuthForm component
- [ ] 4.2 Implement Supabase auth
- [ ] 4.3 Add profile type selection
- [ ] 4.4 Create auth context/hooks
- [ ] 4.5 Add protected routes
- [ ] 4.6 Add password reset flow

### Phase 5: Vacancy Details (Week 3)
- [ ] 5.1 Create vacancy/[id] dynamic route
- [ ] 5.2 Create VacancyDetail component
- [ ] 5.3 Add apply functionality
- [ ] 5.4 Add save/bookmark feature
- [ ] 5.5 Add similar vacancies
- [ ] 5.6 Add share functionality

### Phase 6: Map Integration (Week 3-4)
- [ ] 6.1 Install react-yandex-maps
- [ ] 6.2 Create IndustrialParksMap component
- [ ] 6.3 Add park markers
- [ ] 6.4 Add park info popups
- [ ] 6.5 Add map controls
- [ ] 6.6 Add park filtering

### Phase 7: API Layer (Week 4)
- [ ] 7.1 Create lib/api/auth.ts
- [ ] 7.2 Create lib/api/profile.ts
- [ ] 7.3 Create lib/api/vacancies.ts
- [ ] 7.4 Create lib/api/companies.ts
- [ ] 7.5 Create lib/api/chat.ts
- [ ] 7.6 Add error handling
- [ ] 7.7 Add loading states

### Phase 8: Styling (Week 4-5)
- [ ] 8.1 Configure Tailwind theme (colors, fonts)
- [ ] 8.2 Convert all gradients
- [ ] 8.3 Convert all buttons
- [ ] 8.4 Convert all cards
- [ ] 8.5 Convert all forms
- [ ] 8.6 Add animations
- [ ] 8.7 Test responsive design
- [ ] 8.8 Test dark mode (optional)

### Phase 9: Testing (Week 5)
- [ ] 9.1 Test all pages
- [ ] 9.2 Test auth flow
- [ ] 9.3 Test profile creation
- [ ] 9.4 Test vacancy search/filter
- [ ] 9.5 Test AI chat
- [ ] 9.6 Test file uploads
- [ ] 9.7 Test mobile responsive
- [ ] 9.8 Fix bugs

### Phase 10: Deployment (Week 5-6)
- [ ] 10.1 Set up Vercel project
- [ ] 10.2 Configure environment variables
- [ ] 10.3 Test production build
- [ ] 10.4 Deploy to staging
- [ ] 10.5 Test staging
- [ ] 10.6 Deploy to production
- [ ] 10.7 Configure custom domain
- [ ] 10.8 Set up monitoring

---

## 🎯 Priority Order

### MUST HAVE (MVP)
1. Hero + Search
2. Vacancy listing
3. Auth system
4. Profile page
5. AI Chat basic

### SHOULD HAVE
6. Vacancy details
7. Map integration
8. Profile video
9. AI Chat advanced

### NICE TO HAVE
10. Analytics
11. Notifications
12. Dark mode
13. PWA features

---

## 📊 Estimated Effort

| Task | Lines of Code | Time Estimate |
|------|--------------|---------------|
| Components | ~3000 | 2-3 weeks |
| API Layer | ~800 | 1 week |
| Styling | ~500 (Tailwind) | 1 week |
| Testing | N/A | 1 week |
| **TOTAL** | ~4300 lines | **5-6 weeks** |

---

## 🚀 Getting Started

1. Read this guide completely
2. Set up development environment
3. Start with Phase 1 (Core Components)
4. Test each component before moving on
5. Commit frequently
6. Update this checklist as you progress

**Remember:** The foundation is solid. You're building on a modern stack. Take it step by step! 💪

