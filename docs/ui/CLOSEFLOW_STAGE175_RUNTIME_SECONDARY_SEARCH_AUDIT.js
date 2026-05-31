(() => {
  const bars = [...document.querySelectorAll('[data-cf-main-search-stage175="true"]')].map((el, index) => {
    const r = el.getBoundingClientRect();
    const input = el.querySelector('input, [role="combobox"]');
    const icon = el.querySelector('svg, span[aria-hidden="true"]');
    const cs = getComputedStyle(el);
    const inputCs = input ? getComputedStyle(input) : null;

    return {
      index,
      tag: el.tagName.toLowerCase(),
      className: el.getAttribute('class') || '',
      source: el.getAttribute('data-cf-main-search-source'),
      left: Math.round(r.left),
      width: Math.round(r.width),
      right: Math.round(r.right),
      wrapperBg: cs.backgroundColor,
      wrapperBorder: cs.border,
      wrapperShadow: cs.boxShadow,
      iconDisplay: icon ? getComputedStyle(icon).display : null,
      placeholder: input?.getAttribute('placeholder') || '',
      inputPaddingLeft: inputCs?.paddingLeft || null,
      inputFontWeight: inputCs?.fontWeight || null,
      inputFontSize: inputCs?.fontSize || null,
      inputBg: inputCs?.backgroundColor || null,
      inputShadow: inputCs?.boxShadow || null,
    };
  });

  console.table(bars);
  return {
    href: location.href,
    stage175: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage175-extend-main-search-source-truth-secondary-pages')
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
