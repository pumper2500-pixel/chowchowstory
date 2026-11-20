// ประกอบเกมกลับเป็นไฟล์เดียว: game/ → public/farm/index.html
//   node game/build.mjs          build (ย่อโค้ด) แล้วเขียนทับ public/farm/index.html
//   node game/build.mjs --dev    ไม่ย่อโค้ด (ดีบักง่าย ไฟล์ใหญ่ขึ้น) — อย่า commit แบบนี้
// ต้องมี esbuild: npm i --no-save esbuild   (หรือ npx จะติดตั้งให้เอง)
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "public", "farm", "index.html");
const dev = process.argv.includes("--dev");

// 1) รูปไอคอน (window.__IMG) — ลำดับตาม img/_order.json, รูปใหม่ที่ไม่มีในรายการต่อท้ายตามชื่อ
const order = JSON.parse(readFileSync(join(here, "img", "_order.json"), "utf8"));
const files = readdirSync(join(here, "img")).filter((f) => /\.(png|jpe?g|webp)$/.test(f));
const all = [...order.filter((f) => files.includes(f)), ...files.filter((f) => !order.includes(f)).sort()];
const mime = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
const img = {};
for (const f of all) {
  const ext = f.split(".").pop();
  img[f.replace(/\.[^.]+$/, "")] = `data:${mime[ext]};base64,${readFileSync(join(here, "img", f)).toString("base64")}`;
}

// 2) โค้ดเกม (Three.js r170 + ตัวเกม รวมอยู่ในไฟล์เดียว)
const src = readFileSync(join(here, "src", "main.js"), "utf8");
const { code } = await transform(src, {
  loader: "js",
  minify: !dev,
  target: "es2020",
  charset: "ascii",
  legalComments: "none",
});
if (code.includes("</script")) throw new Error("โค้ดมีคำว่า </script ทำให้ HTML พัง");

// 3) ประกอบ
const html = readFileSync(join(here, "index.template.html"), "utf8")
  .replace("<!--STYLE-->", () => readFileSync(join(here, "style.css"), "utf8"))
  .replace("<!--IMG-->", () => `<script>window.__IMG=${JSON.stringify(img)}</script>`)
  .replace("<!--MAIN-->", () => code.trimEnd());
writeFileSync(out, html);
console.log(`เขียน ${out} (${(html.length / 1e6).toFixed(2)} MB, รูป ${all.length}${dev ? ", โหมด dev" : ""})`);
console.log("อย่าลืม: เพิ่มเลข VERSION ใน public/farm/sw.js ก่อน commit");
