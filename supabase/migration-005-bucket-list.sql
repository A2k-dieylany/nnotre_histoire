-- 3E.1 Bucket List.

create table if not exists public.bucket_items (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  done boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.bucket_items enable row level security;

create policy "authenticated read bucket items" on public.bucket_items
  for select to authenticated using (true);

create policy "authenticated write bucket items" on public.bucket_items
  for insert to authenticated with check (true);

create policy "authenticated update bucket items" on public.bucket_items
  for update to authenticated using (true) with check (true);

create policy "authenticated delete bucket items" on public.bucket_items
  for delete to authenticated using (true);
