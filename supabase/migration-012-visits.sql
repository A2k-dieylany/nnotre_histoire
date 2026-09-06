-- EE.5 — Le compteur de visites : un jour = une visite, peu importe le nombre
-- de pages vues ce jour-là (upsert idempotent sur profile_id + visit_date).
-- Lecture restreinte à sa propre ligne : le nombre de visites de l'un n'a pas
-- à être visible par l'autre, ce n'est pas une donnée du couple.

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  visit_date date not null default current_date,
  unique (profile_id, visit_date)
);

alter table public.visits enable row level security;

create policy "self insert visit" on public.visits
  for insert to authenticated with check (profile_id = auth.uid());

create policy "self read own visits" on public.visits
  for select to authenticated using (profile_id = auth.uid());
