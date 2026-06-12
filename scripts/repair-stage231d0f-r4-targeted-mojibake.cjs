#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

const targetFiles = [
  'src/pages/SalesFunnel.tsx',
  'src/pages/CaseDetail.tsx',
  'src/styles/sales-funnel-stage231d0f-visual-alignment.css',
  '_project/UI_DICTIONARY_STAGE231D0A.md',
  '_project/runs/2026-06-12_STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR.md',
  '_project/obsidian_updates/2026-06-12_STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR.md',
];

const replacements = [
  ['Ă˘â‚¬â€ť', '—'],
  ['Ă˘â‚¬”', '—'],
  ['Ă˘â€ ’', '→'],
  ['Ă—', '×'],
  ['Ä…', 'ą'],
  ['Ä‡', 'ć'],
  ['Ä™', 'ę'],
  ['Ĺ‚', 'ł'],
  ['Ĺ„', 'ń'],
  ['Ăł', 'ó'],
  ['Ĺ›', 'ś'],
  ['Ĺş', 'ź'],
  ['Ĺź', 'ź'],
  ['Ĺº', 'ź'],
  ['ĹĽ', 'ż'],
  ['Å¼', 'ż'],
  ['Åº', 'ź'],
  ['Ä„', 'Ą'],
  ['Ä†', 'Ć'],
  ['Ä', 'Ę'],
  ['ÄĘ', 'Ę'],
  ['Ĺ', 'Ł'],
  ['ĹŁ', 'Ł'],
  ['Ĺ', 'Ń'],
  ['Ă“', 'Ó'],
  ['Ĺ»', 'Ż'],
  ['Å»', 'Ż'],
  ['ĹŹ', 'Ź'],
  ['Ĺą', 'Ź'],
  ['Â·', '·'],
  ['Â ', ' '],
  ['Â', ''],
  ['ďż˝', ''],
];

function repairText(text) {
  let current = text;
  let previous = null;
  let loops = 0;
  while (current !== previous && loops < 6) {
    previous = current;
    for (const [from, to] of replacements) {
      current = current.split(from).join(to);
    }
    loops += 1;
  }
  return current;
}

let changed = 0;

for (const rel of targetFiles) {
  const file = path.join(repoRoot, rel);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  const after = repairText(before);
  if (after !== before) {
    fs.writeFileSync(file, after.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n*$/u, '\n'), 'utf8');
    console.log(`[TARGETED-MOJIBAKE] repaired ${rel}`);
    changed += 1;
  }
}

console.log(`[TARGETED-MOJIBAKE] changed=${changed}`);
