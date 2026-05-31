(() => {
  const pickers = [...document.querySelectorAll('[data-topic-contact-picker="true"]')].map((el, index) => {
    const input = el.querySelector('[data-topic-contact-picker-input="true"]');
    const dropdown = el.querySelector('[data-topic-contact-picker-dropdown="true"]');
    const options = [...el.querySelectorAll('[data-topic-contact-picker-option="true"]')].slice(0, 8);
    const pack = (node) => {
      if (!node) return null;
      const r = node.getBoundingClientRect();
      const cs = getComputedStyle(node);
      return {
        tag: node.tagName.toLowerCase(),
        className: String(node.className || '').slice(0, 160),
        left: Math.round(r.left),
        top: Math.round(r.top),
        width: Math.round(r.width),
        height: Math.round(r.height),
        background: cs.backgroundColor,
        color: cs.color,
        webkitTextFillColor: cs.webkitTextFillColor,
        zIndex: cs.zIndex,
        text: (node.innerText || node.getAttribute('placeholder') || '').replace(/\s+/g, ' ').slice(0, 140),
      };
    };
    return {
      index,
      input: pack(input),
      dropdown: pack(dropdown),
      options: options.map(pack),
    };
  });

  console.log('STAGE169_TOPIC_CONTACT_PICKER_AUDIT');
  console.log({
    href: location.href,
    stage169: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage169-topic-contact-picker-readable-and-task-guard')
      .trim(),
    pickerCount: pickers.length,
  });
  console.table(pickers.map((p) => ({
    index: p.index,
    inputBg: p.input?.background,
    inputColor: p.input?.color,
    dropdownBg: p.dropdown?.background,
    dropdownColor: p.dropdown?.color,
    option0Bg: p.options?.[0]?.background,
    option0Color: p.options?.[0]?.color,
    option0Text: p.options?.[0]?.text,
  })));
  return pickers;
})();
