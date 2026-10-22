import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Small source chunks keep authenticated uploads bounded. Pages serves one
// continuous Ogg file per part, with the original encoded bytes preserved.
const root = fileURLToPath(new URL('../', import.meta.url));
const folders = readdirSync(path.join(root, 'import/listening')).filter(name => /^[a-zA-Z0-9-]+-audio$/.test(name));
for (const folder of folders) {
const set = folder.slice(0, -6);
const source = path.join(root, 'import/listening', folder);
const target = path.join(root, 'dist/assets/listening', set);
mkdirSync(target, { recursive: true });
const parts = [...new Set(readdirSync(source).map(name => /^part([1-4])\.ogg\.\d{3}$/.exec(name)?.[1]).filter(Boolean))];
for (const part of parts) {
  const names = readdirSync(source).filter(name => name.startsWith(`part${part}.ogg.`)).sort();
  if (!names.length || names.some((name, index) => name !== `part${part}.ogg.${String(index).padStart(3, '0')}`)) {
    throw new Error(`Missing or misordered audio chunks for Part ${part}`);
  }
  const audio = Buffer.concat(names.map(name => readFileSync(path.join(source, name))));
  if (audio.subarray(0, 4).toString() !== 'OggS') throw new Error(`Invalid Ogg Part ${part}`);
  writeFileSync(path.join(target, `part${part}.ogg`), audio);
  console.log(`Assembled Listening ${set} Part ${part}: ${audio.length} bytes`);
}
}
