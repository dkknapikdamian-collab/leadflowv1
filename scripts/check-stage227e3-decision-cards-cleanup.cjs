const fs = require('fs');

const leadPath = 'src/pages/LeadDetail.tsx';
const cssPath = 'src/styles/visual-stage14-lead-detail-vnext.css';
const pkgPath = 'package.json';

const lead = fs.readFileSync(leadPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const pkg = fs.readFileSync(pkgPath, 'utf8');

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  console.error(`FAIL STAGE227E3_DECISION_CARDS_CLEANUP: ${message}`);
  process.exit(1);
}

function mustContain(source, fragment, label = fragment) {
  if (!source.includes(fragment)) fail(`missing: ${label}`);
  pass(`contains: ${label}`);
}

function mustContainAny(source, fragments, label) {
  if (!fragments.some((fragment) => source.includes(fragment))) fail(`missing any: ${label}`);
  pass(`contains any: ${label}`);
}

function mustNotContain(source, fragment, label = fragment) {
  if (source.includes(fragment)) fail(`forbidden: ${label}`);
  pass(`not contains: ${label}`);
}

function extractTopGrid() {
  const startCandidates = [
    'data-stage227e3-decision-cards="true"',
    'data-stage227e2-top-cards="true"',
    'className="lead-detail-top-grid"',
  ];
  let start = -1;
  for (const marker of startCandidates) {
    start = lead.indexOf(marker);
    if (start >= 0) break;
  }
  if (start < 0) fail('top decision grid start not found');
  const sectionStart = lead.lastIndexOf('<section', start);
  const from = sectionStart >= 0 ? sectionStart : start;
  const end = lead.indexOf('</section>', start);
  if (end < 0) fail('top decision grid end not found');
  return lead.slice(from, end + '</section>'.length);
}

const topGrid = extractTopGrid();

mustContain(lead, 'STAGE227E3_DECISION_CARDS_CLEANUP', 'stage marker');
mustContainAny(lead, ['data-stage227e3-decision-cards="true"', 'data-stage227e2-top-cards="true"'], 'decision cards grid marker');
mustContain(topGrid, 'data-stage227e2-next-step-card="true"', 'next step card marker');
mustContain(topGrid, 'data-stage227e2-potential-card="true"', 'potential card marker');
mustContain(topGrid, 'data-stage227e2-silence-risk-card="true"', 'silence risk card marker');
mustContainAny(topGrid, ['data-stage227e3-blocker-card="true"', 'data-stage227e3-blockade-card="true"'], 'blocker card marker');
mustContain(topGrid, 'Blokada', 'blocker card label');

const cardCount = (topGrid.match(/lead-detail-top-card/g) || []).length;
if (cardCount < 4) fail(`expected at least 4 top decision cards, got ${cardCount}`);
pass(`top decision cards count: ${cardCount}`);

mustNotContain(topGrid, 'Aktywny lead', 'old decorative active lead card');
mustNotContain(topGrid, 'sourceLabel(lead.source)', 'source duplicated inside top cards');
mustNotContain(topGrid, 'statusLabel(lead.status)', 'status duplicated inside top cards');
mustNotContain(lead, 'data-stage227e4-sales-signal-section="true"', 'removed sales context section stays removed');
mustNotContain(lead, 'data-stage227e4r2-sales-context-section="true"', 'removed compact sales context section stays removed');

mustContain(css, 'STAGE227E3_DECISION_CARDS_CLEANUP_CSS', 'CSS marker');
mustContain(css, '.lead-detail-top-grid', 'top grid CSS rule');
mustContainAny(css, ['repeat(4, minmax(0, 1fr))', 'repeat(4,minmax(0,1fr))'], '4-column top grid CSS');
mustContainAny(css, ['lead-detail-callout-red', 'lead-detail-callout-danger', 'lead-detail-callout-blocker'], 'blocker card tone CSS');

mustContain(pkg, 'check:stage227e3-decision-cards-cleanup', 'package check script');
mustContain(pkg, 'test:stage227e3-decision-cards-cleanup', 'package test script');

console.log('PASS STAGE227E3_DECISION_CARDS_CLEANUP');