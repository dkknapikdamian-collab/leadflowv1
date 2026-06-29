#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = process.cwd();
const stage = 'LF-UI-SOT-CZ2-007';
const canonical = 'src/lib/source-of-truth/client-options.ts';
const errors = [];
const warnings = [];
const checked = [];
function file(rel) { checked.push(rel); return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function error(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }
function git(cmd) { try { return cp.execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } }

for (const rel of [
  'src/App.tsx',
  'src/lib/routes.ts',
  'src/components/Layout.tsx',
  'src/pages/Clients.tsx',
  'src/pages/ClientDetail.tsx',
  'src/lib/clients.ts',
  canonical,
  'scripts/guards/verify-lf-ui-sot-cz2-007-client-directory-source-of-truth.cjs',
  'tests/lf-ui-sot-cz2-007-client-directory-source-of-truth.test.cjs',
  'package.json',
]) if (!exists(rel)) error(`missing required file: ${rel}`);

const app = exists('src/App.tsx') ? file('src/App.tsx') : '';
const routes = exists('src/lib/routes.ts') ? file('src/lib/routes.ts') : '';
const layout = exists('src/components/Layout.tsx') ? file('src/components/Layout.tsx') : '';
const clientsPage = exists('src/pages/Clients.tsx') ? file('src/pages/Clients.tsx') : '';
const clientDetail = exists('src/pages/ClientDetail.tsx') ? file('src/pages/ClientDetail.tsx') : '';
const clientsLib = exists('src/lib/clients.ts') ? file('src/lib/clients.ts') : '';
const clientOptions = exists(canonical) ? file(canonical) : '';
const packageJson = exists('package.json') ? file('package.json') : '';

if (!app.includes('path={CLOSEFLOW_ROUTES.clients}') || !app.includes('<Clients')) error('App.tsx does not render active /clients route');
if (!app.includes('path={CLOSEFLOW_ROUTES.clientDetail}') || !app.includes('<ClientDetail')) error('App.tsx does not render active /clients/:clientId route');
if (!routes.includes("clients: '/clients'") || !routes.includes("clientDetail: '/clients/:clientId'")) error('routes.ts missing clients/clientDetail route constants');
if (!routes.includes("path: CLOSEFLOW_ROUTES.clients, status: 'canonical'") || !routes.includes("path: CLOSEFLOW_ROUTES.clientDetail, status: 'canonical'")) error('routes.ts does not mark clients/clientDetail canonical');
if (!routes.includes('export function clientsPath()') || !routes.includes('export function clientDetailPath(')) error('routes.ts missing clientsPath/clientDetailPath helpers');
if (!layout.includes("label: 'Klienci'") || !layout.includes("path: '/clients'")) error('Layout does not link Klienci /clients');

for (const token of [
  'ClientHealthValue', 'ClientSourceValue', 'PortalStatusValue',
  'ClientHealthMeta', 'ClientSourceMeta', 'PortalStatusMeta',
  'CLIENT_HEALTH_OPTIONS', 'CLIENT_SOURCE_OPTIONS', 'PORTAL_STATUS_OPTIONS',
  'deriveClientHealthValue', 'resolveClientHealthValue', 'getClientHealthMeta',
  'getClientHealthLabel', 'getClientHealthTone', 'getClientSourceMeta',
  'getPortalStatusValue', 'getPortalStatusMeta', 'getPortalStatusLabel',
]) {
  const pattern = new RegExp(`export\\s+(type\\s+|const\\s+|function\\s+)${token}\\b`);
  if (!pattern.test(clientOptions)) error(`client-options.ts missing export: ${token}`);
}

if (!clientsLib.includes("from './source-of-truth/client-options'")) error('src/lib/clients.ts does not consume client-options.ts');
if (!clientsLib.includes('return getPortalStatusLabel(portalReady)')) error('portalStatusLabel wrapper does not delegate');
if (!clientsLib.includes('return getClientHealthLabel(input)')) error('clientHealthLabel wrapper does not delegate');
if (!clientsLib.includes('return getClientHealthTone(label)')) error('clientHealthTone wrapper does not delegate');
if (/case\s+['"]W realizacji['"]/.test(clientsLib) || /case\s+['"]Onboarding['"]/.test(clientsLib)) error('src/lib/clients.ts still contains local health switch cases');

for (const [rel, content] of [['src/pages/Clients.tsx', clientsPage], ['src/pages/ClientDetail.tsx', clientDetail]]) {
  for (const forbidden of ['CLIENT_HEALTH_OPTIONS', 'CLIENT_SOURCE_OPTIONS', 'PORTAL_STATUS_OPTIONS']) {
    if (new RegExp(`(const|let|var)\\s+${forbidden}\\b`).test(content)) error(`${rel} defines local ${forbidden}`);
  }
  if (/bg-\$\{/.test(content) || /text-\$\{/.test(content) || /border-\$\{/.test(content)) error(`${rel} contains dynamic Tailwind class fragments`);
}

if (!packageJson.includes('"verify:lf-ui-sot-cz2-007-client-directory-source-of-truth"')) error('package.json missing CZ2-007 verify script');

const changed = git('git diff --name-only HEAD');
const changedFiles = changed ? changed.split(/\r?\n/).filter(Boolean) : [];
const allowed = new Set([
  canonical,
  'src/lib/clients.ts',
  'scripts/guards/verify-lf-ui-sot-cz2-007-client-directory-source-of-truth.cjs',
  'tests/lf-ui-sot-cz2-007-client-directory-source-of-truth.test.cjs',
  'package.json',
]);
const forbiddenChanged = changedFiles.filter((rel) => {
  if (allowed.has(rel)) return false;
  if (rel.endsWith('.css') || rel.endsWith('.sql') || rel.startsWith('supabase/migrations/')) return true;
  return ['src/App.tsx', 'src/lib/routes.ts', 'src/components/Layout.tsx', 'src/pages/Billing.tsx', 'src/lib/access.ts', 'src/lib/plans.ts', 'src/lib/source-of-truth/billing-options.ts'].includes(rel);
});
if (forbiddenChanged.length) error(`forbidden changed files: ${forbiddenChanged.join(', ')}`);

for (const [rel, content] of [[canonical, clientOptions], ['src/lib/clients.ts', clientsLib]]) {
  if (/[ÅÄĹ�]/.test(content)) error(`${rel} contains mojibake`);
}

const vaultCandidates = [process.env.OBSIDIAN_VAULT_ROOT, path.resolve(root, '../00_OBSIDIAN_VAULT'), path.resolve(root, '../../00_OBSIDIAN_VAULT')].filter(Boolean);
const vaultRoot = vaultCandidates.find((candidate) => fs.existsSync(candidate));
if (vaultRoot) {
  const stageFile = path.join(vaultRoot, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-UI-SOT-CZ2-007_CLIENT_DIRECTORY_CLIENT_HEALTH_DECISION.md');
  const routerFile = path.join(vaultRoot, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY - CloseFlow Lead App.md');
  if (!fs.existsSync(stageFile)) error(`missing Obsidian CZ2-007 report: ${stageFile}`);
  if (!fs.existsSync(routerFile)) error(`missing Obsidian router: ${routerFile}`);
  if (fs.existsSync(stageFile) && !fs.readFileSync(stageFile, 'utf8').includes(stage)) error('Obsidian report missing CZ2-007 marker');
  if (fs.existsSync(routerFile) && !fs.readFileSync(routerFile, 'utf8').includes(stage)) error('Obsidian router missing CZ2-007 marker');
} else {
  warn('OBSIDIAN_VAULT_ROOT not set; skipped external report/router check');
}

const result = { ok: errors.length === 0, stage, decision: 'CLIENTS_ACTIVE_AND_CANONICAL', canonical, checked, changedFiles, warnings, errors };
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
