
-- 1. Create Vocabulary Table
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
  created_at timestamptz default now()
);

-- 2. Enable RLS (Security)
alter table public.vocabulary enable row level security;

-- 3. Policy: Everyone can READ (Public)
create policy "Public can view vocabulary" 
on public.vocabulary for select 
using ( true );

-- 4. Policy: Only authenticated users (admins) can INSERT/UPDATE
-- For simplicity, we allow any logged-in user to upload for now (Traveler level), 
-- but in production you might want to restrict this to specific user IDs.
create policy "Users can upload vocabulary" 
on public.vocabulary for insert 
with check ( auth.role() = 'authenticated' );

create policy "Users can update vocabulary" 
on public.vocabulary for update 
using ( auth.role() = 'authenticated' );
