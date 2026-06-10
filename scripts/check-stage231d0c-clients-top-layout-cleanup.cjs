const fs = require('fs');
const path = require('path');
function read(file) { return fs.readFileSync(file, 'utf8'); }
function exists(file) { return fs.existsSync(file); }
function ch(...codes) { return String.fromCharCode(...codes); }
const badTokens = [
  ch(0x0102),
  ch(0x0139),
  ch(0x00c4),
  ch(0x00c5),
  ch(0x00c2),
  ch(0xfffd),
  ch(0x010f, 0x017c, 0x02dd),
  ch(0x00e2, 0x20ac)
];
const errors = [];
function fail(msg) { errors.push(msg); }
function toPosix(file) { return file.split(path.sep).join('/'); }
function assertNoMojibake(file, text) {
  for (const token of badTokens) {
    if (text.includes(token)) fail('Mojibake detected in ' + file);
  }
}
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git', 'coverage', '.next', 'build'].includes(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (/\.(tsx|jsx|ts|js)$/.test(full)) out.push(full);
  }
  return out;
}
function isPreviewStaticHtmlSource(file) {
  const rel = toPosix(file);
  return rel === 'src/pages/UiPreviewVNextFull.tsx' || rel === 'src/pages/UiPreviewVNext.tsx';
}

const clientsPath = 'src/pages/Clients.tsx';
const cssPath = 'src/styles/closeflow-record-list-source-truth.css';
const guardPath = 'scripts/check-stage231d0c-clients-top-layout-cleanup.cjs';
const runPath = '_project/runs/STAGE231D0C_CLIENTS_TOP_LAYOUT_CLEANUP_RUN_REPORT_2026-06-10.md';
const obsPath = '_project/OBSIDIAN_UPDATE_STAGE231D0C_CLIENTS_TOP_LAYOUT_CLEANUP.md';

const clients = read(clientsPath);
const css = read(cssPath);
const guard = read(guardPath);
const run = exists(runPath) ? read(runPath) : '';
const obs = exists(obsPath) ? read(obsPath) : '';
for (const [file, text] of [[clientsPath, clients], [cssPath, css], [guardPath, guard], [runPath, run], [obsPath, obs]]) assertNoMojibake(file, text);

for (const needle of ['clients-centered-rail-layout', 'data-stage231d0c-clients-centered-filters', 'clients-filters-centered-rail', 'data-stage231d0c-centered-filters']) {
  if (!clients.includes(needle)) fail('Clients.tsx missing marker: ' + needle);
}
for (const needle of ['STAGE231D0C CLIENTS TOP LAYOUT CLEANUP START', '[data-stage231d0c-trial-top-card="true"]', 'clients-centered-rail-layout', 'clients-filters-centered-rail', 'grid-template-columns: minmax(0, 1fr) clamp(260px, 22vw, 330px)']) {
  if (!css.includes(needle)) fail('CSS source truth missing: ' + needle);
}

const sourceFiles = walk('src');
const trialFiles = sourceFiles.filter((full) => {
  if (isPreviewStaticHtmlSource(full)) return false;
  const text = fs.readFileSync(full, 'utf8');
  return text.includes('Aktywuj plan') || text.includes('okres próbny') || text.includes('Twój trial') || text.includes('trial wygasł');
});
if (trialFiles.length && !trialFiles.some((full) => fs.readFileSync(full, 'utf8').includes('data-stage231d0c-trial-top-card="true"'))) {
  fail('Trial banner source found, but no data-stage231d0c-trial-top-card marker was added. Files: ' + trialFiles.map(toPosix).join(', '));
}

if (clients.includes('Leady:')) fail('Client card must not reintroduce Leady:');
if (clients.includes('Aktywna sprawa')) fail('Client card must not reintroduce Aktywna sprawa');
if (!clients.includes('Zarobione łącznie')) fail('Client card contract missing Zarobione łącznie');
if (!clients.includes('Aktywna prowizja') && !clients.includes('Prowizja aktywna')) fail('Client card contract missing active commission label');
if (!clients.includes('Sprawy:')) fail('Client card contract missing Sprawy:');

for (const preview of ['src/pages/UiPreviewVNextFull.tsx', 'src/pages/UiPreviewVNext.tsx']) {
  if (exists(preview)) {
    const text = read(preview);
    if (text.includes('data-stage231d0c-trial-top-card="true"')) {
      fail(preview + ' must not be patched inside a static HTML string by STAGE231D0C. Restore it from HEAD.');
    }
  }
}

if (errors.length) {
  console.error('STAGE231D0C clients top layout cleanup guard: FAIL');
  for (const e of errors) console.error('- ' + e);
  process.exit(1);
}
console.log('STAGE231D0C clients top layout cleanup guard: PASS');
