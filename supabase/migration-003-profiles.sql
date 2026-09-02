-- Fondation double-compte pour la Phase 3 : distingue "toi" de "elle" au lieu
-- d'un seul rôle "authenticated" partagé. Nécessaire pour "je pense à toi"
-- (savoir qui l'envoie) et plus tard pour le suivi de cycle (elle seule décide
-- de partager ses données).

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('author', 'partner')),
  display_name text not null
);

alter table public.profiles enable row level security;

create policy "authenticated read profiles" on public.profiles
  for select to authenticated using (true);

-- Remplace les deux adresses ci-dessous par les vrais emails des deux comptes
-- (Authentication -> Users dans le dashboard) puis exécute.
insert into public.profiles (id, role, display_name)
select id, 'author', 'A2K' from auth.users where email = 'TON_EMAIL_ICI'
union all
select id, 'partner', 'Fatima' from auth.users where email = 'EMAIL_DE_FATIMA_ICI'
on conflict (id) do update set role = excluded.role, display_name = excluded.display_name;

-- "Je pense à toi" (3A.3) : qui l'a envoyé détermine qui est notifié.
create table if not exists public.thoughts (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.thoughts enable row level security;

create policy "authenticated read thoughts" on public.thoughts
  for select to authenticated using (true);

create policy "authenticated send thoughts" on public.thoughts
  for insert to authenticated with check (true);
