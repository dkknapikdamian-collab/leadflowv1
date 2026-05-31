# STAGE157 Viewport Zoom 80 Source Truth — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / viewport-compensated browser-zoom emulation / source truth

## Cel

Uzyskać wygląd taki jak przy browser zoom 80%, ale przy ustawieniu przeglądarki 100%.

## FAKTY

- Damian porównał dwa screeny: 100% i 80%.
- Docelowy wygląd to screen z 80%.
- Stage156 nie dał tego efektu, bo zmniejszał realne tokeny, ale nie zmieniał logicznego viewportu jak browser zoom.
- Poprzednie próby Stage153/154/155 były złe, bo nie zachowywały poprawnego trzymania lewej/prawej strony.

## DECYZJE DAMIANA

- Chcemy, żeby 100% wyglądało jak obecne 80%.
- Skala ma być jednym źródłem prawdy wizualnym.
- Nie pushować bez akceptacji.
- Każda poprawka ma mieć osobny guard.

## HIPOTEZY AI

- Najbliższe browser zoomowi 80% będzie viewport-compensated page zoom:
  - `zoom: 0.80`
  - szerokość layoutu `100vw * 1.25`
- Błąd Stage153 wynikał z kompensacji przez fixed canvas, a nie przez viewport.

## Zakres Stage157

Dodaje:
- `src/styles/closeflow-viewport-zoom-80-source-truth-stage157.css`
- `scripts/apply-stage157-viewport-zoom-80.cjs`
- `scripts/check-stage157-viewport-zoom-80.cjs`
- `docs/ui/CLOSEFLOW_STAGE157_VIEWPORT_ZOOM_80_SOURCE_TRUTH.md`
- `docs/ui/CLOSEFLOW_STAGE157_RUNTIME_VIEWPORT_ZOOM_AUDIT.js`
- `_project/STAGE157_VIEWPORT_ZOOM_80_SOURCE_TRUTH_REPORT.md`
- aktualizację Obsidiana

Modyfikuje:
- `src/App.tsx`: dodaje import Stage157, usuwa importy odrzuconych Stage153/154/155 jeśli istnieją.
- `src/components/Layout.tsx`: usuwa odrzucony wrapper Stage155 jeśli istnieje.

## Testy

```powershell
node scripts/check-stage157-viewport-zoom-80.cjs
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

Sprawdzić lokalnie `/`, `/leads`, `/clients`, `/cases`, `/tasks`, `/calendar`, `/templates`, `/response-templates`, `/activity`.
Jeśli jest zbyt małe/duże, stroić wyłącznie `--cf157-page-zoom` i `--cf157-page-zoom-inverse`.
