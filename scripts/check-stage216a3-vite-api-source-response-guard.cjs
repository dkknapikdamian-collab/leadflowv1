#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const checks = [];
function exists(p) { return fs.existsSync(path.join(root, p)); }
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
function check(label, condition) { checks.push({ label, pass: Boolean(condition) }); }

const packagePath = 'package.json';
const probePath = 'tools/stage216a2-lcc-runtime-smoke.cjs';
const reportPath = '_project/reports/STAGE216A3_VITE_API_SOURCE_RESPONSE_GUARD_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-A3 Vite API source response guard.md';

check('package.json exists', exists(packagePath));
check('Stage216-A2 runtime probe exists', exists(probePath));
check('Stage216-A3 report exists', exists(reportPath));
check('Stage216-A3 Obsidian update exists', exists(obsidianPath));

if (exists(packagePath)) {
  const pkg = JSON.parse(read(packagePath));
  check('package.json has dev script', typeof pkg.scripts?.dev === 'string' && pkg.scripts.dev.includes('vite'));
  check('package.json has dev:ui script', typeof pkg.scripts?.['dev:ui'] === 'string' && pkg.scripts['dev:ui'].includes('vite'));
  check('package.json has dev:api script', typeof pkg.scripts?.['dev:api'] === 'string' && pkg.scripts['dev:api'].includes('vercel dev'));
  check('dev:api listens on port 3000', String(pkg.scripts?.['dev:api'] || '').includes('--listen 3000'));
}

if (exists(probePath)) {
  const src = read(probePath);
  check('probe has Stage216-A3 marker', src.includes('STAGE216_A3_VITE_API_SOURCE_RESPONSE_GUARD'));
  check('probe detects Vite API source response', src.includes('isLikelyViteApiSourceResponse'));
  check('probe reports VITE_DEV_API_SOURCE_RESPONSE', src.includes('VITE_DEV_API_SOURCE_RESPONSE'));
  check('probe hint points to dev:api', src.includes('npm run dev:api'));
  check('probe remains GET-only', src.includes("fetch(url, { method: 'GET', headers })"));
  check('probe still reports NON_JSON_RESPONSE fallback', src.includes('NON_JSON_RESPONSE'));
}

for (const p of [reportPath, obsidianPath]) {
  if (exists(p)) {
    const text = read(p);
    check(`${p} mentions Vite`, /Vite/i.test(text));
    check(`${p} mentions vercel dev`, /vercel dev/i.test(text));
    check(`${p} mentions dev:api`, /dev:api/.test(text));
    check(`${p} mentions no SQL/RLS/GRANT`, /no SQL\/RLS\/GRANT changes|SQL\/RLS\/GRANT/i.test(text));
    check(`${p} separates facts`, /FAKTY/i.test(text));
    check(`${p} separates decisions`, /DECYZJE/i.test(text));
    check(`${p} separates hypotheses`, /HIPOTEZY/i.test(text));
    check(`${p} has next step`, /NAST[EĘ]PNY KROK/i.test(text));
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'} - ${c.label}`);
if (failed.length) {
  console.error(`\nFAIL: ${failed.length} Stage216-A3 checks failed.`);
  process.exit(1);
}
console.log(`\nPASS: ${checks.length} Stage216-A3 checks passed.`);
