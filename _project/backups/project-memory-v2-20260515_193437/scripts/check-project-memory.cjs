#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
let ok = true;

function fail(message) {
  ok = false;
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`OK ${message}`);
}

function exists(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) fail(`${rel} missing`);
  else pass(`${rel} exists`);
}

function contains(rel, required) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return;
  const txt = fs.readFileSync(p, 'utf8');
  for (const token of required) {
    if (!txt.includes(token)) fail(`${rel} missing required token: ${token}`);
  }
}

const requiredFiles = [
  'AGENTS.md',
  '_project/00_PROJECT_STATUS.md',
  '_project/01_PROJECT_GOAL.md',
  '_project/02_WORK_RULES.md',
  '_project/03_CURRENT_STAGE.md',
  '_project/04_DECISIONS.md',
  '_project/05_MANUAL_TESTS.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/07_NEXT_STEPS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/09_CONTEXT_FOR_OBSIDIAN.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/11_USER_CONFIRMED_TESTS.md',
  '_project/runs/.gitkeep',
  '_project/history/.gitkeep'
];

for (const rel of requiredFiles) exists(rel);

contains('AGENTS.md', ['CloseFlow', 'dev-rollout-freeze', '_project', 'Obsidian']);
contains('_project/01_PROJECT_GOAL.md', ['lead', 'spraw', 'klient']);
contains('_project/04_DECISIONS.md', ['Trial', 'Najbliższa zaplanowana akcja', 'AI']);
contains('_project/06_GUARDS_AND_TESTS.md', ['verify:closeflow:quiet', 'check-project-memory']);
contains('_project/09_CONTEXT_FOR_OBSIDIAN.md', ['CloseFlow', 'Lead app', 'Obsidian']);

const obsidianVault = process.env.OBSIDIAN_VAULT || 'C:\\Users\\malim\\Desktop\\biznesy_ai\\00_OBSIDIAN_VAULT';
const obsidianDir = path.join(obsidianVault, '10_PROJEKTY', 'CloseFlow_Lead_App');
if (fs.existsSync(obsidianDir)) {
  const obsFiles = fs.readdirSync(obsidianDir).filter((name) => name.endsWith('.md'));
  const bad = obsFiles.filter((name) => !name.includes('CloseFlow lead app'));
  if (bad.length) fail(`Obsidian files without project name: ${bad.join(', ')}`);
  else pass('Obsidian file names include project name');
} else {
  console.warn(`WARN Obsidian project dir not found: ${obsidianDir}`);
}

if (!ok) {
  console.error('CloseFlow project memory guard failed.');
  process.exit(1);
}
console.log('CloseFlow project memory guard passed.');
