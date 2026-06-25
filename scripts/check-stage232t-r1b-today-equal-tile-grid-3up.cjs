#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/closeflow-canvas-runtime-source-truth-stage211j.css');
const todayPath = path.join(root, 'src/pages/TodayStable.tsx');
const css = fs.readFileSync(cssPath, 'utf8');
const today = fs.readFileSync(todayPath, 'utf8');

const checks = [];
function check(name, condition) {
  checks.push({ name, ok: Boolean(condition) });
}

check('stage marker exists', css.includes('STAGE232T_R1B_TODAY_EQUAL_TILE_GRID_3UP'));
check('fix is scoped to Today root', css.includes('[data-p0-today-stable-rebuild="true"]'));
check('desktop uses 3 equal columns', /grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)\s*!important/.test(css));
check('tablet uses 2 equal columns', /max-width:\s*1279px[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)\s*!important/.test(css));
check('mobile uses 1 equal column', /max-width:\s*767px[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important/.test(css));
check('upcoming wrapper is constrained to one desktop column', /max-width:\s*calc\(\(100% - \(2 \* var\(--stage232t-r1b-today-card-gap\)\)\) \/ 3\)\s*!important/.test(css));
check('shared card min height contract exists', css.includes('--stage232t-r1b-today-card-min-height'));
check('cards stretch to equal height', /height:\s*100%\s*!important/.test(css));
check('Today metric grid still exists', today.includes('data-stage16ai-today-tiles-match-lists="true"'));
check('Today upcoming section still exists', today.includes("sectionVisible('upcoming')"));
check('stage did not touch finance keywords in css', !/commission|finance|prowizj/i.test(css));
check('stage did not add SQL keywords in css', !/ALTER TABLE|CREATE POLICY|DROP TABLE/i.test(css));

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
console.log('STAGE232T_R1B Today equal tile grid guard passed.');
