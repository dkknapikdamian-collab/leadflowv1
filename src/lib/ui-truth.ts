export const UI_TRUTH_BADGES = [
  'Gotowe',
  'Beta',
  'Wymaga konfiguracji',
  'Niedostępne w Twoim planie',
  'W przygotowaniu',
] as const;

export type UiTruthBadge = (typeof UI_TRUTH_BADGES)[number];

export type UiTruthFeature = {
  label: string;
  badge: UiTruthBadge;
  description?: string;
};

export const UI_TRUTH_COPY_STAGE14 = 'STAGE14_UI_TRUTH_COPY_POLISH';

export function getUiTruthBadgeLabel(badge: UiTruthBadge) {
  return badge;
}

export function getPlanBlockedBadge(): UiTruthBadge {
  return 'Niedostępne w Twoim planie';
}

export function getConfiguredFeatureBadge(configured: boolean, enabled = true): UiTruthBadge {
  if (!enabled) return 'W przygotowaniu';
  return configured ? 'Gotowe' : 'Wymaga konfiguracji';
}

export const UI_TRUTH_FEATURE_BADGE_EXAMPLES: UiTruthFeature[] = [
  { label: 'Leady', badge: 'Gotowe' },
  { label: 'AI', badge: 'Beta' },
  { label: 'Google Calendar', badge: 'Wymaga konfiguracji' },
  { label: 'Funkcja płatnego planu', badge: 'Niedostępne w Twoim planie' },
  { label: 'Nowy moduł', badge: 'W przygotowaniu' },
];

export const UI_TRUTH_STATUSES_STAGE14E = [
  'Gotowe',
  'Beta',
  'Wymaga konfiguracji',
  'Niedostępne w Twoim planie',
  'W przygotowaniu',
] as const;
