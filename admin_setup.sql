
-- ==========================================
-- SHELLY SPANISH ISLAND - ADMIN SETUP
-- ==========================================
-- Run this in Supabase SQL Editor to enable Admin permissions.

-- 1. Add 'role' column to profiles table (Default is 'user')
alter table public.profiles 
add column if not exists role text default 'user';

-- 2. Secure the Vocabulary Table
-- First, drop existing loose policies if they exist
drop policy if exists "Users can upload vocabulary" on public.vocabulary;
drop policy if exists "Users can update vocabulary" on public.vocabulary;
drop policy if exists "Admins can insert vocabulary" on public.vocabulary;
drop policy if exists "Admins can update vocabulary" on public.vocabulary;

-- 3. Create STRICT Admin-only policies
-- Only allow INSERT if the user's profile has role='admin'
create policy "Admins can insert vocabulary" 
on public.vocabulary for insert 
with check ( 
  auth.role() = 'authenticated' and 
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'admin'
  )
);

-- Only allow UPDATE if the user's profile has role='admin'
create policy "Admins can update vocabulary" 
on public.vocabulary for update 
using ( 
  auth.role() = 'authenticated' and 
  exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'admin'
  )
);

-- ==========================================
-- HOW TO MAKE YOURSELF AN ADMIN:
-- Run the following command in SQL Editor (Replace with your email):
-- 
-- update public.profiles
-- set role = 'admin'
-- where id in (select id from auth.users where email = 'YOUR_EMAIL@EXAMPLE.COM');
-- ==========================================
