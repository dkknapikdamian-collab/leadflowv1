# STAGE145 Route Root Width Normalization — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / desktop width / route-root source truth

## Cel

Zakończyć serię CSS wrapper-fixów i przenieść naprawę tam, gdzie pokazuje audyt:
- rooty zakładek,
- shell grid,
- realny `data-shell-content`.

## FAKTY

- Bug recorder wskazał root zakładki `Dziś`:
  `main.mx-auto.flex.w-full.max-w-7xl...`
- Zaznaczony root miał rect:
  `left: 289`, `width: 1243`, `right: 1532`, viewport `1920`.
- To oznacza, że widoczny content dalej zachowywał się jak wyspa, nie jak pełny route slot.
- PowerShell scan potwierdził twarde blockery:
  - `TodayStable.tsx`: `mx-auto flex w-full max-w-7xl`
  - `TasksStable.tsx`: `mx-auto flex w-full max-w-5xl`
  - `ResponseTemplates.tsx`: `mx-auto ... max-w-7xl`
  - `Templates.tsx`: `mx-auto ... max-w-7xl`
  - `PageShell.tsx`: `mx-auto` + `max-w-*` warianty
- Console na `/clients` pokazała `shellContent/workFrame/clientsRoot width=262`, więc poprzednie frame-fixy nie są stabilnym źródłem prawdy.

## DECYZJA

Stage145:
1. usuwa eksperymentalny `cf-work-width-frame` wrapper z `Layout.tsx`,
2. oznacza realny route slot:
   `data-cf-shell-content-stage145="true"`,
3. usuwa `mx-auto/max-w-*` z rootów wybranych zakładek,
4. poprawia `PageShell.tsx`, żeby nie tworzył osobnej szerokości,
5. dodaje finalny CSS:
   `src/styles/closeflow-route-root-width-normalization-stage145.css`.

## Testy automatyczne

```powershell
node scripts/check-stage145-route-root-width-normalization.cjs
npm.cmd run build
```

## Test runtime

W Chrome Console wkleić zawartość:

```text
docs/ui/CLOSEFLOW_STAGE145_RUNTIME_WIDTH_AUDIT.js
```

Oczekiwane:
- `app` ma grid `240px minmax(0, 1fr)`,
- `main` ma szerokość obszaru po sidebarze,
- `shellContent` ma około 1480 px na desktopie 1920,
- aktywny route root ma tę samą szerokość co shellContent,
- brak `workFrame`, bo Stage145 usuwa wrapper.

## Czego nie ruszano

- dane
- auth
- Supabase
- Google Calendar
- Stripe
- AI
- routing
- mobile/tablet
- deployment
- push

## Następny krok

Sprawdzić `/clients`, `/`, `/leads`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
Jeżeli szerokość dalej nie gra, użyć runtime audytu i poprawiać konkretny aktywny root, nie dokładać następnego globalnego wrappera.
