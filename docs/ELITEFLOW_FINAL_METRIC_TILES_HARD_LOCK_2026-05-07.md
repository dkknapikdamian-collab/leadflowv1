# EliteFlow / CloseFlow — final metric tiles hard lock — 2026-05-07

## Problem

Pierwsza paczka była za miękka. Build przeszedł, ale wizualnie kafelki na `/leads` nadal były rozbite: zewnętrzne kafle robiły się niebieskie, a w środku pojawiał się drugi biały kafel.

Przyczyna:

- stary `StatShortcutCard` miał widoczną warstwę z klasą `.metric`,
- stare CSS-y typu `visual-stage25-leads-full-jsx-html-rebuild.css`, `stage37-unified-page-head-and-metrics.css`, `stage38-metrics-and-relations-polish.css` nadal celowały w `.metric`, `.grid-5`, `.grid-4`,
- poprzedni lock nie był ładowany jako ostatnia warstwa w `src/index.css`.

## Fix

- Usunięcie klasy `.metric` z widocznej warstwy `StatShortcutCard`.
- Usunięcie klasy `active` z widocznej warstwy kafelka, zostaje tylko bezpieczne `is-active`.
- Dodanie finalnego CSS hard lock:
  `src/styles/eliteflow-final-metric-tiles-hard-lock.css`
- Import finalnego CSS jako ostatnia linia w:
  `src/index.css`
- Dodanie guarda:
  `scripts/check-eliteflow-final-metric-tiles.cjs`

## Weryfikacja

```powershell
node scripts/check-eliteflow-final-metric-tiles.cjs
npm run build
```

## Ręczny smoke test

Sprawdź kafelki metryk na:

- `/today`
- `/leads`
- `/clients`
- `/cases`
- `/tasks`
- `/templates`
- `/response-templates`
- `/ai-drafts`
- `/activity`

Kafelki nie mogą być niebieskimi blokami. Mają być białe, w rytmie górnych kafelków `Dziś`.
