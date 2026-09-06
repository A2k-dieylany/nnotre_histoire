-- EE.2 — Le double-tap : certaines photos ont un message caché "au dos",
-- révélé par un double-tap/double-clic (effet polaroid qui se retourne).

alter table public.gallery_photos add column if not exists back_note text;
