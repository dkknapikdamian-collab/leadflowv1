(() => {
  const nodes = [...document.querySelectorAll('[data-closeflow-modal-visual-system="true"].cf-modal-surface, .cf-modal-surface[data-closeflow-modal-visual-system="true"]')];
  const rows = nodes.map((el, index) => {
    const form = el.querySelector('form, .event-form-vnext');
    const footer = el.querySelector('.cf-modal-footer, .event-form-footer, .dialog-footer, .modal-footer, footer, form > div:has(button[type="submit"]), form > section:has(button[type="submit"])');
    const pack = (node) => {
      if (!node) return null;
      const rr = node.getBoundingClientRect();
      const ss = getComputedStyle(node);
      return {
        className: String(node.className || '').slice(0, 120),
        top: Math.round(rr.top),
        height: Math.round(rr.height),
        bottom: Math.round(rr.bottom),
        position: ss.position,
        bottomCss: ss.bottom,
        zIndex: ss.zIndex,
        background: ss.backgroundColor,
        order: ss.order,
        text: (node.innerText || '').replace(/\s+/g, ' ').slice(0, 120)
      };
    };
    return {
      index,
      href: location.href,
      stage166: getComputedStyle(document.documentElement).getPropertyValue('--closeflow-stage166-modal-footer-in-flow-no-overlay').trim(),
      form: pack(form),
      footer: pack(footer),
      footerOverlayRisk: footer ? ['sticky', 'fixed'].includes(getComputedStyle(footer).position) : null
    };
  });
  console.table(rows);
  return { href: location.href, rows };
})();
