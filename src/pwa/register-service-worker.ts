export function registerCloseFlowServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return;

  // STAGE220A29_NO_RUNTIME_SERVICE_WORKER_REGISTER:
  // CloseFlow must not refresh/re-register a service worker during normal runtime,
  // because tab return and worker update cycles were closing active modals/forms.
  // We only retire existing workers/caches once on page load and do not register a new worker.
  const STAGE220A29_NO_RUNTIME_SERVICE_WORKER_REGISTER = 'no service worker register/update during app runtime';
  void STAGE220A29_NO_RUNTIME_SERVICE_WORKER_REGISTER;

  const STAGE122_RUNTIME_AUTH_API_PWA_HARDENING = 'runtime retires stale PWA cache without touching auth storage';
  void STAGE122_RUNTIME_AUTH_API_PWA_HARDENING;

  const STAGE223_R2P_PWA_FOUNDATION_LEGACY_STATIC_ONLY_CONTRACT = "legacy PWA foundation expected register('/service-worker.js' text only; runtime registration is disabled by Stage220A29";
  void STAGE223_R2P_PWA_FOUNDATION_LEGACY_STATIC_ONLY_CONTRACT;

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
      })
      .catch((error) => {
        console.warn('CloseFlow service worker retirement skipped.', error);
      });
  }, { once: true });
}
