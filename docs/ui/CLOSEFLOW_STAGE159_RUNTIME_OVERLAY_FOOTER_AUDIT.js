/* CLOSEFLOW_STAGE159_RUNTIME_OVERLAY_FOOTER_AUDIT */
(() => {
  const selectors = [
    ['dialog', '[role="dialog"], [data-radix-dialog-content], [data-radix-alert-dialog-content], .modal, .modal-content'],
    ['dialogForm', '[role="dialog"] form, [data-radix-dialog-content] form, .modal-content form'],
    ['submitRow', '[role="dialog"] form > :is(div, section, footer):has(button[type="submit"]), [data-radix-dialog-content] form > :is(div, section, footer):has(button[type="submit"])'],
    ['footer', '[role="dialog"] footer, [role="dialog"] .dialog-footer, [role="dialog"] .modal-footer'],
    ['overlay', '[data-radix-dialog-overlay], .dialog-overlay, .modal-overlay, .overlay, .backdrop'],
  ];

  const rows = selectors.flatMap(([name, selector]) =>
    [...document.querySelectorAll(selector)].slice(0, 6).map((el, index) => {
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
        zoom: cs.zoom,
        position: cs.position,
        transform: cs.transform,
        order: cs.order,
        overflowY: cs.overflowY,
        maxHeight: cs.maxHeight,
        fontSize: cs.fontSize,
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
    },
    flags: {
      stage157Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage157-viewport-zoom-80-source-truth')
        .trim(),
      stage158Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage158-overlay-portal-density-source-truth')
        .trim(),
      stage159Loaded: getComputedStyle(document.documentElement)
        .getPropertyValue('--closeflow-stage159-overlay-real-density-and-footer-fix')
        .trim(),
    },
    rows,
  };

  console.table(rows);
  return result;
})();
