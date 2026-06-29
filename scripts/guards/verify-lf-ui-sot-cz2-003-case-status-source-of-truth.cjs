const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const ROOT = process.cwd();
const rel = (file) => path.join(ROOT, file);
const exists = (file) => fs.existsSync(rel(file));
const read = (file) => fs.readFileSync(rel(file), 'utf8');
const errors = [];
const warnings = [];

function fail(message) { errors.push(message); }
function requireFile(file) { if (!exists(file)) fail('missing file: ' + file); }
function requireText(file, text, label = text) {
  if (!read(file).includes(text)) fail(file + ' missing ' + label);
}
function requireIdentifier(file, identifier) {
  const source = read(file);
  const regex = new RegExp('(^|[^A-Za-z0-9_])' + identifier + '([^A-Za-z0-9_]|$)');
  if (!regex.test(source)) fail(file + ' missing identifier ' + identifier);
}
function forbid(file, pattern, label) {
  if (pattern.test(read(file))) fail(file + ' still has forbidden ' + label);
}
function forbidText(file, text, label = text) {
  if (read(file).includes(text)) fail(file + ' still has forbidden ' + label);
}
function forbidMojibake(file) {
  const source = read(file);
  for (const marker of ['Ä', 'Ă', 'Ĺ', 'â€', '�']) {
    if (source.includes(marker)) fail(file + ' contains mojibake marker: ' + marker);
  }
}

const stage = 'LF-UI-SOT-CZ2-003';
const canonical = 'src/lib/source-of-truth/case-options.ts';
const config = 'src/lib/config/case-status.ts';
const cases = 'src/lib/cases.ts';
const casesPage = 'src/pages/Cases.tsx';
const caseDetail = 'src/pages/CaseDetail.tsx';
const clientDetail = 'src/pages/ClientDetail.tsx';
const app = 'src/App.tsx';
const routes = 'src/lib/routes.ts';

[canonical, config, cases, casesPage, caseDetail, clientDetail, app, routes, 'package.json'].forEach(requireFile);

if (exists(canonical)) {
  [
    'CASE_STATUS_OPTIONS',
    'CASE_ITEM_STATUS_OPTIONS',
    'CASE_STATUS_META_BY_VALUE',
    'CASE_ITEM_STATUS_META_BY_VALUE',
    'CASE_CLOSED_STATUSES',
    'getCaseStatusMeta',
    'getCaseItemStatusMeta',
    'getCaseStatusLabel',
    'getCaseStatusHint',
    'getCaseStatusTone',
    'getCaseClientPillClass',
    'getCaseDetailPillClass',
    'getCaseItemStatusLabel',
    'isClosedCaseStatus',
    'caseStatusBadgeVariant',
    'normalizeCaseItemStatus',
  ].forEach((identifier) => requireIdentifier(canonical, identifier));
  requireText(canonical, 'CASE_STATUS_VALUES.map', 'CASE_STATUS_VALUES.map');
  requireText(canonical, 'normalizeCaseStatus', 'normalizeCaseStatus');
  requireText(canonical, "'done'", 'legacy done closed status');
  requireText(canonical, "'closed'", 'legacy closed status');
  requireText(canonical, "'cancelled'", 'legacy cancelled status');
}

if (exists(config)) {
  requireText(config, "from '../source-of-truth/case-options'", 'SOT re-export');
  forbid(config, /const\s+CASE_STATUS_LABELS\s*[:=]/, 'local CASE_STATUS_LABELS');
  forbid(config, /const\s+CASE_STATUS_TONES\s*[:=]/, 'local CASE_STATUS_TONES');
  forbid(config, /Object\.fromEntries\(\s*CASE_STATUS_VALUES\.map/, 'local CASE_STATUS_CONFIG builder');
}

if (exists(cases)) {
  forbid(cases, /CLOSED_CASE_STATUSES\s*=\s*\[/, 'own closed status list');
  requireIdentifier(cases, 'isClosedCaseStatus');
  requireIdentifier(cases, 'getCaseStatusLabel');
}

for (const file of [casesPage, caseDetail]) {
  if (!exists(file)) continue;
  forbid(file, /function\s+caseStatusLabel\s*\(/, 'local caseStatusLabel');
  forbid(file, /function\s+caseBadgeVariant\s*\(/, 'local caseBadgeVariant');
  forbid(file, /const\s+CASE_STATUS_OPTIONS\s*=\s*\[/, 'local CASE_STATUS_OPTIONS array');
  forbid(file, /const\s+CASE_STATUS_LABELS\s*=\s*\{/, 'local CASE_STATUS_LABELS');
  forbid(file, /const\s+CASE_STATUS_TONES\s*=\s*\{/, 'local CASE_STATUS_TONES');
}

for (const file of [canonical, config, cases, casesPage, caseDetail]) {
  if (exists(file)) forbidMojibake(file);
}

for (const file of [canonical, config, cases, casesPage, caseDetail]) {
  if (!exists(file)) continue;
  for (const token of [
    'CASE_CASE_STATUS_OPTIONS',
    'CASE_CASE_CASE_STATUS_OPTIONS',
    'CASE_ITEM_ITEM_STATUS_OPTIONS',
    'CASE_CASE_ITEM_STATUS_OPTIONS',
    'caseStatusLabelLocal',
    'caseBadgeVariantLocal',
  ]) forbidText(file, token, 'bad case status token ' + token);
}

const changed = childProcess.execSync('git diff --name-only', { cwd: ROOT, encoding: 'utf8' })
  .split(/\r?\n/).filter(Boolean);
for (const file of changed) {
  if (/\.css$/i.test(file)) fail('CSS touched: ' + file);
}
if (changed.includes(app)) fail('src/App.tsx touched');
if (changed.includes(routes)) fail('src/lib/routes.ts touched');

const result = {
  ok: errors.length === 0,
  stage,
  canonical,
  compatibilityWrapper: config,
  domainWrapper: cases,
  pagesChecked: [casesPage, caseDetail],
  cssTouched: changed.some((file) => /\.css$/i.test(file)),
  routesTouched: changed.includes(app) || changed.includes(routes),
  changedFiles: changed,
  warnings,
  errors,
};

console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exit(1);
