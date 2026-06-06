const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const errors = [];

function read(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function requireIncludes(label, content, token) {
  if (!content.includes(token)) errors.push(`${label}: missing token ${JSON.stringify(token)}`);
}

function requireNotMatches(label, content, regex, message) {
  if (regex.test(content)) errors.push(`${label}: ${message}`);
}

const page = read('src/pages/SalesFunnel.tsx');
const pkg = read('package.json');
const quiet = read('scripts/closeflow-release-check-quiet.cjs');

for (const token of [
  'STAGE227B_SALES_FUNNEL_DECISION_LIST',
  'data-stage227b-decision-list-view="true"',
  'data-stage227b-owner-filter-row="true"',
  'data-stage227b-stage-filter-strip="true"',
  'data-stage227b-decision-list="true"',
  'data-stage227b-funnel-list-card="true"',
  'data-stage227b-owner-priority-panel="true"',
  'Etapy jako filtr, nie ściśnięte kolumny',
  'Bez przeładowanego kanbana',
  'Reguła widoku',
]) {
  requireIncludes('SalesFunnel.tsx', page, token);
}

for (const token of [
  'ownerFilter',
  'stageFilter',
  'filteredCards',
  'countByFilter',
  'needsMovement',
  'cardSort',
  'view.columns.flatMap',
]) {
  requireIncludes('SalesFunnel.tsx', page, token);
}

requireIncludes('package.json', pkg, 'check:stage227b-sales-funnel-decision-list');
requireIncludes('package.json', pkg, 'test:stage227b-sales-funnel-decision-list');
requireIncludes('closeflow-release-check-quiet.cjs', quiet, 'stage227b sales funnel decision list guard');
requireIncludes('closeflow-release-check-quiet.cjs', quiet, 'stage227b sales funnel decision list test');

requireNotMatches('SalesFunnel.tsx', page, /view\.columns\.map\(\(column\)\s*=>\s*\(\s*<section[\s\S]{0,600}data-stage227a-funnel-column/i, 'crowded kanban column render still exists');
requireNotMatches('SalesFunnel.tsx', page, /className="[^"]*grid[^"]*xl:grid-cols-\[repeat\(/i, 'wide repeated kanban grid is forbidden');
requireNotMatches('SalesFunnel.tsx', page, /draggable\b|onDragStart\b|onDrop\b|dnd-kit|react-beautiful-dnd/i, 'drag/drop is forbidden');
requireNotMatches('SalesFunnel.tsx', page, /updateLeadInSupabase|updateCaseInSupabase|insertLeadToSupabase|createCaseInSupabase|updateClientInSupabase/, 'read-only view imported a mutation helper');
requireNotMatches('SalesFunnel.tsx', page, /sendEmail|sendMail|Resend|smtp|createAiDraft|updateAiDraft|AiDraft/i, 'mail sending or AI draft mutation is forbidden');

if (errors.length) {
  console.error('\nSTAGE227B SALES FUNNEL DECISION LIST GUARD FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('PASS STAGE227B sales funnel decision list guard');
