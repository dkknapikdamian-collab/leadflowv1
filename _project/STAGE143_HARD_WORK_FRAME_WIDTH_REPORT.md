# STAGE143 Hard Work Frame Width — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop width / hard selector repair

## Cel

Naprawić sytuację, w której frame szerokości istnieje, ale nadal mierzy się jako `left 12 / width 262`.

## FAKTY

- Diagnostyka Damiana pokazała `left: 12`, `width: 262`, `right: 274`.
- To oznacza, że poprzedni CSS nie łapie frame’u jako głównego obszaru roboczego.
- Stage143 dopisuje marker `data-stage143-work-width-frame="true"` i używa krótkiego selektora bezpośredniego.

## TESTY

```powershell
node scripts/check-stage143-hard-work-frame-width.cjs
npm.cmd run build
```

## TEST W KONSOLI

```js
(() => {
  const el = document.querySelector('[data-stage143-work-width-frame="true"]');
  if (!el) return 'BRAK data-stage143-work-width-frame';
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return {
    left: Math.round(r.left),
    width: Math.round(r.width),
    right: Math.round(r.right),
    maxWidth: cs.maxWidth,
    marginLeft: cs.marginLeft,
    marginRight: cs.marginRight,
    parentClass: el.parentElement?.className,
    parentDataShellContent: el.parentElement?.getAttribute('data-shell-content'),
  };
})();
```

Oczekiwane: `width` około 1400+, nie `262`.

## Czego nie ruszano

Dane, routing, Supabase/Auth/Google, Stripe, AI, przyciski, logika list, mobile/tablet, deploy, push.
