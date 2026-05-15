# ZASADY PRACY - CloseFlow lead app

## Branch i repo

- Pracuj na `dev-rollout-freeze`.
- Nie twórz nowych gałęzi bez decyzji Damiana.
- Nie pushuj do innego brancha.

## Zakres zmian

Przed zmianą określ:
- cel,
- pliki do sprawdzenia,
- co zmieniasz,
- czego nie zmieniasz,
- testy,
- kryterium zakończenia.

## Minimalny zasięg

Dotykaj tylko plików potrzebnych do zadania. Nie naprawiaj przypadkowo połowy aplikacji.

## Nie zmieniaj bez zgody

- UI,
- routingu,
- logiki produktu,
- modeli danych,
- systemu planów,
- nazw i copy,
- działających funkcji.

## Pamięć projektu

Po każdej sensownej pracy aktualizuj:
- `_project/08_CHANGELOG_AI.md`,
- `_project/runs/`,
- `_project/07_NEXT_STEPS.md`,
- inne pliki zależnie od zmiany.

Jeśli zmiana dotyczy decyzji lub kierunku, aktualizuj też Obsidiana.

## Potwierdzenia Damiana

Jeśli Damian potwierdzi, że coś działa, zapisz to w:
- `_project/11_USER_CONFIRMED_TESTS.md`,
- Obsidian `07_POTWIERDZENIA DAMIANA - CloseFlow lead app.md`.

Nie dopisuj potwierdzeń, których Damian nie dał.

## ZIP

Jeśli przygotowujesz paczkę ZIP, ma zawierać:
- zmiany repo,
- aktualizacje `_project/`,
- pliki do Obsidiana,
- raport AI,
- polecenie PowerShell,
- testy/guardy albo informację, że ich brak.

## Testy

Po pracy uruchom dostępne:

```powershell
node scripts/check-project-memory.cjs
npm run check:project-memory
npm run typecheck
npm run build
npm run verify:closeflow:quiet
```

Jeśli nie ma komendy, zapisz brak w raporcie.
