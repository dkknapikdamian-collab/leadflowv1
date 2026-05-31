# CloseFlow Stage171 — Remove Modal Helper Copy

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Obsidian folder: `10_PROJEKTY/CloseFlow_LeadFlow`

## Decision

Remove listed helper texts from modal panels everywhere in `src`.

Removed visible copy:
- `Ustaw termin, powiązanie, przypomnienia i cykliczność wydarzenia w kalendarzu.`
- `Od do`
- `Najpierw ustaw start i koniec. Koniec pilnuje się automatycznie przy zmianie startu.`
- `Możesz zostawić brak albo ustawić powtarzanie, np. co miesiąc.`
- `Na końcu ustaw sposób przypominania i jego cykliczność.`
- `Wpisz minimum danych i zapisz kontakt. Szczegóły możesz uzupełnić później.`
- `Najważniejsze pola do szybkiego zapisania kontaktu.`

## Important implementation rule

`DialogDescription` is not simply deleted, because Radix dialogs can warn when there is no description.
Stage171 preserves it as screen-reader-only with `data-stage171-hidden-copy="true"` and neutral text.

## Guard

`node scripts/check-stage171-remove-modal-helper-copy.cjs`
