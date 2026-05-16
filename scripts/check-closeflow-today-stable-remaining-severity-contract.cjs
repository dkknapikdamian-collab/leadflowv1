#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const fail = (message) => { console.error('[TodayStable Stage14 contract] ' + message); process.exit(1); };
const assert = (condition, message) => { if (!condition) fail(message); };

const todayPath = 'src/pages/TodayStable.tsx';
const docPath = 'docs/ui/CLOSEFLOW_TODAY_STABLE_REMAINING_SEVERITY_STAGE14_2026-05-08.md';
const packagePath = 'package.json';
const previousScripts = [
  'check:closeflow-leads-tasks-status-contract',
  'check:closeflow-calendar-activity-severity-contract',
  'check:closeflow-notifications-severity-contract',
  'check:closeflow-today-stable-severity-contract',
  'check:closeflow-alert-severity-contract',
  'check:closeflow-ui-contract-audit-stage8',
  'check:closeflow-danger-style-contract',
];

assert(exists(todayPath), 'Brakuje TodayStable.tsx');
assert(exists(docPath), 'Brakuje dokumentu Stage14');
assert(exists(packagePath), 'Brakuje package.json');

const today = read(todayPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));

assert(!/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(today), 'TodayStable zawiera control chars');
assert(!/(?:B\u0139|Cykliczno\u0139|\u017A|\u015F|\u0142|\u0144|\u0105|\u0119|\u017C|\u017A|\u0142|\u0144|\u00c2|\u00c3|\ufffd)/.test(today + '\n' + doc), 'Wykryto mojibake w Stage14');
assert(!/today-(?:severity|status)-(?:fix|v2|repair)|today-repair|today-severity-fix|today-status-v2/i.test(today), 'Wykryto lokaln\u0105 klas\u0119 fix/v2/repair');
assert(today.includes('TODAY_STABLE_STAGE14_REMAINING_SEVERITY'), 'Brakuje markera Stage14 w TodayStable');
assert(today.includes('cf-severity-dot') || today.includes('cf-severity-panel') || today.includes('cf-severity-pill') || today.includes('cf-alert') || today.includes('cf-severity-text-warning') || today.includes('cf-severity-text-error'), 'TodayStable nie u\u017Cywa kontraktu cf-severity/cf-alert');
assert(today.includes('cf-status-pill') || today.includes('cf-progress-pill'), 'TodayStable nie u\u017Cywa kontraktu cf-status/cf-progress');
assert(today.includes('<SectionHeaderIcon tone={tone} icon={icon} />'), 'SectionHeader nie u\u017Cywa SectionHeaderIcon z tone oraz icon');

const sectionHeaderIconMatch = today.match(/function\s+SectionHeaderIcon\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
assert(sectionHeaderIconMatch, 'Nie znaleziono funkcji SectionHeaderIcon');
assert(!/<SectionHeaderIcon\b/.test(sectionHeaderIconMatch[1]), 'SectionHeaderIcon wywo\u0142uje samego siebie');

const rawTokens = today.match(/\b(?:(?:hover|focus|active):)?(?:bg|text|border|ring|from|via|to)-(red|rose|amber)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g) || [];
const exceptionLines = doc.match(/^\| .*\| legacy-exception \|/gm) || [];
assert(rawTokens.length === 0 || exceptionLines.length > 0, 'Pozosta\u0142y lokalne red/rose/amber klasy bez udokumentowanego wyj\u0105tku');

const scriptValue = pkg.scripts && pkg.scripts['check:closeflow-today-stable-remaining-severity-contract'];
assert(scriptValue === 'node scripts/check-closeflow-today-stable-remaining-severity-contract.cjs', 'Brakuje komendy package.json dla Stage14');
for (const name of previousScripts) {
  assert(pkg.scripts && pkg.scripts[name], 'Wcze\u015Bniejszy kontrakt nie istnieje w package.json: ' + name);
}

assert(doc.includes('Today.tsx jest poza zakresem') || doc.includes('Today.tsx pozostaje poza zakresem'), 'Dokument nie potwierdza wy\u0142\u0105czenia starego Today.tsx');
assert(doc.includes('Etap 15'), 'Dokument nie opisuje, co zostaje na Etap 15');

console.log('[TodayStable Stage14 contract] OK');
