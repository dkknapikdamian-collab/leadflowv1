const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(repo, rel), 'utf8');
const write = (rel, text) => fs.writeFileSync(path.join(repo, rel), text, 'utf8');
const exists = (rel) => fs.existsSync(path.join(repo, rel));

const STAGE = 'STAGE122_RUNTIME_AUTH_API_PWA_HARDENING';

function ensureDir(rel) {
  fs.mkdirSync(path.dirname(path.join(repo, rel)), { recursive: true });
}

function writeChanged(rel, text) {
  ensureDir(rel);
  const target = path.join(repo, rel);
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (current !== text) fs.writeFileSync(target, text, 'utf8');
}

function replaceOrThrow(text, needle, replacement, label) {
  if (!text.includes(needle)) throw new Error('Missing needle: ' + label);
  return text.replace(needle, replacement);
}

function ensurePackageScript() {
  const rel = 'package.json';
  const pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['test:stage122-runtime-auth-api-pwa-hardening'] = 'node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs';
  write(rel, JSON.stringify(pkg, null, 2) + '\n');
}

function ensureQuietGate() {
  const rel = 'scripts/closeflow-release-check-quiet.cjs';
  let text = read(rel);
  const needle = 'tests/stage122-runtime-auth-api-pwa-hardening.test.cjs';
  if (text.includes(needle)) return;
  const after = "  'tests/stage121-calendar-shift-lead-branch-contract.test.cjs',";
  if (text.includes(after)) {
    text = text.replace(after, after + "\n  '" + needle + "',");
  } else {
    const marker = 'const requiredTests = [';
    if (!text.includes(marker)) throw new Error('Missing requiredTests array in quiet gate');
    text = text.replace(marker, marker + "\n  '" + needle + "',");
  }
  write(rel, text);
}

function patchRegisterServiceWorker() {
  const text = `export function registerCloseFlowServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return;

  // ${STAGE}:
  // Retire older CloseFlow workers that could keep stale Vite bundles alive,
  // clear only CacheStorage closeflow-* buckets, then register the network-only worker.
  const clearCloseFlowCaches = async () => {
    if (!('caches' in window)) return;
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('closeflow-')).map((key) => caches.delete(key)));
  };

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .getRegistrations()
      .then(async (registrations) => {
        await Promise.all(registrations.map((registration) => registration.unregister()));
        await clearCloseFlowCaches();
        return navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
      })
      .then((registration) => {
        if (typeof registration.update === 'function') registration.update();
      })
      .catch((error) => {
        console.warn('CloseFlow service worker refresh skipped.', error);
      });
  });
}
`;
  writeChanged('src/pwa/register-service-worker.ts', text);
}

function patchServiceWorker() {
  const text = `/* ${STAGE}
 * Runtime-safe service worker: no HTML shell cache, no Vite /assets cache,
 * no API/auth/data interception. It exists only to replace and retire older
 * CloseFlow workers while preserving browser auth data and Supabase sessions.
 */
const STAGE122_RUNTIME_AUTH_API_PWA_HARDENING = '${STAGE}';
const CACHE_VERSION = 'closeflow-stage122-network-only-2026-05-18';

async function clearCloseFlowCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key.startsWith('closeflow-')).map((key) => caches.delete(key)));
}

function getRequestUrl(request) {
  try {
    return new URL(request.url);
  } catch {
    return null;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clearCloseFlowCaches().then(() => self.clients.claim()));
});

self.addEventListener('message', (event) => {
  const type = event && event.data ? event.data.type : '';
  if (type === 'SKIP_WAITING') self.skipWaiting();
  if (type === 'CLEAR_CLOSEFLOW_CACHES') event.waitUntil(clearCloseFlowCaches());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = getRequestUrl(request);
  if (!url) return;
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/supabase/')) return;

  // Network-only runtime pass-through for every request.
  void STAGE122_RUNTIME_AUTH_API_PWA_HARDENING;
  void CACHE_VERSION;
});
`;
  writeChanged('public/service-worker.js', text);
}

function patchMainMarker() {
  const rel = 'src/main.tsx';
  let text = read(rel);
  if (text.includes('CLOSEFLOW_STAGE122_RUNTIME_MARKER')) return;
  const marker = 'registerCloseFlowServiceWorker();\n';
  const addition = "\nconsole.info('CLOSEFLOW_STAGE122_RUNTIME_MARKER', 'runtime-auth-api-pwa-hardening-2026-05-18');\n";
  text = replaceOrThrow(text, marker, marker + addition, 'main stage marker after service worker registration');
  write(rel, text);
}

function findMatchingBrace(text, braceStart) {
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = braceStart; index < text.length; index += 1) {
    const char = text[index];
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }
  return -1;
}

function replaceLastCatchBlock(text, replacement) {
  const catchNeedle = '  } catch (error: any) {';
  const start = text.lastIndexOf(catchNeedle);
  if (start === -1) throw new Error('Missing work-items catch start for Stage122 patch');
  const braceStart = text.indexOf('{', start);
  if (braceStart === -1) throw new Error('Missing work-items catch brace for Stage122 patch');
  const end = findMatchingBrace(text, braceStart);
  if (end === -1) throw new Error('Missing work-items catch end for Stage122 patch');
  return text.slice(0, start) + replacement + text.slice(end);
}

function patchWorkItemsAuthErrors() {
  const rel = 'api/work-items.ts';
  let text = read(rel);
  if (!text.includes('RequestAuthError')) {
    const anchor = "import { normalizeEventStatus, normalizeTaskStatus } from '../src/lib/domain-statuses.js';\n";
    text = replaceOrThrow(text, anchor, anchor + "import { RequestAuthError } from '../src/server/_supabase-auth.js';\n", 'RequestAuthError import');
  }

  const newCatch = `  } catch (error: any) {
    // ${STAGE}: auth/workspace failures must be visible as 401/403, not masked as 500.
    if (error instanceof RequestAuthError) {
      res.status(error.status).json({ error: error.code });
      return;
    }

    const message = error?.message || 'WORK_ITEMS_API_FAILED';
    const notFound = new Set(['TASK_NOT_FOUND', 'EVENT_NOT_FOUND', 'LEAD_NOT_FOUND']);
    const authCodes = new Set([
      'AUTHORIZATION_BEARER_REQUIRED',
      'INVALID_SUPABASE_ACCESS_TOKEN',
      'REQUEST_IDENTITY_REQUIRED',
      'AUTH_WORKSPACE_REQUIRED',
      'WORKSPACE_CONTEXT_REQUIRED',
      'SUPABASE_WORKSPACE_ID_MISSING',
      'EVENT_WORKSPACE_REQUIRED',
      'TASK_WORKSPACE_REQUIRED',
    ]);
    const forbiddenCodes = new Set(['WORKSPACE_MEMBERSHIP_REQUIRED', 'WORKSPACE_OWNER_OR_ADMIN_REQUIRED', 'EMAIL_CONFIRMATION_REQUIRED']);
    const statusCode = notFound.has(message) ? 404 : forbiddenCodes.has(message) ? 403 : authCodes.has(message) || message.endsWith('_WORKSPACE_REQUIRED') ? 401 : 500;
    res.status(statusCode).json({ error: message });
  }`;

  if (!text.includes('auth/workspace failures must be visible as 401/403')) {
    text = replaceLastCatchBlock(text, newCatch);
  }

  write(rel, text);
}

function deletePhysicalVersionApi() {
  const rel = 'api/version.ts';
  const target = path.join(repo, rel);
  if (fs.existsSync(target)) fs.unlinkSync(target);
}

function insertBeforeExportDefault(text, helper) {
  if (text.includes('STAGE122_RUNTIME_AUTH_API_PWA_HARDENING_VERSION_ROUTE')) return text;
  const match = /\nexport\s+default\s+async\s+function\s+handler\s*\(/m.exec(text);
  if (!match) throw new Error('Missing system.ts export default handler anchor');
  return text.slice(0, match.index) + helper + text.slice(match.index);
}

function insertVersionRouteInHandler(text) {
  if (text.includes("kind === 'version'") || text.includes("entityConflictsKind === 'version'")) return text;

  const handlerMatch = /export\s+default\s+async\s+function\s+handler\s*\([^)]*\)\s*\{/m.exec(text);
  if (!handlerMatch) throw new Error('Missing system.ts handler for version route');
  const handlerBrace = text.indexOf('{', handlerMatch.index);
  const handlerEnd = findMatchingBrace(text, handlerBrace);
  if (handlerEnd === -1) throw new Error('Missing system.ts handler end');
  const handlerBodyStart = handlerBrace + 1;
  const handlerBody = text.slice(handlerBodyStart, handlerEnd - 1);

  const routeBlock = "\n  if (kind === 'version') {\n    return handleStage122Version(req, res);\n  }\n";

  const constKindRegex = /(\n\s*const\s+kind\s*=\s*routeKind\(req,\s*body\);\s*)/m;
  const constKindMatch = constKindRegex.exec(handlerBody);
  if (constKindMatch) {
    const insertAt = handlerBodyStart + constKindMatch.index + constKindMatch[0].length;
    return text.slice(0, insertAt) + routeBlock + text.slice(insertAt);
  }

  const bodyRegex = /(\n\s*const\s+body\s*=\s*parseBody\(req\.body\);\s*)/m;
  const bodyMatch = bodyRegex.exec(handlerBody);
  if (bodyMatch) {
    const insertAt = handlerBodyStart + bodyMatch.index + bodyMatch[0].length;
    const withKind = "\n  const kind = routeKind(req, body);" + routeBlock;
    return text.slice(0, insertAt) + withKind + text.slice(insertAt);
  }

  throw new Error('Missing system.ts route insertion point for version route');
}

function patchSystemVersionRoute() {
  const rel = 'api/system.ts';
  let text = read(rel);
  const helper = `
function handleStage122Version(req: any, res: any) {
  // STAGE122_RUNTIME_AUTH_API_PWA_HARDENING_VERSION_ROUTE
  void req;
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.status(200).json({
    ok: true,
    app: 'closeflow',
    stage: 'STAGE122_RUNTIME_AUTH_API_PWA_HARDENING',
    commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || '',
    branch: process.env.VERCEL_GIT_COMMIT_REF || '',
    deploymentUrl: process.env.VERCEL_URL || '',
    checkedAt: new Date().toISOString(),
  });
}
`;

  text = insertBeforeExportDefault(text, helper + '\n');
  text = insertVersionRouteInHandler(text);
  write(rel, text);
}

function patchVercelVersionRewrite() {
  const rel = 'vercel.json';
  const config = JSON.parse(read(rel));
  const rewrites = Array.isArray(config.rewrites) ? config.rewrites : [];
  const source = '/api/version';
  const destination = '/api/system?kind=version';
  for (let index = rewrites.length - 1; index >= 0; index -= 1) {
    const rewrite = rewrites[index] || {};
    if (rewrite.source === source && rewrite.destination !== destination) rewrites.splice(index, 1);
  }
  const already = rewrites.some((rewrite) => rewrite && rewrite.source === source && rewrite.destination === destination);
  if (!already) {
    const catchAllIndex = rewrites.findIndex((rewrite) => String(rewrite?.source || '').includes('((?!api/|assets/|'));
    const insertAt = catchAllIndex >= 0 ? catchAllIndex : 0;
    rewrites.splice(insertAt, 0, { source, destination });
  }
  config.rewrites = rewrites;
  write(rel, JSON.stringify(config, null, 2) + '\n');
}

function appendProjectFile(rel, section) {
  const target = path.join(repo, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (current.includes('STAGE122_V9_SYSTEM_VERSION_ROUTE_RESILIENT_AND_MASS_GATE')) return;
  fs.writeFileSync(target, current.replace(/\s*$/, '') + '\n\n' + section.trim() + '\n', 'utf8');
}

function updateProjectMemory() {
  const summary = `## 2026-05-18 - STAGE122_V9_SYSTEM_VERSION_ROUTE_RESILIENT_AND_MASS_GATE

FAKTY: Stage122 V7 passed Stage122/PWA/Stage98/Stage121/build, then failed Vercel Hobby function budget because api/version.ts raised api/*.ts to 13. V8 chose system rewrite architecture but failed on a brittle api/system.ts anchor.

DECYZJA: /api/version stays available through /api/system?kind=version, without adding a physical Vercel function.

TESTY: Stage122 guard, PWA foundation, Vercel budget, Stage98, Stage121, build, verify:closeflow:quiet.

NASTĘPNY KROK: verify production /api/version and runtime marker, then retest calendar shift only if /api/me is clean.`;
  appendProjectFile('_project/08_CHANGELOG_AI.md', summary);
  appendProjectFile('_project/12_IMPLEMENTATION_LEDGER.md', summary);
  appendProjectFile('_project/14_TEST_HISTORY.md', summary);
  appendProjectFile('_project/07_NEXT_STEPS.md', `## 2026-05-18 - STAGE122_V9_SYSTEM_VERSION_ROUTE_RESILIENT_AND_MASS_GATE

1. Deploy Stage122 V9.
2. Check /api/version.
3. Check console marker and JS bundle hash.
4. Check /api/me.
5. If /api/me remains 401, fix auth/session/workspace before touching Calendar UI.`);
}


function stripTrailingWhitespaceInFile(rel) {
  const target = path.join(repo, rel);
  if (!fs.existsSync(target)) return;
  const current = fs.readFileSync(target, 'utf8');
  const normalized = current
    .replace(/[ \t]+$/gm, '')
    .replace(/\s*$/s, '\n');
  if (current !== normalized) fs.writeFileSync(target, normalized, 'utf8');
}

function stripStage122TouchedTrailingWhitespace() {
  [
    'src/pwa/register-service-worker.ts',
    'public/service-worker.js',
    'src/main.tsx',
    'api/work-items.ts',
    'api/system.ts',
    'vercel.json',
    'package.json',
    'scripts/closeflow-release-check-quiet.cjs',
    'tests/stage122-runtime-auth-api-pwa-hardening.test.cjs',
    '_project/08_CHANGELOG_AI.md',
    '_project/12_IMPLEMENTATION_LEDGER.md',
    '_project/14_TEST_HISTORY.md',
    '_project/07_NEXT_STEPS.md',
  ].forEach(stripTrailingWhitespaceInFile);
}

ensurePackageScript();
ensureQuietGate();
patchRegisterServiceWorker();
patchServiceWorker();
patchMainMarker();
patchWorkItemsAuthErrors();
deletePhysicalVersionApi();
patchSystemVersionRoute();
patchVercelVersionRewrite();
updateProjectMemory();
stripStage122TouchedTrailingWhitespace();
console.log('Stage122 V10 runtime auth/api/PWA hardening applied with resilient system version route and whitespace cleanup.');
