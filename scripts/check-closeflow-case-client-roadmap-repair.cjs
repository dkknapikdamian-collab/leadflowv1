#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');

const REQUIRED_CHECKS = [
  'check-closeflow-case-roadmap-source-of-truth.cjs',
  'check-closeflow-activity-roadmap-labels.cjs',
  'check-closeflow-case-note-actions.cjs',
  'check-closeflow-case-quick-actions.cjs',
  'check-closeflow-client-primary-case.cjs',
  'check-closeflow-client-finance-summary.cjs',
  'check-closeflow-client-case-delete-confirm.cjs',
  'check-closeflow-client-card-next-action-layout.cjs',
];

const PACKAGE_SCRIPT_NAME = 'check:closeflow-case-client-roadmap-repair';
const PACKAGE_SCRIPT_VALUE = 'node scripts/check-closeflow-case-client-roadmap-repair.cjs';
const ROADMAP_DOC = path.join(
  repoRoot,
  'docs',
  'bugs',
  'CLOSEFLOW_CASE_CLIENT_ROADMAP_SOT_REPAIR_2026-05-10.md',
);

function fail(message, details = []) {
  console.error('\nCLOSEFLOW_CASE_CLIENT_ROADMAP_REPAIR_GUARD_FAIL');
  console.error(message);
  for (const detail of details) console.error(`- ${detail}`);
  process.exit(1);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function assertPackageScript() {
  const packagePath = path.join(repoRoot, 'package.json');
  if (!fs.existsSync(packagePath)) {
    fail('Brakuje package.json w root repo.', [packagePath]);
  }

  let pkg;
  try {
    pkg = JSON.parse(readText(packagePath));
  } catch (error) {
    fail('package.json nie jest poprawnym JSON.', [String(error && error.message ? error.message : error)]);
  }

  const actual = pkg && pkg.scripts && pkg.scripts[PACKAGE_SCRIPT_NAME];
  if (actual !== PACKAGE_SCRIPT_VALUE) {
    fail('Brakuje poprawnego wpisu script w package.json.', [
      `Oczekiwane: "${PACKAGE_SCRIPT_NAME}": "${PACKAGE_SCRIPT_VALUE}"`,
      `Aktualne: ${actual === undefined ? '<brak>' : JSON.stringify(actual)}`,
    ]);
  }
}

function assertRoadmapGuardSection() {
  if (!fs.existsSync(ROADMAP_DOC)) {
    fail('Brakuje dokumentu roadmap/source-of-truth dla tego pakietu.', [
      path.relative(repoRoot, ROADMAP_DOC),
    ]);
  }

  const doc = readText(ROADMAP_DOC);
  const requiredDocSnippets = [
    '## Guardy',
    'npm.cmd run check:closeflow-case-client-roadmap-repair',
    'npm.cmd run build',
    'npm.cmd run verify:closeflow:quiet',
  ];

  const missing = requiredDocSnippets.filter((snippet) => !doc.includes(snippet));
  if (missing.length > 0) {
    fail('Dokument nie zawiera pe\u0142nej sekcji Guardy dla pakietu.', missing);
  }
}

function assertRequiredChecksExist() {
  const missing = REQUIRED_CHECKS
    .map((name) => ({ name, filePath: path.join(repoRoot, 'scripts', name) }))
    .filter(({ filePath }) => !fs.existsSync(filePath))
    .map(({ name }) => name);

  if (missing.length > 0) {
    fail('Brakuje jednego lub wi\u0119cej guard\u00F3w sk\u0142adowych.', missing);
  }
}

function runCheck(name) {
  const filePath = path.join(repoRoot, 'scripts', name);
  console.log(`\n== run ${name} ==`);
  const result = spawnSync(process.execPath, [filePath], {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  });

  if (result.error) {
    fail(`Nie uda\u0142o si\u0119 uruchomi\u0107 guardu: ${name}`, [String(result.error.message || result.error)]);
  }

  if (result.status !== 0) {
    fail(`Guard sk\u0142adowy zako\u0144czy\u0142 si\u0119 b\u0142\u0119dem: ${name}`, [`exit code: ${result.status}`]);
  }
}

function main() {
  console.log('== CloseFlow case/client roadmap repair aggregate guard ==');

  assertPackageScript();
  assertRoadmapGuardSection();
  assertRequiredChecksExist();

  for (const checkName of REQUIRED_CHECKS) {
    runCheck(checkName);
  }

  console.log('\nCLOSEFLOW_CASE_CLIENT_ROADMAP_REPAIR_GUARD_OK');
}

main();
