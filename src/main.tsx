import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppearanceProvider } from './components/appearance-provider';
import { registerCloseFlowServiceWorker } from './pwa/register-service-worker';
import { registerChunkAssetReloadGuard } from './pwa/chunk-asset-reload-guard';
registerChunkAssetReloadGuard();
registerCloseFlowServiceWorker();
console.info('CLOSEFLOW_STAGE122_RUNTIME_MARKER', 'runtime-auth-api-pwa-hardening-2026-05-18');
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
