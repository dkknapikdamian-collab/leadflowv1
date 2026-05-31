(() => {
  const selectors = [
    'html',
    'body',
    '#root',
    '.app',
    '.cf-html-shell',
    'main.main',
    '[data-shell-main="true"]',
    '.view.active',
    '[data-shell-content="true"]',
    '.cf-route-work-root',
    '.cf-html-view',
    '.main-leads-html',
    '.main-clients-html',
    '.main-cases-html',
    '.main-calendar-html',
    '.tasks-operator-metric-grid',
    '.tasks-stage178-grouped-list',
    '.activity-stats-grid',
    '.calendar-week-layout',
    '.calendar-week-plan',
    '.layout-list',
    '[class*="vnext-page"]',
    '[class*="vnext-shell"]',
    '[class*="stats-grid"]',
    '[class*="toolbar"]',
    '[class*="card"]',
    '[class*="right-card"]',
    '.nav-btn.active',
    '.nav-btn.active .nav-ico'
  ];

  const read = (el) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      selector: el.tagName.toLowerCase() +
        (el.id ? '#' + el.id : '') +
        (typeof el.className === 'string' && el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : ''),
      text: (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120),
      rect: {
        x: Math.round(r.x),
        y: Math.round(r.y),
        width: Math.round(r.width),
        height: Math.round(r.height)
      },
      backgroundColor: s.backgroundColor,
      backgroundImage: s.backgroundImage,
      color: s.color,
      borderColor: s.borderColor,
      boxShadow: s.boxShadow
    };
  };

  const result = {
    route: location.pathname,
    viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    titleText: document.body.innerText.slice(0, 2000),
    mojibakeVisible: /Å|Ä|Ĺ|Â|Ã|�|Ð|¤|œ|¼|º|³/.test(document.body.innerText),
    selectors: selectors.map((selector) => ({
      selector,
      matches: [...document.querySelectorAll(selector)].slice(0, 12).map(read)
    })),
    points: {
      nearSidebar: document.elementsFromPoint(205, 100).map(read),
      pageLeft: document.elementsFromPoint(220, 100).map(read),
      topTiles: document.elementsFromPoint(260, 110).map(read),
      betweenCards: document.elementsFromPoint(260, 170).map(read),
      center: document.elementsFromPoint(Math.round(innerWidth / 2), Math.round(innerHeight / 2)).map(read)
    }
  };

  copy(JSON.stringify(result, null, 2));
  console.log(result);
  return 'SKOPIOWANO_RUNTIME_MAPE_AKTUALNEJ_ZAKLADKI';
})();
