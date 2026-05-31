(() => {
  const pick = (name, selector) => {
    const el = document.querySelector(selector);
    if (!el) return { name, found: false };
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      name,
      found: true,
      className: el.getAttribute('class') || '',
      left: Math.round(r.left),
      width: Math.round(r.width),
      right: Math.round(r.right),
      top: Math.round(r.top),
      height: Math.round(r.height),
      display: cs.display,
      gridTemplateColumns: cs.gridTemplateColumns,
      maxWidth: cs.maxWidth,
      gap: cs.gap,
    };
  };

  const rows = [
    pick('main', '[data-stage178-tasks-operational-panel="true"]'),
    pick('workspace', '[data-stage178-tasks-workspace="true"]'),
    pick('mainStack', '.tasks-stage178-main-stack'),
    pick('searchPanel', '[data-tasks-search-panel-stage178="true"]'),
    pick('search', '[data-cf-main-search-stage178="true"]'),
    pick('groupedList', '[data-stage178-tasks-grouped-list="true"]'),
    pick('firstTaskCard', '.tasks-stage178-grouped-list .tasks-stage48-task-card'),
    pick('rightRail', '[data-stage178-tasks-right-rail="true"]'),
    pick('filterCard', '[data-stage178-tasks-filter-card="true"]'),
    pick('urgentCard', '[data-stage178-tasks-urgent-card="true"]'),
    pick('focusCard', '[data-stage178-tasks-focus-card="true"]'),
  ];

  console.table(rows);
  return {
    href: location.href,
    stage178: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage178-tasks-right-rail-grouped-list-source-truth')
      .trim(),
    viewport: {
      innerWidth,
      innerHeight,
      visualWidth: Math.round(window.visualViewport?.width || innerWidth),
      devicePixelRatio,
    },
    rows,
    groups: [...document.querySelectorAll('[data-stage178-task-group]')].map((el) => ({
      group: el.getAttribute('data-stage178-task-group'),
      text: (el.textContent || '').replace(/\s+/g, ' ').slice(0, 160),
    })),
  };
})();
