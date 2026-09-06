-- Phase 2A.4 — Anecdotes cachées : un petit ✨ sur les entrées qui en ont une,
-- la révélation reste un clic côté client (pas besoin de RLS séparée, le texte
-- est déjà lisible par les deux comptes comme le reste de timeline_events).

alter table public.timeline_events add column if not exists secret_note text;
