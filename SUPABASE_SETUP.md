# 🍓 Supabase Setup Guide for Birthday App

This guide will help you set up Supabase to save RSVP responses and birthday wishes.

## 📋 Prerequisites

- Supabase account (free tier available at https://supabase.com)
- Git (already configured in your project)

## 🚀 Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to https://supabase.com and sign up/log in
2. Click "New Project"
3. Enter a project name (e.g., "birthday-party")
4. Set a strong database password
5. Select your region (closest to you)
6. Click "Create new project"
7. Wait for the project to initialize (2-5 minutes)

### 2. Get Your API Keys

1. In your Supabase dashboard, click **Settings** (bottom left)
2. Click **API** in the left sidebar
3. Under "Project API keys", copy:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon Public Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 3. Configure Environment Variables

1. In your project root, create a `.env.local` file (copy from `.env.local.example`):
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and paste your keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Save the file (⚠️ Never commit this file!)

### 4. Create Database Tables

Go to your Supabase dashboard and run these SQL queries in the **SQL Editor**:

#### Create RSVP Table
```sql
create table rsvps (
  id bigint primary key generated always as identity,
  name text not null,
  phone text,
  email text,
  guest_count integer,
  message text,
  attending text not null,
  child_name text not null,
  submitted_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table rsvps enable row level security;

-- Allow anyone to insert
create policy "anyone_can_insert_rsvp" on rsvps
  for insert
  with check (true);

-- Allow anyone to read
create policy "anyone_can_read_rsvp" on rsvps
  for select
  using (true);
```

#### Create Wishes Table
```sql
create table wishes (
  id bigint primary key generated always as identity,
  guest_name text not null,
  wish text not null,
  child_name text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table wishes enable row level security;

-- Allow anyone to insert
create policy "anyone_can_insert_wish" on wishes
  for insert
  with check (true);

-- Allow anyone to read
create policy "anyone_can_read_wish" on wishes
  for select
  using (true);
```

### 5. Verify Installation

1. Install Supabase dependency (already in package.json):
   ```bash
   npm install @supabase/supabase-js
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

3. Test the app:
   - Open http://localhost:3000
   - Scroll to RSVP form and submit a test response
   - Click the 💌 button (bottom right) to add a wish
   - Check Supabase dashboard SQL Editor: run `select * from rsvps;` and `select * from wishes;` to verify data is being saved

## ✅ Features Now Enabled

✅ **RSVP Form** - Saves guest responses to database  
✅ **Birthday Wishes** - Guests can send wishes shown in popup  
✅ **Real-time Updates** - Wishes update as they're submitted  
✅ **Guest List** - Track who's attending via Supabase dashboard  

## 📊 Accessing Your Data

### View RSVP Responses
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Click **rsvps** table
4. See all guest responses

### View Birthday Wishes
1. Click **wishes** table
2. See all wishes sorted by newest first

### Export Data
1. Click the three dots (...) on any table
2. Click "Export as CSV"
3. Share with parents via email

## 🔐 Security Notes

- ✅ Your `.env.local` file is git-ignored (stays secret)
- ✅ Supabase has Row Level Security policies
- ✅ Public key only allows reading/writing to specified tables
- ✅ Consider restricting IP access in Supabase settings for production

## 🚀 Deploy with Environment Variables

When deploying (Vercel, Netlify, etc.), add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL = your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_key
```

## 🆘 Troubleshooting

**"Module not found: '@supabase/supabase-js'"**
- Run: `npm install @supabase/supabase-js`

**"RSVP won't save"**
- Check `.env.local` variables are correct
- Verify tables were created (check Supabase Table Editor)
- Check browser console for error messages

**"Wishes popup not working"**
- Ensure Supabase URL and keys are set in `.env.local`
- Verify `wishes` table exists and has correct policies

**"Can I see who submitted what?"**
- Yes! All data including names, emails, phone numbers, and wishes are in your Supabase tables
- You can view, export, or delete any entries from the dashboard

## 💡 Pro Tips

1. **Backup Your Data**: Regularly export tables as CSV for safety
2. **Set Reminders**: Use Supabase to see RSVPs and prepare accordingly
3. **Share Access**: Invite parents to Supabase (Settings → Users) to see responses
4. **Custom Queries**: Create reports in Supabase with SQL queries
5. **Automate**: Set up Supabase webhooks to send email notifications

## 📞 Need Help?

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Project README: See [README.md](README.md)

---

**Your birthday app is now fully connected to the internet! 🎉🍓**
