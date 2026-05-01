const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const failures = [];

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function exists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

function check(name, fn) {
  try {
    fn();
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
  }
}

function walk(dir, result = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return result;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, result);
    else result.push(rel);
  }
  return result;
}

function grep(relPath, pattern, message) {
  const source = read(relPath);
  assert.match(source, pattern, message || `${relPath} missing ${pattern}`);
}

function reject(relPath, pattern, message) {
  const source = read(relPath);
  assert.doesNotMatch(source, pattern, message || `${relPath} contains forbidden ${pattern}`);
}

function listFirestoreUsage() {
  const files = [
    ...walk('src'),
    ...walk('api'),
  ].filter((file) => /\.(ts|tsx|js|jsx|cjs|mjs)$/.test(file));

  const hits = [];
  const forbidden = [
    /from\s+['"]firebase\/firestore['"]/,
    /require\(['"]firebase\/firestore['"]\)/,
    /\baddDoc\s*\(/,
    /\bsetDoc\s*\(/,
    /\bupdateDoc\s*\(/,
    /\bdeleteDoc\s*\(/,
    /\bwriteBatch\s*\(/,
    /\brunTransaction\s*\(/,
    /\bonSnapshot\s*\(/,
    /\bcollection\s*\(\s*db\b/,
  ];

  for (const file of files) {
    const lines = read(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (forbidden.some((pattern) => pattern.test(line))) {
        hits.push(`${file}:${index + 1}: ${line.trim()}`);
      }
    });
  }

  return hits;
}

check('auth guard', () => {
  grep('src/server/_supabase-auth.ts', /AUTHORIZATION_BEARER_REQUIRED/);
  grep('src/server/_supabase-auth.ts', /INVALID_SUPABASE_ACCESS_TOKEN/);
  grep('src/server/_request-scope.ts', /requireSupabaseRequestContext/);
  grep('src/server/_request-scope.ts', /withWorkspaceFilter/);
});

check('access gate', () => {
  grep('src/server/_access-gate.ts', /trial_active/);
  grep('src/server/_access-gate.ts', /trial_expired/);
  grep('src/server/_access-gate.ts', /free_active/);
  grep('src/server/_access-gate.ts', /FREE_LIMITS/);
});

check('data contract normalizers', () => {
  const source = read('src/lib/data-contract.ts');
  for (const name of [
    'normalizeLeadContract',
    'normalizeTaskContract',
    'normalizeEventContract',
    'normalizeCaseContract',
    'normalizeClientContract',
    'normalizeActivityContract',
  ]) {
    assert.match(source, new RegExp(`export function ${name}\\b`), `missing ${name}`);
  }
});

check('portal token and tampering protection', () => {
  grep('src/pages/ClientPortal.tsx', /createPortalSessionFromSupabase/);
  grep('src/pages/ClientPortal.tsx', /fetchPortalCaseBundleFromSupabase\(caseId, activeSession\)/);
  grep('src/pages/ClientPortal.tsx', /submitPortalCaseItemInSupabase/);
  grep('src/pages/ClientPortal.tsx', /portalSession/);
});

check('AI drafts confirmation and raw text cleanup', () => {
  const source = read('src/lib/ai-drafts.ts');
  assert.match(source, /status:\s*'draft'/, 'pending/draft status missing');
  assert.match(source, /markAiLeadDraftConvertedAsync/, 'confirm helper missing');
  assert.match(source, /archiveAiLeadDraftAsync/, 'cancel helper missing');
  assert.match(source, /rawText:\s*''/, 'rawText cleanup on confirm/cancel missing');
});

check('Firestore decommission', () => {
  const hits = listFirestoreUsage();
  assert.equal(
    hits.length,
    0,
    `Firestore is legacy and must not be used from active src/api files. Migrate to Supabase.\n${hits.slice(0, 30).map((hit) => `- ${hit}`).join('\n')}${hits.length > 30 ? `\n... and ${hits.length - 30} more` : ''}`,
  );
});

check('Gemini secret not in client bundle', () => {
  const files = walk('src').filter((file) => /\.(ts|tsx|js|jsx)$/.test(file));
  const hits = [];
  for (const file of files) {
    const source = read(file);
    if (/GEMINI_API_KEY|process\.env\.GEMINI|import\.meta\.env\.GEMINI/.test(source)) hits.push(file);
  }
  assert.equal(hits.length, 0, `Gemini secret reference in client source: ${hits.join(', ')}`);
});

check('templates UI matches app visual shell', () => {
  grep('src/pages/Templates.tsx', /app-surface-strong/);
  grep('src/pages/Templates.tsx', /app-text/);
  grep('src/pages/Templates.tsx', /app-muted/);
  grep('src/pages/ResponseTemplates.tsx', /app-surface-strong/);
  grep('src/pages/ResponseTemplates.tsx', /app-text/);
  grep('src/pages/ResponseTemplates.tsx', /app-muted/);
  reject('src/pages/Templates.tsx', /DostÄ|Ĺ|Ă|â€/, 'Templates.tsx contains mojibake');
  reject('src/pages/ResponseTemplates.tsx', /DostÄ|Ĺ|Ă|â€/, 'ResponseTemplates.tsx contains mojibake');
});

if (failures.length) {
  console.error('A13 critical regression guard failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: A13 critical regression guard passed.');
