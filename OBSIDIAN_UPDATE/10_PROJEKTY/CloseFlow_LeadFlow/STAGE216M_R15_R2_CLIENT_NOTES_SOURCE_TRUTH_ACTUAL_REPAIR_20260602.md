# CloseFlow / LeadFlow - STAGE216M_R15_R2_CLIENT_NOTES_SOURCE_TRUTH_ACTUAL_REPAIR_20260602

## FAKTY
- R15/R15-R1 nie domknęły realnej naprawy notatek klienta.
- R15-R2 przenosi notatki klienta do jednego źródła prawdy: centralna sekcja `Notatki`.
- Dyktowanie nie powinno już otwierać edycji danych klienta ani zapisywać do `form.notes`.

## DECYZJE DAMIANA
- Notatki klienta mają działać jak realna robocza sekcja.
- Brak tekstowego dodawania notatki to błąd.
- Duplikat notatki w danych klienta należy usunąć.

## ZAKRES
- `src/pages/ClientDetail.tsx`
- `src/styles/stage216m-r15-r2-client-notes-source-truth-actual-repair.css`
- `src/styles/page-adapters/page-adapters.css`
- guard R15-R2

## TESTY
- Guard kontraktowy R15-R2.
- Build produkcyjny.
- Manual: tekstowa i głosowa notatka klienta.

## NASTĘPNY KROK
Po deployu sprawdzić centralną sekcję notatek klienta.
