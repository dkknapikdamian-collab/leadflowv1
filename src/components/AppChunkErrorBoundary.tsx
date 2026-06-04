import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reloadOnceForChunkAssetFailure } from '../pwa/chunk-asset-reload-guard';

const CHUNK_RELOAD_SESSION_KEY = 'closeflow:chunk-reload-once';
const STAGE220A34_APP_CHUNK_BOUNDARY_NO_TAB_RETURN_FALLBACK = 'App chunk boundary must preserve active CloseFlow UI state after tab return instead of unmounting the route';
void STAGE220A34_APP_CHUNK_BOUNDARY_NO_TAB_RETURN_FALLBACK;

type AppChunkErrorBoundaryProps = {
  children: ReactNode;
};

type AppChunkErrorBoundaryState = {
  error: Error | null;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: unknown }).message || '');
  }
  return String(error || '');
}

function isChunkLoadError(error: unknown) {
  const message = getErrorMessage(error);

  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError|dynamically imported module|Missing lazy page export/i.test(message);
}

function hasProtectedCloseFlowUiState() {
  if (typeof document === 'undefined') return false;
  const documentHidden = document.visibilityState !== 'visible';
  const openDialog = Boolean(document.querySelector('[data-closeflow-modal-visual-system="true"][data-state="open"], [data-cf-vst-dialog="true"][data-state="open"], [role="dialog"][data-state="open"]'));
  const active = document.activeElement;
  const activeInput = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement;
  const filledField = Array.from(document.querySelectorAll('textarea, input:not([type="hidden"]), select')).some((field) => {
    if (field instanceof HTMLTextAreaElement) return field.value.trim().length > 0;
    if (field instanceof HTMLSelectElement) return Boolean(field.value && field.value !== 'none');
    if (field instanceof HTMLInputElement) {
      const type = String(field.type || '').toLowerCase();
      if (['button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'hidden'].includes(type)) return false;
      return String(field.value || '').trim().length > 0;
    }
    return false;
  });
  return documentHidden || openDialog || activeInput || filledField;
}

async function clearBrowserRuntimeCaches() {
  if (typeof window === 'undefined') return;

  if ('caches' in window) {
    try {
      const keys = await window.caches.keys();
      await Promise.all(keys.map((key) => window.caches.delete(key)));
    } catch (error) {
      console.warn('APP_CHUNK_CACHE_CLEAR_FAILED', error);
    }
  }
}

function reloadOnceForNewDeployment() {
  if (typeof window === 'undefined') return;

  const key = `${CHUNK_RELOAD_SESSION_KEY}:${window.location.pathname}`;
  if (window.sessionStorage.getItem(key) === '1') return;

  window.sessionStorage.setItem(key, '1');

  void clearBrowserRuntimeCaches().finally(() => {
    window.location.reload();
  });
}

export class AppChunkErrorBoundary extends Component<AppChunkErrorBoundaryProps, AppChunkErrorBoundaryState> {
  declare readonly props: Readonly<AppChunkErrorBoundaryProps>;

  state: AppChunkErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    if (isChunkLoadError(error) && hasProtectedCloseFlowUiState()) {
      return null;
    }
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error)) {
      const protectedUiState = hasProtectedCloseFlowUiState();
      console.warn(protectedUiState ? 'APP_CHUNK_LOAD_DEFERRED_TO_PRESERVE_UI_STATE' : 'APP_CHUNK_LOAD_STALE_DEPLOY_RELOAD', error, info);
      reloadOnceForChunkAssetFailure(error, protectedUiState ? 'app-chunk-error-boundary-protected-ui' : 'app-chunk-error-boundary');
      if (protectedUiState) {
        this.setState({ error: null });
        return;
      }
      reloadOnceForNewDeployment();
      return;
    }

    console.error('APP_ROUTE_RENDER_FAILED', error, info);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    if (isChunkLoadError(this.state.error)) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md cf-alert cf-alert-info p-6 text-center shadow-sm">
            <h1 className="cf-alert-title text-lg font-bold">Odświeżamy aplikację</h1>
            <p className="cf-alert-muted mt-2 text-sm">
              Wykryto starszą wersję plików aplikacji. Strona odświeży się automatycznie.
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => window.location.reload()}
            >
              Odśwież teraz
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md cf-alert cf-alert-error p-6 text-center shadow-sm">
          <h1 className="cf-alert-title text-lg font-bold">Nie udało się załadować widoku</h1>
          <p className="cf-alert-muted mt-2 text-sm">Odśwież stronę i spróbuj ponownie.</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            Odśwież
          </button>
        </div>
      </div>
    );
  }
}
