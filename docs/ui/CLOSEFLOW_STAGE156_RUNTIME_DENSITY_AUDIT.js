/* CLOSEFLOW_STAGE156_RUNTIME_DENSITY_AUDIT */
(() => {
  const selectors = [
    ['root', '#root'],
    ['app', '#root > .app.closeflow-visual-stage01.cf-html-shell'],
    ['sidebar', '[data-shell-sidebar="true"]'],
    ['main', '[data-shell-main="true"]'],
    ['globalBar', '.global-bar'],
    ['shellContent', '[data-shell-content="true"]'],
    ['routeRoot', '.cf-route-work-root, .cf-html-view, [data-p0-today-stable-rebuild="true"]'],
    ['firstCard', '.summary-card, .table-card, article, .panel-card'],
  ];

  const rows = selectors.flatMap(([name, selector]) =>
    [...document.querySelectorAll(selector)].slice(0, 4).map((el, index) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        name,
        index,
        className: String(el.className || ''),
        left: Math.round(r.left),
        width: Math.round(r.width),
        height: Math.round(r.height),
        right: Math.round(r.right),
        zoom: cs.zoom,
        transform: cs.transform,
        padding: cs.padding,
        gap: cs.gap,
        minHeight: cs.minHeight,
        fontSize: cs.fontSize,
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
    flags: {
      stage149Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage149-clean-desktop-app-shell-canvas')
        .trim(),
      stage153Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage153-panel-zoom-density-source-truth')
        .trim(),
      stage154Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage154-revert-global-zoom-keep-card-density')
        .trim(),
      stage155Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage155-main-panel-density-scale-source-truth')
        .trim(),
      stage156Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage156-real-density-tokens-no-zoom')
        .trim(),
    },
    rows,
  };

  console.table(rows);
  return result;
})();
