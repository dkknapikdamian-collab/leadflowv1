# CHANGELOG AI - CloseFlow lead app

## 2026-05-15 19:40 Europe/Warsaw - Pełny mózg projektu v2

### Typ zmiany
Dokumentacja, pamięć projektu, Obsidian, guard pamięci.

### Co dodano / uzupełniono
- `AGENTS.md`,
- folder `_project/`,
- raporty i historia,
- guard `scripts/check-project-memory.cjs`,
- pliki Obsidiana z nazwą projektu,
- zasady aktualizowania pamięci po każdym etapie.

### Czego nie zmieniano
- UI,
- routing,
- logika produktu,
- API,
- style,
- modele danych.

### Ryzyka zapisane
- konflikt trial 7 vs 21 dni,
- legacy `next step` vs `Najbliższa zaplanowana akcja`,
- niepotwierdzone elementy release readiness,
- konieczność testów guardów w realnym repo.

## 2026-05-15 - fix2 guard token

- Poprawiono `_project/01_PROJECT_GOAL.md`, aby spełniał istniejący guard `scripts/check-project-memory.cjs`.
- Dodano jawny token `klient` przy definicji modelu domenowego, bez zmiany kierunku produktu.

