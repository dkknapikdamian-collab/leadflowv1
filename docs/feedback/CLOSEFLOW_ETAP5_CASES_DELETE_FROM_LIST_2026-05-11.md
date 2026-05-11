# CLOSEFLOW_ETAP5_CASES_DELETE_FROM_LIST — 2026-05-11

## Cel

Na widoku `/cases` z wiersza sprawy ma dać się bezpiecznie usunąć sprawę.

## Co ustalono z kodu

W repo istnieje już bezpieczniejszy wariant delete:

- `src/lib/cases.ts` ma `deleteCaseWithRelations(caseId)`.
- `src/lib/supabase-fallback.ts` ma most do `DELETE /api/cases?id=...`.
- `api/cases.ts` obsługuje `DELETE`, scope'uje sprawę przez workspace i archiwizuje sprawę statusem `archived`.
- API czyści tylko `clients.primary_case_id`, nie kasuje klienta ani leada.

## Zmiana UI

W `src/pages/Cases.tsx` akcja usunięcia z listy jest jawna:

- przycisk ma tekst `Usuń`,
- jest spokojnym danger action,
- nie odpala się po kliknięciu całej karty,
- używa `event.preventDefault()` oraz `event.stopPropagation()`,
- otwiera istniejący confirm dialog przez `setCaseToDelete(record)`.

## Zmiana działania po usunięciu

Po potwierdzeniu usunięcia:

- wywołuje `deleteCaseWithRelations(caseId)`,
- robi `await refreshCases()`, bez `window.location.reload()`,
- pokazuje sukces `Sprawa została usunięta.`,
- przy błędzie relacji pokazuje `Nie można usunąć sprawy, bo ma powiązane działania.`,
- przy innym błędzie pokazuje `Nie udało się usunąć sprawy.`.

## Poprawka finalna

Pierwsza paczka naruszyła JSX, bo regex zamienił tylko otwarcie `EntityTrashButton`, zostawiając fragment starego renderu. Finalizer wymienia cały blok `case-row-title-line`, usuwa pozostałości `EntityTrashButton` i dopiero potem odpala guard oraz build.

## Nie zmieniono

- nie dodano usuwania klienta,
- nie dodano usuwania leada,
- nie dodano cascade delete,
- nie zmieniono relacji lead/client/case,
- nie zmieniono tworzenia spraw.

## Test ręczny

1. Wejdź na `/cases`.
2. Kliknij `Usuń` przy sprawie.
3. Anuluj confirm: sprawa zostaje.
4. Kliknij ponownie i potwierdź.
5. Sprawa znika z listy.
6. Odśwież stronę: sprawa nie wraca.
7. Klient nadal istnieje.
8. Lead źródłowy, jeśli istnieje, nadal istnieje.
