-- Remplace le booléen gentle_reminder_active() par un compte à rebours relatif
-- (nombre de jours, jamais une date) — même garantie de sécurité, juste plus
-- informatif pour le compte "author".

create or replace function public.days_until_next_period()
returns integer
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
    return null;
  end if;

  select start_date into last_start from public.cycle_entries order by start_date desc limit 1;
  if last_start is null then
    return null;
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

  return (next_predicted - current_date);
end;
$$;

grant execute on function public.days_until_next_period() to authenticated;
