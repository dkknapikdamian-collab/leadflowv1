# CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_SYNTAX_FIX_2026-05-11

## Cel
Naprawić składnię guarda `scripts/check-closeflow-case-detail-no-partial-loading.cjs` po nieudanym patchu, który rozbił string z `\n  return (` na realną nową linię w literału JS.

## Zakres
- Nadpisuje check poprawną wersją składniową.
- Nie przywraca starego markera `CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_GUARD_2026_05_11`.
- Akceptuje bezpieczny inline loader oraz `CaseDetailLoadingState`.
- Pilnuje, że `if (loading)` nie pojawia się po głównym JSX return, bo to powodowało runtime crash `loading is not defined`.

## Nie zmienia
- Logiki finansów.
- Renderu paneli sprawy po załadowaniu.
- Kontraktu `verify:closeflow:quiet` w package.json.
