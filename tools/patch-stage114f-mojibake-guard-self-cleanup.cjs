const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const codepoints = [0x0139, 0x00c4, 0x0102, 0x00c2, 0x00e2, 0xfffd];
const replacements = new Map(codepoints.map((code) => [String.fromCodePoint(code), 'U+' + code.toString(16).toUpperCase().padStart(4, '0')]));

function file(relativePath) {
  return path.join(root, relativePath);
}

function readIfExists(relativePath) {
  const full = file(relativePath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

function write(relativePath, text) {
  const full = file(relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text, 'utf8');
}

function sanitizeKnownFile(relativePath) {
  const current = readIfExists(relativePath);
  if (current === null) return false;
  let next = current;
  for (const [bad, replacement] of replacements.entries()) {
    next = next.split(bad).join(replacement);
  }
  if (next !== current) {
    write(relativePath, next);
    console.log('Stage114F sanitized forbidden codepoint examples in ' + relativePath);
    return true;
  }
  return false;
}

const stage114Check = `const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targets = [
  'src/pages/Calendar.tsx',
  'src/styles/visual-stage22-event-form-vnext.css',
  'tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs',
  'tests/stage114-calendar-shift-persistence-contract.test.cjs',
  'tests/stage114-calendar-modal-viewport-contract.test.cjs',
  'tests/stage116-dialog-description-accessibility-contract.test.cjs',
];
const forbiddenCodepoints = [0x0139, 0x00c4, 0x0102, 0x00c2, 0x00e2, 0xfffd];
const forbidden = new Set(forbiddenCodepoints);

function near(text, index) {
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + 90);
  return text.slice(start, end).replace(/\\r/g, '\\\\r').replace(/\\n/g, '\\\\n');
}

const hits = [];
for (const relative of targets) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  for (let i = 0; i < text.length; i += 1) {
    const code = text.codePointAt(i);
    if (code > 0xffff) i += 1;
    if (forbidden.has(code)) {
      hits.push(relative + ': U+' + code.toString(16).toUpperCase().padStart(4, '0') + ' near "' + near(text, i) + '"');
    }
  }
}

if (hits.length) {
  console.error('Stage114 Calendar mojibake guard failed:');
  for (const hit of hits) console.error('- ' + hit);
  process.exit(1);
}

console.log('OK Stage114 Calendar mojibake guard passed');
`;

write('scripts/check-stage114-calendar-mojibake.cjs', stage114Check);
console.log('Stage114F rewrote scripts/check-stage114-calendar-mojibake.cjs without literal forbidden glyphs.');

sanitizeKnownFile('_project/runs/2026-05-18_stage114e_calendar_p0_batch_local_only.md');
sanitizeKnownFile('_project/runs/2026-05-18_stage114f_mojibake_guard_self_cleanup_local_only.md');

const stage98Targets = [
  'scripts/check-stage114-calendar-mojibake.cjs',
  '_project/runs/2026-05-18_stage114e_calendar_p0_batch_local_only.md',
  '_project/runs/2026-05-18_stage114f_mojibake_guard_self_cleanup_local_only.md',
];
const remaining = [];
for (const relative of stage98Targets) {
  const text = readIfExists(relative);
  if (text === null) continue;
  for (let i = 0; i < text.length; i += 1) {
    const code = text.codePointAt(i);
    if (code > 0xffff) i += 1;
    if (codepoints.includes(code)) {
      remaining.push(relative + ': U+' + code.toString(16).toUpperCase().padStart(4, '0'));
    }
  }
}
if (remaining.length) {
  throw new Error('Stage114F still has forbidden codepoints in generated files: ' + remaining.join('; '));
}

console.log('Stage114F generated files are Stage98-safe.');
