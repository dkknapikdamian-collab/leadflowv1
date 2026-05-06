#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const stage = 'STAGE16_FINAL_QA_RELEASE_CANDIDATE_2026_05_06';

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}
function write(file, text) {
  const full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text, 'utf8');
}
function exists(file) {
  return fs.existsSync(path.join(ROOT, file));
}
function ensurePackageScripts() {
  const file = 'package.json';
  const pkg = JSON.parse(read(file).replace(/^\uFEFF/, ''));
  pkg.scripts = pkg.scripts || {};
  const add = {
    'test:route-smoke': 'node --test tests/route-smoke.test.cjs',
    'test:button-action-map': 'node --test tests/button-action-map.test.cjs',
    'check:button-action-map': 'node scripts/check-button-action-map.cjs',
    'check:assistant-operator-v1': 'node scripts/check-assistant-operator-v1.cjs',
    'check:plan-access-gating': 'node scripts/check-p0-plan-access-gating.cjs',
    'check:final-qa-release-candidate': 'node --test tests/route-smoke.test.cjs && node --test tests/button-action-map.test.cjs && node scripts/check-button-action-map.cjs',
    'audit:release-candidate': 'node scripts/print-release-evidence.cjs --write --out=docs/release/RELEASE_CANDIDATE_2026-05-06.md --checks=build,verify:closeflow:quiet,test:critical,check:polish-mojibake,check:ui-truth-copy,check:workspace-scope,check:plan-access-gating,check:assistant-operator-v1,check:pwa-safe-cache,test:route-smoke,test:button-action-map,check:button-action-map'
  };
  let changed = false;
  for (const [key, value] of Object.entries(add)) {
    if (pkg.scripts[key] !== value) {
      pkg.scripts[key] = value;
      changed = true;
    }
  }
  if (changed) write(file, `${JSON.stringify(pkg, null, 2)}\n`);
  return changed;
}

function ensureAppRouteAliases() {
  const file = 'src/App.tsx';
  if (!exists(file)) return false;
  let text = read(file);
  let changed = false;

  if (!text.includes('path="/today"')) {
    const needle = '<Route path="/" element={isLoggedIn ? <Today /> : <Navigate to="/login" />} />';
    const insert = `${needle}\n              <Route path="/today" element={isLoggedIn ? <Today /> : <Navigate to="/login" />} />`;
    if (text.includes(needle)) {
      text = text.replace(needle, insert);
      changed = true;
    }
  }

  if (!text.includes('path="/support"')) {
    const needle = '<Route path="/help" element={isLoggedIn ? <SupportCenter /> : <Navigate to="/login" />} />';
    const insert = `${needle}\n              <Route path="/support" element={isLoggedIn ? <SupportCenter /> : <Navigate to="/login" />} />`;
    if (text.includes(needle)) {
      text = text.replace(needle, insert);
      changed = true;
    }
  }

  if (!text.includes(stage)) {
    text += `\n/* ${stage}: /today and /support route aliases are release-candidate smoke routes. */\n`;
    changed = true;
  }

  if (changed) write(file, text);
  return changed;
}

function patchReleaseEvidenceScript() {
  const file = 'scripts/print-release-evidence.cjs';
  if (!exists(file)) return false;
  let text = read(file);
  let changed = false;
  const oldDefault = 'RELEASE_CANDIDATE_2026-05-02.md';
  const newDefault = 'RELEASE_CANDIDATE_2026-05-06.md';
  if (text.includes(oldDefault)) {
    text = text.replaceAll(oldDefault, newDefault);
    changed = true;
  }
  if (!text.includes(stage)) {
    text += `\n/* ${stage}: supports route smoke, button action map, env matrix and RC evidence output. */\n`;
    changed = true;
  }
  if (changed) write(file, text);
  return changed;
}

function main() {
  const touched = [];
  if (ensurePackageScripts()) touched.push('package.json');
  if (ensureAppRouteAliases()) touched.push('src/App.tsx');
  if (patchReleaseEvidenceScript()) touched.push('scripts/print-release-evidence.cjs');

  console.log('OK: Stage16 final QA release candidate repair completed.');
  console.log(`Touched files: ${touched.length}`);
  for (const file of touched) console.log(`- ${file}`);
}

main();
