#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) throw new Error('Missing file: ' + rel);
  return fs.readFileSync(file, 'utf8');
}
function readExisting(candidates) {
  return candidates
    .filter((rel) => fs.existsSync(path.join(root, rel)))
    .map((rel) => '/* FILE: ' + rel + ' */\n' + fs.readFileSync(path.join(root, rel), 'utf8'))
    .join('\n\n');
}
function fail(message) { throw new Error(message); }
function includes(source, needle) { return source.indexOf(needle) !== -1; }
function passIfIncludes(source, needle, label) {
  if (!includes(source, needle)) fail('Missing: ' + label + ' (' + needle + ')');
}
function failIfIncludes(source, needle, label) {
  if (includes(source, needle)) fail('Forbidden text: ' + label + ' (' + needle + ')');
}
function failIfRegex(source, regex, label) {
  if (regex.test(source)) fail('Forbidden pattern: ' + label + ' (' + regex + ')');
}
function passIfAny(source, needles, label) {
  if (!needles.some((needle) => includes(source, needle))) {
    fail('Missing any: ' + label + ' (' + needles.join(' OR ') + ')');
  }
}
function extractBetween(source, startNeedle, endNeedle, label) {
  const start = source.indexOf(startNeedle);
  if (start === -1) fail('Missing block start: ' + label + ' (' + startNeedle + ')');
  const end = source.indexOf(endNeedle, start + startNeedle.length);
  if (end === -1) fail('Missing block end: ' + label + ' (' + endNeedle + ')');
  return source.slice(start, end);
}
function extractFunction(source, name) {
  const startNeedle = 'function ' + name;
  const start = source.indexOf(startNeedle);
  if (start === -1) fail('Missing function: ' + name);
  let brace = source.indexOf('{', start);
  if (brace === -1) fail('Missing function body: ' + name);
  let depth = 0;
  for (let index = brace; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }
  fail('Unclosed function: ' + name);
}
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|\s)\/\/[^\n\r]*/g, '$1');
}
function getReturnArrayBlock(functionSource, label) {
  const start = functionSource.indexOf('return [');
  if (start === -1) fail('Missing return array: ' + label);
  const end = functionSource.indexOf('].filter', start);
  if (end === -1) fail('Missing return array end: ' + label);
  return functionSource.slice(start, end);
}

const client = read('src/pages/ClientDetail.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const leads = read('src/pages/Leads.tsx');
const leadDetail = read('src/pages/LeadDetail.tsx');
const packageJson = read('package.json');
const leadCss = readExisting([
  'src/styles/LeadDetail.css',
  'src/styles/lead-detail.css',
  'src/styles/visual-stage14-lead-detail-vnext.css',
  'src/styles/closeflow-visual-system.css',
  'src/styles/hotfix-right-rail-dark-wrappers.css',
]);

// ClientDetail: semantic checks for the repaired feedback areas.
failIfIncludes(client, 'Lekka o\u015B ostatnich ruch\u00F3w', 'ClientDetail old recent-moves copy');
failIfIncludes(client, 'Aktywno\u015B\u0107 klientaBrak daty', 'ClientDetail glued activity/date fallback');
passIfIncludes(client, 'data-client-notes-list="true"', 'ClientDetail notes list marker');
passIfIncludes(client, 'data-client-side-quick-actions', 'ClientDetail side quick actions marker');
passIfIncludes(client, 'Sprawy', 'ClientDetail cases copy');
passIfIncludes(client, 'Podsumowanie', 'ClientDetail summary copy');
const quickActionsStart = client.indexOf('data-client-side-quick-actions');
if (quickActionsStart !== -1) {
  const quickActionsBlock = client.slice(quickActionsStart, quickActionsStart + 1800);
  failIfIncludes(quickActionsBlock, 'Dodaj notatk\u0119', 'ClientDetail side quick actions must not contain add-note action');
}
const tabOrder = client.match(/type\s+ClientTab\s*=\s*([^;]+);/);
if (tabOrder && !(tabOrder[1].indexOf("'cases'") !== -1 && tabOrder[1].indexOf("'summary'") !== -1 && tabOrder[1].indexOf("'cases'") < tabOrder[1].indexOf("'summary'"))) {
  fail('ClientDetail semantic tab order should keep cases before summary');
}

// CaseDetail: removed panels and real history marker.
failIfIncludes(caseDetail, 'Roadmapa sprawy', 'CaseDetail roadmap panel');
failIfIncludes(caseDetail, 'Portal i \u017Ar\u00F3d\u0142a', 'CaseDetail portal/source panel');
failIfIncludes(caseDetail, 'case-detail-roadmap-panel', 'CaseDetail roadmap class');
failIfIncludes(caseDetail, 'cf-activity-roadmap', 'CaseDetail activity roadmap usage');
failIfIncludes(caseDetail, 'Zapis operacyjny sprawy', 'CaseDetail fake history copy');
passIfIncludes(caseDetail, 'data-case-history-list="true"', 'CaseDetail real history list marker');

// Leads: value must stay out of compact meta return array, but the intentionally ignored
// _leadValueLabel parameter is allowed as the compatibility contract from Stage14E.
passIfIncludes(leads, 'data-lead-value-pill="true"', 'Leads dedicated value pill marker');
passIfIncludes(leads, 'STAGE14E_LEADS_VALUE_META_DEDUP', 'Leads value meta dedupe marker');
const compactMeta = extractFunction(leads, 'buildLeadCompactMeta');
passIfIncludes(compactMeta, 'void _leadValueLabel;', 'Leads compact meta ignores value label parameter');
const compactReturn = stripComments(getReturnArrayBlock(compactMeta, 'buildLeadCompactMeta'));
failIfRegex(compactReturn, /\b(_?leadValueLabel|dealValue|leadValue|budget|value|formatCurrency|formatMoney|buildLeadValueLabel)\b/i, 'raw value field inside compact lead meta return array');

// LeadDetail: removed copy, visible actions, empty state marker.
failIfIncludes(leadDetail, 'Co tu trzeba zrobi\u0107 teraz', 'LeadDetail removed decision title');
failIfIncludes(leadDetail, 'Kr\u00F3tki panel decyzyjny', 'LeadDetail removed decision description');
passIfAny(leadDetail, ['data-lead-quick-actions', 'aria-label="Szybkie akcje na leadzie"'], 'LeadDetail quick actions marker');
passIfIncludes(leadDetail, 'data-lead-next-action-empty', 'LeadDetail next action empty marker');
passIfIncludes(leadDetail, 'Pow\u00F3d: -', 'LeadDetail risk reason empty fallback');

// LeadDetail CSS: allow descendant one-line ellipsis, require the local Stage14F readability override.
passIfRegexLike(leadCss, /\.lead-detail-right-card[\s\S]{0,500}height\s*:\s*auto/i, 'LeadDetail card local height:auto override');
passIfRegexLike(leadCss, /\.lead-detail-right-card[\s\S]{0,600}min-height\s*:\s*0/i, 'LeadDetail card local min-height reset');
passIfRegexLike(leadCss, /\.lead-detail-right-card[\s\S]{0,800}overflow\s*:\s*visible/i, 'LeadDetail card local overflow visible override');
passIfRegexLike(leadCss, /\.lead-detail-right-card[\s\S]{0,1500}overflow-wrap\s*:\s*anywhere/i, 'LeadDetail right-card text wrapping');

// Package script is part of this guard contract.
passIfIncludes(packageJson, '"check:closeflow-admin-feedback-2026-05-11-p3"', 'package.json P3 script key');
passIfIncludes(packageJson, 'scripts/check-closeflow-admin-feedback-2026-05-11-p3.cjs', 'package.json P3 script target');

console.log('\u2714 CloseFlow admin feedback P3 guard passed');

function passIfRegexLike(source, regex, label) {
  if (!regex.test(source)) fail('Missing pattern: ' + label + ' (' + regex + ')');
}
