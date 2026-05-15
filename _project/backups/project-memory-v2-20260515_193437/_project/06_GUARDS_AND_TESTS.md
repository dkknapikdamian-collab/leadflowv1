# GUARDY I TESTY AUTOMATYCZNE - CloseFlow lead app

## Guardy wymagane po aktualizacji pamięci

| Komenda | Co sprawdza | Kiedy uruchamiać | Ostatni wynik | Czego nie pokrywa |
|---|---|---|---|---|
| `node scripts/check-project-memory.cjs` | obecność `AGENTS.md`, `_project/`, podstawowej treści pamięci | po zmianie pamięci projektu | do uruchomienia | nie sprawdza działania UI |
| `npm run check:project-memory` | wrapper npm dla guardu pamięci | po zmianie pamięci projektu | do uruchomienia | zależy od wpisu w package.json |
| `npm run typecheck` | TypeScript | po zmianach kodu lub package | do uruchomienia | nie zastępuje testów runtime |
| `npm run build` | produkcyjny build | po większych zmianach | do uruchomienia | nie sprawdza wszystkich flow ręcznych |
| `npm run verify:closeflow:quiet` | główny cichy gate projektu | po każdym etapie | do uruchomienia | zależy od zakresu aktualnego skryptu |

## Zasada raportowania

Jeśli guard nie istnieje, nie wpisuj `OK`. Wpisz:

```text
NIEDOSTĘPNY - brak skryptu / brak wpisu npm / brak package.json
```

## Guardy do rozważenia

- guard braku mojibake w UI,
- guard braku starych tekstów `Następny krok` w miejscach, gdzie ma być `Najbliższa akcja`,
- guard confirm-first dla AI,
- guard scope workspace,
- guard billing truth,
- guard PWA/manifest,
- guard route reload.
