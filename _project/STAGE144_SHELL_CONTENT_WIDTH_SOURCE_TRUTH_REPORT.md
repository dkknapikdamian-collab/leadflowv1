# STAGE144 Shell Content Width Source Truth — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop width / shell content parent

## Cel

Naprawić problem, w którym frame `data-cf-work-width-frame` nadal mierzy `width=262`, mimo że jego parent ma `data-shell-content=true`.

## FAKTY

- Diagnostyka Damiana pokazała:
  - `left: 12`
  - `width: 262`
  - `parentClass: view active`
  - `parentDataShellContent: true`
- To oznacza, że problemem nie jest już brak parenta, tylko to, że źródło prawdy szerokości musi być na parentcie: `.view.active[data-shell-content="true"]`.
- `Layout.tsx` renderuje wszystkie zakładki wewnątrz `data-shell-content`.

## DECYZJA

Stage144 przenosi ownership szerokości na:

```css
.view.active[data-shell-content="true"],
[data-shell-content="true"]
```

Frame:

```css
[data-shell-content="true"] > [data-cf-work-width-frame="true"]
```

ma tylko wypełniać rodzica.

## Testy

```powershell
node scripts/check-stage144-shell-content-width-source-truth.cjs
npm.cmd run build
```

## Test konsoli

```js
(() => {
  const shell = document.querySelector('[data-shell-content="true"]');
  const frame = document.querySelector('[data-cf-work-width-frame="true"]');
  return [shell, frame].map((el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      node: el.getAttribute('data-shell-content') ? 'shell-content' : 'work-frame',
      left: Math.round(r.left),
      width: Math.round(r.width),
      right: Math.round(r.right),
      maxWidth: cs.maxWidth,
      marginLeft: cs.marginLeft,
      marginRight: cs.marginRight,
    };
  });
})();
```

Oczekiwane:
- shell-content width około 1400+
- work-frame width około 1400+
- nie `262`

## Czego nie ruszano

Dane, routing, Supabase/Auth/Google, Stripe, AI, przyciski, logika list, mobile/tablet, deploy, push.
