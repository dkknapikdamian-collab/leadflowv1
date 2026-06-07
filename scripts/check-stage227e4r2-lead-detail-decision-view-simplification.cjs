#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const leadPath = path.join(root, 'src/pages/LeadDetail.tsx');
const cssPath = path.join(root, 'src/styles/closeflow-lead-detail-sales-signal-stage227e4.css');
const pkgPath = path.join(root, 'package.json');
const source = fs.readFileSync(leadPath, 'utf8').replace(/^\uFEFF/, '');
const css = fs.readFileSync(cssPath, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8').replace(/^\uFEFF/, ''));
function pass(msg) { console.log('PASS ' + msg); }
function fail(msg) { console.error('FAIL STAGE227E4R2_DECISION_VIEW_SIMPLIFICATION: ' + msg); process.exit(1); }
function requireContains(haystack, needle, label) {
  if (!haystack.includes(needle)) fail('missing: ' + label);
  pass('contains: ' + label);
}
requireContains(source, 'STAGE227E4_LEAD_DETAIL_SALES_SIGNAL_SECTION', 'Stage227E4 marker');
requireContains(source, 'STAGE227E4R2_LEAD_DETAIL_DECISION_VIEW_SIMPLIFICATION', 'Stage227E4R2 marker');
requireContains(source, 'buildLeadSalesSignalStage227E4', 'buildLeadSalesSignalStage227E4');
requireContains(source, 'leadSalesSignalItemsStage227E4', 'leadSalesSignalItemsStage227E4');
requireContains(source, 'data-stage227e4-sales-signal-section="true"', 'sales context section data marker');
requireContains(source, 'data-stage227e4r2-sales-context-section="true"', 'R2 sales context section marker');
requireContains(source, 'Kontekst sprzedażowy', 'Kontekst sprzedażowy');
requireContains(source, 'Potrzeba / problem', 'Potrzeba / problem');
requireContains(source, 'Termin / pilność', 'Termin / pilność');
requireContains(source, 'Budżet / potencjał', 'Budżet / potencjał');
requireContains(source, 'Decyzja', 'Decyzja');
requireContains(source, 'Blokada', 'Blokada');
if (source.includes('Powód kontaktu')) fail('large decision panel still contains Powód kontaktu');
if (source.includes('SYGNAŁ SPRZEDAŻOWY')) fail('large uppercase Sygnał sprzedażowy copy still present');
const helperStart = source.indexOf('function buildLeadSalesSignalStage227E4');
const helperEnd = source.indexOf('export default function LeadDetail()', helperStart);
if (helperStart < 0 || helperEnd < 0) fail('cannot isolate sales context helper');
const helper = source.slice(helperStart, helperEnd);
if (helper.includes('input.sourceLabel')) fail('helper still falls back to sourceLabel');
if (helper.includes('lead.status')) fail('helper still falls back to lead.status');
if (helper.includes("key: 'reason'")) fail('helper still exposes reason item as a major decision field');
const renderStart = source.indexOf('data-stage227e4r2-sales-context-section="true"');
const workStart = source.indexOf('data-stage228b-lead-work-action-center="true"');
if (renderStart < 0 || workStart < 0 || renderStart > workStart) fail('sales context must render before Work Action Center');
requireContains(css, 'STAGE227E4R2_LEAD_DETAIL_DECISION_VIEW_SIMPLIFICATION', 'R2 CSS marker');
requireContains(css, 'lead-detail-sales-context-grid', 'compact context grid css');
requireContains(css, 'min-height: 92px', 'compact card height');
if (!pkg.scripts['check:stage227e4-sales-signal-section']) fail('missing legacy E4 check script');
if (!pkg.scripts['test:stage227e4-sales-signal-section']) fail('missing legacy E4 test script');
if (!pkg.scripts['check:stage227e4r2-lead-detail-decision-view-simplification']) fail('missing E4R2 check script');
if (!pkg.scripts['test:stage227e4r2-lead-detail-decision-view-simplification']) fail('missing E4R2 test script');
pass('STAGE227E4R2_DECISION_VIEW_SIMPLIFICATION');
