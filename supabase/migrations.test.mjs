// ทดสอบ SQL ของ Supabase บน Postgres จำลอง (PGlite) พร้อม auth schema แบบย่อ
// รัน: npm run test:db
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const SQL = readFileSync(new URL("./migrations/0001_init.sql", import.meta.url), "utf8");

const AUTH_STUB = `
  create role anon nologin; create role authenticated nologin;
  grant usage on schema public to anon, authenticated;
  create schema auth;
  grant usage on schema auth to anon, authenticated;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant execute on function auth.uid() to anon, authenticated;
`;

const A = "11111111-1111-1111-1111-111111111111";
const B = "22222222-2222-2222-2222-222222222222";

async function setup() {
  const db = new PGlite();
  await db.exec(AUTH_STUB);
  await db.exec(SQL);
  await db.exec(SQL); // รันซ้ำต้องไม่พัง
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
  assert.equal(r.rows.length, 2);
  assert.equal(r.rows[0].display_name, "ปั้ม");
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
    assert.deepEqual(r.rows.map((x) => x.slug), ["tongue", "history", "temper"]);
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
