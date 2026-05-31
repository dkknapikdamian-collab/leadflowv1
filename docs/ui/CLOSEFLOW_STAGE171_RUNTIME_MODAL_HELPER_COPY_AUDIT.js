(() => {
  const targets = [
    'Ustaw termin, powiązanie, przypomnienia i cykliczność wydarzenia w kalendarzu.',
    'Od do',
    'Najpierw ustaw start i koniec. Koniec pilnuje się automatycznie przy zmianie startu.',
    'Możesz zostawić brak albo ustawić powtarzanie, np. co miesiąc.',
    'Na końcu ustaw sposób przypominania i jego cykliczność.',
    'Wpisz minimum danych i zapisz kontakt. Szczegóły możesz uzupełnić później.',
    'Najważniejsze pola do szybkiego zapisania kontaktu.',
  ];

  const visibleText = document.body.innerText || '';
  const matches = targets.filter((target) => visibleText.includes(target));
  const hiddenDescriptions = [...document.querySelectorAll('[data-stage171-hidden-copy="true"]')].map((el, index) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      index,
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim(),
      width: Math.round(r.width),
      height: Math.round(r.height),
      position: cs.position,
      clip: cs.clip,
      overflow: cs.overflow,
    };
  });

  console.log('STAGE171_REMOVE_MODAL_HELPER_COPY_AUDIT');
  console.log({ href: location.href, matches, hiddenDescriptions });

  return {
    href: location.href,
    stage171: getComputedStyle(document.documentElement)
      .getPropertyValue('--closeflow-stage171-remove-modal-helper-copy')
      .trim(),
    visibleForbiddenMatches: matches,
    hiddenDescriptions,
  };
})();
