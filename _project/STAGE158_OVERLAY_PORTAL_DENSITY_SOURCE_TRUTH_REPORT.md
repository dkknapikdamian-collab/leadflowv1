# STAGE158 Overlay Portal Density Source Truth — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / overlay density / dialogs/modals/popovers / portal scaling

## Cel

Dostosować skalę podokienek do Stage157, bo po emulacji browser zoom 80% główna aplikacja jest mniejsza, ale portaled dialogs/modals/popovers zostały za duże.

## FAKTY

- Stage157 działa na `#root > .app`.
- Modal „Nowy lead” wygląda za duży na tle przeskalowanej aplikacji.
- To wskazuje, że modal jest renderowany poza skalowanym app shellem, prawdopodobnie przez portal.
- Takie podokienka muszą mieć własny source truth skali.

## DECYZJE DAMIANA

- Dostosować skalę podokienek.
- Dotyczy to wszystkich innych podokienek, nie tylko „Nowy lead”.
- Każda poprawka ma mieć osobny guard.
- Nie ruszać danych, auth, deploya ani pusha.

## HIPOTEZY AI

- Najbezpieczniejsze jest skalowanie kontentu portali, nie overlay/backdrop.
- Overlay/backdrop powinien zostać pełnoekranowy i nieskalowany.
- Stage158 powinien dziedziczyć zmienne Stage157, żeby skala była jednym logicznym źródłem prawdy.

## Zakres Stage158

Dodaje:
- `src/styles/closeflow-overlay-portal-density-stage158.css`
- `scripts/apply-stage158-overlay-portal-density.cjs`
- `scripts/check-stage158-overlay-portal-density.cjs`
- `docs/ui/CLOSEFLOW_STAGE158_OVERLAY_PORTAL_DENSITY_SOURCE_TRUTH.md`
- `docs/ui/CLOSEFLOW_STAGE158_RUNTIME_OVERLAY_AUDIT.js`
- `_project/STAGE158_OVERLAY_PORTAL_DENSITY_SOURCE_TRUTH_REPORT.md`
- aktualizację Obsidiana

Modyfikuje:
- `src/App.tsx`: dodaje import CSS Stage158 po Stage157.

## Testy

```powershell
node scripts/check-stage158-overlay-portal-density.cjs
npm.cmd run build
```

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

## Następny krok

Sprawdzić:
- Nowy lead,
- Nowy klient,
- Nowa sprawa,
- Nowe zadanie,
- Nowe wydarzenie,
- edycje formularzy,
- dropdowny/selecty/popover,
- PWA prompt,
- Bug recorder.
