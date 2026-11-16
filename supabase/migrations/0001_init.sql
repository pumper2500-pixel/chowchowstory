-- ChowChowStory · Milestone 02
-- รันครั้งเดียวใน Supabase › SQL Editor (รันซ้ำได้ ไม่พัง)
--
-- หลักความปลอดภัย
--   * ทุกตารางเปิด RLS
--   * ผู้ใช้แก้กระดูกตรง ๆ ไม่ได้ ต้องผ่านฟังก์ชัน claim_reward ที่ตรวจกติกาฝั่งเซิร์ฟเวอร์
--   * ความทรงจำเป็นส่วนตัวโดยค่าเริ่มต้น จะขึ้นกำแพงสาธารณะได้เมื่อแอดมินอนุมัติ (Milestone 04/05)

-- ---------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 40),
  bones integer not null default 0,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- แก้ได้เฉพาะชื่อที่แสดง (bones / is_admin แก้ผ่านฟังก์ชันเท่านั้น)
revoke update on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

-- สร้างโปรไฟล์อัตโนมัติเมื่อมีคนสมัคร
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 40), ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- บัญชีที่สมัครไว้ก่อนรันไฟล์นี้: สร้างโปรไฟล์ให้ย้อนหลัง
insert into public.profiles (id, display_name)
select id, nullif(left(coalesce(raw_user_meta_data ->> 'display_name', ''), 40), '')
from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------
-- rewards: บันทึกว่าได้กระดูกจากภารกิจไหนแล้ว (ได้ครั้งเดียวต่อ key)
-- ---------------------------------------------------------------
create table if not exists public.profile_rewards (
  user_id uuid not null references auth.users (id) on delete cascade,
  key text not null,
  points integer not null,
  created_at timestamptz not null default now(),
  primary key (user_id, key)
);

alter table public.profile_rewards enable row level security;

drop policy if exists "rewards: read own" on public.profile_rewards;
create policy "rewards: read own" on public.profile_rewards
  for select to authenticated using (user_id = auth.uid());

revoke insert, update, delete on public.profile_rewards from anon, authenticated;
grant select on public.profile_rewards to authenticated;

-- กติกาแต้ม — ต้องตรงกับ lib/content.ts (missionsFor)
-- คืน 0 ถ้า key ไม่ถูกต้อง
create or replace function public.reward_points(p_key text, p_allow_past boolean default false)
returns integer language plpgsql stable set search_path = '' as $$
declare
  v_today date := (now() at time zone 'Asia/Bangkok')::date;
  v_day date;
  v_y int; v_m int; v_d int;
begin
  if p_key in ('story-tongue', 'story-history', 'story-temper', 'ready') then return 10; end if;
  if p_key in ('guide-puppy', 'guide-adult', 'guide-senior', 'cost') then return 5; end if;
  if p_key = 'memorial' then return 20; end if;

  -- ภารกิจรายวัน: visit-YYYY-MM-DD / heat-YYYY-MM-DD
  -- ตรวจรูปแบบวันโดยไม่ cast ตรง ๆ (กัน error จากวันที่อย่าง 2026-02-30)
  if p_key ~ '^(visit|heat)-\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$' then
    v_y := substring(p_key from '(\d{4})-\d{2}-\d{2}$')::int;
    v_m := substring(p_key from '\d{4}-(\d{2})-\d{2}$')::int;
    v_d := substring(p_key from '\d{4}-\d{2}-(\d{2})$')::int;
    v_day := make_date(v_y, v_m, 1) + (v_d - 1);
    if extract(month from v_day) <> v_m then return 0; end if;
    -- วันนี้หรือเมื่อวาน (เผื่อเครื่องผู้ใช้อยู่คนละโซนเวลา)
    if v_day between v_today - 1 and v_today then return 5; end if;
    -- ตอนย้ายแต้มจากเครื่องเข้าบัญชี ยอมรับวันย้อนหลังได้ไม่เกิน 1 ปี
    if p_allow_past and v_day between v_today - 366 and v_today then return 5; end if;
  end if;
  return 0;
end $$;

create or replace function public.claim_reward(p_key text)
returns table (bones integer, gained integer)
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_pts integer;
  v_rows integer;
begin
  if v_uid is null then raise exception 'not signed in' using errcode = '28000'; end if;
  v_pts := public.reward_points(p_key, false);
  gained := 0;
  if v_pts > 0 then
    insert into public.profile_rewards (user_id, key, points)
    values (v_uid, p_key, v_pts) on conflict do nothing;
    get diagnostics v_rows = row_count;
    if v_rows > 0 then
      update public.profiles p set bones = p.bones + v_pts where p.id = v_uid;
      gained := v_pts;
    end if;
  end if;
  select p.bones into bones from public.profiles p where p.id = v_uid;
  return next;
end $$;

-- ย้ายแต้มที่เก็บในเครื่อง (ก่อนสมัคร) เข้าบัญชี
create or replace function public.merge_rewards(p_keys text[])
returns integer language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_key text;
  v_pts integer;
  v_rows integer;
  v_bones integer;
begin
  if v_uid is null then raise exception 'not signed in' using errcode = '28000'; end if;
  if coalesce(array_length(p_keys, 1), 0) > 500 then raise exception 'too many keys'; end if;
  foreach v_key in array coalesce(p_keys, '{}') loop
    v_pts := public.reward_points(v_key, true);
    if v_pts > 0 then
      insert into public.profile_rewards (user_id, key, points)
      values (v_uid, v_key, v_pts) on conflict do nothing;
      get diagnostics v_rows = row_count;
      if v_rows > 0 then
        update public.profiles p set bones = p.bones + v_pts where p.id = v_uid;
      end if;
    end if;
  end loop;
  select p.bones into v_bones from public.profiles p where p.id = v_uid;
  return v_bones;
end $$;

revoke execute on function public.claim_reward(text) from public, anon;
revoke execute on function public.merge_rewards(text[]) from public, anon;
grant execute on function public.claim_reward(text) to authenticated;
grant execute on function public.merge_rewards(text[]) to authenticated;

-- ---------------------------------------------------------------
-- articles: เรื่องเล่า (อ่านได้ทุกคน แก้ได้เฉพาะแอดมินใน Milestone 05)
-- ---------------------------------------------------------------
create table if not exists public.articles (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,60}$'),
  title text not null,
  kind text not null default 'เรื่องเล่า',
  minutes integer not null default 2,
  body text[] not null,
  position integer not null default 100,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.articles enable row level security;

drop policy if exists "articles: read published" on public.articles;
create policy "articles: read published" on public.articles
  for select to anon, authenticated using (published);

grant select on public.articles to anon, authenticated;

insert into public.articles (slug, title, kind, minutes, position, body) values
('tongue', 'ตำนานลิ้นสีน้ำเงิน', 'ตำนาน', 1, 10, array[
  'นิทานพื้นบ้านจีนเล่าว่า ตอนที่ท้องฟ้ากำลังถูกทาสีน้ำเงิน มีหมาตัวหนึ่งเดินตามเลียหยดสีที่หล่นลงพื้น ลิ้นของมันเลยกลายเป็นสีน้ำเงินมาจนทุกวันนี้',
  'ความจริงคือลูกเชาเชาเกิดมาลิ้นสีชมพู แล้วค่อย ๆ เข้มขึ้นเป็นน้ำเงินดำในช่วงไม่กี่เดือนแรก เป็นลักษณะประจำพันธุ์ที่เห็นแล้วรู้ทันทีว่าใช่']),
('history', 'ซงซือเฉวี่ยน หมาสิงโตขนฟู', 'ประวัติ', 2, 20, array[
  'เชาเชาเป็นหนึ่งในสายพันธุ์เก่าแก่ของจีน ชื่อจีนคือ ซงซือเฉวี่ยน แปลว่าหมาสิงโตขนฟู คนสมัยก่อนใช้เฝ้าบ้าน ลากของ และล่าสัตว์',
  'ขนสองชั้นหนา ขาหลังตรงจนเดินเหมือนเดินบนไม้ต่อขา และแผงคอรอบหน้า ทั้งหมดถูกสร้างมาเพื่ออากาศหนาว นี่คือเหตุผลที่คนเลี้ยงในเมืองไทยต้องคิดเรื่องความร้อนก่อนเรื่องอื่น']),
('temper', 'ไม่ได้หยิ่ง แค่เลือกคน', 'นิสัย', 2, 30, array[
  'หลายคนว่าเชาเชานิสัยเหมือนแมว เงียบ รักสะอาด ไม่ชอบให้คนแปลกหน้าจับ และผูกพันกับคนในบ้านไม่กี่คน',
  'ความสงวนตัวนี้จะกลายเป็นความระแวงได้ถ้าตอนเด็กไม่ได้เจอคนและเสียงหลากหลาย การพาออกไปเจอโลกตั้งแต่เล็กเลยสำคัญกว่าพันธุ์อื่นมาก'])
on conflict (slug) do nothing;

-- ---------------------------------------------------------------
-- memorials: ความทรงจำถึงน้องที่จากไป
-- ---------------------------------------------------------------
create table if not exists public.memorials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dog_name text not null check (char_length(dog_name) between 1 and 40),
  years text check (char_length(years) <= 30),
  message text not null check (char_length(message) between 1 and 600),
  status text not null default 'private' check (status in ('private', 'pending', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists memorials_user_idx on public.memorials (user_id, created_at desc);
create index if not exists memorials_public_idx on public.memorials (created_at desc) where status = 'approved';

alter table public.memorials enable row level security;

drop policy if exists "memorials: read own or approved" on public.memorials;
create policy "memorials: read own or approved" on public.memorials
  for select to anon, authenticated using (status = 'approved' or user_id = auth.uid());

drop policy if exists "memorials: insert own" on public.memorials;
create policy "memorials: insert own" on public.memorials
  for insert to authenticated with check (user_id = auth.uid() and status in ('private', 'pending'));

-- เจ้าของแก้ได้ แต่ตั้งเป็น approved เองไม่ได้
drop policy if exists "memorials: update own" on public.memorials;
create policy "memorials: update own" on public.memorials
  for update to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid() and status in ('private', 'pending'));

drop policy if exists "memorials: delete own" on public.memorials;
create policy "memorials: delete own" on public.memorials
  for delete to authenticated using (user_id = auth.uid());

grant select on public.memorials to anon, authenticated;
grant insert, update (dog_name, years, message, status), delete on public.memorials to authenticated;
