-- Extension du suivi de cycle : durée des règles + journal bien-être.
-- Même règle qu'avant : aucune policy pour "author" sur ces tables, jamais.

alter table public.cycle_entries add column if not exists end_date date;

create table if not exists public.wellbeing_entries (
  id uuid primary key default gen_random_uuid(),
  entry_date date not null,
  mood text,
  symptoms text,
  note text,
  created_at timestamptz not null default now(),
  unique (entry_date)
);

alter table public.wellbeing_entries enable row level security;

create policy "partner reads own wellbeing" on public.wellbeing_entries
  for select to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  );

create policy "partner writes own wellbeing" on public.wellbeing_entries
  for insert to authenticated with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  );

create policy "partner updates own wellbeing" on public.wellbeing_entries
  for update to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  ) with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  );

create policy "partner deletes own wellbeing" on public.wellbeing_entries
  for delete to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  );
