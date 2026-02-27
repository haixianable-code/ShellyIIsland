-- Add ai_lifetime_used column to profiles table
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='ai_lifetime_used') then
    alter table public.profiles add column ai_lifetime_used int default 0;
  end if;
end $$;
