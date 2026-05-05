import { buildTargetCandidates } from './dom-candidates';
import { AdminTargetCandidate } from './admin-tools-types';

export function isAdminToolClick(event: Event) {
  const target = event.target as HTMLElement | null;
  return Boolean(target?.closest?.('[data-admin-tool-ui="true"]'));
}

export function getComposedPath(event: Event) {
  const rawPath = typeof event.composedPath === 'function' ? event.composedPath() : [];
  if (rawPath.length) return rawPath;

  const path: EventTarget[] = [];
  let current = event.target as Node | null;
  while (current) {
    path.push(current);
    current = current.parentNode;
  }
  return path;
}

export function pickAdminTargetCandidate(event: Event, route: string, screen: string): {
  candidates: AdminTargetCandidate[];
  selectedIndex: number;
} {
  const path = getComposedPath(event);
  const candidates = buildTargetCandidates(path, route, screen);
  return { candidates, selectedIndex: 0 };
}

export function describeAdminTarget(candidate: AdminTargetCandidate | null | undefined) {
  if (!candidate) return 'Brak elementu';
  const target = candidate.target;
  const label = target.text || target.ariaLabel || target.title || target.selectorHint || target.tag;
  return `${target.tag} "${label}"`;
}
