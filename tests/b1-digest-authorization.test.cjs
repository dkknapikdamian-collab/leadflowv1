const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('B1 daily and weekly interactive reports use one verified workspace scope gate', () => {
  const daily = read('src/server/daily-digest-handler.ts');
  const weekly = read('src/server/weekly-report-handler.ts');
  const authorization = read('src/server/digest-authorization.ts');

  for (const source of [daily, weekly]) {
    assert.match(source, /getInteractiveDigestScope/);
    assert.match(authorization, /requireRequestIdentity/);
    assert.match(authorization, /resolveRequestWorkspaceId/);
    assert.match(authorization, /DIGEST_WORKSPACE_SCOPE_MISMATCH|DIGEST_WORKSPACE_NOT_FOUND/);

    const scopeIndex = source.lastIndexOf('getInteractiveDigestScope(req, body)');
    const bundleIndex = Math.max(source.indexOf('await loadWorkspaceBundle'), source.indexOf('await loadWeeklyBundle'));
    const sendIndex = source.indexOf('sendResendEmail({');
    assert.ok(scopeIndex >= 0 && scopeIndex < bundleIndex, 'scope gate must precede tenant data loading');
    assert.ok(scopeIndex < sendIndex, 'scope gate must precede provider calls');

    assert.doesNotMatch(source, /if \(vercelCron\) return true/);
    assert.doesNotMatch(source, /if \(asBool\([^\n]+manual[^\n]+\)\) return true/);
  }
});

test('B1 report deduplication is workspace-scoped', () => {
  const daily = read('src/server/daily-digest-handler.ts');
  const weekly = read('src/server/weekly-report-handler.ts');

  assert.match(daily, /workspace_id=eq\.\$\{encodeURIComponent\(workspaceId\)\}/);
  assert.match(weekly, /workspace_id=eq\.\$\{encodeURIComponent\(workspaceId\)\}/);
  assert.match(read('supabase/migrations/20260810120000_b1_digest_workspace_scope.sql'), /drop index if exists public\.idx_digest_logs_once_per_day/i);
  assert.match(read('supabase/migrations/20260810120000_b1_digest_workspace_scope.sql'), /having count\(\*\) > 1/);
  assert.match(read('supabase/migrations/20260810120000_b1_digest_workspace_scope.sql'), /workspace_id, report_type, sent_for_date/);
});

test('B1 Settings digest actions send the verified Supabase bearer token', () => {
  const settings = read('src/pages/Settings.tsx');
  const diagnostics = settings.slice(settings.indexOf("fetch('/api/daily-digest'"));
  assert.match(diagnostics, /getSupabaseAccessToken/);
  assert.match(diagnostics, /Authorization: `Bearer \$\{token\}`/);
});
