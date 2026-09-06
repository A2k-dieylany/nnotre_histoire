-- Phase 2B — Galerie des Souvenirs : album éditorial toujours visible, distinct
-- des "surprises" (unlockable_content) qui restent verrouillées jusqu'à une date.
-- Même modèle de droits que timeline_events : espace privé à deux, pas de
-- notion de propriétaire de ligne.

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  taken_on date,
  created_at timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;

create policy "authenticated read gallery" on public.gallery_photos
  for select to authenticated using (true);

create policy "authenticated write gallery" on public.gallery_photos
  for insert to authenticated with check (true);

create policy "authenticated update gallery" on public.gallery_photos
  for update to authenticated using (true) with check (true);

create policy "authenticated delete gallery" on public.gallery_photos
  for delete to authenticated using (true);
