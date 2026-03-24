# Supabase Database Setup Guide

This guide covers database-only integration with Supabase while keeping your existing JWT authentication system.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create account
3. Click **"New Project"**
4. Fill in:
   - **Project name**: `jsecurity` (or your choice)
   - **Database password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
5. Click **"Create new project"** and wait for initialization (2-3 minutes)

## Step 2: Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - **anon key** (only needed for frontend, optional)
   - **service_role key** (only if using Supabase client library)

## Step 3: Construct Database URL

Use this format to create your `DATABASE_URL`:

```
postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres
```

**Example:**
```
postgresql://postgres:MySecurePass123@abcdefghijklmnop.supabase.co:5432/postgres
```

Where:
- `[PASSWORD]` = The password you set in Step 1
- `[PROJECT-ID]` = Your project URL without `https://` and `.supabase.co`

## Step 4: Configure Backend

1. **Copy the env template:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` and add:**
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres
   SECRET_KEY=your-super-secret-key-here
   ```

3. **Keep your existing JWT settings** - no changes needed!

## Step 5: Initialize Database Schema

1. **Option A: Using Supabase Studio (Recommended for beginners)**
   - Go to Supabase Dashboard → **SQL Editor**
   - Click **"New Query"**
   - Run your table creation SQL:

   ```sql
   -- Users table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(255) UNIQUE NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- BlogPosts table
   CREATE TABLE blog_posts (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     author_id INTEGER REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Reviews table
   CREATE TABLE reviews (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id),
     rating INTEGER CHECK (rating >= 1 AND rating <= 5),
     comment TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Add other tables as needed...
   ```

2. **Option B: Using Alembic (if you have existing migrations)**
   ```bash
   cd backend
   alembic upgrade head
   ```

## Step 6: Update Environment

Set environment variables in production:
- **Heroku/Replit/Railway**: Add via dashboard settings
- **Local development**: Already in `.env`

## Step 7: Verify Connection

Run this test:

```bash
cd backend
python -c "from app.db.database import engine; engine.connect(); print('✓ Database connection successful!')"
```

## Important Notes

✅ **Your current JWT auth works as-is** - no changes needed
✅ **All SQLAlchemy models work unchanged**
✅ **Existing API endpoints continue working**
✅ **Supabase handles PostgreSQL DB, backups, and scaling**

❌ **Do NOT commit `.env` file** - it contains sensitive credentials
✅ **Always use `.env.example` as template** for team members

## Troubleshooting

### "Connection refused" error
- Check `DATABASE_URL` format is correct
- Verify Supabase project is running (check dashboard)
- Try from Supabase Studio SQL Editor first

### "Authentication failed" error
- Confirm password matches (check Step 1)
- Password may contain special chars - needs URL encoding (e.g., `@` → `%40`)

### "Table does not exist" error
- Tables haven't been created yet
- Run SQL scripts from Option A in Step 5

## Next Steps

1. **Test one endpoint** to confirm DB connection works
2. **Migrate existing data** (if applicable)
3. **Configure backups** in Supabase Dashboard
4. **Set up monitoring** in Supabase Dashboard

## Frontend Setup (Optional)

If you want Supabase client in frontend (not required for database-only):

```bash
npm install @supabase/supabase-js
```

Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

Add to `.env.local`:
```
VITE_SUPABASE_URL=https://[PROJECT-ID].supabase.co
VITE_SUPABASE_ANON_KEY=[ANON-KEY-FROM-SUPABASE]
```
