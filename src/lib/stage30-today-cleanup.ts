const TODAY_STAGE30_HIDDEN_ATTR = 'data-stage30-today-hidden';

function markHidden(element: HTMLElement) {
  if (element.getAttribute(TODAY_STAGE30_HIDDEN_ATTR) === 'true') return;

  element.setAttribute(TODAY_STAGE30_HIDDEN_ATTR, 'true');
  element.style.display = 'none';
  element.setAttribute('aria-hidden', 'true');
}

function findSafeContainer(element: HTMLElement) {
  return (
    element.closest<HTMLElement>('[data-today-tile-card="true"]') ||
    element.closest<HTMLElement>('[data-today-pipeline-card]') ||
    element.closest<HTMLElement>('[data-today-pipeline-section]') ||
    element.closest<HTMLElement>('[data-today-pipeline-shortcut]') ||
    element.closest<HTMLElement>('article') ||
    element.closest<HTMLElement>('section') ||
    element
  );
}

function hideFunnelUi(root: ParentNode) {
  const hardSelectors = [
    '[data-today-pipeline-shortcut]',
    '[data-today-pipeline-card]',
    '[data-today-pipeline-section]',
    '[data-today-funnel]',
    '[data-today-funnel-card]',
    '[data-today-funnel-section]',
  ];

  root.querySelectorAll<HTMLElement>(hardSelectors.join(',')).forEach((element) => {
    markHidden(findSafeContainer(element));
  });

  root.querySelectorAll<HTMLElement>('p, span, div, article, section, button').forEach((element) => {
    const text = String(element.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;

    const isGlobalActionsNotice = text.includes('Globalne akcje są tylko w górnym pasku');
    const isFunnelNotice = /\b(lejek|funnel)\b/i.test(text) && text.length < 900;

    if (isGlobalActionsNotice) {
      markHidden(findSafeContainer(element));
      return;
    }

    if (isFunnelNotice) {
      markHidden(findSafeContainer(element));
    }
  });
}

export function installTodayStage30VisualCleanup() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const run = () => hideFunnelUi(document);

  run();

  const observer = new MutationObserver(() => run());
  observer.observe(document.body, { childList: true, subtree: true });

  return () => observer.disconnect();
}
