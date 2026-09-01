-- À exécuter dans le SQL Editor de Supabase — ajoute suppression + modification
-- (schema.sql initial n'autorisait que lecture/ajout, plus suppression pour timeline).

create policy "authenticated delete timeline" on public.timeline_events
  for delete to authenticated using (true);

create policy "authenticated update unlockable content" on public.unlockable_content
  for update to authenticated using (true) with check (true);

create policy "authenticated delete unlockable content" on public.unlockable_content
  for delete to authenticated using (true);

create policy "authenticated delete memories" on storage.objects
  for delete to authenticated using (bucket_id = 'memories');
