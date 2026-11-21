import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { compactPrimitive, flatten, join, weld, dedup, prune, simplify, textureCompress, unpartition } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
await MeshoptSimplifier.ready;
const R = '/home/claude/m2/raw/', M = '/home/claude/m2/';
async function tex(doc, file, size = 512, png = false) {
  const img = sharp(file).resize(size, size, { fit: 'inside' });
  const buf = png ? await img.png().toBuffer() : await img.jpeg({ quality: 82 }).toBuffer();
  return doc.createTexture(file.split('/').pop()).setImage(buf).setMimeType(png ? 'image/png' : 'image/jpeg');
}
// bake every mesh node under a new named root at scene top, optional filter, recenter x/z
function wrap(doc, name, keep = () => true, recenter = false) {
  const scene = doc.getRoot().listScenes()[0];
  const top = doc.createNode(name);
  const all = [];
  for (const c of scene.listChildren()) c.traverse(n => { if (n.getMesh() && keep(n)) all.push(n); });
  const mats = all.map(n => n.getWorldMatrix());
  all.forEach((n, i) => { n.setMatrix(mats[i]); top.addChild(n); });
  for (const c of scene.listChildren()) scene.removeChild(c);
  scene.addChild(top);
  if (recenter) {
    let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; const v = [];
    for (const n of top.listChildren()) { const W = n.getWorldMatrix(); for (const p of n.getMesh().listPrimitives()) { const a = p.getAttribute('POSITION'); for (let i = 0; i < a.getCount(); i += 7) { a.getElement(i, v); const w = [0, 1, 2].map(k => W[k] * v[0] + W[4 + k] * v[1] + W[8 + k] * v[2] + W[12 + k]); for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], w[k]); mx[k] = Math.max(mx[k], w[k]); } } } }
    top.setTranslation([-(mn[0] + mx[0]) / 2, -mn[1], -(mn[2] + mx[2]) / 2]);
  }
  return top;
}
async function shrinkTex(doc, size, fmt = 'jpeg') {
  for (const t of doc.getRoot().listTextures()) { const im = t.getImage(); if (!im) continue; let x = sharp(Buffer.from(im)).resize(size, size, { fit: 'inside', withoutEnlargement: true }); const meta = await sharp(Buffer.from(im)).metadata(); const png = fmt === 'png' || (meta.hasAlpha && fmt === 'auto'); t.setImage(png ? await x.png().toBuffer() : await x.jpeg({ quality: 80 }).toBuffer()).setMimeType(png ? 'image/png' : 'image/jpeg'); }
}
// meshopt sloppy: ยุบได้แม้เป็นชิ้นเล็กแยกกันเยอะ (ขน, ตะกร้าลวด, สินค้า)
function sloppy(doc, ratio, err = 0.01) {
  for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) {
    const idx = p.getIndices(), pos = p.getAttribute('POSITION'); if (!idx) continue;
    const I = new Uint32Array(idx.getArray()); const P = new Float32Array(pos.getCount() * 3); const e = []; for (let i = 0; i < pos.getCount(); i++) { pos.getElement(i, e); P[i*3]=e[0]; P[i*3+1]=e[1]; P[i*3+2]=e[2]; } if (I.length < 300) continue;
    const target = Math.max(36, Math.floor(I.length * ratio / 3) * 3);
    const [out] = MeshoptSimplifier.simplifySloppy(I, P, 3, null, target, err);
    if (!out.length) { p.dispose(); continue; }
    idx.setArray(out.length > 65535 * 3 || pos.getCount() > 65535 ? new Uint32Array(out) : new Uint32Array(out));
    compactPrimitive(p);
  }
}
const S = (ratio, error = 0.002) => simplify({ simplifier: MeshoptSimplifier, ratio, error });
const out = {};
out.rainbow = async () => {
  const doc = await io.read(R + 'rainbow.glb');
  await doc.transform(flatten());
  const top = wrap(doc, 'rainbow_arc');
  // full semicircle: mirrored copy around the top end of the quarter arc
  let mx = -1e9; const v = [];
  for (const n of top.listChildren()) { const W = n.getWorldMatrix(); for (const p of n.getMesh().listPrimitives()) { const a = p.getAttribute('POSITION'); for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); mx = Math.max(mx, W[0] * v[0] + W[4] * v[1] + W[8] * v[2] + W[12]); } } }
  const mir = doc.createNode('mirror').setScale([-1, 1, 1]).setTranslation([2 * mx, 0, 0]);
  for (const n of top.listChildren()) mir.addChild(doc.createNode(n.getName() + '_m').setMesh(n.getMesh()).setMatrix(n.getMatrix()));
  top.addChild(mir);
  for (const m of doc.getRoot().listMaterials()) m.setRoughnessFactor(0.45).setMetallicFactor(0);
  return doc;
};
out.trees = async () => {
  const doc = await io.read(R + 'trees.glb');
  const root = doc.getRoot(); const T = M + 'trees-set-a/textures/';
  const bark = await tex(doc, T + 'bark_albedo.jpg', 512);
  const leafTex = {};
  for (const m of root.listMaterials()) {
    const n = m.getName();
    if (n === 'bark') m.setBaseColorTexture(bark).setRoughnessFactor(0.95).setMetallicFactor(0);
    else if (/^LLP\d/.test(n)) { leafTex[n] ??= await tex(doc, T + n + '.png', 512, true); m.setBaseColorTexture(leafTex[n]).setAlphaMode('MASK').setAlphaCutoff(0.45).setDoubleSided(true).setRoughnessFactor(0.9).setMetallicFactor(0); }
    else m.setBaseColorTexture(null);
  }
  const want = { T2: 'tree_r1', T3: 'tree_r2', T7: 'tree_r3', T10: 'tree_r4', T11: 'tree_r5' };
  const scene = root.listScenes()[0], rn = scene.listChildren()[0];
  const tops = [];
  for (const c of rn.listChildren()) {
    if (!want[c.getName()]) { c.dispose(); continue; }
    const t = doc.createNode(want[c.getName()]); const W = c.getWorldMatrix(); const all = [];
    c.traverse(n => { if (n.getMesh()) all.push([n, n.getWorldMatrix()]); });
    for (const [n, w] of all) { n.setMatrix(w); t.addChild(n); }
    const tr = c.getTranslation(); t.setTranslation([-tr[0], 0, -tr[2]]); tops.push(t);
  }
  for (const c of scene.listChildren()) scene.removeChild(c);
  tops.forEach(t => scene.addChild(t));
  await doc.transform(dedup(), weld(), S(0.45, 0.004), prune());
  return doc;
};
out.leaves = async () => {
  const doc = await io.read(R + 'leaves.glb');
  const t = await tex(doc, M + 'autumn-leaves/textures/Autumn Leaves.png', 512, true);
  for (const m of doc.getRoot().listMaterials()) m.setBaseColorTexture(t).setBaseColorFactor([1, 1, 1, 1]).setAlphaMode('MASK').setAlphaCutoff(0.5).setDoubleSided(true).setRoughnessFactor(0.9).setMetallicFactor(0);
  await doc.transform(flatten(), dedup(), join({ keepNamed: false }));
  wrap(doc, 'leaf_set', () => true, true);
  return doc;
};
out.beaver = async () => {
  const doc = await io.read(R + 'beaver.glb');
  for (const m of doc.getRoot().listMaterials()) { m.setNormalTexture(null); m.setMetallicFactor(0); m.setRoughnessFactor(0.95); const c = m.getBaseColorFactor(); if (/fur/i.test(m.getName())) m.setBaseColorFactor([Math.min(1, c[0] * 3.2), Math.min(1, c[1] * 3.2), Math.min(1, c[2] * 3.2), 1]); }
  await doc.transform(flatten(), dedup(), join({ keepNamed: false }), weld({ tolerance: 0.002 })); sloppy(doc, 0.1, 0.01); await doc.transform(prune());
  wrap(doc, 'plush_beaver', () => true, true); return doc;
};
out.penguin = async () => {
  const doc = await io.read(R + 'penguin.glb'); const P = M + 'christmas-penguin-plush/textures/Penguin Plush_Material_BaseColor.png';
  const t = await tex(doc, P, 512);
  for (const m of doc.getRoot().listMaterials()) { m.setBaseColorTexture(t).setRoughnessFactor(0.95).setMetallicFactor(0); m.setMetallicRoughnessTexture(null); m.setNormalTexture(null); m.setEmissiveTexture(null); }
  await doc.transform(flatten()); wrap(doc, 'plush_penguin', () => true, true); return doc;
};
out.shiba = async () => {
  const doc = await io.read(R + 'shiba.glb'); const t = await tex(doc, M + 'shiba/textures/default_Base_Color.png', 512);
  for (const m of doc.getRoot().listMaterials()) m.setBaseColorTexture(t).setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.95).setMetallicFactor(0);
  await doc.transform(flatten()); wrap(doc, 'plush_shiba', () => true, true); return doc;
};
out.keychain = async () => {
  const doc = await io.read(R + 'keychain.glb');
  await doc.transform(flatten(), weld(), S(0.3, 0.003), textureCompress({ encoder: sharp, targetFormat: 'jpeg', resize: [512, 512] }));
  for (const m of doc.getRoot().listMaterials()) { m.setNormalTexture(null); m.setMetallicRoughnessTexture(null); m.setMetallicFactor(0); m.setRoughnessFactor(0.9); }
  wrap(doc, 'plush_hound', () => true, true); return doc;
};
out.kirby = async () => {
  const doc = await io.read(R + 'kirby.glb');
  await doc.transform(flatten());
  wrap(doc, 'plush_gura', n => n.getWorldMatrix()[12] < -1, true);
  await doc.transform(dedup(), join({ keepNamed: false }), weld(), S(0.25, 0.003), textureCompress({ encoder: sharp, targetFormat: 'png', resize: [512, 512] }), prune());
  for (const m of doc.getRoot().listMaterials()) { m.setMetallicFactor(0); m.setRoughnessFactor(Math.max(0.5, m.getRoughnessFactor())); }
  return doc;
};
out.macan = async () => {
  const doc = await io.read(R + 'macan.glb');
  const col = { kuzov: [0, 0.145, 0.27], bagaznik: [0, 0.145, 0.27], glass: [0.02, 0.06, 0.08], 'darc metall': [0.02, 0.02, 0.025], 'weels protectors': [0.015, 0.015, 0.015], number: [0.9, 0.9, 0.9], reshotka: [0.01, 0.01, 0.01], metall: [0.35, 0.37, 0.4], plastic: [0.02, 0.02, 0.02], emission: [1, 1, 0.9], 'orange pure': [1, 0.35, 0.05], orange: [0.8, 0.2, 0.03], miror: [0.03, 0.03, 0.03] };
  for (const m of doc.getRoot().listMaterials()) { const k = m.getName().toLowerCase().replace(/\.\d+$/, '').replace(' hamam', ''); const c = col[k] ?? [0.3, 0.3, 0.3]; m.setBaseColorFactor([...c, 1]).setMetallicFactor(/metall|glass|miror/.test(k) ? 0.6 : 0.1).setRoughnessFactor(/glass|miror/.test(k) ? 0.15 : /kuzov|bagaznik/.test(k) ? 0.35 : 0.6); if (/kuzov|bagaznik/.test(k)) m.setName('car_body'); if (k === 'emission') m.setEmissiveFactor([1, 1, 0.85]); }
  await doc.transform(flatten(), dedup(), join({ keepNamed: false }), weld(), S(0.07, 0.003), prune());
  wrap(doc, 'car_macan', () => true, true); return doc;
};
out.sashimi = async () => {
  const doc = await io.read(R + 'sashimi.glb');
  await doc.transform(flatten(), dedup(), join({ keepNamed: false }), weld(), S(0.06, 0.003), prune());
  for (const m of doc.getRoot().listMaterials()) { m.setNormalTexture(null); m.setMetallicRoughnessTexture(null); m.setOcclusionTexture(null); m.setMetallicFactor(0); }
  await doc.transform(prune()); await shrinkTex(doc, 256);
  wrap(doc, 'sashimi_boat', () => true, true); await doc.transform(prune()); return doc;
};
out.snack_shelf = async () => {
  const doc = await io.read(R + 'snack_shelf.glb');
  for (const m of doc.getRoot().listMaterials()) { m.setNormalTexture(null); m.setMetallicRoughnessTexture(null); m.setOcclusionTexture(null); m.setEmissiveTexture(null); }
  await doc.transform(flatten(), dedup(), join({ keepNamed: false }), weld({ tolerance: 0.001 }), S(0.3, 0.002)); sloppy(doc, 0.05, 0.006); await doc.transform(prune()); await shrinkTex(doc, 256, 'auto');
  wrap(doc, 'snack_shelf', () => true, true); return doc;
};
for (const k of process.argv.slice(2)) { const d = await out[k](); await d.transform(unpartition(), prune()); await io.write(`/home/claude/m2/${k}.glb`, d); console.log(k, (fs.statSync(`/home/claude/m2/${k}.glb`).size / 1e6).toFixed(2) + 'MB'); }
