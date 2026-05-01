// STAGE32_TODAY_RELATIONS_LOADING_LOCAL_FIX
// Lokalna poprawka Dziś:
// - porządkuje sekcję "Najcenniejsze relacje",
// - wyrównuje nazwę rekordu i typ Lead/Klient/Sprawa,
// - dodaje delikatny kolor do typu relacji,
// - poprawia pusty/loadingowy stan "Dziś w skrócie".

const STYLE_ID = 'today-stage32-relations-loading-style';
const OBSERVER_DEBOUNCE_MS = 120;

function normalizeText(value: unknown) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function getCardFromHeader(header: HTMLElement) {
  const directCard = header.closest<HTMLElement>('[data-today-tile-card="true"]');
  if (directCard) return directCard;

  const card = header.closest<HTMLElement>('.rounded-2xl, .rounded-xl, article, section');
  return card || header;
}

function findValuableRelationsCard() {
  const headers = Array.from(document.querySelectorAll<HTMLElement>('[data-today-tile-header="true"], h1, h2, h3, p, span, div'));

  for (const header of headers) {
    const text = normalizeText(header.dataset.todayTileTitle || header.textContent);
    if (!text) continue;

    if (
      text.includes('najcenniejsze relacje')
      || text.includes('najcenniejsze kontakty')
      || text.includes('najwazniejsze relacje')
      || text.includes('najwazniejsze kontakty')
    ) {
      return getCardFromHeader(header);
    }
  }

  return null;
}

function inferRelationTypeFromHref(href: string | null) {
  const value = String(href || '').toLowerCase();

  if (value.includes('/clients/')) return 'Klient';
  if (value.includes('/cases/')) return 'Sprawa';
  if (value.includes('/leads/')) return 'Lead';

  return 'Relacja';
}

function inferRelationTypeFromText(text: string) {
  const value = normalizeText(text);

  if (value.includes('klient')) return 'Klient';
  if (value.includes('sprawa')) return 'Sprawa';
  if (value.includes('lead')) return 'Lead';

  return null;
}

function getRelationTone(type: string) {
  if (type === 'Klient') return 'client';
  if (type === 'Sprawa') return 'case';
  if (type === 'Lead') return 'lead';
  return 'relation';
}

function isRelationRowCandidate(element: HTMLElement) {
  if (element.closest('[data-today-tile-header="true"]')) return false;
  if (element.closest('[role="dialog"]')) return false;

  const rect = element.getBoundingClientRect();
  if (rect.width < 160 || rect.height < 34) return false;

  const text = normalizeText(element.textContent);
  if (!text) return false;

  return Boolean(
    element.matches('a, [role="link"], .group, .rounded-xl, .rounded-2xl')
    || element.querySelector('a[href*="/leads/"], a[href*="/clients/"], a[href*="/cases/"]')
    || element.getAttribute('href'),
  );
}

function findRelationRows(card: HTMLElement) {
  const rows = new Set<HTMLElement>();
  const candidates = Array.from(card.querySelectorAll<HTMLElement>('a, [role="link"], .group, .rounded-xl, .rounded-2xl'));

  for (const candidate of candidates) {
    if (!isRelationRowCandidate(candidate)) continue;

    const href = candidate.getAttribute('href') || candidate.querySelector<HTMLAnchorElement>('a[href]')?.getAttribute('href') || '';
    const text = normalizeText(candidate.textContent);

    if (!href.includes('/leads/') && !href.includes('/clients/') && !href.includes('/cases/') && !text.includes('lead') && !text.includes('klient') && !text.includes('sprawa')) {
      continue;
    }

    rows.add(candidate);
  }

  return Array.from(rows);
}

function findMainColumn(row: HTMLElement) {
  return (
    row.querySelector<HTMLElement>('.min-w-0')
    || row.querySelector<HTMLElement>('[class*="basis-full"]')
    || row.querySelector<HTMLElement>('div')
    || row
  );
}

function findTitleElement(mainColumn: HTMLElement) {
  return (
    mainColumn.querySelector<HTMLElement>('p.font-semibold')
    || mainColumn.querySelector<HTMLElement>('strong')
    || mainColumn.querySelector<HTMLElement>('p')
    || mainColumn
  );
}

function getOrCreateMetaLine(mainColumn: HTMLElement) {
  let metaLine = mainColumn.querySelector<HTMLElement>('[data-stage32-relation-meta-line="true"]');

  if (!metaLine) {
    metaLine = document.createElement('div');
    metaLine.setAttribute('data-stage32-relation-meta-line', 'true');
    metaLine.className = 'stage32-relation-meta-line';

    const title = findTitleElement(mainColumn);
    if (title.parentElement === mainColumn) {
      title.insertAdjacentElement('afterend', metaLine);
    } else {
      const titleWrapper = title.closest<HTMLElement>('div');
      if (titleWrapper && titleWrapper.parentElement === mainColumn) {
        titleWrapper.insertAdjacentElement('afterend', metaLine);
      } else {
        mainColumn.insertBefore(metaLine, mainColumn.children[1] || null);
      }
    }
  }

  return metaLine;
}

function moveExistingBadgesToMetaLine(row: HTMLElement, mainColumn: HTMLElement, metaLine: HTMLElement) {
  const title = findTitleElement(mainColumn);
  const titleWrapper = title.closest<HTMLElement>('div');

  const possibleBadges = Array.from(mainColumn.querySelectorAll<HTMLElement>('.rounded-full, [class*="Badge"], [class*="badge"]'));

  for (const badge of possibleBadges) {
    if (badge === metaLine || badge.closest('[data-stage32-relation-meta-line="true"]')) continue;
    if (badge.contains(title)) continue;
    if (badge.closest('[data-today-quick-snooze-bar="true"]')) continue;

    const text = normalizeText(badge.textContent);
    if (!text) continue;

    if (text.includes('lead') || text.includes('klient') || text.includes('sprawa') || titleWrapper?.contains(badge)) {
      metaLine.appendChild(badge);
    }
  }
}

function ensureTypeBadge(row: HTMLElement, metaLine: HTMLElement) {
  const existing = Array.from(metaLine.querySelectorAll<HTMLElement>('[data-stage32-relation-type="true"], .rounded-full, [class*="Badge"], [class*="badge"]'))
    .find((item) => {
      const text = normalizeText(item.textContent);
      return text.includes('lead') || text.includes('klient') || text.includes('sprawa') || text.includes('relacja');
    });

  if (existing) {
    const type = inferRelationTypeFromText(existing.textContent || '') || inferRelationTypeFromHref(row.getAttribute('href'));
    existing.setAttribute('data-stage32-relation-type', 'true');
    existing.setAttribute('data-stage32-relation-tone', getRelationTone(type));
    existing.textContent = type;
    return;
  }

  const href = row.getAttribute('href') || row.querySelector<HTMLAnchorElement>('a[href]')?.getAttribute('href') || '';
  const type = inferRelationTypeFromHref(href);

  const badge = document.createElement('span');
  badge.setAttribute('data-stage32-relation-type', 'true');
  badge.setAttribute('data-stage32-relation-tone', getRelationTone(type));
  badge.textContent = type;

  metaLine.insertBefore(badge, metaLine.firstChild);
}

function normalizeValuableRelationRows() {
  const card = findValuableRelationsCard();
  if (!card) return;

  card.setAttribute('data-stage32-valuable-relations-card', 'true');

  const rows = findRelationRows(card);

  for (const row of rows) {
    row.setAttribute('data-stage32-relation-row', 'true');

    const mainColumn = findMainColumn(row);
    mainColumn.setAttribute('data-stage32-relation-main', 'true');

    const title = findTitleElement(mainColumn);
    title.setAttribute('data-stage32-relation-title', 'true');

    const metaLine = getOrCreateMetaLine(mainColumn);
    moveExistingBadgesToMetaLine(row, mainColumn, metaLine);
    ensureTypeBadge(row, metaLine);
  }
}

function findTodaySummaryLoadingElement() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3, p, span, div'));

  for (const element of elements) {
    const text = normalizeText(element.textContent);
    if (!text) continue;

    if (text === 'dzis w skrocie' || text === 'dziś w skrócie' || text.includes('dzis w skrocie') || text.includes('dziś w skrócie')) {
      return element;
    }
  }

  return null;
}

function hasLoadedTopTiles() {
  const shortcutCount = document.querySelectorAll<HTMLElement>(
    '[data-today-stage31-shortcut], .today-stage31-shortcut-tile, [data-today-pipeline-shortcut], [data-today-top-shortcut]',
  ).length;

  return shortcutCount >= 3;
}

function normalizeTodayLoadingState() {
  const marker = findTodaySummaryLoadingElement();
  if (!marker) return;

  const root =
    marker.closest<HTMLElement>('[data-today-summary-loading-root="true"]')
    || marker.closest<HTMLElement>('.rounded-2xl, .rounded-xl, section, article')
    || marker.parentElement;

  if (!root) return;

  if (hasLoadedTopTiles()) {
    root.removeAttribute('data-stage32-today-summary-loading');
    return;
  }

  root.setAttribute('data-stage32-today-summary-loading', 'true');
}

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    [data-stage32-valuable-relations-card="true"] {
      border-color: rgb(219 234 254) !important;
      background:
        linear-gradient(135deg, rgba(239, 246, 255, 0.72), rgba(255, 255, 255, 0.96) 42%, rgba(240, 253, 250, 0.55)) !important;
    }

    [data-stage32-valuable-relations-card="true"] [data-stage32-relation-row="true"] {
      border: 1px solid rgb(226 232 240) !important;
      background: rgba(255, 255, 255, 0.94) !important;
      border-radius: 18px !important;
      box-shadow: 0 10px 26px rgba(15, 23, 42, 0.055) !important;
      overflow: hidden;
    }

    [data-stage32-valuable-relations-card="true"] [data-stage32-relation-row="true"]:hover {
      border-color: rgb(147 197 253) !important;
      box-shadow: 0 14px 34px rgba(37, 99, 235, 0.11) !important;
    }

    [data-stage32-valuable-relations-card="true"] [data-stage32-relation-main="true"] {
      display: grid !important;
      align-content: center !important;
      gap: 4px !important;
      min-width: 0 !important;
    }

    [data-stage32-valuable-relations-card="true"] [data-stage32-relation-title="true"] {
      display: block !important;
      margin: 0 !important;
      color: rgb(15 23 42) !important;
      font-weight: 800 !important;
      line-height: 1.2 !important;
      white-space: normal !important;
    }

    [data-stage32-valuable-relations-card="true"] [data-stage32-relation-meta-line="true"] {
      display: flex !important;
      min-height: 24px !important;
      align-items: center !important;
      gap: 6px !important;
      flex-wrap: wrap !important;
      margin-top: 2px !important;
    }

    [data-stage32-valuable-relations-card="true"] [data-stage32-relation-type="true"] {
      display: inline-flex !important;
      height: 22px !important;
      align-items: center !important;
      border-radius: 999px !important;
      border: 1px solid transparent !important;
      padding: 0 8px !important;
      font-size: 11px !important;
      font-weight: 800 !important;
      letter-spacing: 0.03em !important;
      text-transform: uppercase !important;
      line-height: 1 !important;
      white-space: nowrap !important;
    }

    [data-stage32-relation-type="true"][data-stage32-relation-tone="lead"] {
      border-color: rgb(191 219 254) !important;
      background: rgb(239 246 255) !important;
      color: rgb(29 78 216) !important;
    }

    [data-stage32-relation-type="true"][data-stage32-relation-tone="client"] {
      border-color: rgb(167 243 208) !important;
      background: rgb(236 253 245) !important;
      color: rgb(4 120 87) !important;
    }

    [data-stage32-relation-type="true"][data-stage32-relation-tone="case"] {
      border-color: rgb(221 214 254) !important;
      background: rgb(245 243 255) !important;
      color: rgb(109 40 217) !important;
    }

    [data-stage32-relation-type="true"][data-stage32-relation-tone="relation"] {
      border-color: rgb(226 232 240) !important;
      background: rgb(248 250 252) !important;
      color: rgb(71 85 105) !important;
    }

    [data-stage32-valuable-relations-card="true"] [data-stage32-relation-main="true"] > p:not([data-stage32-relation-title="true"]) {
      margin-top: 4px !important;
      color: rgb(71 85 105) !important;
    }

    [data-stage32-today-summary-loading="true"] {
      min-height: 128px !important;
      border-radius: 28px !important;
      border: 1px solid rgb(226 232 240) !important;
      background:
        linear-gradient(90deg, rgba(248, 250, 252, 0.74), rgba(255, 255, 255, 0.96), rgba(239, 246, 255, 0.7)) !important;
      box-shadow: 0 16px 42px rgba(15, 23, 42, 0.06) !important;
      position: relative !important;
      overflow: hidden !important;
    }

    [data-stage32-today-summary-loading="true"]::before {
      content: "Ładuję dzisiejszy plan…";
      position: absolute;
      left: 24px;
      top: 22px;
      z-index: 2;
      color: rgb(71 85 105);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    [data-stage32-today-summary-loading="true"]::after {
      content: "";
      position: absolute;
      left: 24px;
      right: 24px;
      bottom: 24px;
      height: 52px;
      border-radius: 18px;
      background:
        linear-gradient(90deg, rgb(241 245 249) 0%, rgb(255 255 255) 45%, rgb(241 245 249) 100%);
      background-size: 220% 100%;
      animation: stage32TodayLoadingPulse 1.2s ease-in-out infinite;
    }

    [data-stage32-today-summary-loading="true"] > * {
      opacity: 0 !important;
    }

    @keyframes stage32TodayLoadingPulse {
      0% { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }
  `;

  document.head.appendChild(style);
}

function runStage32Polish() {
  normalizeValuableRelationRows();
  normalizeTodayLoadingState();
}

export function installTodayStage32RelationsLoadingPolish() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => undefined;
  }

  installStyle();
  runStage32Polish();

  let observerTimer: number | null = null;

  const observer = new MutationObserver(() => {
    if (observerTimer) window.clearTimeout(observerTimer);

    observerTimer = window.setTimeout(() => {
      runStage32Polish();
      observerTimer = null;
    }, OBSERVER_DEBOUNCE_MS);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    if (observerTimer) window.clearTimeout(observerTimer);
    observer.disconnect();
  };
}
