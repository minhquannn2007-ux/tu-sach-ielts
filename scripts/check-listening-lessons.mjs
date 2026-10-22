import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const catalog = JSON.parse(readFileSync(path.join(root, 'listening-catalog.json')));
const ids = new Set();
let count = 0;
for (const item of catalog) {
  assert(!ids.has(item.id), `Duplicate Listening id ${item.id}`); ids.add(item.id);
  if (!item.url.startsWith('listening-practice.html?id=')) continue;
  assert.equal(item.url, `listening-practice.html?id=${item.id}`);
  const lesson = JSON.parse(readFileSync(path.join(root, 'listening-lessons', item.id + '.json')));
  assert.equal(lesson.id, item.id); assert.equal(lesson.title, item.title);
  assert.equal(lesson.part, item.part); assert.equal(item.count, 10);
  assert.equal(lesson.sourceReviewed, true); assert.equal(lesson.mapless, true);
  assert(lesson.duration > 60 && Number.isFinite(lesson.duration));
  assert(existsSync(path.join(root, lesson.audio)), `Missing audio ${item.id}`);
  assert(existsSync(path.join(root, item.image)), `Missing cover ${item.id}`);
  assert(!/map-task|map-canvas|<iframe|<script/i.test(lesson.html), `Invalid content ${item.id}`);
  const numbers = [...new Set([...lesson.html.matchAll(/data-q="(\d+)"/g)].map(m => +m[1]))].sort((a,b) => a-b);
  assert.deepEqual(numbers, Array.from({length:10}, (_,i) => (item.part-1)*10+i+1), `Question numbering ${item.id}`);
  count++;
}
console.log(`PASS ${count} reviewed mapless Listening lessons: numbering, catalog, audio and covers`);
