import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { mergeDocuments, unpartition, prune, dedup } from '@gltf-transform/functions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const [out, ...ins] = process.argv.slice(2);
const doc = await io.read(ins[0]);
for (const f of ins.slice(1)) mergeDocuments(doc, await io.read(f));
const [s0, ...rest] = doc.getRoot().listScenes();
for (const s of rest) { for (const c of s.listChildren()) { s.removeChild(c); s0.addChild(c); } s.dispose(); }
doc.getRoot().setDefaultScene(s0);
await doc.transform(dedup(), unpartition(), prune());
await io.write(out, doc);
console.log(s0.listChildren().map(c => c.getName()));
