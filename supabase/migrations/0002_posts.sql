-- ChowChowStory · Milestone 03: ส่งรูปและเรื่องของน้อง + คิวอนุมัติ
-- รันหลัง 0001_init.sql ใน Supabase › SQL Editor (รันซ้ำได้)

-- ---------------------------------------------------------------
-- แอดมิน
-- ---------------------------------------------------------------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select p.is_admin from public.profiles p where p.id = auth.uid()), false)
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------
-- dog_posts: รูป + เรื่องของน้องที่สมาชิกส่งมา
-- ---------------------------------------------------------------
create table if not exists public.dog_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dog_name text not null check (char_length(dog_name) between 1 and 40),
  caption text not null check (char_length(caption) between 1 and 500),
  photo_path text not null check (photo_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.jpg$'),
  owns_photo boolean not null check (owns_photo),  -- ผู้ส่งยืนยันว่าถ่ายเองหรือมีสิทธิ์ใช้รูป
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reject_reason text check (char_length(reject_reason) <= 200),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id) on delete set null
);

create index if not exists dog_posts_queue_idx on public.dog_posts (created_at) where status = 'pending';
create index if not exists dog_posts_public_idx on public.dog_posts (reviewed_at desc) where status = 'approved';
create index if not exists dog_posts_user_idx on public.dog_posts (user_id, created_at desc);

alter table public.dog_posts enable row level security;

drop policy if exists "posts: read approved, own, or admin" on public.dog_posts;
create policy "posts: read approved, own, or admin" on public.dog_posts
  for select to anon, authenticated
  using (status = 'approved' or user_id = auth.uid() or public.is_admin());

-- ส่งได้เฉพาะของตัวเอง เป็น pending และรูปต้องอยู่ในโฟลเดอร์ของตัวเอง
drop policy if exists "posts: insert own pending" on public.dog_posts;
create policy "posts: insert own pending" on public.dog_posts
  for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending'
              and split_part(photo_path, '/', 1) = auth.uid()::text);

drop policy if exists "posts: delete own or admin" on public.dog_posts;
create policy "posts: delete own or admin" on public.dog_posts
  for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- อนุมัติ / ปฏิเสธ ได้เฉพาะแอดมิน
drop policy if exists "posts: admin review" on public.dog_posts;
create policy "posts: admin review" on public.dog_posts
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.dog_posts to anon, authenticated;
grant insert (dog_name, caption, photo_path, owns_photo) on public.dog_posts to authenticated;
grant update (status, reject_reason, reviewed_at, reviewed_by) on public.dog_posts to authenticated;
grant delete on public.dog_posts to authenticated;

-- ส่งได้ไม่เกิน 5 โพสต์ที่ยังรออนุมัติต่อคน (กันสแปม)
create or replace function public.limit_pending_posts()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.dog_posts where user_id = new.user_id and status = 'pending') >= 5 then
    raise exception 'pending limit reached' using errcode = 'P0001';
  end if;
  return new;
end $$;

drop trigger if exists dog_posts_limit on public.dog_posts;
create trigger dog_posts_limit before insert on public.dog_posts
  for each row execute function public.limit_pending_posts();

-- ---------------------------------------------------------------
-- ภารกิจ "ส่งรูปน้อง" +20 — ได้เมื่อมีโพสต์จริง
-- ---------------------------------------------------------------
create or replace function public.claim_reward(p_key text)
returns table (bones integer, gained integer)
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_pts integer;
  v_rows integer;
begin
  if v_uid is null then raise exception 'not signed in' using errcode = '28000'; end if;
  if p_key = 'post' then
    v_pts := case when exists (select 1 from public.dog_posts d where d.user_id = v_uid) then 20 else 0 end;
  else
    v_pts := public.reward_points(p_key, false);
  end if;
  gained := 0;
  if v_pts > 0 then
    insert into public.profile_rewards (user_id, key, points)
    values (v_uid, p_key, v_pts) on conflict do nothing;
    get diagnostics v_rows = row_count;
    if v_rows > 0 then gained := v_pts; end if;
  end if;
  bones := public.recompute_bones(v_uid);
  return next;
end $$;

-- ---------------------------------------------------------------
-- Storage: bucket dog-photos
--   อ่านได้ทุกคนผ่าน URL (ชื่อไฟล์เป็น uuid เดาไม่ได้ และหน้าเว็บแสดงเฉพาะที่อนุมัติ)
--   อัปโหลดได้เฉพาะในโฟลเดอร์ของตัวเอง ไฟล์ JPEG ไม่เกิน 2 MB
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dog-photos', 'dog-photos', true, 2097152, array['image/jpeg'])
on conflict (id) do update
  set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "dog-photos: upload own folder" on storage.objects;
create policy "dog-photos: upload own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'dog-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "dog-photos: delete own or admin" on storage.objects;
create policy "dog-photos: delete own or admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'dog-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- ให้ API ของ Supabase เห็นตาราง/ฟังก์ชันใหม่ทันที (กัน error 'schema cache')
notify pgrst, 'reload schema';
