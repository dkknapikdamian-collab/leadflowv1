(() => {
  const rows = ['.cf-modal-surface[role="dialog"]','.cf-modal-surface .event-form-vnext','.cf-modal-surface .cf-modal-footer,.cf-modal-surface .event-form-footer']
    .flatMap((selector) => [...document.querySelectorAll(selector)].map((el, index) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        selector,index,tag:el.tagName.toLowerCase(),className:String(el.className||'').slice(0,160),role:el.getAttribute('role'),
        left:Math.round(r.left),top:Math.round(r.top),width:Math.round(r.width),height:Math.round(r.height),
        centerX:Math.round(r.left+r.width/2),centerY:Math.round(r.top+r.height/2),
        viewportCenterX:Math.round(window.innerWidth/2),viewportCenterY:Math.round(window.innerHeight/2),
        dx:Math.round((r.left+r.width/2)-(window.innerWidth/2)),dy:Math.round((r.top+r.height/2)-(window.innerHeight/2)),
        zIndex:cs.zIndex,zoom:cs.zoom,position:cs.position,transform:cs.transform,overflowY:cs.overflowY
      };
    }));
  console.table(rows);
  return {
    href: location.href,
    viewport: {innerWidth: window.innerWidth, innerHeight: window.innerHeight},
    stage161: getComputedStyle(document.documentElement).getPropertyValue('--closeflow-stage161-cf-modal-surface-center-fix').trim(),
    rows
  };
})();
