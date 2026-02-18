
-- 1. Create Vocabulary Table (Safe if exists)
create table if not exists public.vocabulary (
  id text not null primary key,
  s text not null, -- Spanish word
  t text not null, -- Translation
  level text not null, -- A1, A2, etc.
  topic text,
  type text not null, -- verb, noun, etc.
  category text,
  reg boolean default true,
  forms text,
  grammar_tip text,
  noun_notes text,
  examples jsonb default '[]'::jsonb, -- Store examples as JSON array
  nuance jsonb, -- Store nuance object as JSON
  tense_forms jsonb, -- Store past/future forms as JSON { "past": "...", "future": "..." }
  created_at timestamptz default now()
);

-- ==========================================
-- MIGRATION: ADD TENSE_FORMS COLUMN
-- Run this to ensure the column exists even if table was created long ago
-- ==========================================
alter table public.vocabulary 
add column if not exists tense_forms jsonb;

-- 2. Enable RLS (Security)
alter table public.vocabulary enable row level security;

-- 3. Reset Policies (Fix for Error 42710: Policy already exists)
-- We drop them first so we can recreate them safely without errors.
drop policy if exists "Public can view vocabulary" on public.vocabulary;
drop policy if exists "Users can upload vocabulary" on public.vocabulary;
drop policy if exists "Users can update vocabulary" on public.vocabulary;
drop policy if exists "Admins can insert vocabulary" on public.vocabulary;
drop policy if exists "Admins can update vocabulary" on public.vocabulary;

-- 4. Re-Create Policies

-- Policy: Everyone can READ (Public)
create policy "Public can view vocabulary" 
on public.vocabulary for select 
using ( true );

-- Policy: Authenticated users can INSERT/UPDATE
-- Note: If you ran admin_setup.sql previously, you might want to stick with admin-only policies.
-- Ideally, revert to simpler auth checks for now to ensure your sync works:
create policy "Users can upload vocabulary" 
on public.vocabulary for insert 
with check ( auth.role() = 'authenticated' );

create policy "Users can update vocabulary" 
on public.vocabulary for update 
using ( auth.role() = 'authenticated' );
