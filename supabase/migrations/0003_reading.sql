-- ChowChowStory · Milestone 04: หน้าอ่าน + กำแพงความทรงจำ
-- รันหลัง 0002_posts.sql (รันซ้ำได้)

-- ---------------------------------------------------------------
-- บทความใหม่ที่เพิ่มในตาราง articles ได้แต้ม "อ่านจบ" อัตโนมัติ
-- (เดิมรู้จักแค่ 3 เรื่องแรก)
-- ---------------------------------------------------------------
create or replace function public.reward_points(p_key text, p_allow_past boolean default false)
returns integer language plpgsql stable set search_path = '' as $$
declare
  v_today date := (now() at time zone 'Asia/Bangkok')::date;
  v_day date;
  v_y int; v_m int; v_d int;
begin
  if p_key like 'story-%' then
    return case when exists (select 1 from public.articles a where a.published and a.slug = substring(p_key from 7))
                then 10 else 0 end;
  end if;
  if p_key = 'ready' then return 10; end if;
  if p_key in ('guide-puppy', 'guide-adult', 'guide-senior', 'cost') then return 5; end if;
  if p_key = 'memorial' then return 20; end if;

  if p_key ~ '^(visit|heat)-\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$' then
    v_y := substring(p_key from '(\d{4})-\d{2}-\d{2}$')::int;
    v_m := substring(p_key from '\d{4}-(\d{2})-\d{2}$')::int;
    v_d := substring(p_key from '\d{4}-\d{2}-(\d{2})$')::int;
    v_day := make_date(v_y, v_m, 1) + (v_d - 1);
    if extract(month from v_day) <> v_m then return 0; end if;
    if v_day between v_today - 1 and v_today then return 5; end if;
    if p_allow_past and v_day between v_today - 366 and v_today then return 5; end if;
  end if;
  return 0;
end $$;

-- ---------------------------------------------------------------
-- กำแพงความทรงจำ: เจ้าของกด "ขึ้นกำแพง" (pending) → แอดมินอนุมัติ → ทุกคนเห็น
-- ---------------------------------------------------------------
alter table public.memorials add column if not exists reviewed_at timestamptz;
alter table public.memorials add column if not exists reject_reason text check (char_length(reject_reason) <= 200);

drop policy if exists "memorials: read own or approved" on public.memorials;
drop policy if exists "memorials: read own, approved, or admin" on public.memorials;
create policy "memorials: read own, approved, or admin" on public.memorials
  for select to anon, authenticated using (status = 'approved' or user_id = auth.uid() or public.is_admin());

drop policy if exists "memorials: admin review" on public.memorials;
create policy "memorials: admin review" on public.memorials
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

grant update (status, reviewed_at, reject_reason) on public.memorials to authenticated;

-- เจ้าของแก้ข้อความแล้ว ต้องกลับไปรออนุมัติใหม่ (กันแก้หลังอนุมัติ)
create or replace function public.memorial_reset_on_edit()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.user_id = auth.uid() and not public.is_admin()
     and (new.dog_name is distinct from old.dog_name or new.message is distinct from old.message or new.years is distinct from old.years)
     and old.status = 'approved' then
    new.status := 'pending';
    new.reviewed_at := null;
  end if;
  return new;
end $$;

drop trigger if exists memorials_reset_on_edit on public.memorials;
create trigger memorials_reset_on_edit before update on public.memorials
  for each row execute function public.memorial_reset_on_edit();

create index if not exists memorials_queue_idx on public.memorials (created_at) where status = 'pending';

notify pgrst, 'reload schema';
