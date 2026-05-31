# STAGE164 cf-modal Top Anchor Light Surface — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / modal vertical positioning / light modal surface

## Cel

Po Stage163:
- środek poziomy jest już OK,
- modal trzeba przesunąć w dół / ustawić tak, żeby nie ucinało,
- okno zadania ma czarne tło, co trzeba zunifikować.

## FAKTY

- Runtime target pozostaje `.cf-modal-surface[role="dialog"]`.
- Problem nie jest już w wykrywaniu klasy ani poziomym centrum.
- Problem jest w pionowym ustawieniu i tle okna.

## DECYZJE DAMIANA

- Środek już mamy.
- Teraz okna mają iść w dół, bo dalej są ucięte.
- Okno zadania nie może mieć czarnego tła.
- Poprawka ma działać jako jedno źródło prawdy dla modalnych okien.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- `translate(-50%, -50%)` przy wysokich modalach jest źródłem pionowego ucinania.
- Lepszy kierunek: top-anchored modal z `top offset`, a scroll tylko wewnątrz body.
- Light modal surface ujednolici task/lead/event w stronę Vercel-like UI.

## Pliki

- `src/styles/closeflow-cf-modal-top-anchor-light-surface-stage164.css`
- `scripts/apply-stage164-cf-modal-top-anchor-light-surface.cjs`
- `scripts/check-stage164-cf-modal-top-anchor-light-surface.cjs`
- `docs/ui/CLOSEFLOW_STAGE164_CF_MODAL_TOP_ANCHOR_LIGHT_SURFACE.md`
- `docs/ui/CLOSEFLOW_STAGE164_RUNTIME_CF_MODAL_SURFACE_AUDIT.js`
- `_project/STAGE164_CF_MODAL_TOP_ANCHOR_LIGHT_SURFACE_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage164 cf modal top anchor light surface.md`

## Testy

```powershell
node scripts/check-stage164-cf-modal-top-anchor-light-surface.cjs
npm.cmd run build
```

## Testy ręczne

- `/calendar` → `+ Wydarzenie`
- `/leads` → `+ Lead`
- `/tasks` → `+ Zadanie`

Sprawdzić:
- top nie jest ucięty,
- okno jest niżej,
- event ma bezpieczny scroll wewnętrzny,
- task modal nie jest czarny,
- footer nie zasłania tekstu.

## Czego nie ruszano

- dane
- auth
- Supabase
- Google Calendar
- Stripe
- AI
- routing
- deployment
- push
