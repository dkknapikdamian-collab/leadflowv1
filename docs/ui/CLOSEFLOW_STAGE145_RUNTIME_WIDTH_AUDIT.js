/* CLOSEFLOW_STAGE145_RUNTIME_WIDTH_AUDIT
   Wklej wynik w czat, jeśli po Stage145 dalej coś nie gra.
*/
(() => {
  const selectors = [
    ['app', '#root > .app.closeflow-visual-stage01.cf-html-shell'],
    ['sidebar', '[data-shell-sidebar="true"]'],
    ['main', '[data-shell-main="true"]'],
    ['shellContent', '[data-shell-content="true"]'],
    ['todayRoot', '[data-p0-today-stable-rebuild="true"]'],
    ['clientsRoot', '.main-clients-html'],
    ['leadsRoot', '.main-leads-html'],
    ['casesRoot', '.main-cases-html'],
    ['tasksRoot', '[data-p0-tasks-stable-rebuild="true"]'],
    ['templatesRoot', '.main-templates-html'],
    ['responseTemplatesRoot', '[data-a13-template-style="response-templates-v2"]'],
    ['activityShell', '.activity-vnext-shell'],
  ];

  const brief = ([name, selector]) => {
    const all = [...document.querySelectorAll(selector)];
    return all.map((el, index) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        name,
        selector,
        index,
        className: String(el.className || ''),
        left: Math.round(r.left),
        width: Math.round(r.width),
        right: Math.round(r.right),
        height: Math.round(r.height),
        display: cs.display,
        gridTemplateColumns: cs.gridTemplateColumns,
        widthStyle: cs.width,
        maxWidth: cs.maxWidth,
        marginLeft: cs.marginLeft,
        marginRight: cs.marginRight,
        paddingLeft: cs.paddingLeft,
        paddingRight: cs.paddingRight,
        overflow: cs.overflow,
      };
    });
  };

  const result = selectors.flatMap(brief);
  console.table(result);
  return result;
})();
