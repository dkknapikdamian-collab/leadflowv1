#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const root = process.cwd();
const todayPath = path.join(root, 'src/pages/TodayStable.tsx');
const cssPath = path.join(root, 'src/styles/closeflow-canvas-runtime-source-truth-stage211j.css');
const today = fs.readFileSync(todayPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const checks = [];
function check(name, condition) {
  checks.push({ name, ok: Boolean(condition) });
}

function changedFiles() {
  try {
    return execSync('git diff --name-only --cached HEAD && git diff --name-only HEAD', { cwd: root, encoding: 'utf8' })
      .split(/\r?\n/)
      .map((line) => line.trim().replace(/\\/g, '/'))
      .filter(Boolean);
  } catch {
    return [];
  }
}

const files = changedFiles();

check('stage marker exists', today.includes('STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH') && css.includes('STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH'));
check('Today sections have one source array', /const\s+todaySectionCards:\s*Array<\{\s*key:\s*TodaySectionKey;\s*node:\s*ReactNode\s*\}>/.test(today));
check('visible sections render through one map', /visibleSectionCards\s*=\s*todaySectionCards\.filter/.test(today) && /visibleSectionCards\.map\(\(\{\s*key,\s*node\s*\}\)/.test(today));
check('all Today section keys are represented once', ['no_action', 'risk', 'waiting', 'leads', 'tasks', 'events', 'drafts', 'upcoming'].every((key) => new RegExp(`key:\\s*['"]${key}['"]`).test(today)));
check('no visible helper copy starts with Ruch', !today.includes('Ruch:'));
check('old split section layouts removed', !today.includes('xl:grid-cols-2') && !today.includes("sectionVisible('upcoming')"));
check('upcoming is not a separate full-width wrapper', !/<div\s+hidden=\{!sectionVisible\('upcoming'\)\}/.test(today));
check('section grid marker exists', today.includes('data-stage232t-r1c-today-section-grid="true"'));
check('desktop grid has 3 columns', today.includes('xl:grid-cols-3') && /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)\s*!important/.test(css));
check('tablet grid has 2 columns', today.includes('md:grid-cols-2') && /max-width:\s*1279px[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)\s*!important/.test(css));
check('mobile grid has 1 column', /max-width:\s*767px[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important/.test(css));
check('Today CSS is scoped to Today root and R1C grid marker', css.includes('[data-p0-today-stable-rebuild="true"]') && css.includes('[data-stage232t-r1c-today-section-grid="true"]'));
check('view visibility storage still uses the same key', today.includes("const TODAY_VIEW_STORAGE_KEY = 'closeflow:today:view-sections:v1'") && today.includes('writeTodayVisibleSections'));
check('manual refresh still forces a manual refresh', today.includes('manualRefreshing') && today.includes("refreshData({ manual: true, force: true, reason: 'manual' })"));
check('task/event cards still use WorkItemCard', today.includes('<WorkItemCard') && today.includes('getWorkItemCardStatusTone'));
check('no SQL files changed', !files.some((file) => /\.(sql)$/i.test(file) || file.includes('/migrations/')));
check('no finance or commission files changed', !files.some((file) => /(^|\/)(finance|commission)(\/|\.|$)/i.test(file)));
check('Calendar runtime was not changed', !files.some((file) => file === 'src/pages/Calendar.tsx' || file.includes('/calendar-runtime')));

let failed = false;
for (const entry of checks) {
  if (entry.ok) {
    console.log('PASS:', entry.name);
  } else {
    failed = true;
    console.error('FAIL:', entry.name);
  }
}

if (failed) process.exit(1);
console.log('STAGE232T_R1C Today production UI cleanup guard passed.');
