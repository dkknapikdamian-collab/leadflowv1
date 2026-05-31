/* CLOSEFLOW_STAGE157_RUNTIME_VIEWPORT_ZOOM_AUDIT */
(() => {
  const selectors = [
    ['root', '#root'],
    ['app', '#root > .app.closeflow-visual-stage01.cf-html-shell'],
    ['sidebar', '[data-shell-sidebar="true"]'],
    ['main', '[data-shell-main="true"]'],
    ['globalBar', '.global-bar'],
    ['shellContent', '[data-shell-content="true"]'],
    ['routeRoot', '.cf-route-work-root, .cf-html-view, [data-p0-today-stable-rebuild="true"]'],
  ];

  const rows = selectors.flatMap(([name, selector]) =>
    [...document.querySelectorAll(selector)].slice(0, 3).map((el, index) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        name,
        index,
        className: String(el.className || ''),
        left: Math.round(r.left),
        width: Math.round(r.width),
        right: Math.round(r.right),
        height: Math.round(r.height),
        zoom: cs.zoom,
        transform: cs.transform,
        cssWidth: cs.width,
        minWidth: cs.minWidth,
        maxWidth: cs.maxWidth,
        overflowX: cs.overflowX,
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
      stage156Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage156-real-density-tokens-no-zoom')
        .trim(),
      stage157Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage157-viewport-zoom-80-source-truth')
        .trim(),
      cf157Zoom: getComputedStyle(document.documentElement)
        .getPropertyValue('--cf157-page-zoom')
        .trim(),
      cf157Width: getComputedStyle(document.documentElement)
        .getPropertyValue('--cf157-layout-width')
        .trim(),
    },
    rows,
  };

  console.table(rows);
  return result;
})();
