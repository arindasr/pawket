-- ── Pets table ──────────────────────────────────────────
create table if not exists pets (
  id          text        primary key,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  type        text        not null default 'Cat',
  age         text,
  photo       text,
  created_at  timestamptz not null default now()
);

alter table pets enable row level security;

create policy "Users can manage their own pets"
  on pets for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Notes table ──────────────────────────────────────────
create table if not exists notes (
  id          text        primary key,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  text        text        not null,
  pet_name    text        not null default 'General',
  created_at  bigint      not null
);

alter table notes enable row level security;

create policy "Users can manage their own notes"
  on notes for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Daily routines table ─────────────────────────────────
create table if not exists daily_routines (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  pet_id          text        not null references pets(id) on delete cascade,
  date_key        text        not null,     -- format: YYYY-MM-DD
  meal_morning    boolean     not null default false,
  meal_noon       boolean     not null default false,
  meal_night      boolean     not null default false,
  water_refill    boolean     not null default false,
  activity_playtime boolean   not null default false,
  activity_clean  boolean     not null default false,
  unique(pet_id, date_key)
);

alter table daily_routines enable row level security;

create policy "Users can manage their own routines"
  on daily_routines for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
