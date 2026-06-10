const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function ch(...codes) {
  return String.fromCharCode(...codes);
}

const badTokens = [
  ch(0x0102),
  ch(0x0139),
  ch(0x00c4),
  ch(0x00c5),
  ch(0x00c2),
  ch(0xfffd),
  ch(0x010f, 0x017c, 0x02dd),
  ch(0x00e2, 0x20ac),
];

const errors = [];
function fail(message) { errors.push(message); }
function hasAny(text, needles) { return needles.some((needle) => text.includes(needle)); }

function blockMojibake(file, text) {
  for (const token of badTokens) {
    if (text.includes(token)) {
      fail('Mojibake detected in ' + file + ' token=' + Array.from(token).map((c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join('+'));
      return;
    }
  }
}

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : '';
}

const clients = read('src/pages/Clients.tsx');
const css = read('src/styles/closeflow-record-list-source-truth.css');
const guard = read('scripts/check-stage231d0b-client-list-card-freeze.cjs');
const dictionary = readIfExists('_project/UI_DICTIONARY_STAGE231D0A.md');
const runReport = readIfExists('_project/runs/STAGE231D0B_CLIENT_LIST_CARD_VISUAL_FREEZE_RUN_REPORT_2026-06-10.md');
const obsidianUpdate = readIfExists('_project/OBSIDIAN_UPDATE_STAGE231D0B_CLIENT_LIST_CARD_VISUAL_FREEZE.md');
const r8Run = readIfExists('_project/runs/STAGE231D0B_R8_MASS_ENCODING_RESCUE_RUN_REPORT_2026-06-10.md');
const r8Obsidian = readIfExists('_project/OBSIDIAN_UPDATE_STAGE231D0B_R8_MASS_ENCODING_RESCUE.md');

for (const [file, text] of [
  ['src/pages/Clients.tsx', clients],
  ['src/styles/closeflow-record-list-source-truth.css', css],
  ['scripts/check-stage231d0b-client-list-card-freeze.cjs', guard],
  ['_project/UI_DICTIONARY_STAGE231D0A.md', dictionary],
  ['_project/runs/STAGE231D0B_CLIENT_LIST_CARD_VISUAL_FREEZE_RUN_REPORT_2026-06-10.md', runReport],
  ['_project/OBSIDIAN_UPDATE_STAGE231D0B_CLIENT_LIST_CARD_VISUAL_FREEZE.md', obsidianUpdate],
  ['_project/runs/STAGE231D0B_R8_MASS_ENCODING_RESCUE_RUN_REPORT_2026-06-10.md', r8Run],
  ['_project/OBSIDIAN_UPDATE_STAGE231D0B_R8_MASS_ENCODING_RESCUE.md', r8Obsidian],
]) {
  blockMojibake(file, text);
}

if (clients.includes('Leady:')) fail('ClientListCard must not render Leady:');
if (clients.includes('Aktywna sprawa')) fail('ClientListCard must not render Aktywna sprawa');
if (clients.includes('Najbliższa akcja:')) fail('ClientListCard must render clean nearestActionLabel without Najbliższa akcja: prefix');
if (!clients.includes('Sprawy:')) fail('ClientListCard must render Sprawy:');
if (!hasAny(clients, ['Aktywna prowizja', 'Prowizja aktywna'])) fail('ClientListCard must render Aktywna prowizja or Prowizja aktywna');
if (!clients.includes('Zarobione łącznie')) fail('ClientListCard must render Zarobione łącznie');
if (!clients.includes('data-client-list-phone') && !clients.includes('client-list-card-phone')) fail('ClientListCard phone must have its own slot/class/marker');
if (!clients.includes('data-client-list-email') && !clients.includes('client-list-card-email')) fail('ClientListCard email must have its own slot/class/marker');
if (!clients.includes('client-list-card-row-primary')) fail('ClientListCard must have primary 2-line row marker');
if (!clients.includes('client-list-card-row-secondary')) fail('ClientListCard must have secondary 2-line row marker');
if (!clients.includes('closeflow-record-list-source-truth.css')) fail('Clients page must use closeflow-record-list-source-truth.css source of truth');

for (const selector of ['client-list-card-row-primary', 'client-list-card-row-secondary', 'client-list-card-phone', 'client-list-card-earned']) {
  if (!css.includes(selector)) fail('CSS source truth missing selector: ' + selector);
}

if (!dictionary.includes('ClientListCard')) fail('UI Dictionary must include ClientListCard');
if (!dictionary.includes('client-relationship-row-2line')) fail('UI Dictionary must include client-relationship-row-2line variant');
if (!dictionary.includes('Zarobione łącznie')) fail('UI Dictionary must include Zarobione łącznie');
if (!dictionary.includes('Aktywna prowizja')) fail('UI Dictionary must include Aktywna prowizja');
if (!obsidianUpdate.includes('Źródła finansowe')) fail('Obsidian update must include clean Źródła finansowe heading');

if (errors.length) {
  console.error('STAGE231D0B client list card freeze guard: FAIL');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('STAGE231D0B client list card freeze guard: PASS');
