#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const checks = [];
function check(label, condition) {
  checks.push({ label, pass: Boolean(condition) });
}
function read(p) {
  return fs.readFileSync(path.join(root, p), 'utf8');
}
function exists(p) {
  return fs.existsSync(path.join(root, p));
}

const generatorPath = 'tools/stage215-generate-supabase-coverage-matrix.cjs';
const guardPath = 'scripts/check-stage215-supabase-coverage-matrix.cjs';
const reportPath = '_project/reports/STAGE215_SUPABASE_COVERAGE_MATRIX_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage215 Supabase coverage matrix.md';

check('Stage215 generator exists', exists(generatorPath));
check('Stage215 guard exists', exists(guardPath));
check('Stage215 report exists', exists(reportPath));
check('Stage215 Obsidian update exists', exists(obsidianPath));

if (exists(generatorPath)) {
  const src = read(generatorPath);
  check('generator scans api files', src.includes("listFiles('api')"));
  check('generator scans pages', src.includes("listFiles('src/pages')"));
  check('generator scans supabase-fallback', src.includes("src/lib/supabase-fallback.ts"));
  check('generator writes report and Obsidian update', src.includes('fs.writeFileSync') && src.includes('obsidianPath'));
  check('generator includes manual QA checklist', src.includes('manualQa') && src.includes('Manual QA checklist'));
  check('generator defines DONE for Supabase', src.includes('Definicja DONE dla Supabase'));
}

if (exists(reportPath)) {
  const report = read(reportPath);
  const requiredModules = [
    'Auth + workspace context',
    'Leads',
    'Clients',
    'Cases',
    'Tasks',
    'Events + Calendar',
    'Notifications',
    'Activities',
    'Payments + billing',
    'AI drafts + response templates',
    'Client portal + storage upload',
    'Support + settings',
  ];
  for (const moduleName of requiredModules) {
    check(`report includes module: ${moduleName}`, report.includes(moduleName));
  }
  check('report declares audit-only/no runtime code changes', report.includes('Nie naprawia kodu') || report.includes('audytem/macierza'));
  check('report says no SQL/RLS/GRANT', /SQL/.test(report) && /RLS/.test(report) && /GRANT/.test(report));
  check('report bans git add dot', report.includes('git add .'));
  check('report includes hard refresh routes', report.includes('/calendar') && report.includes('/notifications') && report.includes('/settings'));
  check('report includes status columns', report.includes('structural') && report.includes('QA'));
  check('report points to Stage216 next fixes', report.includes('Stage216-A') && report.includes('Stage216-B'));
}

if (exists(obsidianPath)) {
  const obsidian = read(obsidianPath);
  check('Obsidian update separates facts', obsidian.includes('## FAKTY'));
  check('Obsidian update separates decisions', obsidian.includes('## DECYZJE DAMIANA'));
  check('Obsidian update separates hypotheses', obsidian.includes('## HIPOTEZY AI'));
  check('Obsidian update mentions no SQL/RLS/GRANT', /SQL/.test(obsidian) && /RLS/.test(obsidian) && /GRANT/.test(obsidian));
  check('Obsidian update has next step', obsidian.includes('## NASTEPNY KROK') || obsidian.includes('## NASTĘPNY KROK'));
}

const failed = checks.filter((item) => !item.pass);
for (const item of checks) {
  console.log(`${item.pass ? 'PASS' : 'FAIL'} - ${item.label}`);
}
if (failed.length) {
  console.error(`\nFAIL: ${failed.length} Stage215 checks failed.`);
  process.exit(1);
}
console.log(`\nPASS: ${checks.length} Stage215 checks passed.`);
