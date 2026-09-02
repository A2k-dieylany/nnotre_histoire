-- 3B.3 Mur de post-its + 3B.4 Messages aléatoires.

create table if not exists public.postits (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.postits enable row level security;

create policy "authenticated read postits" on public.postits
  for select to authenticated using (true);

create policy "authenticated write postits" on public.postits
  for insert to authenticated with check (true);

create policy "authenticated delete postits" on public.postits
  for delete to authenticated using (true);

create table if not exists public.random_messages (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.random_messages enable row level security;

create policy "authenticated read random messages" on public.random_messages
  for select to authenticated using (true);

create policy "authenticated write random messages" on public.random_messages
  for insert to authenticated with check (true);

create policy "authenticated delete random messages" on public.random_messages
  for delete to authenticated using (true);
