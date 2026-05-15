import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/stage80-today-task-done-desktop-visibility.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppearanceProvider } from './components/appearance-provider';
import { registerCloseFlowServiceWorker } from './pwa/register-service-worker';
import { registerChunkAssetReloadGuard } from './pwa/chunk-asset-reload-guard';
import './styles/action-color-taxonomy-v1.css';
import './styles/closeflow-right-rail-source-truth.css';
import './styles/closeflow-leads-right-rail-layout-lock.css';

registerChunkAssetReloadGuard();
registerCloseFlowServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
