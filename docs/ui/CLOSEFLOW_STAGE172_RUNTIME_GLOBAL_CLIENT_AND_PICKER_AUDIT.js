(() => {
  const globalClientButton = document.querySelector('[data-global-client-direct-modal-trigger="true"]');
  const pickerInputs = [...document.querySelectorAll('[data-topic-contact-picker-input="true"], .cf-topic-contact-picker-input')].map((el, index) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const parent = el.closest('[data-topic-contact-picker="true"], .space-y-2');
    return {
      index,
      value: el.value || '',
      placeholder: el.getAttribute('placeholder') || '',
      left: Math.round(r.left),
      top: Math.round(r.top),
      width: Math.round(r.width),
      paddingLeft: cs.paddingLeft,
      color: cs.color,
      background: cs.backgroundColor,
      hasSearchIconNearby: Boolean(parent?.querySelector('svg[class*="search"], [data-search-icon]')),
    };
  });

  const clientDialog = document.querySelector('[data-client-create-dialog-stage172="true"]');
  const clientDialogRect = clientDialog?.getBoundingClientRect();

  return {
    href: location.href,
    stage172: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage172-global-client-button-picker-icon-cleanup')
      .trim(),
    globalClientButton: globalClientButton ? {
      text: (globalClientButton.textContent || '').replace(/\s+/g, ' ').trim(),
      className: globalClientButton.getAttribute('class'),
    } : null,
    pickerInputs,
    clientDialog: clientDialog ? {
      width: Math.round(clientDialogRect.width),
      height: Math.round(clientDialogRect.height),
      text: (clientDialog.textContent || '').replace(/\s+/g, ' ').slice(0, 220),
      hasCaseOption: Boolean(clientDialog.querySelector('[data-client-create-case-option-stage172="true"]')),
    } : null,
  };
})();
