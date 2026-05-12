import { useEffect } from 'react';

const CLOSEFLOW_OPERATOR_TOP_TRIM_RUNTIME_2026_05_12 = 'CLOSEFLOW_OPERATOR_TOP_TRIM_RUNTIME_2026_05_12';
void CLOSEFLOW_OPERATOR_TOP_TRIM_RUNTIME_2026_05_12;

function normalizeActionLabel(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isViewAction(element: Element) {
  const explicit = normalizeActionLabel((element as HTMLElement).dataset?.cfHeaderAction);
  const aria = normalizeActionLabel(element.getAttribute('aria-label'));
  const title = normalizeActionLabel(element.getAttribute('title'));
  const text = normalizeActionLabel(element.textContent);

  return explicit === 'view'
    || aria === 'widok'
    || title === 'widok'
    || text === 'widok'
    || text.includes(' widok')
    || text.endsWith(' widok');
}

function markOperatorHeaderActions() {
  if (typeof document === 'undefined') return;

  const headers = Array.from(document.querySelectorAll<HTMLElement>('.cf-page-header-v2'));

  for (const header of headers) {
    header.dataset.cfOperatorTopTrimmed = 'true';

    const copy = header.querySelector<HTMLElement>('.cf-page-header-v2__copy');
    if (copy) copy.dataset.cfOperatorTopTrimHidden = 'copy';

    const actions = header.querySelector<HTMLElement>('.cf-page-header-v2__actions');
    if (!actions) continue;

    actions.dataset.cfOperatorTopTrimActions = 'true';

    const controls = Array.from(actions.querySelectorAll<HTMLElement>('button, a, [role="button"]'));
    let promotedView = false;

    for (const control of controls) {
      if (isViewAction(control)) {
        control.dataset.cfTopbarPromotedAction = 'view';
        control.removeAttribute('data-cf-topbar-hidden-action');
        promotedView = true;
      } else {
        control.dataset.cfTopbarHiddenAction = 'true';
        control.removeAttribute('data-cf-topbar-promoted-action');
      }
    }

    actions.dataset.cfOperatorTopTrimHasView = promotedView ? 'true' : 'false';
  }
}

export default function OperatorTopBarRuntime() {
  useEffect(() => {
    let frame = 0;

    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(markOperatorHeaderActions);
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
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
