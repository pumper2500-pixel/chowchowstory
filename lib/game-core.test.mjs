import { test } from "node:test";
import assert from "node:assert/strict";
import { levelOf, progress, earn, heatVerdict, LEVELS, DOGS } from "./game-core.mjs";

test("มีหมาหนึ่งตัวต่อหนึ่งเลเวล", () => assert.equal(LEVELS.length, DOGS.length));

test("levelOf ตามขอบเลเวล", () => {
  assert.equal(levelOf(0), 0);
  assert.equal(levelOf(29), 0);
  assert.equal(levelOf(30), 1);
  assert.equal(levelOf(359), 4);
  assert.equal(levelOf(9999), 5);
});

test("progress อยู่ในช่วง 0..1", () => {
  assert.equal(progress(0), 0);
  assert.equal(progress(15), 0.5);
  assert.equal(progress(400), 1);
});

test("earn ให้แต้มครั้งเดียว และบอกเลเวลอัป", () => {
  const s0 = { bones: 25, done: {} };
  const a = earn(s0, "story-tongue", 10);
  assert.equal(a.state.bones, 35);
  assert.equal(a.levelUp, true);
  assert.equal(s0.bones, 25, "ไม่แก้ state เดิม");
  const b = earn(a.state, "story-tongue", 10);
  assert.equal(b.gained, 0);
  assert.equal(b.state.bones, 35);
});

test("heatVerdict", () => {
  assert.equal(heatVerdict(22, 50).level, "ok");
  assert.equal(heatVerdict(27, 60).level, "warn");
  assert.equal(heatVerdict(24, 100).level, "warn"); // ชื้นมากดันขึ้น
  assert.equal(heatVerdict(33, 70).level, "bad");
});
