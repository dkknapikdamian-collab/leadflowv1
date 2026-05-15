import { useEffect } from 'react';
import {
  CLOSEFLOW_VS7_REPORTED_ADMIN_FEEDBACK_LABELS,
  CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH,
  normalizeOperatorMetricKey,
  resolveOperatorMetricTone,
} from './operator-metric-tone-contract';

const CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_RUNTIME =
  'CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_RUNTIME: repairs legacy metric/list cards from the central semantic tone contract';
void CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH;
void CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_RUNTIME;

const CLOSEFLOW_VS7_RUNTIME_FEEDBACK_LABEL_GUARD = [
  'Najbliższe 7 dni',
  'Szkice AI do sprawdzenia',
  'Leady czekające',
] as const;
void CLOSEFLOW_VS7_RUNTIME_FEEDBACK_LABEL_GUARD;

const LEGACY_SECTION_LABELS = [
  ...CLOSEFLOW_VS7_REPORTED_ADMIN_FEEDBACK_LABELS,
  ...CLOSEFLOW_VS7_RUNTIME_FEEDBACK_LABEL_GUARD,
  'Zagrożone',
  'Zaległe',
  'Bez działań',
  'Bez ruchu',
  'Waiting za długo',
  'Do sprawdzenia',
  'Do ruchu dziś',
];

function getTileLabel(tile: Element) {
  return (
    tile.querySelector('.cf-operator-metric-label')?.textContent
    || tile.getAttribute('aria-label')
    || tile.getAttribute('title')
    || tile.textContent
    || ''
  );
}

function syncMetricTile(tile: HTMLElement) {
  const metricId = tile.getAttribute('data-cf-operator-metric-id') || '';
  const label = getTileLabel(tile);
  const currentTone = tile.getAttribute('data-cf-operator-metric-tone') || '';
  const tone = resolveOperatorMetricTone({ id: metricId, label, tone: currentTone, classText: tile.className });
  const semanticKey = normalizeOperatorMetricKey(metricId || label);

  tile.setAttribute('data-cf-operator-metric-tone', tone);
  tile.setAttribute('data-cf-semantic-tone', tone);
  tile.setAttribute('data-cf-semantic-key', semanticKey);

  tile.querySelectorAll<HTMLElement>('[data-cf-operator-metric-tile-content]').forEach((content) => {
    content.setAttribute('data-cf-operator-metric-tone', tone);
    content.setAttribute('data-cf-semantic-tone', tone);
    content.setAttribute('data-cf-semantic-key', semanticKey);
  });

  tile.querySelectorAll<HTMLElement>('[data-cf-operator-metric-value]').forEach((valueNode) => {
    valueNode.setAttribute('data-cf-operator-metric-value-tone', tone);
  });

  tile.querySelectorAll<HTMLElement>('.cf-operator-metric-icon').forEach((iconNode) => {
    iconNode.setAttribute('data-cf-operator-metric-icon-tone', tone);
  });
}

function findLegacyLabel(text: string) {
  const key = normalizeOperatorMetricKey(text);
  if (!key) return null;

  return LEGACY_SECTION_LABELS.find((label) => {
    const labelKey = normalizeOperatorMetricKey(label);
    return Boolean(labelKey && (key === labelKey || key.includes(labelKey)));
  }) || null;
}

function findLegacyToneTarget(element: HTMLElement) {
  return (
    element.closest<HTMLElement>('[data-cf-semantic-section-card]')
    || element.closest<HTMLElement>('.rounded-2xl')
    || element.closest<HTMLElement>('.rounded-xl')
    || element.closest<HTMLElement>('.border')
    || element
  );
}

function syncLegacySectionCards(root: ParentNode = document) {
  const candidates = root.querySelectorAll<HTMLElement>('button, [role="button"], .text-left, article, section');

  candidates.forEach((candidate) => {
    if (candidate.closest('[data-cf-operator-metric-tile="true"]')) return;
    const label = findLegacyLabel(candidate.textContent || '');
    if (!label) return;

    const tone = resolveOperatorMetricTone({ id: label, label, classText: candidate.className });
    const semanticKey = normalizeOperatorMetricKey(label);
    const target = findLegacyToneTarget(candidate);

    target.setAttribute('data-cf-semantic-tone', tone);
    target.setAttribute('data-cf-semantic-key', semanticKey);
    target.setAttribute('data-cf-semantic-section-card', 'true');
    candidate.setAttribute('data-cf-semantic-label', label);
  });
}

function applySemanticToneContract(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-cf-operator-metric-tile="true"]').forEach(syncMetricTile);
  syncLegacySectionCards(root);
}

export function OperatorMetricToneRuntime() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        applySemanticToneContract(document);
      });
    };

    schedule();

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['class', 'data-cf-operator-metric-tone', 'data-cf-operator-metric-id', 'data-cf-operator-metric-active'],
    });

    window.addEventListener('closeflow:semantic-tones-refresh', schedule);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('closeflow:semantic-tones-refresh', schedule);
    };
  }, []);

  return null;
}

export default OperatorMetricToneRuntime;
