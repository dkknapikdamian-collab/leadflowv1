#!/usr/bin/env node
const fs = require('fs');

const STAGE = 'CLOSEFLOW_STAGE14H_CALENDAR_WEEK_NEAREST7_DEDUPE_2026_05_12';

if (process.argv.includes('--syntax-only')) {
  new Function('return true;');
  process.exit(0);
}

function fail(message) {
  throw new Error(message);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function passIfIncludes(source, needle, label) {
  if (!source.includes(needle)) fail(`Missing: ${label} (${needle})`);
}

function failIfRegex(source, regex, label) {
  if (regex.test(source)) fail(`Forbidden pattern: ${label} (${regex})`);
}

const calendar = read('src/pages/Calendar.tsx');
const pkg = read('package.json');

passIfIncludes(calendar, STAGE, 'Stage14H marker in Calendar');
passIfIncludes(pkg, '"check:stage14h-calendar-week-nearest7-dedupe"', 'package.json check script');

// The removed duplicate is the old compact text list under "Najblizsze 7 dni", especially with "Przyszly tydzien".
failIfRegex(calendar, /Przysz(?:ł|l)y\s+tydzie(?:ń|n)/i, 'legacy next-week row in duplicated nearest-7 summary');

// Guard against the old simple summary pattern if it returns literally in render.
failIfRegex(calendar, /Dzisiaj\s*(?:·|-)\s*\{?\s*formatCalendarItemCount/i, 'literal compact day/count duplicate row');
failIfRegex(calendar, /getCalendarDayNavLabel[\s\S]{0,900}(?:·|&middot;)[\s\S]{0,900}formatCalendarItemCount[\s\S]{0,900}Przysz/i, 'generated compact weekly duplicate summary with next week');

// The readable main nearest-7 panel should remain.
if (!/Najbli(?:ż|z)sze\s+7\s+dni/i.test(calendar)) {
  fail('Nearest 7 days panel header is missing. Stage14H must remove only duplicate lower list, not the whole panel.');
}

console.log('✔ Stage14H Calendar nearest-7 duplicate guard passed');
