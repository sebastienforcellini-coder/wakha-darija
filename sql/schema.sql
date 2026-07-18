-- Wakha Darija — schéma de base de données (Neon Postgres)
-- À exécuter une fois dans l'éditeur SQL de Neon (console.neon.tech → ton projet → SQL Editor)

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  gender text not null check (gender in ('m', 'f')),
  created_at timestamptz not null default now()
);

create table if not exists progress (
  user_id uuid not null references users(id) on delete cascade,
  word_key text not null,       -- correspond au champ "d" (translittération) de chaque mot
  status text not null default 'known',
  updated_at timestamptz not null default now(),
  primary key (user_id, word_key)
);

create index if not exists progress_user_id_idx on progress(user_id);
