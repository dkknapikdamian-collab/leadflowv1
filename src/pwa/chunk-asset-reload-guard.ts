const CLOSEFLOW_ASSET_CACHE_STALE_CHUNK_HOTFIX_2026_05_11 = 'CLOSEFLOW_ASSET_CACHE_STALE_CHUNK_HOTFIX_2026_05_11';
void CLOSEFLOW_ASSET_CACHE_STALE_CHUNK_HOTFIX_2026_05_11;
const STAGE220A28_NO_TAB_RETURN_MODAL_RELOAD = 'do not hard reload after tab return or while a CloseFlow modal is open';
void STAGE220A28_NO_TAB_RETURN_MODAL_RELOAD;

const CHUNK_RELOAD_MARKER = 'closeflow:asset-cache-stale-chunk-reloaded:v1';
const CHUNK_RELOAD_REASON = 'closeflow:asset-cache-stale-chunk-reason:v1';
const CHUNK_RELOAD_DEFERRED_REASON = 'closeflow:asset-cache-stale-chunk-deferred-reason:v1';
let closeFlowLastHiddenAt = 0;
let closeFlowLastVisibleAt = 0;

function hasOpenCloseFlowDialog() {
  if (typeof document === 'undefined') return false;
  return Boolean(document.querySelector('[data-closeflow-modal-visual-system="true"][data-state="open"], [data-cf-vst-dialog="true"][data-state="open"], [role="dialog"][data-state="open"]'));
}

function shouldDeferReloadForOpenCloseFlowModal(source = 'unknown') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const now = Date.now();
  const recentlyReturnedToTab = closeFlowLastVisibleAt > 0 && now - closeFlowLastVisibleAt < 12000;
  const recentlyHidden = closeFlowLastHiddenAt > 0 && now - closeFlowLastHiddenAt < 12000;
  if (!hasOpenCloseFlowDialog() && !recentlyReturnedToTab && !recentlyHidden) return false;
  try {
    window.sessionStorage.setItem(CHUNK_RELOAD_DEFERRED_REASON, source);
  } catch {
    // Ignore storage failures. The guard still prevents a destructive hard reload.
  }
  console.warn('CloseFlow chunk reload deferred to preserve open modal / tab-return state.', { source });
  return true;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    const now = Date.now();
    if (document.visibilityState === 'hidden') closeFlowLastHiddenAt = now;
    if (document.visibilityState === 'visible') closeFlowLastVisibleAt = now;
  });
}

function getErrorMessage(error: unknown) {
  if (!error) return '';
  if (error instanceof Error) return error.message || String(error);
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message?: unknown }).message || '');
  }
  return String(error);
}

export function isChunkAssetLoadError(error: unknown) {
  const message = getErrorMessage(error);
  return /Unable to preload CSS|Failed to fetch dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk [^ ]+ failed|Failed to load module script|\/assets\/[^ ]+\.(js|css)/i.test(message);
}

async function clearCloseFlowRuntimeCaches() {
  if (typeof window === 'undefined') return;

  try {
    if ('caches' in window) {
      const keys = await window.caches.keys();
      await Promise.all(keys.filter((key) => key.startsWith('closeflow-')).map((key) => window.caches.delete(key)));
    }
  } catch (error) {
    console.warn('CloseFlow stale asset cache cleanup skipped.', error);
  }

  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.update().catch(() => undefined)));
    }
  } catch (error) {
    console.warn('CloseFlow service worker update check skipped.', error);
  }
}

export function reloadOnceForChunkAssetFailure(error: unknown, source = 'unknown') {
  if (typeof window === 'undefined') return false;
  if (!isChunkAssetLoadError(error)) return false;
  if (shouldDeferReloadForOpenCloseFlowModal(source)) return true;

  try {
    const marker = window.sessionStorage.getItem(CHUNK_RELOAD_MARKER);
    if (marker === '1') return false;
    window.sessionStorage.setItem(CHUNK_RELOAD_MARKER, '1');
    window.sessionStorage.setItem(CHUNK_RELOAD_REASON, source);
  } catch {
    // If sessionStorage is unavailable, still try a single hard reload in this runtime tick.
  }

  clearCloseFlowRuntimeCaches().finally(() => {
    window.location.reload();
  });

  return true;
}

export function registerChunkAssetReloadGuard() {
  if (typeof window === 'undefined') return;

  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    reloadOnceForChunkAssetFailure((event as CustomEvent).payload || event, 'vite-preload-error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (reloadOnceForChunkAssetFailure(event.reason, 'unhandledrejection')) {
      event.preventDefault();
    }
  });

  window.addEventListener(
    'error',
    (event) => {
      const target = event.target as HTMLElement | null;
      const assetUrl =
        target && ('src' in target || 'href' in target)
          ? String((target as HTMLScriptElement | HTMLLinkElement).src || (target as HTMLLinkElement).href || '')
          : '';

      if (assetUrl.includes('/assets/') && /\.(js|css)(\?|$)/i.test(assetUrl)) {
        reloadOnceForChunkAssetFailure(new Error(`Failed to load runtime asset: ${assetUrl}`), 'asset-error-event');
      }
    },
    true,
  );
}
