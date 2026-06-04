const fs = require('node:fs');
function read(path) { return fs.readFileSync(path, 'utf8'); }
function fail(message) { console.error('STAGE220A34_TAB_RETURN_STATE_PRESERVATION_GUARD: FAIL'); console.error(message); process.exit(1); }
function requireText(text, needle, label) { if (!text.includes(needle)) fail(label + ' missing: ' + needle); }
function forbidText(text, needle, label) { if (text.includes(needle)) fail(label + ' forbidden: ' + needle); }

const sessionHook = read('src/hooks/useSupabaseSession.ts');
const appBoundary = read('src/components/AppChunkErrorBoundary.tsx');
const chunkGuard = read('src/pwa/chunk-asset-reload-guard.ts');
const pkg = JSON.parse(read('package.json'));

requireText(sessionHook, 'STAGE220A34_SUPABASE_AUTH_NO_TAB_RETURN_REMOUNT', 'Supabase auth no-remount marker');
requireText(sessionHook, 'useRef', 'stable user key ref import');
requireText(sessionHook, 'buildStableSessionUserKey', 'stable session user key helper');
requireText(sessionHook, 'stableSessionUserKeyRef.current === nextKey', 'same user auth event does not call setUser');
requireText(sessionHook, 'applySessionUser(nextUser);', 'auth change uses stable applySessionUser');
forbidText(sessionHook, 'syncClientAuthSnapshotFromSessionUser(nextUser);\n      setUser(nextUser);', 'raw setUser on every auth change');

requireText(appBoundary, 'STAGE220A34_APP_CHUNK_BOUNDARY_NO_TAB_RETURN_FALLBACK', 'AppChunk boundary marker');
requireText(appBoundary, "import { reloadOnceForChunkAssetFailure } from '../pwa/chunk-asset-reload-guard';", 'AppChunk uses shared reload guard');
requireText(appBoundary, 'hasProtectedCloseFlowUiState', 'AppChunk protected UI detector');
requireText(appBoundary, 'return null;', 'AppChunk getDerivedStateFromError preserves route state');
requireText(appBoundary, 'APP_CHUNK_LOAD_DEFERRED_TO_PRESERVE_UI_STATE', 'AppChunk protected log marker');
requireText(appBoundary, 'app-chunk-error-boundary-protected-ui', 'AppChunk protected reload source');

requireText(chunkGuard, 'STAGE220A33_NO_TAB_SWITCH_HARD_RELOAD', 'existing A33 chunk marker still present');
requireText(chunkGuard, 'hasActiveCloseFlowUserInput', 'existing active form detector still present');
requireText(chunkGuard, 'CLOSEFLOW_TAB_RETURN_RELOAD_SUPPRESSION_MS = 5 * 60 * 1000', 'existing 5 minute tab suppression window still present');
requireText(String(pkg.scripts?.prebuild || ''), 'node scripts/check-stage220a34-tab-return-state-preservation.cjs', 'prebuild A34 guard wiring');

console.log('STAGE220A34_TAB_RETURN_STATE_PRESERVATION_GUARD: OK');
