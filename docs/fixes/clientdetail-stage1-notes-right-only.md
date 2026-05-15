# ClientDetail — ETAP 1: zakładki i notatki po prawej

Data: 2026-05-14
Tryb: lokalna naprawa bez commit/push/deploy

## Cel

Naprawić ekran klienta jako pierwszy obszar P1:

- `Sprawy` przed `Podsumowanie`,
- jedno miejsce notatek klienta,
- zero duplikatu dyktowania po lewej,
- prawy panel jako jedyna powierzchnia notatek operacyjnych klienta,
- notatki z aktywności i payloadów mają być widoczne w jednym helperze,
- widoczny wiersz notatki ma mieć akcje operacyjne.

## Zakres plików

- `src/pages/ClientDetail.tsx`
- `tools/repair-clientdetail-stage1-notes-right-only.cjs`
- `tests/stage-client-detail-notes-right-only.test.cjs`
- `docs/fixes/clientdetail-stage1-notes-right-only.md`

## Poza zakresem

- model leada,
- model sprawy,
- routing,
- pełna skórka klienta,
- CaseDetail,
- globalny visual refactor.

## Test ręczny po wdrożeniu

1. Wejdź w ekran klienta.
2. Sprawdź zakładki: `Sprawy`, `Podsumowanie`, `Historia`.
3. Sprawdź, czy dyktowanie/notatki są tylko po prawej stronie.
4. Dodaj notatkę w prawym panelu.
5. Sprawdź, czy notatka pojawia się na liście po prawej.
6. Sprawdź, czy wiersz notatki ma akcje: przypnij/podgląd/edytuj/usuń, zależnie od aktualnego UI.
7. Odśwież ekran i sprawdź, czy notatka nie zniknęła, jeśli obecny zapis jest trwały.

## Kryterium zakończenia

Klient ma jedno miejsce notatek. Zero duplikatu dyktowania. Guard przechodzi lokalnie. Build przechodzi lokalnie.
