/* CLOSEFLOW_STAGE160_RUNTIME_MODAL_CENTER_AUDIT */
(() => {
  const selectors = [
    ['app', '#root > .app.closeflow-visual-stage01.cf-html-shell'],
    ['inAppDialog', '#root > .app.closeflow-visual-stage01.cf-html-shell [role="dialog"]'],
    ['bodyPortalDialog', 'body > :not(#root) [role="dialog"], body > [data-radix-portal] [role="dialog"]'],
    ['dialogAny', '[role="dialog"], [data-radix-dialog-content], [data-radix-alert-dialog-content], .modal-content'],
    ['submitRow', '[role="dialog"] form > :is(div, section, footer):has(button[type="submit"])'],
    ['overlay', '[data-radix-dialog-overlay], .dialog-overlay, .modal-overlay, .overlay, .backdrop'],
  ];

  const rows = selectors.flatMap(([name, selector]) =>
    [...document.querySelectorAll(selector)].slice(0, 8).map((el, index) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        name,
        index,
        tag: el.tagName.toLowerCase(),
        className: String(el.className || ''),
        role: el.getAttribute('role'),
        left: Math.round(r.left),
        top: Math.round(r.top),
        width: Math.round(r.width),
        height: Math.round(r.height),
        right: Math.round(r.right),
        bottom: Math.round(r.bottom),
        centerX: Math.round(r.left + r.width / 2),
        centerY: Math.round(r.top + r.height / 2),
        viewportCenterX: Math.round(window.innerWidth / 2),
        viewportCenterY: Math.round(window.innerHeight / 2),
        zoom: cs.zoom,
        position: cs.position,
        transform: cs.transform,
        maxWidth: cs.maxWidth,
        maxHeight: cs.maxHeight,
        overflowY: cs.overflowY,
      };
    })
  );

  const result = {
    href: location.href,
    viewport: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      visualWidth: Math.round(window.visualViewport?.width || 0),
      visualHeight: Math.round(window.visualViewport?.height || 0),
      outerWidth: window.outerWidth,
      devicePixelRatio: window.devicePixelRatio,
    },
    flags: {
      stage157Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage157-viewport-zoom-80-source-truth')
        .trim(),
      stage159Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage159-overlay-real-density-and-footer-fix')
        .trim(),
      stage160Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage160-modal-center-and-compact-all')
        .trim(),
      cf160ModalWidth: getComputedStyle(document.documentElement)
        .getPropertyValue('--cf160-modal-visual-width')
        .trim(),
    },
    rows,
  };

  console.table(rows);
  return result;
})();
