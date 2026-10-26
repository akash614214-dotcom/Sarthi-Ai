-- ==============================================================================
-- SHARTHI AI — Supabase Database Schema
-- AI-Native Browser with Autonomous Multimodal Companion Using AdaL
-- ==============================================================================

-- 1. Enable pgvector for semantic search and episodic memory
create extension if not exists vector;

-- 2. Browsing History & Context Table
-- Stores visited URLs, page titles, summaries, and embeddings for AdaL recall
create table if not exists browsing_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  url text not null,
  title text,
  page_summary text,
  raw_content text,
  screenshot_url text,
  embedding vector(1536), -- Vector representation for semantic search
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast user queries
create index if not exists idx_browsing_history_user on browsing_history(user_id);
create index if not exists idx_browsing_history_created_at on browsing_history(created_at desc);

-- 3. Companion Sessions
-- Represents individual conversation and browsing threads with AdaL
create table if not exists companion_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text default 'New Session',
  context_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Companion Multimodal Messages
-- Stores conversation between user and AdaL companion, including vision payloads and actions
create table if not exists companion_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references companion_sessions(id) on delete cascade,
  sender text not null check (sender in ('user', 'companion', 'system')),
  content text,
  multimodal_payload jsonb default '{}'::jsonb, -- Action traces, screenshot data, weights
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Autonomous Action Planner & Execution Log
create table if not exists autonomous_tasks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references companion_sessions(id) on delete cascade,
  goal text not null,
  status text default 'in_progress' check (status in ('pending', 'in_progress', 'completed', 'failed')),
  steps jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies
alter table browsing_history enable row level security;
alter table companion_sessions enable row level security;
alter table companion_messages enable row level security;
alter table autonomous_tasks enable row level security;

-- Allow anonymous or authenticated access for development
create policy "Allow all access to browsing_history for dev" on browsing_history for all using (true) with check (true);
create policy "Allow all access to companion_sessions for dev" on companion_sessions for all using (true) with check (true);
create policy "Allow all access to companion_messages for dev" on companion_messages for all using (true) with check (true);
create policy "Allow all access to autonomous_tasks for dev" on autonomous_tasks for all using (true) with check (true);

