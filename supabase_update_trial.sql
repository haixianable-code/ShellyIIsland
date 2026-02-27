-- Add trial_ends_at column to profiles table
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='trial_ends_at') then
    alter table public.profiles add column trial_ends_at timestamptz;
  end if;
end $$;
