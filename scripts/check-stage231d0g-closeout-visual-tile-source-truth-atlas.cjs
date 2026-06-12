#!/usr/bin/env node
const fs = require('fs');

const failures = [];
const marker = 'STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS_2026_06_12';

function read(path, optional = false) {
  if (!fs.existsSync(path)) {
    if (!optional) failures.push(`missing file: ${path}`);
    return '';
  }
  return fs.readFileSync(path, 'utf8');
}

function block(text, markerName) {
  const start = `<!-- ${markerName}_START -->`;
  const end = `<!-- ${markerName}_END -->`;
  const startIndex = text.indexOf(start);
  if (startIndex < 0) return '';
  const endIndex = text.indexOf(end, startIndex);
  if (endIndex < 0) return text.slice(startIndex);
  return text.slice(startIndex, endIndex + end.length);
}

function must(text, token, label = token) {
  if (!text.includes(token)) failures.push(`missing ${label}: ${token}`);
}

function mustNot(text, token, label = token) {
  if (text.includes(token)) failures.push(`forbidden ${label}: ${token}`);
}

const runFull = read('_project/runs/2026-06-12_STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS.md');
const guardsFull = read('_project/06_GUARDS_AND_TESTS.md');
const nextFull = read('_project/07_NEXT_STEPS.md');
const changelogFull = read('_project/08_CHANGELOG_AI.md');
const risksFull = read('_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md');
const historyFull = read('_project/13_TEST_HISTORY.md');
const obsidianFull = read('_project/obsidian_updates/2026-06-12_STAGE231D0G_CLOSEOUT_VISUAL_TILE_SOURCE_TRUTH_ATLAS.md');

const runBlock = block(runFull, marker);
const guardsBlock = block(guardsFull, marker);
const nextBlock = block(nextFull, marker);
const changelogBlock = block(changelogFull, marker);
const risksBlock = block(risksFull, marker);
const historyBlock = block(historyFull, marker);
const obsidianText = obsidianFull;

const activeScope = [
  runBlock,
  guardsBlock,
  nextBlock,
  changelogBlock,
  risksBlock,
  historyBlock,
  obsidianText,
].join('\n');

for (const [label, text] of [
  ['run closeout block', runBlock],
  ['guards closeout block', guardsBlock],
  ['next closeout block', nextBlock],
  ['changelog closeout block', changelogBlock],
  ['risks closeout block', risksBlock],
  ['history closeout block', historyBlock],
  ['obsidian closeout payload', obsidianText],
]) {
  if (!text.trim()) failures.push(`missing active ${label}`);
}

must(runFull, 'Status:\nPASS / CLOSED', 'run report PASS / CLOSED status');
mustNot(runFull, 'Status:\nREADY_TO_APPLY', 'old READY_TO_APPLY status in D0G run report');

for (const token of [
  marker,
  'PASS / CLOSED',
  'node scripts/check-stage231d0g-visual-tile-source-truth-atlas.cjs',
  'node --test tests/stage231d0g-visual-tile-source-truth-atlas.test.cjs',
  'node scripts/check-stage231d0f-r13-funnel-visual-color-density.cjs',
  'node --test tests/stage231d0f-r13-funnel-visual-color-density.test.cjs',
  'npm run build',
  'git diff --check',
  'STAGE231D0H-1',
  'CloseFlowMetricTileV2',
]) {
  must(activeScope, token);
}

// Scope creep/mojibake check only active closeout blocks.
// Do not scan full historical central files; they intentionally contain old entries and old mojibake.
for (const token of ['CREATE TABLE', 'DROP TABLE', 'TRUNCATE TABLE', 'onDrag', 'onDrop', 'draggable=', 'KanbanBoard', 'data-kanban']) {
  mustNot(activeScope, token, `scope creep ${token}`);
}

for (const token of ['Ă', 'Ĺ', 'Ä', 'Å', 'Â', '�', 'ďż˝', 'â€ž', 'â€ť']) {
  mustNot(activeScope, token, `mojibake in D0G closeout active scope ${token}`);
}

if (failures.length) {
  console.error('STAGE231D0G-CLOSEOUT R2 guard scope repair: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0G-CLOSEOUT R2 guard scope repair: PASS');
