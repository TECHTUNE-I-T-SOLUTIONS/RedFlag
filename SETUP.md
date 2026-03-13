# RedFlag - AI-Powered Scam Detection Platform

## Overview

RedFlag is a modern, full-featured web application for AI-powered scam and fraud detection. Users can submit suspicious messages, screenshots, and URLs for instant analysis with risk scoring and actionable recommendations.

## What's Been Built

### ✅ Core Infrastructure

- Dark mode default theme system with light/dark mode toggle
- Supabase authentication and session management
- Middleware-based route protection for dashboard
- Responsive design with glassmorphism UI patterns

### ✅ Public Pages

- **Landing Page** - Hero section with features overview and CTA
- **Features** - Comprehensive feature breakdown
- **How It Works** - Step-by-step visual guide
- **Pricing** - Tiered pricing with Free, Pro, and Enterprise tiers
- **About** - Mission and values
- **Contact** - Contact form (frontend-only)
- **Blog** - Blog listing page
- **Privacy & Terms** - Legal pages

### ✅ Authentication

- Login page with email/password auth
- Signup page with password strength indicator
- Password reset flow
- Full Supabase Auth integration

### ✅ Dashboard

- **Overview** - Stats cards and recent analyses
- **Analyze** - Tabbed interface for text/URL/image analysis with mock results
- **History** - Analysis history with filtering and search
- **Settings** - Theme toggle and account settings
- Responsive sidebar navigation
- Logout confirmation modal

### ✅ API Routes

- `/api/analyze` - Main analysis endpoint (mock results)
- `/api/analyses` - Get analysis history with filtering
- `/api/stats` - Get dashboard statistics

### ✅ Database Schema

- SQL migration script for `analyses` table
- RLS policies for user data privacy
- Indexes for performance


## Setup Instructions


### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Supabase

1. Go to your Vercel project settings
2. Add Supabase integration or set these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Create Database Tables

1. Go to your Supabase project SQL editor
2. Run the script from `/scripts/setup-database.sql`
3. This creates the `analyses` table with RLS policies

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── (public pages)/          # Features, how-it-works, pricing, etc.
├── auth/                    # Login, signup, password reset
├── dashboard/               # Protected dashboard pages
│   ├── layout.tsx          # Dashboard wrapper
│   ├── page.tsx            # Overview
│   ├── analyze/            # Analysis page
│   ├── history/            # History page
│   └── settings/           # Settings page
├── api/
│   ├── analyze/            # Analysis API
│   ├── analyses/           # History API
│   └── stats/              # Stats API
└── globals.css             # Design tokens and theme

components/
├── Header.tsx              # Navigation header
├── Footer.tsx              # Footer
├── Sidebar.tsx             # Dashboard navigation
├── RiskScoreDisplay.tsx    # Animated risk score
├── LogoutConfirmModal.tsx  # Logout confirmation
└── ui/                     # shadcn/ui components

lib/
├── supabase.ts             # Client-side Supabase
├── supabase-server.ts      # Server-side Supabase
└── utils.ts                # Utility functions
```

## Design System

### Colors
- **Primary**: Crimson Red (#B11226) - Risk and alerts
- **Accent**: Electric Orange (#FF6B35) - Secondary actions
- **Dark**: #0E1117 - Dark mode background
- **Light**: #F9FAFB - Light mode background

### Components
- Glass effect cards with backdrop blur
- Soft shadows and rounded corners (2xl)
- Smooth transitions and animations
- WCAG 2.1 AA accessible

### Typography
- Geist font family (sans-serif)
- Bold headlines, regular body text

## Key Features

### Risk Scoring
- 0-100 scale with animated circular progress
- Color-coded (green/low, yellow/medium, red/high)
- Confidence percentage display

### Analysis Types
- **Text** - Messages, emails, social media
- **URL** - Link analysis with domain verification
- **Screenshot** - OCR-powered image analysis

### Dashboard
- Personal analysis history with filtering
- Real-time statistics
- Account management
- Theme customization

## Next Steps

### To Connect to Real Gemini API:
1. Add `GOOGLE_GENERATIVE_AI_API_KEY` to environment variables
2. Update `/app/api/analyze/route.ts` to call Gemini instead of returning mock results
3. Implement proper error handling and rate limiting

### To Deploy:
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy with `vercel deploy`

### To Add Features:
- Email notifications (Sendgrid/Postmark)
- Advanced filtering and export
- Team collaboration features
- API for third-party integrations
- Batch analysis processing

## Environment Variables

Required for development:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Optional for production:
```
GOOGLE_GENERATIVE_AI_API_KEY=
```

## Troubleshooting

### Supabase Auth Issues
- Ensure RLS policies are correctly set up on the `analyses` table
- Check that auth session cookie is properly configured
- Verify JWT claims in Supabase settings

### Styling Issues
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`
- Check that `globals.css` design tokens are defined

### API Errors
- Check browser console and server logs
- Verify user is authenticated before making API calls
- Ensure database tables exist and RLS policies allow access

## Support

For issues or questions, check the official documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

Built with Next.js 14, Supabase, and shadcn/ui. Ready for demo and investor presentations!
