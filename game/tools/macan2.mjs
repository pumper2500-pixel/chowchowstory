import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, prune, dedup } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const src = await io.read('/home/claude/m2/raw/macan.glb');
const W0 = [[1.125, -0.68, 1.255], [-1.125, -0.68, 1.255], [1.125, -0.685, -1.285], [-1.125, -0.685, -1.285]];
const NAMES = ['Wheel_FR', 'Wheel_FL', 'Wheel_RR', 'Wheel_RL'];
const buckets = new Map(); // key mat|b -> {pos:[], nrm:[]}
const v = [], nn = [];
for (const n of src.getRoot().listNodes()) {
  const m = n.getMesh(); if (!m) continue;
  const W = n.getWorldMatrix();
  const det = W[0]*(W[5]*W[10]-W[6]*W[9]) - W[4]*(W[1]*W[10]-W[2]*W[9]) + W[8]*(W[1]*W[6]-W[2]*W[5]);
  for (const p of m.listPrimitives()) {
    const a = p.getAttribute('POSITION'), na = p.getAttribute('NORMAL'), idx = p.getIndices();
    const I = idx ? idx.getArray() : [...Array(a.getCount()).keys()];
    const mat = p.getMaterial()?.getName() ?? 'x';
    const tp = (i) => { a.getElement(i, v); return [0,1,2].map(k => W[k]*v[0]+W[4+k]*v[1]+W[8+k]*v[2]+W[12+k]); };
    const tn = (i) => { if (!na) return [0,1,0]; na.getElement(i, nn); const r = [0,1,2].map(k => W[k]*nn[0]+W[4+k]*nn[1]+W[8+k]*nn[2]); const l = Math.hypot(...r) || 1; return r.map(x => x/l * Math.sign(det||1) * Math.sign(det||1)); };
    for (let t = 0; t < I.length; t += 3) {
      let ids = [I[t], I[t+1], I[t+2]]; if (det < 0) ids = [ids[0], ids[2], ids[1]];
      const P = ids.map(tp), N = ids.map(tn);
      const c = [0,1,2].map(k => (P[0][k]+P[1][k]+P[2][k])/3);
      let b = 4;
      for (let w = 0; w < 4; w++) { const C = W0[w]; if (Math.abs(c[0]) > 0.72 && Math.sign(c[0]) === Math.sign(C[0]) && Math.abs(c[0]-C[0]) < 0.36 && Math.hypot(c[1]-C[1], c[2]-C[2]) < 0.555) { b = w; break; } }
      const mat2 = /emission/i.test(mat) && c[2] < 0 ? 'Taillight' : mat; const key = mat2 + '|' + b; let B = buckets.get(key); if (!B) buckets.set(key, B = { mat: mat2, b, pos: [], nrm: [] });
      for (let q = 0; q < 3; q++) { const o = b < 4 ? W0[b] : [0,0,0]; B.pos.push(P[q][0]-o[0], P[q][1]-o[1], P[q][2]-o[2]); B.nrm.push(...N[q]); }
    }
  }
}
const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene();
const col = { kuzov: [0, 0.145, 0.27], bagaznik: [0, 0.145, 0.27], 'kuzov.001': [0,0.145,0.27], glass: [0.02, 0.06, 0.08], 'glass.002':[0.02,0.06,0.08], 'darc metall': [0.02, 0.02, 0.025], 'weels protectors': [0.015, 0.015, 0.015], number: [0.9, 0.9, 0.9], reshotka: [0.01, 0.01, 0.01], metall: [0.35, 0.37, 0.4], plastic: [0.02, 0.02, 0.02], emission: [1, 0.95, 0.8], 'orange pure': [1, 0.35, 0.05], orange: [0.8, 0.2, 0.03], miror: [0.03, 0.03, 0.03], 'kuzov hamam':[0,0.145,0.27] };
const mats = new Map();
const getMat = (name) => { if (mats.has(name)) return mats.get(name); if (name === 'Taillight') { const m = doc.createMaterial('Taillight').setBaseColorFactor([0.9,0.05,0.05,1]).setEmissiveFactor([1,0.1,0.05]).setRoughnessFactor(0.4).setMetallicFactor(0); mats.set(name, m); return m; } const k = name.toLowerCase(); const c = col[k] ?? [0.3,0.3,0.3];
  const m = doc.createMaterial(/kuzov|bagaznik/.test(k) ? 'car_body' : /emission/.test(k) ? 'Headlight' : name).setBaseColorFactor([...c, 1]).setMetallicFactor(/metall|glass|miror/.test(k) ? 0.6 : 0.1).setRoughnessFactor(/glass|miror/.test(k) ? 0.15 : /kuzov|bagaznik/.test(k) ? 0.35 : 0.6);
  if (/emission/.test(k)) m.setEmissiveFactor([1, 0.95, 0.8]); mats.set(name, m); return m; };
const top = doc.createNode('car_macan'); scene.addChild(top);
const meshes = [0,1,2,3,4].map(b => doc.createMesh(b < 4 ? NAMES[b] : 'body'));
for (const B of buckets.values()) {
  const prim = doc.createPrimitive().setMaterial(getMat(B.mat))
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(B.pos)).setBuffer(buf))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(B.nrm)).setBuffer(buf));
  meshes[B.b].addPrimitive(prim);
}
top.addChild(doc.createNode('body').setMesh(meshes[4]));
for (let w = 0; w < 4; w++) top.addChild(doc.createNode(NAMES[w]).setMesh(meshes[w]).setTranslation(W0[w]));
await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: 0.08, error: 0.003 }), dedup(), prune());
await io.write('/home/claude/m2/macan.glb', doc);
let tri = {}; for (const m of doc.getRoot().listMeshes()) tri[m.getName()] = m.listPrimitives().reduce((s,p)=>s+p.getIndices().getCount()/3,0);
console.log(tri);
