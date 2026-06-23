/*
STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE
Central policy for legacy Calendar DOM normalizers.

Purpose:
- do not add more anonymous post-render DOM surgery,
- make every remaining normalizer explicit and switchable,
- allow safe rollback/diagnostics before final retirement.
*/

export const CALENDAR_DOM_NORMALIZER_IDS = {
  colorTooltipV2: 'color-tooltip-v2',
  monthEntryStructuralV3: 'month-entry-structural-v3',
  monthPlainTextRowsV4: 'month-plain-text-rows-v4',
} as const;

export type CalendarDomNormalizerId =
  (typeof CALENDAR_DOM_NORMALIZER_IDS)[keyof typeof CALENDAR_DOM_NORMALIZER_IDS];

type CalendarDomNormalizerState = 'allowed' | 'retired';

type CalendarDomNormalizerPolicy = {
  id: CalendarDomNormalizerId;
  state: CalendarDomNormalizerState;
  reason: string;
};

export const CALENDAR_DOM_NORMALIZER_POLICY: Record<CalendarDomNormalizerId, CalendarDomNormalizerPolicy> = {
  [CALENDAR_DOM_NORMALIZER_IDS.colorTooltipV2]: {
    id: CALENDAR_DOM_NORMALIZER_IDS.colorTooltipV2,
    state: 'allowed',
    reason: 'Keeps clipped calendar text readable until declarative tooltip/render source fully replaces it.',
  },
  [CALENDAR_DOM_NORMALIZER_IDS.monthEntryStructuralV3]: {
    id: CALENDAR_DOM_NORMALIZER_IDS.monthEntryStructuralV3,
    state: 'allowed',
    reason: 'High-risk legacy month chip structural normalizer; gated before retirement because it still protects current month layout.',
  },
  [CALENDAR_DOM_NORMALIZER_IDS.monthPlainTextRowsV4]: {
    id: CALENDAR_DOM_NORMALIZER_IDS.monthPlainTextRowsV4,
    state: 'allowed',
    reason: 'High-risk legacy month plain-text row normalizer; gated before retirement because it still protects current month layout.',
  },
};

const GLOBAL_STORAGE_KEY = 'closeflow:calendar:dom-normalizers';
const NORMALIZER_STORAGE_PREFIX = 'closeflow:calendar:dom-normalizer:';

function readLocalStorageValue(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function shouldRunCalendarDomNormalizer(id: CalendarDomNormalizerId): boolean {
  const globalOverride = readLocalStorageValue(GLOBAL_STORAGE_KEY);
  if (globalOverride === 'off') return false;
  if (globalOverride === 'on') return true;

  const override = readLocalStorageValue(`${NORMALIZER_STORAGE_PREFIX}${id}`);
  if (override === 'off') return false;
  if (override === 'on') return true;

  const policy = CALENDAR_DOM_NORMALIZER_POLICY[id];
  return Boolean(policy && policy.state === 'allowed');
}

export function listCalendarDomNormalizerPolicy(): CalendarDomNormalizerPolicy[] {
  return Object.values(CALENDAR_DOM_NORMALIZER_POLICY);
}
