/* CLOSEFLOW_STAGE148_RUNTIME_SCALED_DESKTOP_AUDIT */
(() => {
  const selectors = [
    ['html', 'html'],
    ['body', 'body'],
    ['root', '#root'],
    ['app', '#root > .app.closeflow-visual-stage01.cf-html-shell'],
    ['sidebar', '[data-shell-sidebar="true"]'],
    ['main', '[data-shell-main="true"]'],
    ['globalBar', '[data-shell-global-bar="true"]'],
    ['shellContent', '[data-shell-content="true"]'],
    ['todayRoot', '[data-p0-today-stable-rebuild="true"]'],
    ['leadsRoot', '.main-leads-html'],
    ['clientsRoot', '.main-clients-html'],
    ['casesRoot', '.main-cases-html'],
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
        display: cs.display,
        transform: cs.transform,
        gridTemplateColumns: cs.gridTemplateColumns,
        maxWidth: cs.maxWidth,
        marginLeft: cs.marginLeft,
        marginRight: cs.marginRight,
        overflowX: cs.overflowX,
      };
    })
  );

  const htmlStyle = getComputedStyle(document.documentElement);
  const result = {
    href: location.href,
    viewport: {
      innerWidth: window.innerWidth,
      visualWidth: Math.round(window.visualViewport?.width || 0),
      outerWidth: window.outerWidth,
      devicePixelRatio: window.devicePixelRatio,
      hoverFine: matchMedia('(hover: hover) and (pointer: fine)').matches,
    },
    stageFlags: {
      stage145Loaded: htmlStyle.getPropertyValue('--closeflow-stage145-route-root-width-normalization').trim(),
      stage146Loaded: htmlStyle.getPropertyValue('--closeflow-stage146-fluid-work-surface').trim(),
      stage147Loaded: htmlStyle.getPropertyValue('--closeflow-stage147-shell-overflow-and-work-surface-repair').trim(),
      stage148Loaded: htmlStyle.getPropertyValue('--closeflow-stage148-scaled-desktop-shell').trim(),
      scaledDesktopAttr: document.documentElement.getAttribute('data-cf148-scaled-desktop-shell'),
      designWidth: htmlStyle.getPropertyValue('--cf148-design-width').trim(),
      scale: htmlStyle.getPropertyValue('--cf148-scale').trim(),
      inverseScale: htmlStyle.getPropertyValue('--cf148-inverse-scale').trim(),
    },
    rows,
  };

  console.table(rows);
  return result;
})();
