import { buildSelectorHint, getElementDataAttributes, readElementText, summarizeElement } from './dom-selector';
import { AdminElementTarget, AdminTargetCandidate, AdminTargetRect } from './admin-tools-types';

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

function scoreElement(element: HTMLElement) {
  const tag = element.tagName.toLowerCase();
  const role = element.getAttribute('role') || '';
  const className = String(element.className || '').toLowerCase();
  const rect = element.getBoundingClientRect();
  const text = readElementText(element);
  let score = 0;
  const reasons: string[] = [];

  if (['button', 'input', 'textarea', 'select'].includes(tag) || (tag === 'a' && element.hasAttribute('href'))) {
    score += 100;
    reasons.push('native-action');
  }
  if (role === 'button' || role === 'link' || element.hasAttribute('tabindex')) {
    score += 90;
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
  if (['article', 'section', 'li', 'tr'].includes(tag)) {
    score += 70;
    reasons.push('container');
  }
  if (/(card|panel|row|item|action|button|tile|list)/i.test(className)) {
    score += 60;
    reasons.push('semantic-class');
  }
  if (text) {
    score += 40;
    reasons.push('text');
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
  const raw = filtered.slice(0, 8).map((element, index) => {
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

export function scanActionElements(route: string): AdminTargetCandidate[] {
  if (typeof document === 'undefined') return [];
  const selector = [
    'button',
    'a[href]',
    '[role="button"]',
    '[role="link"]',
    '[data-nav-path]',
    '[data-context-action]',
    '[data-action]',
    '[data-testid]',
    'input[type="button"]',
    'input[type="submit"]',
    '[tabindex]',
  ].join(',');
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))
    .filter((element) => !element.closest('[data-admin-tool-ui="true"]'));
  return buildTargetCandidates(elements, route, 'button-matrix');
}

// ADMIN_DEBUG_TOOLBAR_COMPOSED_PATH_TARGETING_STAGE87
