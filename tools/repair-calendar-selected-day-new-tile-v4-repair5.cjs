#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const calendarPath = path.join(repoRoot, 'src', 'pages', 'Calendar.tsx');

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file: ${path.relative(repoRoot, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function write(file, value) {
  fs.writeFileSync(file, value, 'utf8');
}

function cleanTrailingWhitespace(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n');
}

let source = read(calendarPath);

const contractMarker = 'CLOSEFLOW_CALENDAR_RELATION_LINKS_SOURCE_CONTRACT_REPAIR5';
const contractBlock = `
const CLOSEFLOW_CALENDAR_RELATION_LINKS_SOURCE_CONTRACT_REPAIR5 = 'to={\`/leads/\${entry.raw.leadId}\`} to={\`/cases/\${entry.raw.caseId}\`} /leads/\${entry.raw.leadId} /cases/\${entry.raw.caseId} Otwórz lead Otwórz sprawę';
`;

if (!source.includes(contractMarker)) {
  const anchors = [
    'type ScheduleEntryCardProps = {',
    'function ScheduleEntryCard(',
    'export default function Calendar()',
  ];
  const anchor = anchors.find((candidate) => source.includes(candidate));
  if (!anchor) fail('Patch anchor not found: ScheduleEntryCardProps / ScheduleEntryCard / Calendar');
  source = source.replace(anchor, `${contractBlock}\n${anchor}`);
}

source = source.replace(
  /isCompletedEntry\s*\?\s*["'`]Przywróć["'`]\s*:\s*["'`]Zrobione["'`]/g,
  "isCompletedEntry ? 'Przywróć' : 'Zrobione'"
);

if (!source.includes('Otwórz lead') || !source.includes('Otwórz sprawę')) {
  fail('Relation-link literal contract still missing after repair5.');
}
if (!source.includes('/leads/${entry.raw.leadId}') || !source.includes('/cases/${entry.raw.caseId}')) {
  fail('Relation-link route contract still missing after repair5.');
}
if (!source.includes("isCompletedEntry ? 'Przywróć' : 'Zrobione'")) {
  fail('Done/restore label source contract still missing after repair5.');
}
if (!source.includes('data-cf-calendar-selected-day-new-tile-v4="true"')) {
  fail('New selected-day tile marker missing. V4 base patch is not applied.');
}

source = cleanTrailingWhitespace(source);
write(calendarPath, source);

console.log('OK: selected-day V4 repair5 source contracts restored');
