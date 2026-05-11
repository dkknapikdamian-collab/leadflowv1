import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCloseFlowPageHeaderByPath, type CloseFlowPageHeaderConfig } from '../lib/page-header-content';

const RUNTIME_MARKER = 'closeflowPageHeaderSystem';

function asHTMLElement(value: Element | null): HTMLElement | null {
  return value instanceof HTMLElement ? value : null;
}

function getActiveRoot() {
  return (
    asHTMLElement(document.querySelector('.view.active')) ||
    asHTMLElement(document.querySelector('main.main')) ||
    document.body
  );
}

function queryHeaderBySelectors(config: CloseFlowPageHeaderConfig, root: HTMLElement) {
  for (const selector of config.selectors) {
    const direct = asHTMLElement(root.querySelector(selector)) || asHTMLElement(document.querySelector(selector));
    if (direct) return direct;
  }

  const candidates = Array.from(root.querySelectorAll<HTMLElement>('header, .page-head, .cf-page-hero'));
  const expected = [config.title, config.kicker]
    .map((value) => value.toLowerCase())
    .filter(Boolean);

  return candidates.find((candidate) => {
    const text = String(candidate.textContent || '').toLowerCase();
    return expected.some((part) => text.includes(part.toLowerCase()));
  }) || candidates[0] || null;
}

function getTextHost(header: HTMLElement) {
  return (
    asHTMLElement(header.querySelector('.space-y-2')) ||
    asHTMLElement(header.querySelector('.space-y-3')) ||
    asHTMLElement(header.querySelector('.cf-page-hero-layout > div:first-child')) ||
    asHTMLElement(header.querySelector(':scope > div:first-child')) ||
    header
  );
}

function findTitleElement(host: HTMLElement, header: HTMLElement) {
  return (
    asHTMLElement(host.querySelector('h1')) ||
    asHTMLElement(host.querySelector('[data-page-title="true"]')) ||
    asHTMLElement(header.querySelector('h1'))
  );
}

function ensureKicker(host: HTMLElement, config: CloseFlowPageHeaderConfig) {
  const existing =
    asHTMLElement(host.querySelector('.kicker')) ||
    asHTMLElement(host.querySelector('.cf-page-hero-kicker')) ||
    asHTMLElement(host.querySelector('.ai-drafts-kicker')) ||
    asHTMLElement(host.querySelector('.activity-kicker')) ||
    asHTMLElement(host.querySelector('.notifications-kicker'));

  if (existing) {
    existing.textContent = config.kicker;
    existing.classList.add('cf-page-header-kicker');
    return existing;
  }

  const kicker = document.createElement('span');
  kicker.className = 'cf-page-header-kicker';
  kicker.textContent = config.kicker;
  host.insertBefore(kicker, host.firstChild);
  return kicker;
}

function ensureDescription(host: HTMLElement, header: HTMLElement, config: CloseFlowPageHeaderConfig) {
  const title = findTitleElement(host, header);

  if (title && String(title.textContent || '').trim()) {
    title.textContent = config.title;
  }

  const existingRuntime = asHTMLElement(host.querySelector('.cf-page-header-description'));
  if (existingRuntime) {
    existingRuntime.textContent = config.description;
    return;
  }

  const existingParagraphs = Array.from(host.querySelectorAll<HTMLElement>('p')).filter((paragraph) => {
    const className = String(paragraph.className || '');
    return !className.includes('kicker') && !className.includes('pill') && paragraph.closest('button') === null;
  });

  const description = existingParagraphs[0] || document.createElement('p');
  description.className = 'cf-page-header-description';
  description.textContent = config.description;

  if (!existingParagraphs[0]) {
    if (title?.parentElement === host) {
      title.insertAdjacentElement('afterend', description);
    } else {
      host.appendChild(description);
    }
  }
}

function classifyHeaderAction(element: HTMLElement) {
  const text = String(element.textContent || element.getAttribute('aria-label') || element.getAttribute('title') || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return 'secondary';
  if (text.includes('ai') || text.includes('zapytaj')) return 'ai';
  if (text.includes('usuń') || text.includes('usun') || text.includes('kosz') || text.includes('archiw')) return 'danger';
  if (
    text.includes('dodaj') ||
    text.includes('nowy') ||
    text.includes('nowa') ||
    text.includes('utwórz') ||
    text.includes('utworz') ||
    text.includes('zapisz') ||
    text.includes('zarządzaj') ||
    text.includes('zarzadzaj')
  ) return 'primary';
  if (text.includes('odśwież') || text.includes('odswiez') || text.includes('pokaż') || text.includes('pokaz')) return 'secondary';

  return 'secondary';
}

function applyHeaderActionClasses(header: HTMLElement) {
  const actionSelectors = [
    '.head-actions',
    '.ai-drafts-header-actions',
    '.activity-header-actions',
    '.notifications-header-actions',
    '.cf-page-hero-actions',
    '.cf-section-head-actions',
    ':scope > div:last-child',
  ];

  const actionContainers = actionSelectors
    .map((selector) => asHTMLElement(header.querySelector(selector)))
    .filter(Boolean) as HTMLElement[];

  const root = actionContainers[0] || header;
  const actions = Array.from(root.querySelectorAll<HTMLElement>('button, a')).filter((element) => {
    if (element.closest('[data-closeflow-page-header-system="true"]') !== header) return false;
    return element.offsetParent !== null || element.getAttribute('aria-label') || element.textContent;
  });

  for (const action of actions) {
    const tone = classifyHeaderAction(action);
    action.classList.add('cf-header-action', `cf-header-action--${tone}`);
    action.setAttribute('data-cf-header-action-tone', tone);
  }
}

function applyPageHeader(config: CloseFlowPageHeaderConfig | null) {
  if (!config) return;

  const root = getActiveRoot();
  const header = queryHeaderBySelectors(config, root);
  if (!header) return;

  header.dataset[RUNTIME_MARKER] = config.id;
  header.setAttribute('data-closeflow-page-header-system', 'true');

  const host = getTextHost(header);
  host.setAttribute('data-closeflow-page-header-copy-host', 'true');

  ensureKicker(host, config);
  ensureDescription(host, header, config);
  applyHeaderActionClasses(header);
}

export default function CloseFlowPageHeaderRuntime({ enabled = true }: { enabled?: boolean }) {
  const location = useLocation();

  useEffect(() => {
    if (!enabled) return;

    const config = getCloseFlowPageHeaderByPath(location.pathname);
    if (!config) return;

    const timers = [0, 80, 250, 700].map((delay) =>
      window.setTimeout(() => applyPageHeader(config), delay),
    );

    const root = getActiveRoot();
    const observer = new MutationObserver(() => applyPageHeader(config));
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [enabled, location.pathname]);

  return null;
}
