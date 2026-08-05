-- AgentGuard schema (run in Supabase SQL editor when using Postgres)
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  plan text not null default 'free',
  monthly_quota int not null default 300,
  paddle_customer_id text,
  paddle_subscription_id text,
  subscription_status text not null default 'none',
  cancel_at_period_end boolean not null default false,
  -- legacy (unused)
  lemon_subscription_id text,
  lemon_customer_id text,
  created_at timestamptz not null default now()
);

alter table users add column if not exists paddle_customer_id text;
alter table users add column if not exists paddle_subscription_id text;
alter table users add column if not exists subscription_status text not null default 'none';
alter table users add column if not exists cancel_at_period_end boolean not null default false;

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  key_hash text unique not null,
  key_prefix text not null,
  name text not null default 'default',
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists api_keys_user_id_idx on api_keys(user_id);
create index if not exists users_paddle_sub_idx on users(paddle_subscription_id);

create table if not exists usage_monthly (
  user_id uuid not null references users(id) on delete cascade,
  period text not null, -- YYYY-MM
  calls int not null default 0,
  primary key (user_id, period)
);

create table if not exists webhook_events (
  event_id text primary key,
  event_name text not null,
  processed_at timestamptz not null default now()
);

create table if not exists refund_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  email text not null,
  reason text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now()
);
