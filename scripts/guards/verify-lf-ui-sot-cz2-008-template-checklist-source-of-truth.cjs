#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = process.cwd();
const stage = 'LF-UI-SOT-CZ2-008';
const canonical = 'src/lib/source-of-truth/template-options.ts';
const errors = [];
const warnings = [];
const checked = [];
const mojibakePattern = /[\u00c5\u00c4\u0139\ufffd]/;

function relPath(rel) { return path.join(root, rel); }
function exists(rel) { return fs.existsSync(relPath(rel)); }
function read(rel) { checked.push(rel); return fs.readFileSync(relPath(rel), 'utf8'); }
function error(message) { errors.push(message); }
function warn(message) { warnings.push(message); }
function git(command) { try { return cp.execSync(command, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } }

for (const rel of [
  'src/App.tsx',
  'src/lib/routes.ts',
  'src/pages/Templates.tsx',
  'src/pages/CaseDetail.tsx',
  'src/lib/source-of-truth/case-options.ts',
  'src/lib/config/case-status.ts',
  canonical,
  'scripts/guards/verify-lf-ui-sot-cz2-008-template-checklist-source-of-truth.cjs',
  'tests/lf-ui-sot-cz2-008-template-checklist-source-of-truth.test.cjs',
  'package.json',
]) if (!exists(rel)) error(`missing required file: ${rel}`);

const app = exists('src/App.tsx') ? read('src/App.tsx') : '';
const routes = exists('src/lib/routes.ts') ? read('src/lib/routes.ts') : '';
const templates = exists('src/pages/Templates.tsx') ? read('src/pages/Templates.tsx') : '';
const caseDetail = exists('src/pages/CaseDetail.tsx') ? read('src/pages/CaseDetail.tsx') : '';
const caseOptions = exists('src/lib/source-of-truth/case-options.ts') ? read('src/lib/source-of-truth/case-options.ts') : '';
const caseStatusWrapper = exists('src/lib/config/case-status.ts') ? read('src/lib/config/case-status.ts') : '';
const templateOptions = exists(canonical) ? read(canonical) : '';
const packageJson = exists('package.json') ? read('package.json') : '';

if (!app.includes('path={CLOSEFLOW_ROUTES.templates}') || !app.includes('<Templates')) error('App.tsx does not render active /templates route');
if (!app.includes('path={CLOSEFLOW_ROUTES.caseTemplates}') || !app.includes('<Navigate to={templatesPath()} replace')) error('App.tsx does not redirect /case-templates to /templates');
if (!routes.includes("templates: '/templates'") || !routes.includes("caseTemplates: '/case-templates'")) error('routes.ts missing templates/caseTemplates constants');
if (!routes.includes("path: CLOSEFLOW_ROUTES.templates, status: 'canonical'")) error('routes.ts does not mark /templates as canonical');
if (!routes.includes("path: CLOSEFLOW_ROUTES.caseTemplates, status: 'alias'") || !routes.includes('aliasFor: CLOSEFLOW_ROUTES.templates')) error('routes.ts does not mark /case-templates as alias for /templates');
if (!routes.includes('export function templatesPath()')) error('routes.ts missing templatesPath helper');

for (const token of [
  'TemplateItemTypeValue', 'TemplateItemDraft', 'TemplateRecord', 'TemplateItemTypeMeta',
  'TEMPLATE_ITEM_TYPE_OPTIONS', 'EMPTY_TEMPLATE_ITEM', 'getTemplateItemTypeMeta',
  'getTemplateItemTypeLabel', 'normalizeTemplateItems', 'createEmptyTemplateItem',
  'createEmptyTemplateDraft', 'getTemplateItemCount', 'getRequiredTemplateItemCount',
]) {
  const pattern = new RegExp(`export\\s+(type\\s+|const\\s+|function\\s+)${token}\\b`);
  if (!pattern.test(templateOptions)) error(`template-options.ts missing export: ${token}`);
}

for (const value of ['file', 'text', 'decision', 'access', 'meeting', 'payment', 'materials', 'other']) {
  if (!new RegExp(`value:\\s*['"]${value}['"]`).test(templateOptions)) error(`template-options.ts missing item type value: ${value}`);
}

for (const label of ['Plik', 'Tekst / brief', 'Decyzja / akceptacja', 'Dostęp / login', 'Spotkanie / telefon', 'Płatność / faktura', 'Materiały / zdjęcia', 'Inne']) {
  if (!templateOptions.includes(`label: '${label}'`)) error(`template-options.ts missing preserved label: ${label}`);
}

for (const className of [
  'border-sky-200 bg-sky-50 text-sky-700',
  'border-indigo-200 bg-indigo-50 text-indigo-700',
  'border-amber-200 bg-amber-50 text-amber-700',
  'border-emerald-200 bg-emerald-50 text-emerald-700',
  'border-blue-200 bg-blue-50 text-blue-700',
  'border-rose-200 bg-rose-50 text-rose-700',
  'border-violet-200 bg-violet-50 text-violet-700',
  'border-slate-200 bg-slate-50 text-slate-700',
]) {
  if (!templateOptions.includes(`badgeClassName: '${className}'`)) error(`template-options.ts missing preserved badgeClassName: ${className}`);
}

if (!templates.includes("from '../lib/source-of-truth/template-options'")) error('Templates.tsx does not consume template-options.ts');
if (!templates.includes('TEMPLATE_ITEM_TYPE_OPTIONS.map')) error('Templates.tsx does not use TEMPLATE_ITEM_TYPE_OPTIONS');
if (!templates.includes('createEmptyTemplateDraft()')) error('Templates.tsx does not use createEmptyTemplateDraft');
if (!templates.includes('createEmptyTemplateItem()')) error('Templates.tsx does not use createEmptyTemplateItem');
if (!templates.includes('getTemplateItemTypeMeta(item.type)')) error('Templates.tsx does not use getTemplateItemTypeMeta');

for (const [label, pattern] of [
  ['local TemplateItemType type', /^type\s+TemplateItemType\b/m],
  ['local TemplateItemDraft type', /^type\s+TemplateItemDraft\b/m],
  ['local TemplateRecord type', /^type\s+TemplateRecord\b/m],
  ['local ITEM_TYPE_OPTIONS const', /^const\s+ITEM_TYPE_OPTIONS\b/m],
  ['local EMPTY_ITEM const', /^const\s+EMPTY_ITEM\b/m],
  ['local cloneEmptyItem helper', /^function\s+cloneEmptyItem\b/m],
  ['local createEmptyDraft helper', /^function\s+createEmptyDraft\b/m],
  ['local normalizeTemplateItems helper', /^function\s+normalizeTemplateItems\b/m],
  ['local itemTypeMeta helper', /^function\s+itemTypeMeta\b/m],
  ['local getTemplateItemTypeLabel helper', /^function\s+getTemplateItemTypeLabel\b/m],
  ['local getTemplateItemCount helper', /^function\s+getTemplateItemCount\b/m],
  ['local getRequiredItemCount helper', /^function\s+getRequiredItemCount\b/m],
]) if (pattern.test(templates)) error(`Templates.tsx still defines ${label}`);

for (const token of ['CASE_ITEM_STATUS_LABELS', 'CASE_ITEM_STATUS_OPTIONS', 'CASE_ITEM_STATUS_META_BY_VALUE', 'normalizeCaseItemStatus', 'getCaseItemStatusMeta', 'getCaseItemStatusLabel']) {
  const pattern = new RegExp(`export\\s+(const\\s+|function\\s+)${token}\\b`);
  if (!pattern.test(caseOptions)) error(`case-options.ts missing case item status SOT export: ${token}`);
}

if (!caseStatusWrapper.includes("from '../source-of-truth/case-options'")) error('case-status.ts no longer wraps case-options.ts');
if (!caseStatusWrapper.includes('getCaseItemStatusLabel') || !caseStatusWrapper.includes('getCaseItemStatusMeta')) error('case-status.ts missing case item status wrapper exports');
if (!caseDetail.includes("from '../lib/config/case-status'")) error('CaseDetail.tsx no longer consumes case-status config wrapper');
if (!caseDetail.includes('getCaseItemStatusLabel as getConfiguredCaseItemStatusLabel')) error('CaseDetail.tsx no longer imports configured case item status label');
if (!packageJson.includes('"verify:lf-ui-sot-cz2-008-template-checklist-source-of-truth"')) error('package.json missing CZ2-008 verify script');

const changed = git('git diff --name-only HEAD');
const changedFiles = changed ? changed.split(/\r?\n/).filter(Boolean) : [];
const allowed = new Set([
  canonical,
  'src/pages/Templates.tsx',
  'scripts/guards/verify-lf-ui-sot-cz2-008-template-checklist-source-of-truth.cjs',
  'tests/lf-ui-sot-cz2-008-template-checklist-source-of-truth.test.cjs',
  'package.json',
]);
const forbiddenChanged = changedFiles.filter((rel) => {
  if (allowed.has(rel)) return false;
  if (rel.endsWith('.css') || rel.endsWith('.sql') || rel.startsWith('supabase/migrations/')) return true;
  return [
    'src/App.tsx', 'src/lib/routes.ts', 'src/pages/CaseDetail.tsx', 'src/pages/LeadDetail.tsx',
    'src/lib/source-of-truth/case-options.ts', 'src/lib/config/case-status.ts', 'src/lib/supabase-fallback.ts',
    'src/lib/source-of-truth/client-options.ts', 'src/lib/clients.ts', 'src/pages/Billing.tsx', 'src/lib/access.ts', 'src/lib/plans.ts',
  ].includes(rel);
});
if (forbiddenChanged.length) error(`forbidden changed files: ${forbiddenChanged.join(', ')}`);

for (const [rel, content] of [[canonical, templateOptions], ['src/pages/Templates.tsx', templates], ['scripts/guards/verify-lf-ui-sot-cz2-008-template-checklist-source-of-truth.cjs', exists('scripts/guards/verify-lf-ui-sot-cz2-008-template-checklist-source-of-truth.cjs') ? read('scripts/guards/verify-lf-ui-sot-cz2-008-template-checklist-source-of-truth.cjs') : ''], ['tests/lf-ui-sot-cz2-008-template-checklist-source-of-truth.test.cjs', exists('tests/lf-ui-sot-cz2-008-template-checklist-source-of-truth.test.cjs') ? read('tests/lf-ui-sot-cz2-008-template-checklist-source-of-truth.test.cjs') : '']]) {
  if (mojibakePattern.test(content)) error(`${rel} contains mojibake`);
}

const vaultCandidates = [process.env.OBSIDIAN_VAULT_ROOT, path.resolve(root, '../00_OBSIDIAN_VAULT'), path.resolve(root, '../../00_OBSIDIAN_VAULT')].filter(Boolean);
const vaultRoot = vaultCandidates.find((candidate) => fs.existsSync(candidate));
if (vaultRoot) {
  const stageFile = path.join(vaultRoot, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-UI-SOT-CZ2-008_TEMPLATE_CHECKLIST_SOURCE_OF_TRUTH_DECISION.md');
  const routerFile = path.join(vaultRoot, '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY - CloseFlow Lead App.md');
  if (!fs.existsSync(stageFile)) error(`missing Obsidian CZ2-008 report: ${stageFile}`);
  if (!fs.existsSync(routerFile)) error(`missing Obsidian router: ${routerFile}`);
  if (fs.existsSync(stageFile) && !fs.readFileSync(stageFile, 'utf8').includes(stage)) error('Obsidian report missing CZ2-008 marker');
  if (fs.existsSync(routerFile) && !fs.readFileSync(routerFile, 'utf8').includes(stage)) error('Obsidian router missing CZ2-008 marker');
} else {
  warn('OBSIDIAN_VAULT_ROOT not set; skipped external report/router check');
}

const result = {
  ok: errors.length === 0,
  stage,
  decision: 'TEMPLATES_ACTIVE_AND_CANONICAL / TEMPLATE_OPTIONS_SOT_REQUIRED / CHECKLIST_STATUS_ALREADY_IN_CASE_OPTIONS',
  canonical,
  checked,
  changedFiles,
  warnings,
  errors,
};
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
