# STAGE142 Repair Shared Work Width Frame Mount — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop width source truth / naprawa mountu frame

## Cel

Naprawić Stage141, bo diagnostyka pokazała, że `data-cf-work-width-frame` nie działa jako frame głównego contentu.

## FAKTY

Damian uruchomił diagnostykę:

```js
{
  left: 12,
  width: 262,
  right: 274,
  maxWidth: '1500px',
  marginLeft: '0px',
  marginRight: '0px'
}
```

To oznacza, że znaleziony `data-cf-work-width-frame` jest w złym kontekście szerokości. Główny content nie może mieć `left: 12` i `width: 262`, bo to odpowiada okolicom sidebara, nie obszarowi roboczemu.

## Audyt blockera

- `Layout.tsx` ma właściwe miejsce naprawy: `div.view.active[data-shell-content]`.
- Stage141 musiał być za słaby albo frame trafił w nieprawidłowy kontekst.
- Potrzebna jest normalizacja: usunąć wszystkie dotychczasowe `cf-work-width-frame` wrappery i wstawić dokładnie jeden bezpośrednio pod `view.active`.

## Decyzja

Stage142:
1. usuwa istniejące wrappery `cf-work-width-frame` wokół `{children}`,
2. wstawia dokładnie jeden wrapper jako bezpośrednie dziecko:
   ```tsx
   <div className="view active" data-shell-content="true" ...>
     <div className="cf-work-width-frame" data-cf-work-width-frame="true" data-stage142-main-work-frame="true">
       {children}
     </div>
   </div>
   ```
3. dodaje CSS, który celuje wyłącznie w `data-stage142-main-work-frame="true"`.

## Testy

```powershell
node scripts/check-stage142-repair-shared-work-width-frame-mount.cjs
npm.cmd run build
```

## Test ręczny

Po uruchomieniu aplikacji na `/` wkleić w konsoli:

```js
(() => {
  const el = document.querySelector('[data-stage142-main-work-frame="true"]');
  if (!el) return 'BRAK data-stage142-main-work-frame';
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

Oczekiwane:
- `parentDataShellContent: "true"`
- `width` dużo większe niż `262`
- `left` w okolicach głównego obszaru po sidebarze, nie `12`

## Czego nie ruszano

- dane
- routing
- Supabase/Auth/Google
- Stripe
- AI
- przyciski
- logika list
- mobile/tablet
- Vercel deploy
- push

## Następny krok

Jeżeli Stage142 frame ma właściwy `parentDataShellContent` i szerokość, dopiero wtedy regulować `--cf142-work-width`, nie strukturę każdej zakładki.
