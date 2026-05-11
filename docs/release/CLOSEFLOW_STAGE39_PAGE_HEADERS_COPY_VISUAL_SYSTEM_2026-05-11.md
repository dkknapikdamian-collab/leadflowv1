# CLOSEFLOW_STAGE39_PAGE_HEADERS_COPY_VISUAL_SYSTEM_2026-05-11

## Cel

Wdrożyć spokojny, globalny standard nagłówków stron CloseFlow bez przebudowy logiki stron.

Ten etap jest celowo mały: dotyka tylko warstwy CSS dla istniejących klas:

- `.cf-html-view .page-head`
- `.cf-html-view .page-head h1`
- `.cf-html-view .head-actions`

## Decyzja produktowa

CloseFlow nie ma wyglądać jak landing page. Nagłówek ma porządkować ekran i pomagać użytkownikowi szybko wejść w pracę.

Dlatego etap:
- nie dodaje dużych hero sekcji,
- nie zmienia danych,
- nie zmienia działania formularzy,
- nie zmienia metric tiles,
- nie rusza logiki leadów, klientów, spraw, zadań ani kalendarza.

## Pliki

Dodane / zmienione:

- `src/styles/stage39-page-headers-copy-visual-system.css`
- `src/styles/page-adapters/page-adapters.css`
- `scripts/check-stage39-page-headers-copy-visual-system.cjs`
- `package.json`
- `docs/release/CLOSEFLOW_STAGE39_PAGE_HEADERS_COPY_VISUAL_SYSTEM_2026-05-11.md`

## Check

```powershell
npm run check:stage39-page-headers-copy-visual-system
```

Oczekiwany wynik:

```text
CLOSEFLOW_STAGE39_PAGE_HEADERS_COPY_VISUAL_SYSTEM_OK
```

## Kryterium zakończenia

Etap jest zakończony, gdy:

1. CSS jest zaimportowany przez `src/styles/page-adapters/page-adapters.css`.
2. Check stage39 przechodzi.
3. Nagłówki stron są wizualnie spokojniejsze i spójniejsze.
4. Nie ma zmian w logice biznesowej aplikacji.
