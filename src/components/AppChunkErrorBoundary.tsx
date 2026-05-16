import { Component, type ErrorInfo, type ReactNode } from 'react';

const CHUNK_RELOAD_SESSION_KEY = 'closeflow:chunk-reload-once';

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
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error)) {
      console.warn('APP_CHUNK_LOAD_STALE_DEPLOY_RELOAD', error, info);
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
