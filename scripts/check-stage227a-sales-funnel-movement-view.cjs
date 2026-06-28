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
const helper = read('src/lib/owner-control/sales-funnel-movement.ts');
const app = read('src/App.tsx');
const layout = read('src/components/Layout.tsx');
const pkg = read('package.json');

for (const marker of [
  'data-stage227a-sales-funnel-movement-view="true"',
  'data-stage227a-funnel-summary="true"',
  'data-stage227a-funnel-column="true"',
  'data-stage227a-funnel-card="true"',
  'data-stage227a-funnel-next-step="true"',
  'data-stage227a-funnel-silence-age="true"',
  'data-stage227a-funnel-risk-flag="true"',
  'data-stage227a-funnel-value="true"',
]) {
  requireIncludes('SalesFunnel.tsx', page, marker);
}

requireIncludes('App.tsx', app, "import('./pages/SalesFunnel')");
requireIncludes('App.tsx', app, 'const SalesFunnel');
requireIncludes('App.tsx', app, 'CLOSEFLOW_ROUTES.funnel');
requireIncludes('Layout.tsx', layout, "label: 'Lejek'");
requireIncludes('Layout.tsx', layout, "path: '/funnel'");
requireIncludes('package.json', pkg, 'check:stage227a-sales-funnel-movement-view');
requireIncludes('package.json', pkg, 'test:stage227a-sales-funnel-movement-view');

for (const token of [
  'buildSalesFunnelMovementView',
  'SalesFunnelMovementCard',
  'buildContactCadenceGrid',
  'buildLostLeadRescue',
  'buildRecordOperationalBadges',
  'getCaseFinanceSummary',
  'getNearestWorkItemAction',
  'normalizeWorkItem',
]) {
  requireIncludes('sales-funnel-movement.ts', helper, token);
}

requireNotMatches('SalesFunnel.tsx', page, /updateLeadInSupabase|updateCaseInSupabase|insertLeadToSupabase|createCaseInSupabase|updateClientInSupabase/, 'read-only view imported a mutation helper');
requireNotMatches('SalesFunnel.tsx', page, /draggable\b|onDragStart\b|onDrop\b|dnd-kit|react-beautiful-dnd/i, 'drag/drop is forbidden in Stage227A');
requireNotMatches('SalesFunnel.tsx', page, /sendEmail|sendMail|Resend|smtp|createAiDraft|updateAiDraft|AiDraft/i, 'mail sending or AI draft mutation is forbidden in Stage227A');
requireNotMatches('sales-funnel-movement.ts', helper, /lastContactAt\s*:\s*[^,\n]*(updatedAt|updated_at|createdAt|created_at)/i, 'updatedAt/createdAt cannot be written as lastContactAt truth');
requireNotMatches('sales-funnel-movement.ts', helper, /candidateDate\([^)]*\[(?:[^\]]*)(updatedAt|updated_at|createdAt|created_at)(?:[^\]]*)\][^)]*\)/i, 'helper must not build contact candidates from updatedAt/createdAt');

const forbiddenHelperWrites = /updateLeadInSupabase|updateCaseInSupabase|insertLeadToSupabase|createCaseInSupabase|fetch\([^)]*method\s*:\s*['"](?:POST|PATCH|DELETE)['"]/i;
requireNotMatches('sales-funnel-movement.ts', helper, forbiddenHelperWrites, 'helper must be pure/read-only');

if (!/href:\s*'\/leads\/'/.test(helper)) errors.push('sales-funnel-movement.ts: missing lead href /leads/:id');
if (!/href:\s*'\/cases\/'/.test(helper)) errors.push('sales-funnel-movement.ts: missing case href /cases/:id');
if (!/entityType:\s*'lead'/.test(helper)) errors.push('sales-funnel-movement.ts: missing lead entityType card');
if (!/entityType:\s*'case'/.test(helper)) errors.push('sales-funnel-movement.ts: missing case entityType card');
if (!/commissionAmount/.test(helper)) errors.push('sales-funnel-movement.ts: case value/prowizja must use finance helper commissionAmount');

if (errors.length) {
  console.error('\nSTAGE227A SALES FUNNEL MOVEMENT VIEW GUARD FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('PASS STAGE227A sales funnel movement view guard');
