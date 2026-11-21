import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { flatten, join, weld, dedup, prune, simplify, textureCompress, resample, mergeDocuments, unpartition } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
await MeshoptSimplifier.ready;
const s2l = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

// ---------- garden ----------
async function garden() {
  const doc = await io.read('/mnt/user-data/uploads/e87be1ea-CHOWCHOW_RAINBOW_GARDEN_v1.glb');
  const root = doc.getRoot();
  const mStatic = doc.createMaterial('rbg_static').setRoughnessFactor(0.92).setMetallicFactor(0);
  const mTall = doc.createMaterial('rbg_tall').setRoughnessFactor(0.91).setMetallicFactor(0);
  const mGlow = doc.createMaterial('rbg_glow').setRoughnessFactor(0.6).setMetallicFactor(0).setEmissiveFactor([1, 0.86, 0.55]);
  for (const n of root.listNodes()) {
    const m = n.getMesh(); if (!m) continue;
    const glow = /^(LANTERN_LIGHT|TRIBUTE_CANDLES|FIREFLY_ORBS)/.test(n.getName());
    for (const p of m.listPrimitives()) {
      const col = p.getAttribute('COLOR_0');
      if (!col) { p.getMaterial()?.setName('rbg_' + n.getName()); continue; }
      // vertex colors were authored as sRGB bytes -> convert to linear float (glTF spec)
      const N = col.getCount(), k = col.getElementSize(), arr = new Float32Array(N * 3), v = [];
      for (let i = 0; i < N; i++) { col.getElement(i, v); for (let c = 0; c < 3; c++) arr[i * 3 + c] = s2l(v[c]); }
      const acc = doc.createAccessor().setType('VEC3').setArray(arr).setBuffer(root.listBuffers()[0]);
      p.setAttribute('COLOR_0', acc);
      const tall = /^(SAKURA_|GATE_|RAINBOW_|CHOW_|GUARDIAN_|STATUE_HEART|DEDICATION_STONE)/.test(n.getName());
      p.setMaterial(glow ? mGlow : tall ? mTall : mStatic);
    }
  }
  await doc.transform(flatten(), dedup(), join({ keepNamed: false }), weld(), prune());
  // wrap all into one named root node "rb_garden"
  const scene = root.listScenes()[0];
  const top = doc.createNode('rb_garden');
  for (const c of scene.listChildren()) { scene.removeChild(c); collect(c); }
  function collect(n) { if (n.getMesh()) { const w = n.getWorldMatrix(); top.addChild(n); } for (const ch of n.listChildren()) collect(ch); }
  scene.addChild(top);
  return doc;
}
// ---------- lamp ----------
async function lamp() {
  const doc = await io.read('/home/claude/models/lamp_raw.glb');
  const root = doc.getRoot();
  for (const n of root.listNodes()) if (/IES|Light/i.test(n.getName()) && !n.getMesh()) n.dispose();
  await doc.transform(flatten());
  // world-space bake & trim cord: compute min y of all, keep tris below miny + shadeH*1.12
  let miny = 1e9, maxx = -1e9, minx = 1e9;
  const v = [];
  for (const n of root.listNodes()) { const m = n.getMesh(); if (!m) continue; const W = n.getWorldMatrix();
    for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'); for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); const y = W[1]*v[0]+W[5]*v[1]+W[9]*v[2]+W[13]; const x = W[0]*v[0]+W[4]*v[1]+W[8]*v[2]+W[12]; miny = Math.min(miny, y); maxx = Math.max(maxx, x); minx = Math.min(minx, x); } } }
  const cut = miny + (maxx - minx) * 1.15; console.error('lamp miny', miny, 'maxx', maxx, 'cut', cut);
  for (const n of root.listNodes()) { const m = n.getMesh(); if (!m) continue; const W = n.getWorldMatrix();
    for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'), idx = p.getIndices(); if (!idx) continue; const I = idx.getArray(); const keep = [];
      for (let t = 0; t < I.length; t += 3) { let ok = true; for (let q = 0; q < 3; q++) { a.getElement(I[t+q], v); const y = W[1]*v[0]+W[5]*v[1]+W[9]*v[2]+W[13]; if (y > cut) ok = false; } if (ok) keep.push(I[t], I[t+1], I[t+2]); }
      if (!keep.length) { p.dispose(); continue; }
      console.error('prim', p.getMaterial()?.getName(), I.length/3, '->', keep.length/3); idx.setArray(new Uint32Array(keep)); } }
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) if (/Glass_Window|LED_/.test(p.getMaterial()?.getName() ?? '')) p.dispose();
  for (const p of root.listMeshes().flatMap(m => m.listPrimitives())) p.setAttribute('TEXCOORD_0', null);
  await doc.transform(dedup(), join({ keepNamed: false }), weld(), simplify({ simplifier: MeshoptSimplifier, ratio: 0.5, error: 0.0015 }), prune());
  const scene = root.listScenes()[0]; const top = doc.createNode('lamp_rice');
  const all = []; for (const c of scene.listChildren()) { (function f(n){ if (n.getMesh()) all.push(n); n.listChildren().forEach(f); })(c); }
  for (const n of all) { const W = n.getWorldMatrix(); n.setMatrix(W); top.addChild(n); }
  for (const c of scene.listChildren()) if (c !== top) scene.removeChild(c);
  scene.addChild(top);
  return doc;
}
// ---------- lighthouse ----------
async function lighthouse() {
  const doc = await io.read('/home/claude/models/lighthouse_raw.glb');
  const root = doc.getRoot();
  for (const a of root.listAnimations()) a.dispose();
  for (const m of root.listMaterials()) { m.setNormalTexture(null); m.setMetallicFactor(0); m.setRoughnessFactor(0.75); }
  await doc.transform(flatten(), dedup(), weld(), simplify({ simplifier: MeshoptSimplifier, ratio: 0.08, error: 0.004 }),
    textureCompress({ encoder: sharp, targetFormat: 'jpeg', resize: [256, 256], quality: 80 }), prune());
  const scene = root.listScenes()[0]; const top = doc.createNode('lighthouse');
  const all = []; for (const c of scene.listChildren()) { (function f(n){ if (n.getMesh()) all.push(n); n.listChildren().forEach(f); })(c); }
  for (const n of all) { const W = n.getWorldMatrix(); n.setMatrix(W); top.addChild(n); }
  for (const c of scene.listChildren()) if (c !== top) scene.removeChild(c);
  scene.addChild(top);
  return doc;
}
const which = process.argv[2];
const doc = await ({ garden, lamp, lighthouse })[which]();
await doc.transform(unpartition());
await io.write(`/home/claude/models/${which}.glb`, doc);
