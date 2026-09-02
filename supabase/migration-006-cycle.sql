-- 3J — Suivi de cycle. Le point le plus sensible du projet : la donnée brute
-- ne doit JAMAIS être lisible par le compte "author", partage activé ou non.
-- Seule une fonction security definer peut lire cycle_entries pour calculer
-- un signal dérivé (booléen) exposé au compte author — jamais les dates elles-mêmes.

create table if not exists public.cycle_entries (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  created_at timestamptz not null default now()
);

alter table public.cycle_entries enable row level security;

-- Aucune policy pour le rôle "author" : il n'a tout simplement pas de moyen
-- d'accéder à cette table, quel que soit le contenu de cycle_settings.
create policy "partner reads own cycle" on public.cycle_entries
  for select to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  );

create policy "partner writes own cycle" on public.cycle_entries
  for insert to authenticated with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  );

create policy "partner deletes own cycle" on public.cycle_entries
  for delete to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  );

create table if not exists public.cycle_settings (
  id uuid primary key default gen_random_uuid(),
  sharing_enabled boolean not null default false
);

insert into public.cycle_settings (sharing_enabled)
select false
where not exists (select 1 from public.cycle_settings);

alter table public.cycle_settings enable row level security;

create policy "partner reads cycle settings" on public.cycle_settings
  for select to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  );

create policy "partner updates cycle settings" on public.cycle_settings
  for update to authenticated using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  ) with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'partner')
  );

-- Security definer : contourne la RLS en interne (lit les vraies dates) mais ne
-- retourne qu'un booléen. Callable par les DEUX comptes, sans jamais exposer
-- les dates au compte "author".
create or replace function public.gentle_reminder_active()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  sharing boolean;
  last_start date;
  avg_length numeric;
  next_predicted date;
begin
  select sharing_enabled into sharing from public.cycle_settings limit 1;
  if sharing is not true then
    return false;
  end if;

  select start_date into last_start from public.cycle_entries order by start_date desc limit 1;
  if last_start is null then
    return false;
  end if;

  select avg(diff) into avg_length
  from (
    select start_date - lag(start_date) over (order by start_date) as diff
    from public.cycle_entries
  ) d
  where diff is not null;

  if avg_length is null then
    avg_length := 28;
  end if;

  next_predicted := last_start + (avg_length || ' days')::interval;

  return current_date between (next_predicted - interval '3 days')::date
    and (next_predicted + interval '2 days')::date;
end;
$$;

grant execute on function public.gentle_reminder_active() to authenticated;
