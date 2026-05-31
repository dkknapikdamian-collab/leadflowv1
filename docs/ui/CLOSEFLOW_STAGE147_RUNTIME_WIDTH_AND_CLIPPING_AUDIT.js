/* CLOSEFLOW_STAGE147_RUNTIME_WIDTH_AND_CLIPPING_AUDIT */
(() => {
  const selectors = [
    ['app', '#root > .app.closeflow-visual-stage01.cf-html-shell'],
    ['sidebar', '[data-shell-sidebar="true"]'],
    ['main', '[data-shell-main="true"]'],
    ['globalBar', '.global-bar'],
    ['shellContent', '[data-shell-content="true"]'],
    ['todayRoot', '[data-p0-today-stable-rebuild="true"]'],
    ['clientsRoot', '.main-clients-html'],
    ['leadsRoot', '.main-leads-html'],
    ['layoutList', '.layout-list'],
    ['rightRail', '.lead-right-rail, .clients-right-rail, .cases-right-rail'],
    ['activityShell', '.activity-vnext-shell'],
  ];

  const rows = selectors.flatMap(([name, selector]) =>
    [...document.querySelectorAll(selector)].map((el, index) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        name,
        index,
        className: String(el.className || ''),
        left: Math.round(r.left),
        width: Math.round(r.width),
        right: Math.round(r.right),
        maxWidth: cs.maxWidth,
        marginLeft: cs.marginLeft,
        marginRight: cs.marginRight,
        overflowX: cs.overflowX,
        overflow: cs.overflow,
        clipPath: cs.clipPath,
        contain: cs.contain,
        gridTemplateColumns: cs.gridTemplateColumns,
      };
    })
  );

  const result = {
    href: location.href,
    viewport: {
      innerWidth: window.innerWidth,
      visualWidth: Math.round(window.visualViewport?.width || 0),
      outerWidth: window.outerWidth,
      devicePixelRatio: window.devicePixelRatio,
      hoverFine: matchMedia('(hover: hover) and (pointer: fine)').matches,
    },
    stage145Loaded: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage145-route-root-width-normalization')
      .trim(),
    stage146Loaded: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage146-fluid-work-surface')
      .trim(),
    stage147Loaded: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage147-shell-overflow-and-work-surface-repair')
      .trim(),
    rows,
  };

  console.table(rows);
  return result;
})();
