const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const failures = [];

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function walk(dir, result = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return result;

  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === 'test-results') continue;

    const rel = path.join(dir, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      walk(rel, result);
      continue;
    }

    result.push(rel);
  }

  return result;
}

function check(name, fn) {
  try {
    fn();
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
  }
}

function grep(relPath, pattern, message) {
  const source = read(relPath);
  assert.match(source, pattern, message || `${relPath} missing ${pattern}`);
}

function reject(relPath, pattern, message) {
  const source = read(relPath);
  assert.doesNotMatch(source, pattern, message || `${relPath} contains forbidden ${pattern}`);
}

function sourceFilesFrom(...dirs) {
  return dirs
    .flatMap((dir) => walk(dir))
    .filter((file) => /\.(ts|tsx|js|jsx|cjs|mjs)$/.test(file));
}

function listFirestoreUsage() {
  const files = sourceFilesFrom('src', 'api');

  const hits = [];
  const forbidden = [
    /from\s+['"]firebase\/firestore['"]/,
    /require\(['"]firebase\/firestore['"]\)/,
    /\bgetFirestore\s*\(/,
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

function listGeminiClientSecretReferences() {
  const files = sourceFilesFrom('src')
    .filter((file) => !file.startsWith('src/server/'))
    .filter((file) => !file.endsWith('.test.ts'))
    .filter((file) => !file.endsWith('.test.tsx'));

  const hits = [];

  for (const file of files) {
    const lines = read(file).split(/\r?\n/);

    lines.forEach((line, index) => {
      if (/GEMINI_API_KEY|process\.env\.GEMINI|import\.meta\.env\.GEMINI/.test(line)) {
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
  const hits = listGeminiClientSecretReferences();

  assert.equal(
    hits.length,
    0,
    `Gemini secret reference detected in client-bundle source:\n${hits.slice(0, 30).map((hit) => `- ${hit}`).join('\n')}${hits.length > 30 ? `\n... and ${hits.length - 30} more` : ''}`,
  );
});

check('templates UI matches light app shell', () => {
  grep('src/pages/Templates.tsx', /data-a16-template-light-ui="true"/);
  grep('src/pages/Templates.tsx', /bg-white/);
  grep('src/pages/Templates.tsx', /border-slate-200/);
  grep('src/pages/Templates.tsx', /text-slate-900/);
  grep('src/pages/Templates.tsx', /text-slate-500/);
  grep('src/pages/ResponseTemplates.tsx', /app-surface-strong/);
  grep('src/pages/ResponseTemplates.tsx', /app-text/);
  grep('src/pages/ResponseTemplates.tsx', /app-muted/);
  reject('src/pages/Templates.tsx', /app-surface-strong|app-text|app-muted/, 'Templates.tsx must not use dark app shell tokens for the light templates page');
  reject('src/pages/Templates.tsx', /DostÄ|Ĺ|Ă/, 'Templates.tsx contains mojibake');
  reject('src/pages/ResponseTemplates.tsx', /DostÄ|Ĺ|Ă/, 'ResponseTemplates.tsx contains mojibake');
});

check('unified light pages CSS stays reference-only', () => {
  reject('src/index.css', /stage36-unified-light-pages\.css/, 'stage36-unified-light-pages.css must not be imported globally because it breaks the live UI');

  if (fs.existsSync(path.join(root, 'src/styles/stage36-unified-light-pages.css'))) {
    grep('src/styles/stage36-unified-light-pages.css', /STAGE36_UNIFIED_LIGHT_PAGES/);
    grep('src/styles/stage36-unified-light-pages.css', /\[data-a16-template-light-ui\]/);
  }
});

if (failures.length) {
  console.error('A13 critical regression guard failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('OK: A13 critical regression guard passed.');
