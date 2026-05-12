import { useEffect } from 'react';

const CLOSEFLOW_OPERATOR_TOP_TRIM_RUNTIME_REPAIR3_2026_05_12 = 'CLOSEFLOW_OPERATOR_TOP_TRIM_RUNTIME_REPAIR3_2026_05_12';
void CLOSEFLOW_OPERATOR_TOP_TRIM_RUNTIME_REPAIR3_2026_05_12;

const PROXY_WRAP_ID = 'cf-global-promoted-page-actions';
const VIEW_PROXY_ID = 'cf-global-promoted-view-action';

function normalizeActionLabel(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isViewAction(element: Element) {
  const node = element as HTMLElement;
  const explicit = normalizeActionLabel(node.dataset?.cfHeaderAction);
  const aria = normalizeActionLabel(element.getAttribute('aria-label'));
  const title = normalizeActionLabel(element.getAttribute('title'));
  const text = normalizeActionLabel(element.textContent);

  return explicit === 'view'
    || explicit === 'widok'
    || aria === 'widok'
    || title === 'widok'
    || text === 'widok'
    || text.includes(' widok')
    || text.endsWith(' widok');
}

function findOriginalViewAction() {
  const headers = Array.from(document.querySelectorAll<HTMLElement>('.cf-page-header-v2'));

  for (const header of headers) {
    const actions = header.querySelector<HTMLElement>('.cf-page-header-v2__actions');
    if (!actions) continue;

    const controls = Array.from(actions.querySelectorAll<HTMLElement>('button, a, [role="button"]'));
    const viewControl = controls.find(isViewAction);
    if (viewControl) return viewControl;
  }

  return null;
}

function markOldPageHeaders() {
  const headers = Array.from(document.querySelectorAll<HTMLElement>('.cf-page-header-v2'));

  for (const header of headers) {
    header.dataset.cfOperatorTopTrimmed = 'true';

    const copy = header.querySelector<HTMLElement>('.cf-page-header-v2__copy');
    if (copy) copy.dataset.cfOperatorTopTrimHidden = 'copy';

    const actions = header.querySelector<HTMLElement>('.cf-page-header-v2__actions');
    if (!actions) continue;

    actions.dataset.cfOperatorTopTrimActions = 'true';
    const controls = Array.from(actions.querySelectorAll<HTMLElement>('button, a, [role="button"]'));

    for (const control of controls) {
      if (isViewAction(control)) {
        control.dataset.cfTopbarOriginalViewAction = 'true';
      } else {
        control.dataset.cfTopbarHiddenAction = 'true';
      }
    }
  }
}

function ensureGlobalViewProxy(originalViewAction: HTMLElement | null) {
  const globalBar = document.querySelector<HTMLElement>('#root .cf-html-shell .global-bar');
  if (!globalBar) return;

  let wrapper = document.getElementById(PROXY_WRAP_ID) as HTMLDivElement | null;
  let proxy = document.getElementById(VIEW_PROXY_ID) as HTMLButtonElement | null;

  if (!originalViewAction) {
    wrapper?.remove();
    return;
  }

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.id = PROXY_WRAP_ID;
    wrapper.className = 'cf-global-promoted-page-actions';
    wrapper.dataset.cfGlobalPromotedPageActions = 'true';
    globalBar.appendChild(wrapper);
  }

  if (!proxy) {
    proxy = document.createElement('button');
    proxy.id = VIEW_PROXY_ID;
    proxy.type = 'button';
    proxy.className = 'cf-global-promoted-view-action';
    proxy.dataset.cfGlobalViewProxy = 'true';
    proxy.setAttribute('aria-label', 'Widok');
    proxy.textContent = 'Widok';
    wrapper.appendChild(proxy);
  }

  const sourceLabel = String(originalViewAction.textContent || '').trim();
  proxy.textContent = sourceLabel || 'Widok';
  proxy.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    originalViewAction.click();
  };
}

function syncOperatorTopTrim() {
  if (typeof document === 'undefined') return;
  markOldPageHeaders();
  ensureGlobalViewProxy(findOriginalViewAction());
}

export default function OperatorTopBarRuntime() {
  useEffect(() => {
    let frame = 0;

    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(syncOperatorTopTrim);
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'data-cf-header-action', 'aria-label', 'title'],
    });

    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    window.addEventListener('closeflow:data-mutated', sync as EventListener);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('closeflow:data-mutated', sync as EventListener);
    };
  }, []);

  return null;
}
