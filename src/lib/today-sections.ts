export type TodaySectionKey =
  | 'review'
  | 'overdue'
  | 'move_today'
  | 'no_action'
  | 'waiting_too_long'
  | 'next_days'
  | 'high_value_risk'
  | 'completed_today';

export type TodaySectionMeta = {
  key: TodaySectionKey;
  title: string;
  count: number;
  reason: string;
  sectionIds: string[];
};

export type BuildTodaySectionsInput = {
  reviewCount: number;
  overdueCount: number;
  moveTodayCount: number;
  noActionCount: number;
  waitingTooLongCount: number;
  nextDaysCount: number;
  highValueRiskCount: number;
  completedTodayCount: number;
};

export function buildTodaySections(input: BuildTodaySectionsInput): TodaySectionMeta[] {
  return [
    {
      key: 'review',
      title: 'Do sprawdzenia',
      count: input.reviewCount,
      reason: 'Pozycje wymagające decyzji lub zatwierdzenia.',
      sectionIds: ['today-section-ai-drafts'],
    },
    {
      key: 'overdue',
      title: 'Zaległe',
      count: input.overdueCount,
      reason: 'Terminy po dacie i wymagają natychmiastowej reakcji.',
      sectionIds: ['today-section-overdue-tasks', 'today-section-overdue-leads'],
    },
    {
      key: 'move_today',
      title: 'Do ruchu dziś',
      count: input.moveTodayCount,
      reason: 'Najbliższe akcje na dziś dla aktywnych tematów.',
      sectionIds: ['today-section-main'],
    },
    {
      key: 'no_action',
      title: 'Bez zaplanowanej akcji',
      count: input.noActionCount,
      reason: 'Tematy bez next action z tasków i wydarzeń.',
      sectionIds: ['today-section-no-step'],
    },
    {
      key: 'waiting_too_long',
      title: 'Waiting za długo',
      count: input.waitingTooLongCount,
      reason: 'Tematy w statusie waiting bez świeżego ruchu.',
      sectionIds: ['today-section-waiting-too-long'],
    },
    {
      key: 'next_days',
      title: 'Najbliższe dni',
      count: input.nextDaysCount,
      reason: 'Horyzont kilku dni, żeby planować wcześniej.',
      sectionIds: ['today-section-next-days'],
    },
    {
      key: 'high_value_risk',
      title: 'Wysoka wartość / ryzyko',
      count: input.highValueRiskCount,
      reason: 'Wysoka wartość lub oznaki ryzyka wymagają priorytetu.',
      sectionIds: ['today-section-high-value-risk'],
    },
    {
      key: 'completed_today',
      title: 'Dzisiaj zakończone',
      count: input.completedTodayCount,
      reason: 'Domknięte dziś działania do szybkiego podsumowania.',
      sectionIds: ['today-section-completed-today'],
    },
  ];
}

export function dedupeTodaySectionEntries<T extends { id?: string | number }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item, index) => {
    const key = String(item?.id ?? index);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
