(() => {
  const nodes = [...document.querySelectorAll('[data-closeflow-modal-visual-system="true"].cf-modal-surface, .cf-modal-surface[data-closeflow-modal-visual-system="true"]')];
  const rows = nodes.map((el, index) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const header = el.querySelector('.cf-modal-header');
    const footer = el.querySelector('.cf-modal-footer, .event-form-footer, footer');
    const form = el.querySelector('form, .event-form-vnext');
    const pack = (node) => {
      if (!node) return null;
      const rr = node.getBoundingClientRect();
      const ss = getComputedStyle(node);
      return {
        top: Math.round(rr.top),
        height: Math.round(rr.height),
        bottom: Math.round(rr.bottom),
        background: ss.backgroundColor,
        color: ss.color,
        overflowY: ss.overflowY
      };
    };
    return {
      index,
      tag: el.tagName.toLowerCase(),
      className: String(el.className || '').slice(0, 180),
      role: el.getAttribute('role'),
      left: Math.round(r.left),
      top: Math.round(r.top),
      width: Math.round(r.width),
      height: Math.round(r.height),
      right: Math.round(r.right),
      bottom: Math.round(r.bottom),
      centerX: Math.round(r.left + r.width / 2),
      viewportCenterX: Math.round(window.innerWidth / 2),
      dx: Math.round((r.left + r.width / 2) - (window.innerWidth / 2)),
      topGap: Math.round(r.top),
      bottomGap: Math.round(window.innerHeight - r.bottom),
      zIndex: cs.zIndex,
      position: cs.position,
      transform: cs.transform,
      background: cs.backgroundColor,
      color: cs.color,
      overflowY: cs.overflowY,
      maxHeight: cs.maxHeight,
      header: pack(header),
      form: pack(form),
      footer: pack(footer),
      text: (el.innerText || '').replace(/\s+/g, ' ').slice(0, 180)
    };
  });

  console.table(rows);

  return {
    href: location.href,
    viewport: { innerWidth: window.innerWidth, innerHeight: window.innerHeight },
    stage165: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage165-modal-unified-event-motif-source-truth')
      .trim(),
    sourceTruth: {
      width: getComputedStyle(document.documentElement).getPropertyValue('--cf165-modal-visual-width').trim(),
      topOffset: getComputedStyle(document.documentElement).getPropertyValue('--cf165-modal-top-offset').trim(),
      shiftX: getComputedStyle(document.documentElement).getPropertyValue('--cf165-modal-work-center-shift-x').trim(),
      bg: getComputedStyle(document.documentElement).getPropertyValue('--cf165-modal-bg').trim()
    },
    rows
  };
})();
