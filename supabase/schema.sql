-- Schéma initial "Notre Histoire" — à exécuter dans Supabase SQL Editor.
-- Règle appliquée partout : RLS activé immédiatement après la création de la table,
-- jamais en fin de projet. Une table sans RLS est lisible par n'importe qui possédant
-- la clé anon (publique, présente dans le bundle JS du navigateur).

-- ── Timeline ────────────────────────────────────────────────────────────────
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  event_date date not null,
  cover_image_url text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.timeline_events enable row level security;

-- Espace privé à deux : tout utilisateur authentifié (vous deux) peut tout lire/écrire.
-- Pas de notion de propriétaire de ligne pour le MVP — inutile tant qu'il n'y a
-- qu'un compte partagé. À revoir si un 2e compte distinct arrive en Phase 3.
create policy "authenticated read timeline" on public.timeline_events
  for select to authenticated using (true);

create policy "authenticated write timeline" on public.timeline_events
  for insert to authenticated with check (true);

create policy "authenticated update timeline" on public.timeline_events
  for update to authenticated using (true) with check (true);

create policy "authenticated delete timeline" on public.timeline_events
  for delete to authenticated using (true);

-- ── Contenu à déverrouillage programmé ────────────────────────────────────────
-- Primitive réutilisée par : photo mystère, lettres du futur, coffre-fort.
-- Le check de date est fait ICI, côté serveur (policy RLS), pas côté client :
-- un `if unlockAt > now()` en React se contourne en 10 secondes dans les devtools.
create table if not exists public.unlockable_content (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('letter', 'photo', 'audio', 'video', 'text')),
  title text not null,
  body text,
  media_url text,
  unlock_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.unlockable_content enable row level security;

-- La ligne n'est même pas renvoyée par l'API tant que unlock_at n'est pas passé :
-- pas de fuite de métadonnées (titre, date) sur du contenu encore verrouillé.
create policy "authenticated read unlocked content" on public.unlockable_content
  for select to authenticated using (unlock_at <= now());

create policy "authenticated write unlockable content" on public.unlockable_content
  for insert to authenticated with check (true);

create policy "authenticated update unlockable content" on public.unlockable_content
  for update to authenticated using (true) with check (true);

create policy "authenticated delete unlockable content" on public.unlockable_content
  for delete to authenticated using (true);

-- ── Stockage (photos, audio, vidéo) ──────────────────────────────────────────
-- Bucket privé : pas d'URL publique, accès uniquement via une session authentifiée.
insert into storage.buckets (id, name, public)
values ('memories', 'memories', false)
on conflict (id) do nothing;

create policy "authenticated read memories" on storage.objects
  for select to authenticated using (bucket_id = 'memories');

create policy "authenticated upload memories" on storage.objects
  for insert to authenticated with check (bucket_id = 'memories');

create policy "authenticated delete memories" on storage.objects
  for delete to authenticated using (bucket_id = 'memories');
