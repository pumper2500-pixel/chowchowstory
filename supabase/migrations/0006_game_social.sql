-- ChowChowStory · เกมเมืองเชาเชา: รอยเท้าเงาของผู้เล่นคนอื่น + ป้ายข้อความบนพื้น
-- รันซ้ำได้ · อ่านได้ทุกคน · เขียนได้เฉพาะคนที่ล็อกอิน (ของตัวเอง) · จำกัดความถี่กันสแปม

create table if not exists public.ghost_walks (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dog_name text not null check (char_length(dog_name) between 1 and 20),
  coat text not null default 'orange' check (coat ~ '^[a-z]{1,12}$'),
  -- จุดทุก 1 วินาที เป็นเดซิเมตร [[x,z],...] 20–240 จุด
  pts jsonb not null check (jsonb_typeof(pts) = 'array' and jsonb_array_length(pts) between 20 and 240),
  created_at timestamptz not null default now()
);
create index if not exists ghost_walks_recent on public.ghost_walks (created_at desc);

-- ข้อความบนพื้นเลือกจากชุดคำที่เกมกำหนดเท่านั้น (msg = ลำดับข้อความ) ไม่มีข้อความอิสระ
create table if not exists public.paw_notes (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dog_name text not null check (char_length(dog_name) between 1 and 20),
  x real not null check (x between -400 and 400),
  z real not null check (z between -400 and 400),
  msg smallint not null check (msg between 0 and 11),
  created_at timestamptz not null default now()
);
create index if not exists paw_notes_recent on public.paw_notes (created_at desc);

alter table public.ghost_walks enable row level security;
alter table public.paw_notes enable row level security;

drop policy if exists "ghost read" on public.ghost_walks;
create policy "ghost read" on public.ghost_walks for select using (true);
drop policy if exists "ghost insert own" on public.ghost_walks;
create policy "ghost insert own" on public.ghost_walks for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "ghost delete own" on public.ghost_walks;
create policy "ghost delete own" on public.ghost_walks for delete to authenticated using (user_id = auth.uid());

drop policy if exists "note read" on public.paw_notes;
create policy "note read" on public.paw_notes for select using (true);
drop policy if exists "note insert own" on public.paw_notes;
create policy "note insert own" on public.paw_notes for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "note delete own" on public.paw_notes;
create policy "note delete own" on public.paw_notes for delete to authenticated using (user_id = auth.uid());

-- ไม่เปิดให้เห็น user_id ของคนอื่น: อ่านได้เฉพาะคอลัมน์ที่เกมใช้
revoke select on public.ghost_walks from anon, authenticated;
revoke select on public.paw_notes from anon, authenticated;
grant select (id, dog_name, coat, pts, created_at) on public.ghost_walks to anon, authenticated;
grant select (id, dog_name, x, z, msg, created_at) on public.paw_notes to anon, authenticated;
grant insert (dog_name, coat, pts) on public.ghost_walks to authenticated;
grant insert (dog_name, x, z, msg) on public.paw_notes to authenticated;
grant delete on public.ghost_walks, public.paw_notes to authenticated;

-- กันสแปม: รอยเท้า 1 ครั้ง/2 นาที · ข้อความ 1 ครั้ง/20 วินาที และไม่เกิน 30 ข้อความ/วัน ต่อคน
create or replace function public.game_social_rate() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_table_name = 'ghost_walks' then
    if exists (select 1 from public.ghost_walks where user_id = new.user_id and created_at > now() - interval '2 minutes') then
      raise exception 'ghost_walks: too frequent';
    end if;
  else
    if exists (select 1 from public.paw_notes where user_id = new.user_id and created_at > now() - interval '20 seconds') then
      raise exception 'paw_notes: too frequent';
    end if;
    if (select count(*) from public.paw_notes where user_id = new.user_id and created_at > now() - interval '1 day') >= 30 then
      raise exception 'paw_notes: daily limit';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists ghost_walks_rate on public.ghost_walks;
create trigger ghost_walks_rate before insert on public.ghost_walks for each row execute function public.game_social_rate();
drop trigger if exists paw_notes_rate on public.paw_notes;
create trigger paw_notes_rate before insert on public.paw_notes for each row execute function public.game_social_rate();

notify pgrst, 'reload schema';
