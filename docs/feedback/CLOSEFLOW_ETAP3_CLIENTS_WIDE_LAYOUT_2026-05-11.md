# CLOSEFLOW ETAP 3 — Clients wide card layout

## Cel

Przywrócić szeroki, czytelny układ karty klienta na `/clients`.

Zgłoszony objaw: karta klienta wyglądała jak zwinięta kolumna, około 962px szerokości przy szerokim viewportcie.

## Zakres zmiany

Dotknięte miejsca:

- `src/pages/Clients.tsx`
- `src/styles/clients-next-action-layout.css`
- `scripts/check-closeflow-etap3-clients-wide-layout.cjs`
- `package.json`

## Co zmienia patch

1. Oznacza listę klientów markerem `data-clients-wide-layout="true"`.
2. Dodaje `w-full max-w-none` do `layout-list` i `table-card` na ekranie klientów.
3. Dodaje `w-full` i marker `data-client-card-wide-layout="true"` do `relative group/client-card`.
4. Dopina scoped CSS tylko pod `.main-clients-html`, żeby:
   - `.layout-list` używał pełnej dostępnej szerokości,
   - `.table-card` używał pełnej dostępnej szerokości,
   - `group/client-card` nie był ograniczony max-width,
   - `.client-row` miał czytelny grid desktopowy,
   - mobile dalej przechodziło do jednej kolumny bez poziomego scrolla.
5. Dodaje guard `check:etap3-clients-wide-layout`.

## Czego patch nie robi

- Nie używa `transform: scale()`.
- Nie ustawia sztywnego `width: 1200px`.
- Nie rusza danych klienta.
- Nie rusza relacji lead/client/case.
- Nie przebudowuje całego design systemu.

## Test ręczny

1. Wejdź na `/clients`.
2. Na szerokim ekranie sprawdź, czy lista i karta klienta zajmują całą dostępną szerokość contentu.
3. Sprawdź, czy sekcje w karcie nie są ściśnięte.
4. Zwęź okno poniżej 900px i sprawdź, czy karta przechodzi do czytelnego układu mobilnego.
5. Na mobile sprawdź brak poziomego scrolla.

## Kryterium zakończenia

Karta klienta nie wygląda jak skurczona kolumna. Wraca do szerokiego, czytelnego układu, a mobile pozostaje stabilne.
