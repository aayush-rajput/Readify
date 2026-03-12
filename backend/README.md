# Readify Backend — Supabase Setup Guide

## Overview

Readify uses **Supabase** as its backend — there is no separate Node.js API server to run. The frontend communicates directly with Supabase via the JavaScript SDK.

The "backend" consists of:
- **PostgreSQL tables** with schemas matching what the frontend expects
- **Row Level Security (RLS)** policies that control who can read/write what
- **Database triggers** that auto-create user profiles on signup
- **Storage buckets** for file uploads (thumbnails, lesson content, assignments)

## Prerequisites

1. A [Supabase](https://supabase.com) account (free tier works)
2. A Supabase project created
3. Node.js 18+ installed (for the frontend)

## Setup Instructions

### Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Step 2: Run Database Migration

1. In your Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy-paste the entire contents of `supabase_migration.sql`
4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned" — this is correct

### Step 3: Run Storage Setup

1. Still in **SQL Editor**, click **New Query**
2. Copy-paste the entire contents of `supabase_storage.sql`
3. Click **Run**

### Step 4: Load Seed Data (Optional)

1. Still in **SQL Editor**, click **New Query**
2. Copy-paste the entire contents of `seed_data.sql`
3. Click **Run**
4. This creates sample courses and lessons for testing

### Step 5: Configure Frontend Environment

1. Navigate to the project root (where `package.json` is)
2. Edit the `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

### Step 6: Start the Frontend

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` — the app should be running!

## Verification Checklist

After setup, verify everything works:

| Test | Expected Result |
|---|---|
| Visit `/register` and create an account | Success toast, redirect to dashboard |
| Check Supabase → Table Editor → `profiles` | New row with your email, name, role |
| Visit `/courses` | 4 published sample courses appear |
| Click a course → Enroll | "Successfully enrolled" toast |
| Open a lesson → Mark as Complete | Progress bar updates |
| Visit `/dashboard` | Stats show enrolled courses and progress |

## Creating an Admin Account

After signing up normally, promote yourself to admin:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```
3. Log out and log back in
4. Visit `/admin` — you should see the Admin Dashboard

## File Structure

```
backend/
├── supabase_migration.sql   ← Tables, triggers, RLS policies, indexes
├── supabase_storage.sql     ← Storage buckets and access policies
├── seed_data.sql            ← Sample courses and lessons for testing
├── .env.example             ← Documents required environment variables
└── README.md                ← This file
```

## Troubleshooting

### "Missing Supabase environment variables" error
→ Make sure your `.env` file has valid `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Signup works but profile not created
→ Check if the `handle_new_user` trigger exists: Supabase → Database → Triggers

### Courses not showing up
→ Make sure you ran `seed_data.sql` and courses have `is_published = true`

### RLS errors (403 / permission denied)
→ Check that RLS policies exist: Supabase → Auth → Policies

### "relation does not exist" error
→ Re-run `supabase_migration.sql` in the SQL Editor
