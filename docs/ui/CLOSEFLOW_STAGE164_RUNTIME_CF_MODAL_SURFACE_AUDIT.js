(() => {
  const rows = [...document.querySelectorAll('.cf-modal-surface[role="dialog"], [role="dialog"].cf-modal-surface, .cf-modal-surface .event-form-vnext, .cf-modal-surface .cf-modal-footer, .cf-modal-surface .event-form-footer')]
    .map((el, index) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        index,
        tag: el.tagName.toLowerCase(),
        className: String(el.className || '').slice(0, 160),
        role: el.getAttribute('role'),
        left: Math.round(r.left),
        top: Math.round(r.top),
        width: Math.round(r.width),
        height: Math.round(r.height),
        bottom: Math.round(r.bottom),
        centerX: Math.round(r.left + r.width / 2),
        centerY: Math.round(r.top + r.height / 2),
        viewportCenterX: Math.round(window.innerWidth / 2),
        viewportCenterY: Math.round(window.innerHeight / 2),
        dx: Math.round((r.left + r.width / 2) - (window.innerWidth / 2)),
        topGap: Math.round(r.top),
        bottomGap: Math.round(window.innerHeight - r.bottom),
        zIndex: cs.zIndex,
        zoom: cs.zoom,
        position: cs.position,
        transform: cs.transform,
        overflowY: cs.overflowY,
        background: cs.backgroundColor,
        color: cs.color,
        maxHeight: cs.maxHeight,
        heightCss: cs.height
      };
    });

  console.table(rows);

  return {
    href: location.href,
    viewport: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
    stage164: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage164-cf-modal-top-anchor-light-surface')
      .trim(),
    sourceTruth: {
      width: getComputedStyle(document.documentElement).getPropertyValue('--cf164-modal-visual-width').trim(),
      topOffset: getComputedStyle(document.documentElement).getPropertyValue('--cf164-modal-top-offset').trim(),
      maxHeight: getComputedStyle(document.documentElement).getPropertyValue('--cf164-modal-visual-max-height').trim(),
      bg: getComputedStyle(document.documentElement).getPropertyValue('--cf164-modal-bg').trim()
    },
    rows
  };
})();
