-- Add tier column to profiles table
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='tier') then
    alter table public.profiles add column tier text default 'free';
  end if;
end $$;
