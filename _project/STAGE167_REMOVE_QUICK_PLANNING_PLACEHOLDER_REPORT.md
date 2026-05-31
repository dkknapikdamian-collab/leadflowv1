# STAGE167 Remove Quick Planning Placeholder — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / modal copy cleanup / placeholder removal

## Cel

Usunąć blok widoczny na screenie:

- `Szybkie planowanie`
- opis o osobnym flow,
- komunikat, że etap nie udaje funkcji.

## FAKTY

- Stage166 został zastosowany lokalnie.
- Guard Stage166 przeszedł.
- `npm.cmd run build` przeszedł.
- Problem dotyczy już treści/placeholdera w modalnym formularzu, nie położenia modala.

## DECYZJE DAMIANA

- Kasujemy blok ze screenem.
- Każda poprawka ma mieć guard.
- Lokalnie, bez pusha/deploya.

## HIPOTEZY AI

- Ten blok jest nieprodukcyjnym placeholderem i nie powinien być widoczny dla użytkownika.
- Usunięcie z JSX jest lepsze niż ukrywanie CSS-em, bo nie zostawia martwego UI.

## Pliki

- `scripts/apply-stage167-remove-quick-planning-placeholder.cjs`
- `scripts/check-stage167-remove-quick-planning-placeholder.cjs`
- `docs/ui/CLOSEFLOW_STAGE167_REMOVE_QUICK_PLANNING_PLACEHOLDER.md`
- `_project/STAGE167_REMOVE_QUICK_PLANNING_PLACEHOLDER_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage167 remove quick planning placeholder.md`

## Testy automatyczne

```powershell
node scripts/check-stage167-remove-quick-planning-placeholder.cjs
npm.cmd run build
```

## Testy ręczne

- `/leads` → `+ Lead`
- sprawdzić, czy karta `Szybkie planowanie` zniknęła.
- `/calendar` → `+ Wydarzenie`
- `/tasks` → `+ Zadanie`
- sprawdzić, czy nie ma tej samej karty w innych modalach.

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
