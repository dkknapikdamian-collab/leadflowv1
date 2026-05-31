# STAGE163 cf-modal Main Center Tall Compact — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / modal source truth / main-area center / tall compact

## Cel

Po Stage162:
- modal jest nadal zbyt lewo,
- powinien być bardziej na środku panelu roboczego,
- powinien być raczej wyższy niż szerszy,
- wydarzenia muszą mieć więcej pionowej przestrzeni, bo się nie mieszczą.

## FAKTY

- Stage161 i Stage162 działają technicznie, build przechodzi.
- Runtime target pozostaje `.cf-modal-surface[role="dialog"]`.
- Problem jest już tuningiem położenia i proporcji modala, nie wykrywaniem klasy.

## DECYZJE DAMIANA

- Bardziej na środek.
- Raczej wyższe niż szersze.
- To samo dla wszystkich modalnych okien.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Modal powinien być centrowany w work-area, nie w całym viewportcie razem z sidebarem.
- Dlatego Stage163 dodaje `--cf163-modal-main-center-shift-x`.
- Event modal wymaga osobnej wysokości `84vh`, ale dalej korzysta z tej samej klasy `.cf-modal-surface`.

## Pliki

- `src/styles/closeflow-cf-modal-main-center-tall-compact-stage163.css`
- `scripts/apply-stage163-cf-modal-main-center-tall-compact.cjs`
- `scripts/check-stage163-cf-modal-main-center-tall-compact.cjs`
- `docs/ui/CLOSEFLOW_STAGE163_CF_MODAL_MAIN_CENTER_TALL_COMPACT.md`
- `docs/ui/CLOSEFLOW_STAGE163_RUNTIME_CF_MODAL_SURFACE_AUDIT.js`
- `_project/STAGE163_CF_MODAL_MAIN_CENTER_TALL_COMPACT_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage163 cf modal main center tall compact.md`

## Testy

```powershell
node scripts/check-stage163-cf-modal-main-center-tall-compact.cjs
npm.cmd run build
```

## Testy ręczne

- `/calendar` → `+ Wydarzenie`
- `/leads` → `+ Lead`
- `/tasks` → `+ Zadanie`

Sprawdzić:
- czy modal jest bardziej na środku panelu roboczego,
- czy jest węższy,
- czy event ma więcej wysokości,
- czy footer nie zasłania treści,
- czy lewa krawędź nie jest ucięta.

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
