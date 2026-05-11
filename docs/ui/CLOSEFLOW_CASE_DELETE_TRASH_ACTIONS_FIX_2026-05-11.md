# CLOSEFLOW CASE DELETE TRASH ACTIONS FIX 2026-05-11

Zakres:
- lista `/cases`: czerwony kosz przy każdej sprawie,
- potwierdzenie `Tak, usuń` / `Nie`,
- widok sprawy: ten sam mechanizm potwierdzenia zamiast starego komunikatu o potwierdzeniu widoku,
- `EntityTrashButton` jako jedno źródło prawdy dla ikon kosza,
- wspólne CSS tokeny: `--cf-trash-icon-color`, `.cf-trash-action-button`, `.cf-trash-action-icon`.

Nie zmieniać:
- modelu danych spraw,
- logiki `deleteCaseWithRelations`,
- filtrów i metryk listy spraw.
