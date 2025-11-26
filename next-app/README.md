# Next.js App with Supabase

This is a [Next.js](https://nextjs.org) project with [Supabase](https://supabase.com) backend integration, ready for deployment on [Netlify](https://netlify.com).

## Features

- ⚡ Next.js 16 with App Router
- 🔐 Supabase Authentication & Database
- 🎨 Tailwind CSS for styling
- 📱 Responsive design with mobile-first approach
- 🚀 Optimized for Netlify deployment

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- A Supabase account and project
- A Netlify account (for deployment)

### Local Development Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd next-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `env.example` file to `.env.local`:

```bash
cp env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project dashboard:
- Go to Project Settings → API
- Copy the "Project URL" and "anon/public" key

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created

### 2. Configure Authentication

1. In your Supabase dashboard, go to Authentication → Settings
2. Configure your Site URL (for local: `http://localhost:3000`)
3. Add redirect URLs:
   - Local: `http://localhost:3000/**`
   - Production: `https://your-netlify-site.netlify.app/**`

### 3. Set Up Database Tables

You'll need to create the necessary tables for your application. Common tables might include:

- `profiles` - User profile information
- `vacancies` - Job vacancy listings
- `messages` - User messages
- `applications` - Job applications
- `posts` - Social feed posts

Refer to your application's data model to create the appropriate schema.

### 4. Configure Storage (Optional)

If you're using file uploads:

1. Go to Storage in your Supabase dashboard
2. Create buckets for different file types (e.g., avatars, resumes, company-logos)
3. Set up appropriate access policies

## Deployment to Netlify

### Step 1: Prepare Your Repository

Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### Step 2: Connect to Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider and select your repository
4. Netlify will auto-detect the build settings from `netlify.toml`

### Step 3: Configure Environment Variables

In the Netlify dashboard:

1. Go to Site settings → Environment variables
2. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be live at `https://your-site-name.netlify.app`

### Step 5: Update Supabase Settings

After deployment:

1. Go to your Supabase dashboard
2. Navigate to Authentication → URL Configuration
3. Update the Site URL to your Netlify domain
4. Add your Netlify domain to the redirect URLs:
   - `https://your-site-name.netlify.app/**`

## Project Structure

```
next-app/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication page
│   ├── messages/          # Messages page
│   ├── profile/           # User profile page
│   ├── search/            # Search page
│   ├── vacancy/           # Vacancy pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/
│   └── supabase/         # Supabase client configuration
│       ├── client.ts     # Browser client
│       └── server.ts     # Server client
├── types/                # TypeScript type definitions
├── public/               # Static assets
├── middleware.ts         # Authentication middleware
├── netlify.toml          # Netlify configuration
└── env.example           # Environment variables template
```

## Key Files

- **`middleware.ts`** - Handles authentication, session refresh, and route protection
- **`netlify.toml`** - Netlify build configuration and deployment settings
- **`lib/supabase/client.ts`** - Supabase client for browser-side operations
- **`lib/supabase/server.ts`** - Supabase client for server-side operations

## Protected Routes

The following routes are protected and require authentication:

- `/profile` - User profile page
- `/messages` - Messages page
- `/vacancy/new` - Create new vacancy

Users not logged in will be redirected to `/auth`.

## Learn More

### Next.js

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

### Supabase

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)

### Netlify

- [Netlify Documentation](https://docs.netlify.com)
- [Deploy Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)

## Troubleshooting

### Build Fails on Netlify

- Check that all environment variables are set correctly
- Ensure `@netlify/plugin-nextjs` is properly configured
- Review build logs for specific errors

### Authentication Issues

- Verify Supabase URL and keys are correct
- Check that redirect URLs are properly configured in Supabase
- Ensure middleware is not blocking necessary routes

### Supabase Connection Errors

- Confirm environment variables are available on the server
- Check that your Supabase project is active and not paused
- Verify network connectivity to Supabase

## Support

For issues and questions:

- Check the [Next.js documentation](https://nextjs.org/docs)
- Visit [Supabase support](https://supabase.com/docs/support)
- Review [Netlify support docs](https://docs.netlify.com/support/)

## License

This project is licensed under the MIT License.
