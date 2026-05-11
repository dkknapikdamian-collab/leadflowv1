# CloseFlow Stage 13 Settings tabs inplace 2026-05-11

Cel: dodac podzakladki w ustawieniach bez ruszania lewego panelu aplikacji i bez tworzenia zewnetrznego right raila.

Zakres:
- `src/pages/Settings.tsx`
- `src/styles/Settings.css`
- `scripts/check-closeflow-settings-tabs-inplace.cjs`
- `package.json`

Decyzja naprawcza:
- nie tworzymy `SettingsLegacy.tsx`,
- nie uzywamy `settings-vnext-page`,
- nie dodajemy `settings-account-rail`,
- nie uzywamy `right-card settings-account-card`, bo to powodowalo ciemny/pusty panel,
- stary widok ustawien zostaje zachowany wewnatrz zakladki `Konto`,
- nowy uklad jest jednym oknem w obrebie strony `/settings`.

Weryfikacja:
- `npm.cmd run check:settings-tabs-inplace`
- `npm.cmd run build`
