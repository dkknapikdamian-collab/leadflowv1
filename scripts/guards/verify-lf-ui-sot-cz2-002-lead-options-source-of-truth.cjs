#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const ROOT = process.cwd();
const STAGE = 'LF-UI-SOT-CZ2-002';
const rel = (p) => path.join(ROOT, p);
const read = (p) => fs.readFileSync(rel(p), 'utf8');
const exists = (p) => fs.existsSync(rel(p));
const errors = [];

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

const canonical = 'src/lib/source-of-truth/lead-options.ts';
const config = 'src/lib/config/lead-status.ts';
const options = 'src/lib/options.ts';
const leadSources = 'src/lib/leadSources.ts';
const leads = 'src/pages/Leads.tsx';
const leadDetail = 'src/pages/LeadDetail.tsx';
const app = 'src/App.tsx';
const routes = 'src/lib/routes.ts';
const obsidianReport = '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-UI-SOT-CZ2-002_LEAD_OPTIONS_SOURCE_OF_TRUTH.md';
const noMojibakeFiles = [leads, leadDetail, canonical, options, config, leadSources];
const badLeadTokens = [
  'LEAD_LEAD_SOURCE_OPTIONS',
  'LEAD_LEAD_STATUS_OPTIONS',
  'LEAD_LEAD_LEAD_SOURCE_OPTIONS',
  'LEAD_LEAD_LEAD_STATUS_OPTIONS',
];

[canonical, config, options, leadSources, leads, leadDetail, app, routes].forEach(requireFile);

if (exists(canonical)) {
  [
    'export const LEAD_STATUS_OPTIONS',
    'export const LEAD_SOURCE_OPTIONS',
    'export const LEAD_STATUS_META_BY_VALUE',
    'export const LEAD_SOURCE_META_BY_VALUE',
    'export function getLeadStatusMeta',
    'export function getLeadSourceMeta',
    'export function getLeadStatusLabel',
    'export function getLeadSourceLabel',
    'export function getLeadStatusTone',
    'export function getLeadStatusPillClass',
    'export function normalizeLeadSource',
    'export function isClosedLeadStatus',
  ].forEach((text) => requireText(canonical, text));
  requireText(canonical, 'LEAD_STATUS_VALUES.map', 'LEAD_STATUS_VALUES.map');
  requireText(canonical, 'normalizeLeadStatus', 'normalizeLeadStatus');
}

if (exists(config)) {
  requireText(config, "from '../source-of-truth/lead-options'", 'SOT re-export');
  forbid(config, /const\s+LEAD_STATUS_TONES\s*[:=]/, 'local LEAD_STATUS_TONES');
  forbid(config, /const\s+LEAD_STATUS_OPTIONS\s*=/, 'local LEAD_STATUS_OPTIONS');
  forbid(config, /Object\.fromEntries\(\s*LEAD_STATUS_VALUES\.map/, 'local status config builder');
}

if (exists(options)) {
  requireText(options, "from './source-of-truth/lead-options'", 'SOT re-export');
  forbid(options, /export\s+const\s+SOURCE_OPTIONS\s*=\s*\[/, 'local SOURCE_OPTIONS array');
}

if (exists(leads)) {
  requireText(leads, "from '../lib/source-of-truth/lead-options'", 'SOT import');
  requireIdentifier(leads, 'LEAD_SOURCE_OPTIONS');
  requireIdentifier(leads, 'LEAD_STATUS_OPTIONS');
  requireIdentifier(leads, 'getLeadSourceLabel');
  requireIdentifier(leads, 'getLeadStatusLabel');
  requireIdentifier(leads, 'getLeadStatusTone');
  forbid(leads, /const\s+SOURCE_OPTIONS\s*=\s*\[/, 'local SOURCE_OPTIONS');
  forbid(leads, /LEAD_STATUS_OPTIONS\s+as\s+STATUS_OPTIONS/, 'LEAD_STATUS_OPTIONS as STATUS_OPTIONS alias');
  forbid(leads, /function\s+formatLeadSourceLabel\s*\(/, 'local formatLeadSourceLabel');
}

if (exists(leadDetail)) {
  requireText(leadDetail, "from '../lib/source-of-truth/lead-options'", 'SOT import');
  requireIdentifier(leadDetail, 'LEAD_SOURCE_OPTIONS');
  requireIdentifier(leadDetail, 'LEAD_STATUS_OPTIONS');
  requireIdentifier(leadDetail, 'getLeadSourceLabel');
  requireIdentifier(leadDetail, 'getLeadStatusLabel');
  requireIdentifier(leadDetail, 'getLeadStatusPillClass');
  forbid(leadDetail, /const\s+SOURCE_OPTIONS\s*=\s*\[/, 'local SOURCE_OPTIONS');
  forbid(leadDetail, /LEAD_STATUS_OPTIONS\s+as\s+STATUS_OPTIONS/, 'LEAD_STATUS_OPTIONS as STATUS_OPTIONS alias');
}

if (exists(leadSources)) {
  requireText(leadSources, "from './source-of-truth/lead-options'", 'leadSources compatibility re-export');
  forbid(leadSources, /export\s+const\s+LEAD_SOURCE_OPTIONS\s*=\s*\[/, 'local LEAD_SOURCE_OPTIONS array');
}

for (const file of noMojibakeFiles) forbidMojibake(file);
for (const file of noMojibakeFiles) {
  for (const token of badLeadTokens) forbidText(file, token, 'bad lead options token ' + token);
}

const changed = childProcess.execSync('git diff --name-only', { cwd: ROOT, encoding: 'utf8' })
  .split(/\r?\n/).filter(Boolean);
for (const file of changed) {
  if (/\.css$/i.test(file)) fail('CSS touched: ' + file);
}
if (changed.includes(app)) fail('src/App.tsx touched');
if (changed.includes(routes)) fail('src/lib/routes.ts touched');

const reportCandidates = [
  rel(obsidianReport),
  path.join(ROOT, '..', '00_OBSIDIAN_VAULT', obsidianReport),
];
const reportExists = reportCandidates.some((candidate) => fs.existsSync(candidate));

const result = {
  ok: errors.length === 0,
  stage: STAGE,
  r1: 'BROKEN_IMPORTS_UTF8_GUARD_HARDENING',
  canonical,
  pagesChecked: [leads, leadDetail],
  compatibilityExports: [config, options, leadSources].filter(exists),
  runtimeBehaviorIntent: 'UNCHANGED',
  cssTouched: changed.some((file) => /\.css$/i.test(file)),
  routesTouched: changed.includes(app) || changed.includes(routes),
  obsidianReportExists: reportExists,
  changedFiles: changed,
  mojibakeFilesChecked: noMojibakeFiles,
  forbiddenTokensChecked: badLeadTokens,
  errors,
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
