#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const leadPath = path.join(repoRoot, 'src/pages/LeadDetail.tsx');
if (!fs.existsSync(leadPath)) {
  console.error('STAGE228B_LEAD_WORK_ACTION_CENTER_GUARD FAILED');
  console.error('- missing src/pages/LeadDetail.tsx');
  process.exit(1);
}

const source = fs.readFileSync(leadPath, 'utf8');
const requiredTokens = [
  'data-stage228b-lead-work-action-center="true"',
  'Co robimy teraz?',
  'data-stage228b-r14-lead-action-center-vst="true"',
  'Działania leada',
  'Najbliższe działania',
  'Braki i blokady',
  'Wszystkie aktywne',
  'Dodaj notatkę',
  'Dodaj zadanie',
  'Dodaj wydarzenie',
  'Dodaj brak',
  'Oznacz utracony',
  'Edytuj',
  'Jutro',
  'Zrobione',
  'Usuń',
  'activeLeadWorkEntries',
  'leadBlockerEntries',
  'handleCreateQuickTask',
  'handleCreateQuickEvent',
  "handleUpdateStatus('lost')",
  'openLinkedTaskEditor(entry.raw)',
  'openLinkedEventEditor(entry.raw)',
  'handleRescheduleLinkedTask(entry.raw, 24 * 60 * 60 * 1000, \'Jutro\')',
  'handleRescheduleLinkedEvent(entry.raw, 24 * 60 * 60 * 1000, \'Jutro\')',
  'handleToggleLinkedTask(entry.raw)',
  'handleToggleLinkedEvent(entry.raw)',
  'handleDeleteLinkedTask(entry.raw)',
  'handleDeleteLinkedEvent(entry.raw)',
];

const failures = requiredTokens.filter((token) => !source.includes(token));
if (source.includes('Działania leada: zadania, wydarzenia i braki w jednym miejscu.')) {
  failures.push('old duplicate lead action copy must be removed');
}
if (source.includes('return entry.isOverdue || title.includes')) {
  failures.push('overdue events must not be duplicated as blockers by default');
}
if (source.includes('â€˘') || source.includes('â€¢')) {
  failures.push('mojibake bullet must not be present in LeadDetail action rows');
}

const leadActionCenterIndex = source.indexOf('data-stage228b-lead-work-action-center="true"');
const notesIndex = source.indexOf('lead-detail-history-center lead-detail-notes-only-section');
if (leadActionCenterIndex === -1 || notesIndex === -1 || leadActionCenterIndex > notesIndex) {
  failures.push('Lead work action center must render before notes/history section in the main column');
}

const disallowed = [
  'data-stage228b-lead-work-action-center="true" data-stage228b-lead-work-action-center="true"',
  'href="#"',
];
for (const token of disallowed) {
  if (source.includes(token)) failures.push(`disallowed token present: ${token}`);
}

if (failures.length) {
  console.error('STAGE228B_LEAD_WORK_ACTION_CENTER_GUARD FAILED');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228B_LEAD_WORK_ACTION_CENTER',
  guard: 'check:stage228b-lead-work-action-center',
}, null, 2));
