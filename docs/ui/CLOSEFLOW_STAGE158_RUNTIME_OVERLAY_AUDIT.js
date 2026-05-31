/* CLOSEFLOW_STAGE158_RUNTIME_OVERLAY_AUDIT */
(() => {
  const selectors = [
    ['app', '#root > .app.closeflow-visual-stage01.cf-html-shell'],
    ['dialog', '[role="dialog"], [data-radix-dialog-content], [data-radix-alert-dialog-content], .modal, .modal-content'],
    ['popover', '[data-radix-popper-content-wrapper], [data-radix-popover-content], [data-radix-dropdown-menu-content], [data-radix-select-content]'],
    ['toast', '[data-sonner-toaster], [data-sonner-toast], .pwa-install-prompt, .bug-note-recorder, [data-bug-note-recorder]'],
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
        transform: cs.transform,
        maxWidth: cs.maxWidth,
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
      cf157Zoom: getComputedStyle(document.documentElement)
        .getPropertyValue('--cf157-page-zoom')
        .trim(),
      cf158Scale: getComputedStyle(document.documentElement)
        .getPropertyValue('--cf158-overlay-scale')
        .trim(),
    },
    rows,
  };

  console.table(rows);
  return result;
})();
