#!/usr/bin/env node
/*
 * Stage213B - Supabase Query Budget Audit guard.
 * This is an audit guard, not a production optimization patch.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT = '_project/reports/STAGE213B_SUPABASE_QUERY_BUDGET_AUDIT_2026-05-31.md';
const OBSIDIAN = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage213B Supabase query budget audit.md';
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.next', '_local_backups', 'backups']);
const EXCLUDED_PARTS = ['_project/backups', '_local_backups'];
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const REQUIRED_REPORT_MARKERS = [
  'Stage213B - Supabase Query Budget Audit',
  'Mapa zapytań i ryzyka',
  'Najwięksi winowajcy limitów',
  'Decyzja: pierwsze 3 miejsca do optymalizacji w Stage213C',
  'src/pages/Calendar.tsx',
  'src/pages/NotificationsCenter.tsx',
  'src/pages/TodayStable.tsx',
  'src/lib/supabase-fallback.ts',
];
const REQUIRED_OBSIDIAN_MARKERS = [
  'CloseFlow Stage213B Supabase query budget audit',
  'FAKTY',
  'HIPOTEZY AI',
  'NASTĘPNY KROK',
];

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const relative = rel(full);
    if (EXCLUDED_PARTS.some((part) => relative.includes(part))) continue;
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      walk(full, out);
      continue;
    }
    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function fail(message, details = []) {
  console.error('FAIL - ' + message);
  for (const detail of details) console.error('  - ' + detail);
  process.exitCode = 1;
}

function pass(message) {
  console.log('PASS - ' + message);
}

function warn(message, details = []) {
  console.log('WARN - ' + message);
  for (const detail of details) console.log('  - ' + detail);
}

if (!exists(REPORT)) fail('Brak raportu Stage213B', [REPORT]);
else pass('Raport Stage213B istnieje');

if (!exists(OBSIDIAN)) fail('Brak aktualizacji Obsidiana Stage213B', [OBSIDIAN]);
else pass('Aktualizacja Obsidiana Stage213B istnieje');

const reportText = exists(REPORT) ? read(REPORT) : '';
const obsidianText = exists(OBSIDIAN) ? read(OBSIDIAN) : '';

const missingReportMarkers = REQUIRED_REPORT_MARKERS.filter((marker) => !reportText.includes(marker));
if (missingReportMarkers.length) fail('Raport Stage213B nie zawiera wymaganych markerów', missingReportMarkers);
else pass('Raport zawiera wymagane sekcje i top ryzyka');

const missingObsidianMarkers = REQUIRED_OBSIDIAN_MARKERS.filter((marker) => !obsidianText.includes(marker));
if (missingObsidianMarkers.length) fail('Update Obsidiana nie zawiera wymaganych markerów', missingObsidianMarkers);
else pass('Update Obsidiana zawiera wymagane sekcje');

const sourceFiles = [
  ...walk(path.join(ROOT, 'src')),
  ...walk(path.join(ROOT, 'api')),
  ...walk(path.join(ROOT, 'scripts')),
].filter((file, index, all) => all.indexOf(file) === index);

const findings = [];
const supabaseTerms = /supabase|fetchCalendarBundleFromSupabase|fetchTasksFromSupabase|fetchEventsFromSupabase|fetchLeadsFromSupabase|fetchCasesFromSupabase|fetchClientsFromSupabase|refreshSupabaseBundle/i;

for (const file of sourceFiles) {
  const relative = rel(file);
  const text = fs.readFileSync(file, 'utf8');

  const hasSupabaseTerm = supabaseTerms.test(text);
  const intervalMatches = [...text.matchAll(/setInterval\s*\(/g)];
  if (intervalMatches.length && hasSupabaseTerm) {
    findings.push({ type: 'supabase-interval', file: relative, count: intervalMatches.length });
  }

  const selectStarMatches = [...text.matchAll(/\.select\s*\(\s*['"`]\*['"`]\s*\)/g)];
  if (selectStarMatches.length && /^(src|api)\//.test(relative)) {
    findings.push({ type: 'select-star', file: relative, count: selectStarMatches.length });
  }

  if (/^src\/pages\/.+\.(tsx|jsx)$/.test(relative)) {
    const refreshMatches = [...text.matchAll(/refreshSupabaseBundle/g)];
    if (refreshMatches.length > 1) {
      findings.push({ type: 'multi-refreshSupabaseBundle', file: relative, count: refreshMatches.length });
    }
  }
}

if (!findings.length) {
  pass('Nie wykryto bieżących wzorców wysokiego ryzyka');
} else {
  warn('Wykryto wzorce audytowe Stage213B', findings.map((item) => `${item.type}: ${item.file} (${item.count})`));
  const undocumented = findings.filter((item) => !reportText.includes(item.file));
  if (undocumented.length) {
    fail('Raport nie dokumentuje wszystkich wykrytych ryzyk', undocumented.map((item) => `${item.type}: ${item.file}`));
  } else {
    pass('Wszystkie wykryte wzorce ryzyka są ujęte w raporcie');
  }
}

if (!/git add \./.test(reportText + obsidianText)) pass('Raport/update nie sugerują git add .');
else fail('Raport/update zawierają zakazane git add .');

if (process.exitCode) {
  console.error('\nWERDYKT: FAIL - Stage213B audit guard wymaga poprawy.');
  process.exit(process.exitCode);
}

console.log('\nWERDYKT: PASS - Stage213B query budget audit jest opisany i pilnowany guardem.');
