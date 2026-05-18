export function registerCloseFlowServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return;

  // STAGE122_RUNTIME_AUTH_API_PWA_HARDENING:
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
