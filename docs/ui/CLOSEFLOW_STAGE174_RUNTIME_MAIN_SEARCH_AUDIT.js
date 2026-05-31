(() => {
  const bars = [...document.querySelectorAll('[data-cf-main-search-source="stage173"], .cf-main-search')].map((el, index) => {
    const r = el.getBoundingClientRect();
    const input = el.querySelector('input, [role="combobox"]');
    const icon = el.querySelector('span[aria-hidden="true"], svg, .search-icon');
    const cs = getComputedStyle(el);
    const inputCs = input ? getComputedStyle(input) : null;

    return {
      index,
      className: el.getAttribute('class') || '',
      left: Math.round(r.left),
      width: Math.round(r.width),
      right: Math.round(r.right),
      bg: cs.backgroundColor,
      border: cs.border,
      boxShadow: cs.boxShadow,
      padding: cs.padding,
      iconDisplay: icon ? getComputedStyle(icon).display : null,
      inputPlaceholder: input?.getAttribute('placeholder') || '',
      inputPaddingLeft: inputCs?.paddingLeft || null,
      inputFontWeight: inputCs?.fontWeight || null,
      inputFontSize: inputCs?.fontSize || null,
      inputBg: inputCs?.backgroundColor || null,
      inputBoxShadow: inputCs?.boxShadow || null,
      inputLeft: input ? Math.round(input.getBoundingClientRect().left) : null,
      inputWidth: input ? Math.round(input.getBoundingClientRect().width) : null,
    };
  });

  console.table(bars);
  return {
    href: location.href,
    stage174: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage174-main-search-surface-and-text-normalization')
      .trim(),
    viewport: {
      innerWidth,
      innerHeight,
      visualWidth: Math.round(window.visualViewport?.width || innerWidth),
      devicePixelRatio,
    },
    bars,
  };
})();
