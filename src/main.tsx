import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// LF-UI-SOT-007 canonical owner marker: index.css is bootstrapped by App.tsx before the canonical owner.
// LF-UI-SOT-007 canonical owner marker: disabled legacy import src/styles/stage80-today-task-done-desktop-visibility.css; content merged above.
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppearanceProvider } from './components/appearance-provider';
import { registerCloseFlowServiceWorker } from './pwa/register-service-worker';
import { registerChunkAssetReloadGuard } from './pwa/chunk-asset-reload-guard';
// LF-UI-SOT-007 canonical owner marker: disabled legacy import src/styles/action-color-taxonomy-v1.css; content merged above.
// LF-UI-SOT-007 canonical owner marker: disabled legacy import src/styles/operator-rail-tasks-pattern-stage228r1.css; content merged above.
// LF-UI-SOT-007 canonical owner marker: disabled legacy import src/styles/closeflow-leads-right-rail-layout-lock.css; content merged above.
// LF-UI-SOT-007 canonical owner marker: disabled legacy import src/styles/closeflow-detail-view-source-truth-stage219.css; content merged above.
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
