import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const files = [
  'components/footer.tsx',
  'components/navigation.tsx',
  'app/admin/properties/page.tsx',
];

// Each entry: [bad bytes as Buffer, correct UTF-8 string]
const fixes = [
  // e2 82 ac e2 80 9c = €" → " (left double quote U+201C)
  [Buffer.from([0xE2, 0x82, 0xAC, 0xE2, 0x80, 0x9C]), '\u201C'],
  // e2 82 ac e2 80 9d = €" → " (right double quote U+201D)
  [Buffer.from([0xE2, 0x82, 0xAC, 0xE2, 0x80, 0x9D]), '\u201D'],
  // e2 82 ac e2 80 a6 = €… → … (ellipsis U+2026)
  [Buffer.from([0xE2, 0x82, 0xAC, 0xE2, 0x80, 0xA6]), '\u2026'],
  // e2 82 b9 = ₹ — already correct rupee, keep
  // e2 82 ac alone = € — check context; in "â€" it's part of em-dash
  // e2 80 94 = — (em-dash, already valid UTF-8, keep)
  // e2 80 93 = – (en-dash, already valid UTF-8, keep)
  // e2 86 97 = ↗ (already valid UTF-8, keep)
  // c3 a2 = Ã¢ — this is the start of triple-encoded sequences
  // c3 a2 c2 80 c2 9c = Ã¢â‚¬Å" → " (left double quote)
  [Buffer.from([0xC3, 0xA2, 0xC2, 0x80, 0x9C]), '\u201C'],
  [Buffer.from([0xC3, 0xA2, 0xC2, 0x80, 0x9D]), '\u201D'],
  [Buffer.from([0xC3, 0xA2, 0xC2, 0x80, 0x94]), '\u2014'],
  [Buffer.from([0xC3, 0xA2, 0xC2, 0x80, 0x93]), '\u2013'],
  [Buffer.from([0xC3, 0xA2, 0xC2, 0x80, 0xA6]), '\u2026'],
  // c2 b0 = ° (degree, already valid, keep)
];

// Byte-level replace
function replaceBytes(buf, search, replaceStr) {
  const replaceBytes = Buffer.from(replaceStr, 'utf8');
  const parts = [];
  let i = 0;
  while (i < buf.length) {
    if (i + search.length <= buf.length && buf.slice(i, i + search.length).equals(search)) {
      parts.push(replaceBytes);
      i += search.length;
    } else {
      parts.push(buf.slice(i, i + 1));
      i++;
    }
  }
  return Buffer.concat(parts);
}

for (const rel of files) {
  const path = join(root, rel);
  let buf = readFileSync(path);
  let totalFixed = 0;

  for (const [badBytes, goodStr] of fixes) {
    const before = buf.length;
    let prev;
    do {
      prev = buf;
      buf = replaceBytes(buf, badBytes, goodStr);
    } while (!buf.equals(prev));
    if (buf.length !== before) totalFixed++;
  }

  writeFileSync(path, buf);
  console.log(`${rel}: done (${totalFixed} pattern(s) replaced)`);
}
