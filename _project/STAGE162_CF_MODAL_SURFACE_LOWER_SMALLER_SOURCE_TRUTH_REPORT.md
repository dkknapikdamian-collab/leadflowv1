# STAGE162 cf-modal-surface Lower Smaller Source Truth — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / modal source truth / lower and smaller

## Cel

Po Stage161 modal jest lepszy, ale nadal:
- powinien być niżej,
- powinien być trochę mniejszy,
- ta sama reguła ma działać dla każdego podokienka.

## FAKTY

- Stage161 został zastosowany lokalnie.
- Stage161 guard przeszedł.
- `npm.cmd run build` przeszedł.
- Użytkownik wizualnie potwierdził: "lepiej ale dalej źle".

## DECYZJE DAMIANA

- Podokienka mają być niżej.
- Podokienka mają być trochę mniejsze.
- Każde okienko ma iść tą samą regułą.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Nie zmieniamy Stage157 ani globalnej skali aplikacji.
- Nie wracamy do ogólnego `zoom` na dialogach.
- Najbezpieczniejsza poprawka to nadpisanie source truth Stage161 przez Stage162:
  width 620px, max-height 76vh, center-y 56vh.

## Pliki

- `src/styles/closeflow-cf-modal-surface-lower-smaller-stage162.css`
- `scripts/apply-stage162-cf-modal-surface-lower-smaller.cjs`
- `scripts/check-stage162-cf-modal-surface-lower-smaller.cjs`
- `docs/ui/CLOSEFLOW_STAGE162_CF_MODAL_SURFACE_LOWER_SMALLER_SOURCE_TRUTH.md`
- `docs/ui/CLOSEFLOW_STAGE162_RUNTIME_CF_MODAL_SURFACE_AUDIT.js`
- `_project/STAGE162_CF_MODAL_SURFACE_LOWER_SMALLER_SOURCE_TRUTH_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage162 cf modal lower smaller source truth.md`

## Testy

```powershell
node scripts/check-stage162-cf-modal-surface-lower-smaller.cjs
npm.cmd run build
```

## Testy ręczne

- `/calendar` → `+ Wydarzenie`
- `/leads` → `+ Lead`
- `/tasks` → `+ Zadanie`

Sprawdzić:
- lower placement,
- smaller modal,
- no left cut,
- footer visible,
- no text covered.

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
