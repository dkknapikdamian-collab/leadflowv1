#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const GUARD = 'CLOSEFLOW_ADMIN_FEEDBACK_VISUAL_REPAIR_2026_05_08';

function listFiles(dir, predicate, out = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === '.vercel') continue;
    const full = path.join(abs, entry.name);
    if (entry.isDirectory()) listFiles(path.relative(ROOT, full), predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
}

function assert(condition, message) {
  if (!condition) {
    console.error(`CLOSEFLOW_ADMIN_FEEDBACK_VISUAL_REPAIR_FAIL: ${message}`);
    process.exit(1);
  }
}

const cssFiles = listFiles('src', file => file.endsWith('.css'));
const guardFiles = cssFiles.filter(file => fs.readFileSync(file, 'utf8').includes(GUARD));
assert(guardFiles.length > 0, `missing ${GUARD} CSS guard in src CSS files`);

const css = guardFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');
const requiredSnippets = [
  'case-detail-create-action-card',
  'data-case-create-actions-panel',
  'calendar-week-filter',
  'calendar-entry-card',
  'calendar-week-plan',
  'text-slate-400',
  'text-slate-600',
  'background: linear-gradient',
  'color: #334155',
];
for (const snippet of requiredSnippets) {
  assert(css.includes(snippet), `missing CSS snippet: ${snippet}`);
}

const packageJsonPath = path.join(ROOT, 'package.json');
assert(fs.existsSync(packageJsonPath), 'missing package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
assert(pkg.scripts && pkg.scripts['check:closeflow-admin-feedback-visual-repair'], 'missing package.json check script');

console.log('CLOSEFLOW_ADMIN_FEEDBACK_VISUAL_REPAIR_OK');
console.log(`guard_files=${guardFiles.map(file => path.relative(ROOT, file).replace(/\\/g, '/')).join(',')}`);
