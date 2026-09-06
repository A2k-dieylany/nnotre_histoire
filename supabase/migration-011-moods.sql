-- Phase 3A.2 — Météo émotionnelle : chacun poste son humeur du jour (emoji +
-- mot optionnel), l'autre la voit en un coup d'œil. Un seul mood par personne
-- et par jour (upsert sur profile_id + mood_date) — reposter le même jour
-- remplace, ça ne duplique pas.

create table if not exists public.moods (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  mood_date date not null default current_date,
  emoji text not null,
  note text,
  created_at timestamptz not null default now(),
  unique (profile_id, mood_date)
);

alter table public.moods enable row level security;

-- Lecture partagée (comme thoughts/timeline_events) : chacun voit l'humeur de l'autre.
create policy "authenticated read moods" on public.moods
  for select to authenticated using (true);

-- Écriture restreinte à SA propre ligne : rien n'empêcherait sinon un compte
-- de poster une humeur au nom de l'autre.
create policy "self insert mood" on public.moods
  for insert to authenticated with check (profile_id = auth.uid());

create policy "self update mood" on public.moods
  for update to authenticated using (profile_id = auth.uid()) with check (profile_id = auth.uid());
