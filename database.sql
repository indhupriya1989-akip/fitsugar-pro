-- FitSugar Pro production-oriented PostgreSQL schema (core entities)
create extension if not exists "uuid-ossp";
create table gyms (
  id uuid primary key default uuid_generate_v4(),
  name text not null, slug text unique not null, locale text default 'en-IN',
  branding jsonb default '{}', subscription_status text default 'trial',
  created_at timestamptz default now()
);
create table users (
  id uuid primary key default uuid_generate_v4(), gym_id uuid references gyms(id),
  role text not null check (role in ('owner','admin','trainer','member')),
  name text not null, phone text, email text, password_hash text,
  preferred_language text default 'en', created_at timestamptz default now()
);
create table member_profiles (
  user_id uuid primary key references users(id), age int, gender text,
  height_cm numeric, weight_kg numeric, fitness_goal text, diabetes_status text,
  food_preference text, state_region text, workout_level text,
  medical_notes text, trainer_id uuid references users(id), updated_at timestamptz default now()
);
create table exercises (
  id uuid primary key default uuid_generate_v4(), name text not null,
  muscle_group text, difficulty text, media jsonb default '{}',
  steps jsonb default '[]', safety_notes jsonb default '[]', is_published boolean default false
);
create table workout_plans (
  id uuid primary key default uuid_generate_v4(), gym_id uuid references gyms(id),
  title text not null, goal text, level text, schedule jsonb not null, created_by uuid references users(id)
);
create table workout_assignments (
  id uuid primary key default uuid_generate_v4(), member_id uuid references users(id),
  plan_id uuid references workout_plans(id), starts_on date, status text default 'active'
);
create table meal_plans (
  id uuid primary key default uuid_generate_v4(), gym_id uuid references gyms(id),
  title text not null, goal text, region text, preference text, meals jsonb not null
);
create table glucose_logs (
  id uuid primary key default uuid_generate_v4(), member_id uuid references users(id),
  value_mg_dl numeric not null, context text, measured_at timestamptz default now()
);
create table attendance (
  id uuid primary key default uuid_generate_v4(), gym_id uuid references gyms(id),
  member_id uuid references users(id), checked_in_at timestamptz default now()
);
create table memberships (
  id uuid primary key default uuid_generate_v4(), gym_id uuid references gyms(id),
  member_id uuid references users(id), plan_name text, starts_on date, ends_on date,
  amount_paise int, status text default 'active'
);
create table payments (
  id uuid primary key default uuid_generate_v4(), membership_id uuid references memberships(id),
  provider text, provider_payment_id text unique, amount_paise int not null,
  status text not null, paid_at timestamptz, created_at timestamptz default now()
);
create table leads (
  id uuid primary key default uuid_generate_v4(), gym_id uuid references gyms(id),
  name text not null, phone text, source text, stage text default 'new',
  trial_at timestamptz, created_at timestamptz default now()
);
create table notifications (
  id uuid primary key default uuid_generate_v4(), user_id uuid references users(id),
  channel text, kind text, payload jsonb, scheduled_for timestamptz, sent_at timestamptz
);
create index on users(gym_id, role);
create index on attendance(gym_id, checked_in_at);
create index on memberships(gym_id, status, ends_on);
