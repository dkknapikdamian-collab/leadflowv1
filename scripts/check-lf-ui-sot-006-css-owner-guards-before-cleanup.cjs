#!/usr/bin/env node
/* Compatibility guard: LF-UI-SOT-006 now delegates CSS ownership to the
 * semantic registry introduced by LF-UI-SOT-007. Historical marker counts
 * are intentionally not accepted as evidence. */
const fs = require('node:fs');
const path = require('node:path');
const { validateCssArchitecture } = require('./check-closeflow-ui-ssot.cjs');

const root = path.resolve(__dirname, '..');
const SOT006_STAGE = 'LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP';
const ROUTE_OWNER_DICTIONARY = [
  '/', '/today', '/leads', '/leads/:leadId', '/clients', '/clients/:clientId',
  '/cases', '/cases/:caseId', '/funnel', '/tasks', '/calendar', '/templates',
  '/response-templates', '/activity', '/billing', '/help', '/support', '/settings',
  '/settings/ai', '/ai-drafts', '/notifications', '/login', '/start',
  '/portal/:caseId/:token', '/privacy', '/terms', '/ui-preview-vnext', '/ui-preview-vnext-full',
  // Legacy aliases remain routable and therefore need explicit ownership records.
  '/dashboard', '/case/:caseId', '/dev/funnel', '/case-templates',
];
const registry = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/source-of-truth/visual-owner-registry.json'), 'utf8'));
const CSS_OWNER_DICTIONARY = new Map(Object.entries(registry.concerns || {}).map(([concern, definition]) => [concern, { owner: definition.owner, status: 'CANONICAL_OWNER' }]));

function extractRoutes() {
  const source = fs.readFileSync(path.join(root, 'src/lib/routes.ts'), 'utf8');
  return Array.from(source.matchAll(/['"](\/[^'"]*)['"]/g)).map((match) => match[1]);
}

function runChecks() {
  const failures = [];
  const architecture = validateCssArchitecture();
  if (!architecture.ok) failures.push(...architecture.failures.map((message) => `${SOT006_STAGE} FAIL: ${message}`));
  const routes = extractRoutes();
  for (const route of routes) if (!ROUTE_OWNER_DICTIONARY.includes(route)) failures.push(`${SOT006_STAGE} FAIL: missing route owner record for ${route}`);
  const appSource = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
  const activeCssImports = Array.from(appSource.matchAll(/^import\s+['"]([^'"]+\.css)['"];\s*$/gm));
  if (activeCssImports.length !== 2) failures.push(`${SOT006_STAGE} FAIL: expected exactly two App stylesheet boundaries, found ${activeCssImports.length}`);
  return {
    ok: failures.length === 0,
    failures,
    summary: {
      semanticOwnerConcerns: architecture.summary.concerns,
      activeCssFiles: architecture.summary.activeCssFiles,
      oneOwnerPerVisualConcern: architecture.summary.ONE_OWNER_PER_VISUAL_CONCERN,
      activeRuntimePatchLayers: architecture.summary.ACTIVE_RUNTIME_PATCH_LAYERS,
      historicalStageRuntimeOwners: architecture.summary.HISTORICAL_STAGE_RUNTIME_OWNERS,
      competingVisualOwners: architecture.summary.COMPETING_VISUAL_OWNERS,
      unknownVisualOwners: architecture.summary.UNKNOWN_VISUAL_OWNERS,
      activeAppStylesheetBoundaries: activeCssImports.length,
      routeOwners: routes.length,
    },
  };
}

if (require.main === module) {
  const result = runChecks();
  if (!result.ok) {
    console.error(`${SOT006_STAGE}: FAIL`);
    for (const failure of result.failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log(`${SOT006_STAGE}: PASS`);
  console.log(JSON.stringify(result.summary, null, 2));
}

module.exports = { SOT006_STAGE, ROUTE_OWNER_DICTIONARY, CSS_OWNER_DICTIONARY, runChecks };
