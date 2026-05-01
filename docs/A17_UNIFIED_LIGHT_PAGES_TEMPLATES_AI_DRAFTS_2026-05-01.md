# A17 — Jednolity jasny styl: Szablony + Szkice AI

## Cel

Domknąć niespójność wizualną po A16. Zakładka `Szablony` nadal była ciemna, mimo że JSX miał klasy `bg-white`, bo globalne reguły `html[data-skin]` nadpisywały Tailwindowe klasy na tokeny aktywnej skórki.

## Przyczyna

W `src/index.css` istnieją reguły typu:

```css
html[data-skin] .bg-white { background-color: var(--app-surface-strong) !important; }
html[data-skin] .text-slate-900 { color: var(--app-text) !important; }
```

Przy ciemnej skórce `bg-white` nie było realnie białe. Dlatego sama zamiana klas w `Templates.tsx` nie wystarczyła.

## Zmienione pliki

- `src/styles/stage36-unified-light-pages.css`
- `src/index.css`
- `scripts/check-a13-critical-regressions.cjs`

## Zakres

- `Szablony` dostają wymuszony jasny styl niezależnie od aktywnej skórki.
- Header `Szablony` przestaje być ciemnym kaflem i wygląda jak reszta dobrych zakładek.
- Statystyki są jasnymi kartami.
- Pasek wyszukiwania jest ciemny, tak jak w dobrych widokach typu `Klienci` / `Leady`.
- Empty state i lista szablonów są jasne.
- `Szkice AI` dostają spójny jasny shell, jasne karty i ciemny pasek filtrów/wyszukiwania.
- Nie zmieniono logiki Supabase, zapisu, odczytu ani routingu.

## Testy

Po wdrożeniu:

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run test:critical
npm.cmd run build
```

## Kryterium zakończenia

`Szablony` i `Szkice AI` nie wyglądają już jak osobne ciemne moduły. Mają pasować do jasnego stylu głównych zakładek.
