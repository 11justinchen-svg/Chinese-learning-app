create table if not exists public.learning_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default
    '{"schemaVersion":1,"progress":{"version":1,"words":{},"stages":{}},"srs":{},"customCards":[],"updatedAt":0}'::jsonb,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.learning_progress enable row level security;

create policy "Learners can read their own progress"
on public.learning_progress for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Learners can create their own progress"
on public.learning_progress for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Learners can update their own progress"
on public.learning_progress for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Learners can delete their own progress"
on public.learning_progress for delete
to authenticated
using ((select auth.uid()) = user_id);
