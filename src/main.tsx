import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppearanceProvider } from './components/appearance-provider';

const CHUNK_RELOAD_KEY = 'leadflow:chunk-reload';

function reloadAfterChunkMismatch() {
  const currentPath = `${window.location.pathname}${window.location.search}`;
  const previousAttempt = window.sessionStorage.getItem(CHUNK_RELOAD_KEY);

  if (previousAttempt === currentPath) {
    return;
  }

  window.sessionStorage.setItem(CHUNK_RELOAD_KEY, currentPath);
  window.location.reload();
}

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  reloadAfterChunkMismatch();
});

window.addEventListener('unhandledrejection', (event) => {
  const message = String(event.reason?.message || event.reason || '');
  if (!message.includes('Failed to fetch dynamically imported module')) {
    return;
  }

  event.preventDefault();
  reloadAfterChunkMismatch();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
