// ทดสอบ SQL ของ Supabase บน Postgres จำลอง (PGlite) พร้อม auth schema แบบย่อ
// รัน: npm run test:db
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const SQL = readFileSync(new URL("./migrations/0001_init.sql", import.meta.url), "utf8");
const SQL2 = readFileSync(new URL("./migrations/0002_posts.sql", import.meta.url), "utf8");
const SQL3 = readFileSync(new URL("./migrations/0003_reading.sql", import.meta.url), "utf8");
const SQL4 = readFileSync(new URL("./migrations/0004_akc_article.sql", import.meta.url), "utf8");
const SQL5 = readFileSync(new URL("./migrations/0005_covers.sql", import.meta.url), "utf8");
const SQL6 = readFileSync(new URL("./migrations/0006_game_social.sql", import.meta.url), "utf8");

const AUTH_STUB = `
  create role anon nologin; create role authenticated nologin;
  grant usage on schema public to anon, authenticated;
  create schema auth;
  grant usage on schema auth to anon, authenticated;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant execute on function auth.uid() to anon, authenticated;
  create schema storage;
  grant usage on schema storage to anon, authenticated;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  grant select, insert, delete on storage.objects to anon, authenticated;
  create function storage.foldername(name text) returns text[] language sql immutable as
    $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
  grant execute on function storage.foldername(text) to anon, authenticated;
`;

const A = "11111111-1111-1111-1111-111111111111";
const B = "22222222-2222-2222-2222-222222222222";

async function setup() {
  const db = new PGlite();
  await db.exec(AUTH_STUB);
  // ผู้ใช้ที่สมัครก่อนรัน migration ต้องได้โปรไฟล์ด้วย
  await db.query(`insert into auth.users (id, email, raw_user_meta_data) values ('33333333-3333-3333-3333-333333333333','early@x.com','{"display_name":"มาก่อน"}')`);
  await db.exec(SQL);
  await db.exec(SQL2);
  await db.exec(SQL3);
  await db.exec(SQL4);
  await db.exec(SQL5);
  await db.exec(SQL6);
  await db.exec(SQL); // รันซ้ำต้องไม่พัง
  await db.exec(SQL2);
  await db.exec(SQL3);
  await db.exec(SQL4);
  await db.exec(SQL5);
  await db.exec(SQL6);
  await db.query(`insert into auth.users (id, email, raw_user_meta_data) values ($1,'a@x.com','{"display_name":"ปั้ม"}'), ($2,'b@x.com','{}')`, [A, B]);
  return db;
}

async function as(db, uid, fn) {
  await db.exec(uid ? `set role authenticated; select set_config('request.jwt.claim.sub','${uid}',false);`
                    : `set role anon; select set_config('request.jwt.claim.sub','',false);`);
  try { return await fn(); } finally { await db.exec("reset role;"); }
}

const today = () => {
  const d = new Date(Date.now() + 7 * 3600e3); // Asia/Bangkok
  return d.toISOString().slice(0, 10);
};

test("สมัครแล้วมีโปรไฟล์และชื่อ", async () => {
  const db = await setup();
  const r = await db.query("select display_name, bones from public.profiles order by display_name nulls last");
  assert.equal(r.rows.length, 3, "รวมคนที่สมัครก่อนรัน migration");
  assert.ok(r.rows.some((x) => x.display_name === "มาก่อน"));
  assert.ok(r.rows.some((x) => x.display_name === "ปั้ม"));
  assert.equal(r.rows[0].bones, 0);
});

test("claim_reward ให้แต้มครั้งเดียว และปฏิเสธ key ปลอม", async () => {
  const db = await setup();
  await as(db, A, async () => {
    let r = await db.query("select * from public.claim_reward('story-tongue')");
    assert.deepEqual(r.rows[0], { bones: 10, gained: 10 });
    r = await db.query("select * from public.claim_reward('story-tongue')");
    assert.deepEqual(r.rows[0], { bones: 10, gained: 0 });
    r = await db.query("select * from public.claim_reward('hack-9999')");
    assert.equal(r.rows[0].gained, 0);
    r = await db.query(`select * from public.claim_reward('visit-${today()}')`);
    assert.equal(r.rows[0].gained, 5);
    r = await db.query("select * from public.claim_reward('visit-2020-01-01')");
    assert.equal(r.rows[0].gained, 0, "วันเก่าเคลมสดไม่ได้");
    r = await db.query("select * from public.claim_reward('visit-2026-13-45')");
    assert.equal(r.rows[0].gained, 0, "วันที่ผิดรูปแบบ");
    r = await db.query("select * from public.claim_reward('visit-2026-02-30')");
    assert.equal(r.rows[0].gained, 0, "วันที่ไม่มีจริง");
  });
});

test("merge_rewards ย้ายแต้มในเครื่องเข้าบัญชี ไม่นับซ้ำ", async () => {
  const db = await setup();
  await as(db, B, async () => {
    const keys = ["story-history", "guide-puppy", "cost", "ready", "memorial", "fake", `heat-${today()}`, "story-history"];
    const r = await db.query("select public.merge_rewards($1::text[]) as b", [keys]);
    assert.equal(r.rows[0].b, 10 + 5 + 5 + 10 + 20 + 5);
    const again = await db.query("select public.merge_rewards($1::text[]) as b", [keys]);
    assert.equal(again.rows[0].b, 55);
  });
});

test("แก้กระดูกตรง ๆ ไม่ได้ แต่แก้ชื่อได้", async () => {
  const db = await setup();
  await as(db, A, async () => {
    await assert.rejects(db.query("update public.profiles set bones = 9999 where id = auth.uid()"));
    await assert.rejects(db.query("update public.profiles set is_admin = true where id = auth.uid()"));
    await db.query("update public.profiles set display_name = 'Pump' where id = auth.uid()");
    await assert.rejects(db.query("insert into public.profile_rewards (user_id,key,points) values (auth.uid(),'x',999)"));
  });
});

test("เห็นโปรไฟล์และแต้มของคนอื่นไม่ได้", async () => {
  const db = await setup();
  await as(db, A, () => db.query("select * from public.claim_reward('cost')"));
  await as(db, B, async () => {
    const p = await db.query("select id from public.profiles");
    assert.deepEqual(p.rows.map((x) => x.id), [B]);
    const r = await db.query("select * from public.profile_rewards");
    assert.equal(r.rows.length, 0);
  });
});

test("คนไม่ล็อกอินอ่านบทความได้ แต่เคลมแต้มไม่ได้", async () => {
  const db = await setup();
  await as(db, null, async () => {
    const r = await db.query("select slug from public.articles order by position");
    assert.deepEqual(r.rows.map((x) => x.slug), ["tongue", "history", "han-hunter", "temper", "swim"]);
    await assert.rejects(db.query("select * from public.claim_reward('cost')"));
    await assert.rejects(db.query("insert into public.articles (slug,title,body) values ('x','x','{a}')"));
  });
});

test("ความทรงจำ: ส่วนตัวโดยค่าเริ่มต้น อนุมัติตัวเองไม่ได้", async () => {
  const db = await setup();
  await as(db, A, async () => {
    await db.query("insert into public.memorials (dog_name, years, message) values ('ข้าวต้ม','2555–2566','คิดถึงนะ')");
    await assert.rejects(db.query("insert into public.memorials (dog_name, message, status) values ('x','y','approved')"));
    await assert.rejects(db.query("update public.memorials set status='approved'"));
    await db.query("update public.memorials set status='pending'");
    const own = await db.query("select dog_name, status from public.memorials");
    assert.deepEqual(own.rows, [{ dog_name: "ข้าวต้ม", status: "pending" }]);
  });
  await as(db, B, async () => {
    const r = await db.query("select * from public.memorials");
    assert.equal(r.rows.length, 0, "คนอื่นมองไม่เห็นจนกว่าจะอนุมัติ");
    await db.query("delete from public.memorials");
  });
  // แอดมินอนุมัติ (สิทธิ์ postgres) แล้วทุกคนเห็น
  await db.query("update public.memorials set status='approved'");
  await as(db, null, async () => {
    const r = await db.query("select dog_name from public.memorials");
    assert.deepEqual(r.rows, [{ dog_name: "ข้าวต้ม" }]);
  });
});

test("ยอดเพี้ยน (มีภารกิจแต่ยอดเป็น 0) ถูกซ่อมเมื่อรันไฟล์ซ้ำ และเมื่อเคลมครั้งถัดไป", async () => {
  const db = await setup();
  // จำลองเหตุการณ์จริง: บันทึกภารกิจไว้ แต่ยอดในโปรไฟล์ไม่ถูกบวก
  await db.query("insert into public.profile_rewards (user_id,key,points) values ($1,'story-tongue',10),($1,'cost',5)", [A]);
  await db.query("update public.profiles set bones = 0 where id = $1", [A]);
  await db.exec(SQL);
  let r = await db.query("select bones from public.profiles where id = $1", [A]);
  assert.equal(r.rows[0].bones, 15);
  await db.query("update public.profiles set bones = 0 where id = $1", [A]);
  await as(db, A, async () => {
    const c = await db.query("select * from public.claim_reward('ready')");
    assert.deepEqual(c.rows[0], { bones: 25, gained: 10 });
  });
});

test("เคลมได้แม้ยังไม่มีโปรไฟล์ (สร้างให้อัตโนมัติ)", async () => {
  const db = await setup();
  await db.query("delete from public.profiles where id = $1", [B]);
  await as(db, B, async () => {
    const r = await db.query("select public.merge_rewards($1::text[]) as b", [["cost", "ready"]]);
    assert.equal(r.rows[0].b, 15);
  });
});

// ---------------- Milestone 03 ----------------
const P = (uid) => `${uid}/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa.jpg`;
const P2 = (uid, n) => `${uid}/aaaaaaaa-aaaa-aaaa-aaaa-${String(n).padStart(12, "0")}.jpg`;

test("ส่งโพสต์: เข้าคิว pending และคนอื่นยังไม่เห็น", async () => {
  const db = await setup();
  await as(db, A, async () => {
    await db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo) values ('ข้าวต้ม','วันแรกที่บ้าน',$1,true)", [P(A)]);
    const own = await db.query("select status from public.dog_posts");
    assert.deepEqual(own.rows, [{ status: "pending" }]);
  });
  await as(db, B, async () => assert.equal((await db.query("select * from public.dog_posts")).rows.length, 0));
  await as(db, null, async () => assert.equal((await db.query("select * from public.dog_posts")).rows.length, 0));
});

test("ส่งโพสต์: กันส่งแทนคนอื่น อนุมัติตัวเอง ไม่ยืนยันสิทธิ์รูป และ path แปลก", async () => {
  const db = await setup();
  await as(db, A, async () => {
    await assert.rejects(db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo) values ('x','y',$1,true)", [P(B)]), "รูปในโฟลเดอร์คนอื่น");
    await assert.rejects(db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo, status) values ('x','y',$1,true,'approved')", [P(A)]), "ตั้ง status เอง");
    await assert.rejects(db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo) values ('x','y',$1,false)", [P(A)]), "ไม่ยืนยันสิทธิ์รูป");
    await assert.rejects(db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo) values ('x','y','../../etc/passwd',true)"), "path แปลก");
    await db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo) values ('x','y',$1,true)", [P(A)]);
    const n = await db.query("update public.dog_posts set status='approved' returning id");
    assert.equal(n.rows.length, 0, "ไม่ใช่แอดมิน อัปเดตไม่ได้");
  });
});

test("ส่งค้างอนุมัติได้ไม่เกิน 5 โพสต์", async () => {
  const db = await setup();
  await as(db, A, async () => {
    for (let i = 1; i <= 5; i++) await db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo) values ('x','y',$1,true)", [P2(A, i)]);
    await assert.rejects(db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo) values ('x','y',$1,true)", [P2(A, 6)]));
  });
});

test("แอดมินเห็นคิว อนุมัติแล้วทุกคนเห็น", async () => {
  const db = await setup();
  await as(db, B, () => db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo) values ('บัวลอย','ชอบนอนหน้าแอร์',$1,true)", [P(B)]));
  await db.query("update public.profiles set is_admin = true where id = $1", [A]);
  await as(db, A, async () => {
    const q = await db.query("select id from public.dog_posts where status='pending'");
    assert.equal(q.rows.length, 1);
    await db.query("update public.dog_posts set status='approved', reviewed_at=now(), reviewed_by=auth.uid() where id=$1", [q.rows[0].id]);
    await assert.rejects(db.query("update public.dog_posts set caption='แก้แคปชันคนอื่น'"), "แอดมินแก้เนื้อหาไม่ได้ แค่อนุมัติ");
  });
  await as(db, null, async () => {
    const r = await db.query("select dog_name from public.dog_posts");
    assert.deepEqual(r.rows, [{ dog_name: "บัวลอย" }]);
  });
});

test("ภารกิจส่งรูป: ได้ 20 เมื่อมีโพสต์จริงเท่านั้น", async () => {
  const db = await setup();
  await as(db, A, async () => {
    let r = await db.query("select * from public.claim_reward('post')");
    assert.equal(r.rows[0].gained, 0);
    await db.query("insert into public.dog_posts (dog_name, caption, photo_path, owns_photo) values ('x','y',$1,true)", [P(A)]);
    r = await db.query("select * from public.claim_reward('post')");
    assert.deepEqual(r.rows[0], { bones: 20, gained: 20 });
  });
});

test("Storage: อัปโหลดได้เฉพาะโฟลเดอร์ตัวเอง", async () => {
  const db = await setup();
  await as(db, A, async () => {
    await db.query("insert into storage.objects (bucket_id, name) values ('dog-photos', $1)", [P(A)]);
    await assert.rejects(db.query("insert into storage.objects (bucket_id, name) values ('dog-photos', $1)", [P(B)]));
  });
  await as(db, null, async () => {
    await assert.rejects(db.query("insert into storage.objects (bucket_id, name) values ('dog-photos', 'x/y.jpg')"));
  });
  const b = await db.query("select public, file_size_limit, allowed_mime_types from storage.buckets where id='dog-photos'");
  assert.deepEqual(b.rows[0], { public: true, file_size_limit: 2097152, allowed_mime_types: ["image/jpeg"] });
});

// ---------------- Milestone 04 ----------------
test("บทความใหม่ในฐานข้อมูลได้แต้มอ่านจบ แต่ slug ที่ไม่มีจริงไม่ได้", async () => {
  const db = await setup();
  await db.query("insert into public.articles (slug,title,body) values ('summer-tips','ร้อนนี้ดูแลยังไง','{a}')");
  await db.query("insert into public.articles (slug,title,body,published) values ('draft','ร่าง','{a}',false)");
  await as(db, A, async () => {
    assert.equal((await db.query("select * from public.claim_reward('story-summer-tips')")).rows[0].gained, 10);
    assert.equal((await db.query("select * from public.claim_reward('story-nope')")).rows[0].gained, 0);
    assert.equal((await db.query("select * from public.claim_reward('story-draft')")).rows[0].gained, 0, "ร่างที่ยังไม่เผยแพร่");
  });
});

test("กำแพงความทรงจำ: ขอขึ้นกำแพง → แอดมินอนุมัติ → ทุกคนเห็น → แก้ข้อความแล้วต้องรออนุมัติใหม่", async () => {
  const db = await setup();
  await db.query("update public.profiles set is_admin = true where id = $1", [A]);
  let id;
  await as(db, B, async () => {
    id = (await db.query("insert into public.memorials (dog_name, message) values ('ทองหยิบ','รักเสมอ') returning id")).rows[0].id;
    await db.query("update public.memorials set status='pending' where id=$1", [id]);
    await assert.rejects(db.query("update public.memorials set status='approved' where id=$1", [id]));
  });
  await as(db, A, async () => {
    const q = await db.query("select id from public.memorials where status='pending'");
    assert.equal(q.rows.length, 1, "แอดมินเห็นคิว");
    await db.query("update public.memorials set status='approved', reviewed_at=now() where id=$1", [id]);
  });
  await as(db, null, async () => assert.equal((await db.query("select * from public.memorials")).rows.length, 1));
  await as(db, B, async () => {
    await db.query("update public.memorials set message='รักเสมอ ไม่เคยลืม' where id=$1", [id]);
    const r = await db.query("select status from public.memorials where id=$1", [id]);
    assert.equal(r.rows[0].status, "pending");
  });
  await as(db, null, async () => assert.equal((await db.query("select * from public.memorials")).rows.length, 0, "หลุดจากกำแพงจนกว่าจะอนุมัติใหม่"));
});

test("บทความ AKC ได้แต้มอ่านจบ", async () => {
  const db = await setup();
  await as(db, A, async () => assert.equal((await db.query("select * from public.claim_reward('story-han-hunter')")).rows[0].gained, 10));
});

test("บทความว่ายน้ำมีรูปปก และ cover รับเฉพาะ path รูปของเว็บ", async () => {
  const db = await setup();
  const r = await db.query("select cover from public.articles where slug='swim'");
  assert.equal(r.rows[0].cover, "/photos/swim.jpg");
  await assert.rejects(db.query("update public.articles set cover='https://evil.example/x.jpg' where slug='swim'"));
});

test("เกม: รอยเท้าเงา/ข้อความบนพื้น อ่านได้ทุกคน เขียนได้เฉพาะคนล็อกอิน และกันสแปม", async () => {
  const db = await setup();
  const pts = JSON.stringify(Array.from({ length: 30 }, (_, i) => [i * 5, -i * 3]));
  await as(db, null, async () => {
    await assert.rejects(db.query("insert into public.ghost_walks (dog_name, coat, pts) values ('x','orange',$1::jsonb)", [pts]), "anon เขียนไม่ได้");
    await assert.rejects(db.query("insert into public.paw_notes (dog_name, x, z, msg) values ('x',1,1,0)"));
  });
  await as(db, A, async () => {
    await db.query("insert into public.ghost_walks (dog_name, coat, pts) values ('ข้าวต้ม','orange',$1::jsonb)", [pts]);
    await assert.rejects(db.query("insert into public.ghost_walks (dog_name, coat, pts) values ('ข้าวต้ม','orange',$1::jsonb)", [pts]), "ถี่เกินไป");
    await db.query("insert into public.paw_notes (dog_name, x, z, msg) values ('ข้าวต้ม', 3.5, -2, 4)");
    await assert.rejects(db.query("insert into public.paw_notes (dog_name, x, z, msg) values ('ข้าวต้ม', 3.5, -2, 4)"), "ข้อความถี่เกินไป");
    await assert.rejects(db.query("insert into public.paw_notes (dog_name, x, z, msg, user_id) values ('ปลอม', 1, 1, 1, $1)", [B]), "ปลอมเป็นคนอื่นไม่ได้");
  });
  await as(db, B, async () => {
    await assert.rejects(db.query("insert into public.paw_notes (dog_name, x, z, msg) values ('ข้าวต้ม', 1, 1, 99)"), "ข้อความต้องอยู่ในชุดที่กำหนด");
    await assert.rejects(db.query("insert into public.ghost_walks (dog_name, coat, pts) values ('สั้น','orange','[[1,2]]'::jsonb)"), "เส้นทางสั้นเกิน");
  });
  await as(db, null, async () => {
    const g = await db.query("select dog_name, jsonb_array_length(pts) n from public.ghost_walks");
    assert.deepEqual(g.rows, [{ dog_name: "ข้าวต้ม", n: 30 }]);
    const n = await db.query("select dog_name, msg from public.paw_notes");
    assert.deepEqual(n.rows, [{ dog_name: "ข้าวต้ม", msg: 4 }]);
    await assert.rejects(db.query("select user_id from public.ghost_walks"), "ไม่เปิดเผย user_id");
  });
});
