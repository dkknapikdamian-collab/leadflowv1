(() => {
  const dialog = document.querySelector('[data-task-create-dialog-stage170="true"].cf-modal-surface, .cf-modal-surface[data-task-create-dialog-stage170="true"]');
  const controls = dialog ? [...dialog.querySelectorAll('input, select, textarea')].map((el, index) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      index,
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type') || '',
      value: el.value || '',
      placeholder: el.getAttribute('placeholder') || '',
      left: Math.round(r.left),
      top: Math.round(r.top),
      width: Math.round(r.width),
      height: Math.round(r.height),
      background: cs.backgroundColor,
      color: cs.color,
      webkitTextFillColor: cs.webkitTextFillColor,
      opacity: cs.opacity,
      disabled: el.disabled,
    };
  }) : [];

  const relationPicker = dialog?.querySelector('[data-task-create-dialog-relation-picker="true"]');
  const dr = dialog?.getBoundingClientRect();

  console.table(controls);
  return {
    href: location.href,
    stage170: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage170-task-dialog-relation-and-field-readability')
      .trim(),
    dialog: dialog ? {
      top: Math.round(dr.top),
      height: Math.round(dr.height),
      bottom: Math.round(dr.bottom),
      text: (dialog.innerText || '').replace(/\s+/g, ' ').slice(0, 220),
    } : null,
    relationPickerFound: Boolean(relationPicker),
    controls,
  };
})();
