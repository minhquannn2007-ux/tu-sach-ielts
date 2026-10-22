import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Small source chunks keep authenticated uploads bounded. Pages serves one
// continuous Ogg file per part, with the original encoded bytes preserved.
const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'import/listening/55484-audio');
const target = path.join(root, 'dist/assets/listening/55484');
mkdirSync(target, { recursive: true });
for (const part of [1, 3, 4]) {
  const names = readdirSync(source).filter(name => name.startsWith(`part${part}.ogg.`)).sort();
  if (!names.length || names.some((name, index) => name !== `part${part}.ogg.${String(index).padStart(3, '0')}`)) {
    throw new Error(`Missing or misordered audio chunks for Part ${part}`);
  }
  const audio = Buffer.concat(names.map(name => readFileSync(path.join(source, name))));
  if (audio.subarray(0, 4).toString() !== 'OggS') throw new Error(`Invalid Ogg Part ${part}`);
  writeFileSync(path.join(target, `part${part}.ogg`), audio);
  console.log(`Assembled Listening 55484 Part ${part}: ${audio.length} bytes`);
}
