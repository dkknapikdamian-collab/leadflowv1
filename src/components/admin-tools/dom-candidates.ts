import { buildSelectorHint, getElementDataAttributes, readElementText, summarizeElement } from './dom-selector';
import { AdminElementTarget, AdminTargetCandidate, AdminTargetRect } from './admin-tools-types';

const ADMIN_TARGET_PRECISION_STAGE88 = 'prefer exact text/action targets over huge sections and scan page actions before sidebar nav';

function isHTMLElement(value: unknown): value is HTMLElement {
  return Boolean(value && typeof value === 'object' && (value as HTMLElement).nodeType === 1 && 'getBoundingClientRect' in (value as HTMLElement));
}

function normalizeRect(rect: DOMRect): AdminTargetRect {
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
  };
}

function getViewport() {
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  };
}

function getScroll() {
  return {
    x: typeof window !== 'undefined' ? window.scrollX || 0 : 0,
    y: typeof window !== 'undefined' ? window.scrollY || 0 : 0,
  };
}

function isAdminToolElement(element: HTMLElement) {
  return Boolean(element.closest('[data-admin-tool-ui="true"]'));
}

function isActuallyVisible(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  return rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function isTextLeaf(tag: string, element: HTMLElement, text: string) {
  if (!text) return false;
  if (['p', 'span', 'strong', 'small', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(tag)) return true;
  const actionChildren = element.querySelector('button,a,input,textarea,select,[role="button"],[role="link"]');
  return !actionChildren && element.children.length <= 1 && text.length <= 220;
}

function isLargeContainer(tag: string, element: HTMLElement, text: string) {
  const rect = element.getBoundingClientRect();
  const actionChildren = element.querySelector('button,a,input,textarea,select,[role="button"],[role="link"]');
  return (
    ['section', 'div', 'article', 'main', 'aside'].includes(tag)
    && (
      text.length > 180
      || element.children.length >= 3
      || Boolean(actionChildren)
      || rect.height > 260
    )
  );
}

function scoreElement(element: HTMLElement) {
  const tag = element.tagName.toLowerCase();
  const role = element.getAttribute('role') || '';
  const className = String(element.className || '').toLowerCase();
  const rect = element.getBoundingClientRect();
  const text = readElementText(element);
  let score = 0;
  const reasons: string[] = [];

  if (['button', 'input', 'textarea', 'select'].includes(tag) || (tag === 'a' && element.hasAttribute('href'))) {
    score += 120;
    reasons.push('native-action');
  }
  if (role === 'button' || role === 'link' || element.hasAttribute('tabindex')) {
    score += 95;
    reasons.push('interactive-role');
  }
  if (
    element.hasAttribute('data-action')
    || element.hasAttribute('data-context-action')
    || element.hasAttribute('data-nav-path')
    || element.hasAttribute('data-testid')
  ) {
    score += 80;
    reasons.push('data-action');
  }
  if (isTextLeaf(tag, element, text)) {
    score += 90;
    reasons.push('text-leaf');
  }
  if (['article', 'section', 'li', 'tr'].includes(tag)) {
    score += 42;
    reasons.push('container');
  }
  if (/(card|panel|row|item|action|button|tile|list)/i.test(className)) {
    score += 46;
    reasons.push('semantic-class');
  }
  if (text) {
    score += 32;
    reasons.push('text');
  }
  if (isLargeContainer(tag, element, text)) {
    score -= 95;
    reasons.push('large-container-penalty');
  }
  if (text.length > 320) {
    score -= 60;
    reasons.push('long-text-penalty');
  }
  if (['html', 'body', 'svg', 'path'].includes(tag)) {
    score -= 100;
    reasons.push('bad-tag');
  }
  if (isAdminToolElement(element)) {
    score -= 80;
    reasons.push('admin-tool');
  }
  if (rect.width < 2 || rect.height < 2) {
    score -= 50;
    reasons.push('zero-rect');
  }
  if (!text && tag === 'div' && !element.attributes.length) {
    score -= 50;
    reasons.push('empty-div');
  }
  if (!isActuallyVisible(element)) {
    score -= 70;
    reasons.push('not-visible');
  }

  return { score, reason: reasons.join(',') || 'neutral' };
}

export function buildTargetFromElement(
  element: HTMLElement,
  candidateIndex: number,
  candidateCount: number,
  composedPathSummary: string[],
  route: string,
  screen: string,
): AdminElementTarget {
  const rect = element.getBoundingClientRect();
  return {
    tag: element.tagName.toLowerCase(),
    text: readElementText(element),
    ariaLabel: element.getAttribute('aria-label') || '',
    title: element.getAttribute('title') || '',
    role: element.getAttribute('role') || '',
    id: element.id || '',
    className: String(element.className || ''),
    dataAttributes: getElementDataAttributes(element),
    selectorHint: buildSelectorHint(element),
    candidateIndex,
    candidateCount,
    composedPathSummary,
    rect: normalizeRect(rect),
    scroll: getScroll(),
    viewport: getViewport(),
    route,
    screen,
  };
}

export function buildTargetCandidates(pathLike: EventTarget[] | Element[], route: string, screen: string): AdminTargetCandidate[] {
  const elements = pathLike
    .filter(isHTMLElement)
    .filter((element) => !['html', 'body'].includes(element.tagName.toLowerCase()));

  const filtered = elements.filter((element) => !isAdminToolElement(element));
  const composedPathSummary = elements.slice(0, 8).map((element) => summarizeElement(element));
  const raw = filtered.slice(0, 10).map((element, index) => {
    const score = scoreElement(element);
    return {
      element,
      score: score.score,
      reason: score.reason,
      target: buildTargetFromElement(element, index, filtered.length, composedPathSummary, route, screen),
    };
  });

  return raw.sort((a, b) => b.score - a.score);
}

function uniqueElements(elements: HTMLElement[]) {
  return [...new Set(elements)];
}

function getActionScanScope() {
  if (typeof document === 'undefined') return document;
  const scopes = [
    document.querySelector<HTMLElement>('.view.active main'),
    document.querySelector<HTMLElement>('.view.active'),
    document.querySelector<HTMLElement>('main.main'),
    document.querySelector<HTMLElement>('main'),
  ].filter(Boolean) as HTMLElement[];

  return scopes.find((scope) => scope.querySelector('button,a[href],[role="button"],[role="link"],[data-context-action],[data-action],[data-testid]')) || document;
}

export function scanActionElements(route: string): AdminTargetCandidate[] {
  if (typeof document === 'undefined') return [];
  const selector = [
    'button',
    'a[href]',
    '[role="button"]',
    '[role="link"]',
    '[data-context-action]',
    '[data-action]',
    '[data-testid]',
    'input[type="button"]',
    'input[type="submit"]',
    '[tabindex]',
  ].join(',');

  const scope = getActionScanScope();
  const scopedElements = uniqueElements(Array.from(scope.querySelectorAll<HTMLElement>(selector)))
    .filter((element) => !element.closest('[data-admin-tool-ui="true"]'))
    .filter((element) => isActuallyVisible(element));

  const pageActions = scopedElements.filter((element) => !element.closest('.sidebar, .side-nav, nav[aria-label="Sidebar"], [data-nav-path]'));
  const finalElements = pageActions.length ? pageActions : scopedElements;

  return buildTargetCandidates(finalElements, route, 'button-matrix');
}

// ADMIN_DEBUG_TOOLBAR_COMPOSED_PATH_TARGETING_STAGE87
// ADMIN_TARGET_PRECISION_STAGE88
