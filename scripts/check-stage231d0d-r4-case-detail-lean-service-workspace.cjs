#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const failures = [];
const repoRoot = process.cwd();
const caseDetailPath = path.join(repoRoot, 'src', 'pages', 'CaseDetail.tsx');

function fail(message) {
  failures.push(message);
}

function requireToken(source, token, label) {
  if (!source.includes(token)) fail(`missing ${label}: ${token}`);
}

function forbidToken(source, token, label) {
  if (source.includes(token)) fail(`forbidden ${label}: ${token}`);
}

function count(source, token) {
  return source.split(token).length - 1;
}

function requireCount(source, token, expected, label) {
  const actual = count(source, token);
  if (actual !== expected) fail(`${label}: expected ${expected}, got ${actual}`);
}

if (!fs.existsSync(caseDetailPath)) {
  console.error(`STAGE231D0D-R4 guard: FAIL\n- missing ${caseDetailPath}`);
  process.exit(1);
}

const src = fs.readFileSync(caseDetailPath, 'utf8');

const badTokens = [
  0x0102, // Ă
  0x0139, // Ĺ
  0x00c4, // Ä
  0x00c5, // Å
  0x00c2, // Â
  0xfffd, // �
].map((code) => String.fromCharCode(code)).concat(['ďż˝']);

for (const token of badTokens) {
  forbidToken(src, token, 'mojibake token in CaseDetail.tsx');
}

requireToken(src, 'STAGE231D0D_R4_CASE_DETAIL_LEAN_SERVICE_WORKSPACE', 'R4 freeze marker');
requireToken(src, 'data-case-service-tabs-column="true"', 'service tabs column marker');
requireToken(src, 'data-case-service-actions-panel="true"', 'service actions panel marker');
requireToken(src, 'data-case-service-notes-panel="true"', 'service notes panel marker');
requireToken(src, 'data-case-settlement-rail-card="true"', 'settlement rail card marker');
requireToken(src, 'data-case-quick-actions-rail="true"', 'quick actions rail marker');

requireCount(src, 'data-case-service-actions-panel="true"', 1, 'service actions panel marker count');
requireCount(src, 'data-case-service-notes-panel="true"', 1, 'service notes panel marker count');
requireCount(src, 'data-case-settlement-rail-card="true"', 1, 'settlement rail card marker count');
requireCount(src, 'data-case-quick-actions-rail="true"', 1, 'quick actions rail marker count');

const railStart = src.indexOf('<aside className="case-detail-right-rail"');
if (railStart < 0) fail('missing case-detail-right-rail aside');
const railEndCandidates = [
  src.indexOf('<CaseItemDialog', railStart),
  src.indexOf('</main>', railStart),
].filter((value) => value > railStart);
const railEnd = railEndCandidates.length ? Math.min(...railEndCandidates) : src.length;
const rail = src.slice(railStart, railEnd);

requireToken(rail, 'data-case-settlement-rail-card="true"', 'right rail settlement');
requireToken(rail, 'data-case-quick-actions-rail="true"', 'right rail quick actions');
requireToken(rail, '<CaseQuickActions', 'CaseQuickActions in rail');

for (const token of [
  'Dane sprawy i klienta',
  'data-case-context-rail-card="true"',
  'data-case-client-data-rail-card="true"',
  'case-payment-history-expanded',
  'case-cost-history-expanded',
]) {
  forbidToken(rail, token, 'forbidden permanent rail content');
}

if (failures.length) {
  console.error('STAGE231D0D-R4 guard: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE231D0D-R4 guard: PASS');
