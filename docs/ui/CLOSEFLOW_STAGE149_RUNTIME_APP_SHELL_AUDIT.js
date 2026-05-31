/* CLOSEFLOW_STAGE149_RUNTIME_APP_SHELL_AUDIT */
(() => {
  const selectors = [
    ['html', 'html'],
    ['body', 'body'],
    ['root', '#root'],
    ['app', '#root > .app.closeflow-visual-stage01.cf-html-shell'],
    ['sidebar', '[data-shell-sidebar="true"]'],
    ['main', '[data-shell-main="true"]'],
    ['globalBar', '.global-bar'],
    ['shellContent', '[data-shell-content="true"]'],
    ['todayRoot', '[data-p0-today-stable-rebuild="true"]'],
    ['leadsRoot', '.main-leads-html'],
    ['clientsRoot', '.main-clients-html'],
    ['casesRoot', '.main-cases-html'],
    ['tasksRoot', '[data-p0-tasks-stable-rebuild="true"]'],
    ['layoutList', '.layout-list'],
    ['rightRail', '.lead-right-rail, .clients-right-rail, .cases-right-rail'],
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
        clientWidth: el.clientWidth,
        scrollWidth: el.scrollWidth,
        maxWidth: cs.maxWidth,
        minWidth: cs.minWidth,
        marginLeft: cs.marginLeft,
        marginRight: cs.marginRight,
        overflowX: cs.overflowX,
        transform: cs.transform,
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
      minCanvas: getComputedStyle(document.documentElement)
        .getPropertyValue('--cf149-min-canvas-width')
        .trim(),
      stage148Attr: document.documentElement.getAttribute('data-cf148-scaled-desktop-shell'),
    },
    rows,
  };

  console.table(rows);
  return result;
})();
