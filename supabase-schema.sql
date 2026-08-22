-- ==============================================================================
-- DevFolio PostgreSQL Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up tables, RLS, triggers & storage
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  headline TEXT,
  custom_domain TEXT UNIQUE,
  is_pro BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false NOT NULL;

CREATE OR REPLACE FUNCTION public.prevent_client_pro_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_pro IS DISTINCT FROM OLD.is_pro AND auth.role() <> 'service_role' THEN
    NEW.is_pro := OLD.is_pro;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_profile_pro_status ON public.profiles;
CREATE TRIGGER protect_profile_pro_status
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_client_pro_changes();

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public can view profile of published portfolio owners" ON public.profiles;
CREATE POLICY "Public can view profile of published portfolio owners"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolios
      WHERE public.portfolios.user_id = public.profiles.id
        AND public.portfolios.is_published = true
    )
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ------------------------------------------------------------------------------
-- 2. PORTFOLIOS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  template TEXT DEFAULT 'minimal' NOT NULL, -- 'minimal' | 'modern' | 'professional'
  theme_settings JSONB DEFAULT '{
    "accentColor": "#10b981",
    "fontStyle": "inter",
    "darkMode": true
  }'::jsonb NOT NULL,
  content JSONB DEFAULT '{
    "personal": {
      "fullName": "",
      "title": "",
      "email": "",
      "phone": "",
      "location": "",
      "introduction": "",
      "avatarUrl": ""
    },
    "about": {
      "bio": ""
    },
    "skills": [],
    "education": [],
    "projects": [],
    "experience": [],
    "certifications": [],
    "achievements": [],
    "socialLinks": {
      "github": "",
      "linkedin": "",
      "twitter": "",
      "website": "",
      "other": ""
    },
    "resume": {
      "url": "",
      "filename": ""
    }
  }'::jsonb NOT NULL,
  is_published BOOLEAN DEFAULT false NOT NULL,
  views_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance & quick lookups
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON public.portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_published ON public.portfolios(is_published);

-- Enable RLS for portfolios
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Portfolios Policies
-- 1. Read: Users can read their own portfolios (published or draft) OR anyone can read if published
DROP POLICY IF EXISTS "Portfolios are viewable by owner or publicly if published" ON public.portfolios;
CREATE POLICY "Portfolios are viewable by owner or publicly if published"
  ON public.portfolios FOR SELECT
  USING (
    auth.uid() = user_id OR is_published = true
  );

-- 2. Insert: Authenticated users can insert their own portfolios
DROP POLICY IF EXISTS "Users can create portfolios" ON public.portfolios;
CREATE POLICY "Users can create portfolios"
  ON public.portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Update: Users can update their own portfolios
DROP POLICY IF EXISTS "Users can update portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can update their own portfolios" ON public.portfolios;
CREATE POLICY "Users can update their own portfolios"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Delete: Users can delete their own portfolios
DROP POLICY IF EXISTS "Users can delete portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Users can delete their own portfolios" ON public.portfolios;
CREATE POLICY "Users can delete their own portfolios"
  ON public.portfolios FOR DELETE
  USING (auth.uid() = user_id);


-- ------------------------------------------------------------------------------
-- 3. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ------------------------------------------------------------------------------
-- 4. AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_portfolios_updated_at ON public.portfolios;
CREATE TRIGGER set_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ------------------------------------------------------------------------------
-- 5. STORAGE BUCKETS (Optional for file uploads like resumes and avatars)
-- ------------------------------------------------------------------------------
-- Note: Create buckets named 'portfolios-media' and 'resumes' in Supabase Storage UI or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolios-media', 'portfolios-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public portfolio media access" ON storage.objects;
CREATE POLICY "Public portfolio media access"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('portfolios-media', 'resumes'));

DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id IN ('portfolios-media', 'resumes')
  );

DROP POLICY IF EXISTS "Users can update/delete their own uploads" ON storage.objects;
CREATE POLICY "Users can update/delete their own uploads"
  ON storage.objects FOR UPDATE
  USING (auth.uid() = owner);

DROP POLICY IF EXISTS "Users can delete their own uploads" ON storage.objects;
CREATE POLICY "Users can delete their own uploads"
  ON storage.objects FOR DELETE
  USING (auth.uid() = owner);
