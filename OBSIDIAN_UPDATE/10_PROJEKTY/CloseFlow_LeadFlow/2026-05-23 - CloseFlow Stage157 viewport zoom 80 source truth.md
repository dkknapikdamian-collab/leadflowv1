# CloseFlow Stage157 — Viewport Zoom 80 Source Truth

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / viewport-compensated browser-zoom emulation

## FAKTY

- Docelowy wygląd to obecny widok aplikacji przy browser zoom 80%.
- Stage156 nie wystarczył, bo nie emuluje logicznego viewportu browser zoom.
- Stage153/154/155 zostały odrzucone jako błędne kierunki aktywne.
- Poprawne rozwiązanie musi zachować trzymanie lewej/prawej strony.

## DECYZJE DAMIANA

- 100% ma wyglądać jak obecne 80%.
- Skala ma być jednym źródłem prawdy wizualnym.
- Każda poprawka ma mieć osobny guard.
- Bez pusha i bez deploya przed akceptacją.

## HIPOTEZY AI

- Viewport-compensated page zoom jest najbliższy temu, co robi przeglądarka.
- Stage157 powinien być lepszy niż Stage153, bo używa `100vw * inverse`, a nie fixed canvas.

## TESTY

```powershell
node scripts/check-stage157-viewport-zoom-80.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić główne zakładki lokalnie i dopiero potem commit bez pusha.
