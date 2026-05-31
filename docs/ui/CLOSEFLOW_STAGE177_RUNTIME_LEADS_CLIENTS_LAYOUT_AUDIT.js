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
      gap: cs.columnGap || cs.gap,
    };
  };

  const rows = [
    pick('layoutList', '.cf-html-view .layout-list'),
    pick('stack', '.cf-html-view .layout-list > .stack'),
    pick('search', '.cf-html-view .layout-list > .stack .cf-main-search, .cf-html-view .layout-list > .stack .search'),
    pick('tableCard', '.cf-html-view .table-card'),
    pick('firstRecordRow', '.cf-html-view .table-card .row:not(.row-empty)'),
    pick('rightRail', '.cf-html-view .lead-right-rail, .cf-html-view .clients-right-rail'),
    pick('simpleFiltersCard', '[data-testid="leads-simple-filters-card"], [data-testid="clients-simple-filters-card"]'),
    pick('topValueCard', '[data-testid="leads-top-value-records-card"], [data-testid="clients-top-value-records-card"]'),
  ];

  console.table(rows);
  return {
    href: location.href,
    stage177: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage177-leads-clients-list-layout-source-truth')
      .trim(),
    viewport: {
      innerWidth,
      innerHeight,
      visualWidth: Math.round(window.visualViewport?.width || innerWidth),
      devicePixelRatio,
    },
    rows,
  };
})();
