(() => {
  const bars = [...document.querySelectorAll('[data-cf-main-search-source="stage173"], .cf-main-search')].map((el, index) => {
    const r = el.getBoundingClientRect();
    const input = el.querySelector('input, [role="combobox"]');
    const icon = el.querySelector('span[aria-hidden="true"], svg');
    const cs = getComputedStyle(el);
    const inputCs = input ? getComputedStyle(input) : null;

    return {
      index,
      className: el.getAttribute('class') || '',
      left: Math.round(r.left),
      width: Math.round(r.width),
      right: Math.round(r.right),
      maxWidth: cs.maxWidth,
      iconDisplay: icon ? getComputedStyle(icon).display : null,
      inputPaddingLeft: inputCs?.paddingLeft || null,
      inputValue: input?.value || '',
      inputPlaceholder: input?.getAttribute('placeholder') || '',
      inputLeft: input ? Math.round(input.getBoundingClientRect().left) : null,
      inputWidth: input ? Math.round(input.getBoundingClientRect().width) : null,
    };
  });

  console.table(bars);
  return {
    href: location.href,
    stage173: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage173-main-search-source-truth')
      .trim(),
    viewport: {
      innerWidth: innerWidth,
      innerHeight: innerHeight,
      visualWidth: Math.round(window.visualViewport?.width || innerWidth),
      devicePixelRatio,
    },
    bars,
  };
})();
