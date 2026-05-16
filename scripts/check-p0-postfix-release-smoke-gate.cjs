const fs = require('node:fs');
const path = require('node:path');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(process.cwd(), rel));
}

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

function assertFile(rel) {
  assert(exists(rel), `missing file: ${rel}`);
}

function assertIncludes(rel, needle, label) {
  assertFile(rel);
  assert(read(rel).includes(needle), `${rel} missing: ${label || needle}`);
}

function assertMissing(rel) {
  assert(!exists(rel), `${rel} must not exist`);
}

function readJson(rel) {
  assertFile(rel);
  try {
    return JSON.parse(read(rel));
  } catch (error) {
    console.error(`FAIL: ${rel} is not valid JSON`);
    console.error(error.message);
    process.exit(1);
  }
}

function hasRewrite(vercel, source, destination) {
  const rewrites = Array.isArray(vercel.rewrites) ? vercel.rewrites : [];
  return rewrites.some((entry) => entry && entry.source === source && entry.destination === destination);
}

// P0: confirmed hotfix must stay in place after the lead-save incident.
assertIncludes('src/server/_access-gate.ts', 'P0_WORKSPACE_WRITE_ACCESS_STATUS_COMPAT_2026_05_03', 'workspace write-access status compatibility marker');
assertIncludes('src/server/_access-gate.ts', 'normalizeWorkspaceAccessStatus', 'workspace access status normalization');
assertIncludes('src/server/_access-gate.ts', "status === 'free_active' || status === 'free'", 'Free write compatibility');
assertIncludes('src/server/_supabase-auth.ts', 'row.status ?? row.statusCode', 'auth/gate errors preserve HTTP status');

// P0: lead writes still have server-side workspace + access + limit gates.
assertIncludes('api/leads.ts', 'resolveRequestWorkspaceId(req)', 'lead API resolves workspace server-side');
assertIncludes('api/leads.ts', 'await assertWorkspaceWriteAccess', 'lead API write access gate');
assertIncludes('api/leads.ts', "await assertWorkspaceEntityLimit(finalWorkspaceId, 'lead')", 'lead API Free limit gate');
assertIncludes('api/leads.ts', "await requireScopedRow('leads'", 'lead API scoped row guard');

// P0: AI must remain read/draft-only, not direct-write.
assertIncludes('src/server/ai-application-operator.ts', 'AI_APP_CONTEXT_OPERATOR_STAGE26', 'AI application operator marker');
assertIncludes('src/server/ai-application-operator.ts', 'Nie znalaz\u0142em tego w danych aplikacji.', 'AI no-hallucination fallback');
assertIncludes('src/server/ai-application-operator.ts', 'noAutoWrite: true', 'AI no-auto-write contract');
assertIncludes('src/server/ai-application-operator.ts', 'Z komend\u0105 zapisu utw\u00F3rz szkic do sprawdzenia, nigdy finalny rekord.', 'AI draft-only instruction');

// Vercel Hobby/API consolidation guard. Parse JSON instead of matching fragile formatting.
assertMissing('api/assistant.ts');
assertMissing('api/assistant-context.ts');
assertIncludes('api/system.ts', "kind === 'assistant-context'", 'assistant-context routed through system endpoint');
assertIncludes('api/system.ts', "kind === 'ai-assistant'", 'ai-assistant routed through system endpoint');
const vercel = readJson('vercel.json');
assert(hasRewrite(vercel, '/api/assistant', '/api/system?kind=ai-assistant'), 'vercel.json missing assistant rewrite /api/assistant -> /api/system?kind=ai-assistant');
assert(hasRewrite(vercel, '/api/assistant-context', '/api/system?kind=assistant-context'), 'vercel.json missing assistant-context rewrite /api/assistant-context -> /api/system?kind=assistant-context');
assert(hasRewrite(vercel, '/api/records', '/api/system?apiRoute=records'), 'vercel.json missing records consolidation rewrite');
assert(hasRewrite(vercel, '/api/payments', '/api/system?apiRoute=payments'), 'vercel.json missing payments consolidation rewrite');

// Release evidence tooling must be present before user handoff.
assertFile('scripts/print-release-evidence.cjs');
assertIncludes('package.json', 'audit:release-evidence', 'release evidence npm script');
assertIncludes('package.json', 'verify:closeflow:quiet', 'quiet release verification script');
assertIncludes('package.json', 'test:critical', 'critical compact test script');

console.log('PASS p0 postfix release smoke gate v2');
console.log('Manual smoke required before release: login -> add lead -> reload -> task/event -> Today -> lead to case -> AI read query -> second user isolation.');
