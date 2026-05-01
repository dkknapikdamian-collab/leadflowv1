// STAGE31_TODAY_TILES_VISUAL_FIX_V5
// Zakładka Dziś:
// - łapie prawdziwy wrapper górnego kafelka, nie tylko wewnętrzny element,
// - wymusza widoczne cyfry mimo text-white/opacity,
// - utrzymuje klik kafelka -> właściwa sekcja,
// - wybrana sekcja idzie na górę,
// - pozostałe sekcje zwijają się.

type TodayShortcutTarget =
  | 'urgent'
  | 'today'
  | 'without_action'
  | 'without_movement'
  | 'blocked'
  | 'service_transition'
  | 'ai_drafts';

type TargetConfig = {
  aliases: string[];
  sectionAliases: string[];
  hash: string;
};

const TOP_TILE_CLASS_NAME = 'today-stage31-shortcut-tile';
const TOP_TILE_ACTIVE_CLASS_NAME = 'today-stage31-shortcut-tile-active';
const TOP_TILE_NUMBER_CLASS_NAME = 'today-stage31-shortcut-number';
const TOP_TILE_ICON_CLASS_NAME = 'today-stage31-shortcut-icon';
const STYLE_ID = 'today-stage31-tiles-interaction-style';
const OBSERVER_DEBOUNCE_MS = 120;

const TARGETS: Record<TodayShortcutTarget, TargetConfig> = {
  urgent: {
    aliases: [
      'pilne',
      'pilne teraz',
      'zaległe',
      'zalegle',
      'zaległe zadania',
      'zalegle zadania',
      'wymaga uwagi',
      'ryzyko',
    ],
    sectionAliases: [
      'zaległe zadania',
      'zalegle zadania',
      'zaległe',
      'zalegle',
      'pilne teraz',
      'pilne',
      'zadania po terminie',
      'po terminie',
      'do ruchu dziś',
      'do ruchu dzis',
    ],
    hash: 'zalegle-zadania',
  },
  today: {
    aliases: [
      'na dziś',
      'na dzis',
      'dzisiaj',
      'dziś',
      'dzis',
    ],
    sectionAliases: [
      'na dziś',
      'na dzis',
      'dzisiaj',
      'dziś',
      'dzis',
      'zadania na dziś',
      'zadania na dzis',
      'wydarzenia dziś',
      'wydarzenia dzis',
    ],
    hash: 'na-dzis',
  },
  without_action: {
    aliases: [
      'bez działań',
      'bez dzialan',
      'bez akcji',
      'bez zaplanowanej akcji',
      'brak zaplanowanej akcji',
      'bez następnego',
      'bez nastepnego',
      'brak następnego',
      'brak nastepnego',
    ],
    sectionAliases: [
      'bez działań',
      'bez dzialan',
      'bez akcji',
      'bez zaplanowanej akcji',
      'brak zaplanowanej akcji',
      'bez następnego',
      'bez nastepnego',
      'brak następnego',
      'brak nastepnego',
      'następny krok',
      'nastepny krok',
    ],
    hash: 'bez-dzialan',
  },
  without_movement: {
    aliases: [
      'bez ruchu',
      'brak ruchu',
      'bez zmiany',
      'brak zmiany',
      'za długo',
      'za dlugo',
      '7 dni',
    ],
    sectionAliases: [
      'bez ruchu',
      'brak ruchu',
      'bez zmiany',
      'brak zmiany',
      'za długo',
      'za dlugo',
      '7 dni',
      'zbyt długo',
      'zbyt dlugo',
    ],
    hash: 'bez-ruchu',
  },
  blocked: {
    aliases: [
      'zablokowane',
      'blokery',
      'blok',
      'sprawy stoją',
      'sprawy stoja',
      'stoją',
      'stoja',
    ],
    sectionAliases: [
      'zablokowane',
      'blokery',
      'blok',
      'sprawy stoją',
      'sprawy stoja',
      'sprawa stoi',
      'zatrzymane',
    ],
    hash: 'zablokowane',
  },
  service_transition: {
    aliases: [
      'start i obsługa',
      'start i obsluga',
      'obsługa',
      'obsluga',
      'gotowe do uruchomienia',
      'w obsłudze',
      'w obsludze',
    ],
    sectionAliases: [
      'start i obsługa',
      'start i obsluga',
      'obsługa aktywna',
      'obsluga aktywna',
      'gotowe do uruchomienia',
      'w obsłudze',
      'w obsludze',
    ],
    hash: 'start-i-obsluga',
  },
  ai_drafts: {
    aliases: [
      'szkice',
      'szkice ai',
      'do sprawdzenia',
      'ai drafts',
      'drafts',
    ],
    sectionAliases: [
      'szkice',
      'szkice ai',
      'do sprawdzenia',
      'ai drafts',
      'drafts',
    ],
    hash: 'szkice-ai',
  },
};

function normalizeText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesAny(value: unknown, aliases: string[]) {
  const normalized = normalizeText(value);
  if (!normalized) return false;

  return aliases.some((alias) => {
    const normalizedAlias = normalizeText(alias);
    return normalized === normalizedAlias || normalized.includes(normalizedAlias);
  });
}

function inferTargetFromText(value: unknown): TodayShortcutTarget | null {
  for (const [target, config] of Object.entries(TARGETS) as Array<[TodayShortcutTarget, TargetConfig]>) {
    if (matchesAny(value, config.aliases)) return target;
  }

  return null;
}

function isElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function isLikelyTopShortcutRoot(element: HTMLElement) {
  if (element.closest('[data-today-tile-card="true"]')) return false;
  if (element.closest('[role="dialog"]')) return false;

  const text = normalizeText(element.textContent);
  if (!inferTargetFromText(text)) return false;

  const rect = element.getBoundingClientRect();
  if (rect.width < 90 || rect.height < 56) return false;
  if (rect.width > 280 || rect.height > 180) return false;

  return true;
}

function findVisualTileRoot(element: HTMLElement) {
  let current: HTMLElement | null = element;
  let best: HTMLElement | null = null;

  while (current && current !== document.body) {
    if (isLikelyTopShortcutRoot(current)) {
      best = current;
    }

    const parent = current.parentElement;
    if (!parent) break;

    const parentRect = parent.getBoundingClientRect();
    if (parentRect.width > 360 || parentRect.height > 220) {
      break;
    }

    current = parent;
  }

  return best || element;
}

function readTargetFromElement(element: HTMLElement) {
  return (element.dataset.todayStage31Shortcut as TodayShortcutTarget | undefined)
    || (element.dataset.todayPipelineShortcut as TodayShortcutTarget | undefined)
    || (element.dataset.todayTopShortcut as TodayShortcutTarget | undefined)
    || (element.dataset.todaySummaryTile as TodayShortcutTarget | undefined)
    || (element.dataset.todayStatTile as TodayShortcutTarget | undefined)
    || inferTargetFromText(element.textContent);
}

function getClickableCandidate(target: EventTarget | null) {
  if (!isElement(target)) return null;
  if (target.closest('[data-today-tile-header="true"]')) return null;
  if (target.closest('[role="dialog"]')) return null;

  const direct = target.closest('[data-today-stage31-shortcut]');
  if (isElement(direct)) return direct;

  const selectors = [
    '[data-today-pipeline-shortcut]',
    '[data-today-top-shortcut]',
    '[data-today-week-calendar-shortcut="true"]',
    '[data-today-summary-tile]',
    '[data-today-stat-tile]',
    'button',
    'a',
    '[role="button"]',
    '.rounded-2xl',
    '.rounded-xl',
    '.rounded-full',
  ];

  for (const selector of selectors) {
    const element = target.closest(selector);
    if (!isElement(element)) continue;

    const root = findVisualTileRoot(element);
    if (readTargetFromElement(root) || readTargetFromElement(element)) return root;
  }

  return null;
}

function findPotentialTopShortcutElements() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      [
        '[data-today-pipeline-shortcut]',
        '[data-today-top-shortcut]',
        '[data-today-week-calendar-shortcut="true"]',
        '[data-today-summary-tile]',
        '[data-today-stat-tile]',
        'button',
        'a',
        '[role="button"]',
        '.rounded-2xl',
        '.rounded-xl',
        '.rounded-full',
      ].join(','),
    ),
  );
}

function findTopShortcutTileElements() {
  const unique = new Set<HTMLElement>();

  for (const element of findPotentialTopShortcutElements()) {
    if (element.closest('[data-today-tile-card="true"]')) continue;
    if (element.closest('[data-today-tile-header="true"]')) continue;
    if (element.closest('[role="dialog"]')) continue;

    const root = findVisualTileRoot(element);
    const target = readTargetFromElement(root) || readTargetFromElement(element);
    if (!target) continue;

    unique.add(root);
  }

  return Array.from(unique);
}

function markNumberLikeChildren(tile: HTMLElement) {
  const children = Array.from(tile.querySelectorAll<HTMLElement>('span, p, div, strong'));

  for (const child of children) {
    const text = String(child.textContent || '').trim();

    if (/^\d+$/.test(text)) {
      child.classList.add(TOP_TILE_NUMBER_CLASS_NAME);
      continue;
    }

    const className = String(child.getAttribute('class') || '');
    if (/\btext-(2xl|3xl|4xl|5xl|6xl)\b/.test(className) || /\bfont-(bold|black|extrabold)\b/.test(className)) {
      child.classList.add(TOP_TILE_NUMBER_CLASS_NAME);
    }
  }
}

function markIconLikeChildren(tile: HTMLElement) {
  const iconWrappers = Array.from(tile.querySelectorAll<HTMLElement>('svg, [class*="rounded-full"], [class*="rounded-xl"], [class*="rounded-2xl"]'));

  for (const icon of iconWrappers) {
    if (icon.closest('[data-today-tile-header="true"]')) continue;
    icon.classList.add(TOP_TILE_ICON_CLASS_NAME);
  }
}

function normalizeTopShortcutTiles() {
  for (const tile of findTopShortcutTileElements()) {
    const target = readTargetFromElement(tile);
    if (!target) continue;

    tile.classList.add(TOP_TILE_CLASS_NAME);
    tile.dataset.todayStage31Shortcut = target;
    tile.setAttribute('data-today-stage31-shortcut', target);

    if (!tile.getAttribute('role') && tile.tagName.toLowerCase() !== 'button' && tile.tagName.toLowerCase() !== 'a') {
      tile.setAttribute('role', 'button');
    }

    if (!tile.getAttribute('tabindex') && tile.tagName.toLowerCase() !== 'button' && tile.tagName.toLowerCase() !== 'a') {
      tile.setAttribute('tabindex', '0');
    }

    markNumberLikeChildren(tile);
    markIconLikeChildren(tile);
  }
}

function getAllTileHeaders() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-today-tile-header="true"]'));
}

function findSectionHeader(target: TodayShortcutTarget) {
  const config = TARGETS[target];
  const headers = getAllTileHeaders();

  for (const alias of config.sectionAliases) {
    const exact = headers.find((header) => normalizeText(header.dataset.todayTileTitle || header.textContent) === normalizeText(alias));
    if (exact) return exact;
  }

  for (const alias of config.sectionAliases) {
    const partial = headers.find((header) => matchesAny(header.dataset.todayTileTitle || header.textContent, [alias]));
    if (partial) return partial;
  }

  return null;
}

function getHeaderCard(header: HTMLElement) {
  const directCard = header.closest('[data-today-tile-card="true"]');
  if (isElement(directCard)) return directCard;

  const card = header.closest('.rounded-2xl, .rounded-xl, [class*="Card"]');
  return isElement(card) ? card : header;
}

function collapseOtherSections(targetHeader: HTMLElement) {
  const targetCard = getHeaderCard(targetHeader);

  for (const header of getAllTileHeaders()) {
    if (header === targetHeader) continue;

    const card = getHeaderCard(header);
    if (card === targetCard) continue;

    if (header.getAttribute('aria-expanded') !== 'false') {
      header.click();
    }
  }
}

function expandSection(targetHeader: HTMLElement) {
  if (targetHeader.getAttribute('aria-expanded') === 'false') {
    headerClickWithoutBubbling(targetHeader);
  }
}

function headerClickWithoutBubbling(header: HTMLElement) {
  header.click();
}

function moveSectionToTop(targetHeader: HTMLElement) {
  const card = getHeaderCard(targetHeader);
  const parent = card.parentElement;
  if (!parent) return;

  const cards = Array.from(parent.querySelectorAll<HTMLElement>(':scope > [data-today-tile-card="true"]'));
  const firstCard = cards.find((item) => item !== card);

  if (firstCard) {
    parent.insertBefore(card, firstCard);
  }
}

function setActiveTopTile(target: TodayShortcutTarget) {
  for (const tile of findTopShortcutTileElements()) {
    const tileTarget = readTargetFromElement(tile);
    tile.classList.toggle(TOP_TILE_ACTIVE_CLASS_NAME, tileTarget === target);
  }
}

function openTargetSection(target: TodayShortcutTarget) {
  if (target === 'today') {
    const urgentHeader = findSectionHeader('urgent');
    if (urgentHeader) {
      collapseOtherSections(urgentHeader);
    }
    return;
  }

  const header = findSectionHeader(target);

  if (!header) {
    try {
      window.location.hash = TARGETS[target].hash;
    } catch {
      // Ignore hash failures.
    }
    return;
  }

  collapseOtherSections(header);
  expandSection(header);
  moveSectionToTop(header);
  setActiveTopTile(target);

  window.setTimeout(() => {
    const card = getHeaderCard(header);
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      window.history.replaceState(null, '', '#' + TARGETS[target].hash);
    } catch {
      window.location.hash = TARGETS[target].hash;
    }
  }, 80);
}

function handleShortcutClick(event: Event) {
  const element = getClickableCandidate(event.target);
  if (!element) return;

  const target = readTargetFromElement(element);
  if (!target || !(target in TARGETS)) return;

  event.preventDefault();
  event.stopPropagation();

  openTargetSection(target);
}

function handleShortcutKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return;

  const element = getClickableCandidate(event.target);
  if (!element) return;

  const target = readTargetFromElement(element);
  if (!target || !(target in TARGETS)) return;

  event.preventDefault();
  event.stopPropagation();

  openTargetSection(target);
}

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${TOP_TILE_CLASS_NAME} {
      position: relative;
      isolation: isolate;
      cursor: pointer;
      border: 1px solid rgb(226 232 240) !important;
      background: rgb(255 255 255) !important;
      color: rgb(15 23 42) !important;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06) !important;
      transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease, background 160ms ease;
    }

    .${TOP_TILE_CLASS_NAME}:hover {
      border-color: rgb(191 219 254) !important;
      box-shadow: 0 14px 36px rgba(15, 23, 42, 0.10) !important;
      transform: translateY(-1px);
    }

    .${TOP_TILE_ACTIVE_CLASS_NAME} {
      border-color: rgb(59 130 246) !important;
      box-shadow: 0 16px 40px rgba(37, 99, 235, 0.16) !important;
    }

    .${TOP_TILE_CLASS_NAME} :where(p, span, strong, div) {
      color: rgb(15 23 42) !important;
    }

    .${TOP_TILE_CLASS_NAME} :where([class*="opacity-"], [style*="opacity"]) {
      opacity: 1 !important;
    }

    .${TOP_TILE_CLASS_NAME} .${TOP_TILE_NUMBER_CLASS_NAME} {
      color: rgb(15 23 42) !important;
      opacity: 1 !important;
      visibility: visible !important;
      -webkit-text-fill-color: rgb(15 23 42) !important;
      text-shadow: none !important;
    }

    .${TOP_TILE_CLASS_NAME} :where(svg) {
      color: rgb(71 85 105) !important;
      stroke: currentColor !important;
      opacity: 1 !important;
    }

    .${TOP_TILE_CLASS_NAME} :where([class*="text-white"], [class*="text-blue"], [class*="text-red"], [class*="text-orange"], [class*="text-amber"], [class*="text-green"]) {
      color: rgb(15 23 42) !important;
      opacity: 1 !important;
    }

    .${TOP_TILE_CLASS_NAME} :where(.text-2xl, .text-3xl, .text-4xl, .text-5xl, .text-6xl, [class*="font-bold"], [class*="font-black"]) {
      color: rgb(15 23 42) !important;
      opacity: 1 !important;
      -webkit-text-fill-color: rgb(15 23 42) !important;
    }

    .${TOP_TILE_CLASS_NAME} .${TOP_TILE_ICON_CLASS_NAME}:where([class*="rounded"]) {
      color: rgb(51 65 85) !important;
      opacity: 1 !important;
    }

    [data-today-tile-card="true"] {
      scroll-margin-top: 7rem;
    }
  `;

  document.head.appendChild(style);
}

export function installTodayStage31TilesInteraction() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => undefined;
  }

  installStyle();
  normalizeTopShortcutTiles();

  let observerTimer: number | null = null;

  const observer = new MutationObserver(() => {
    if (observerTimer) window.clearTimeout(observerTimer);

    observerTimer = window.setTimeout(() => {
      normalizeTopShortcutTiles();
      observerTimer = null;
    }, OBSERVER_DEBOUNCE_MS);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  document.addEventListener('click', handleShortcutClick, true);
  document.addEventListener('keydown', handleShortcutKeydown, true);

  return () => {
    if (observerTimer) window.clearTimeout(observerTimer);

    observer.disconnect();
    document.removeEventListener('click', handleShortcutClick, true);
    document.removeEventListener('keydown', handleShortcutKeydown, true);
  };
}
