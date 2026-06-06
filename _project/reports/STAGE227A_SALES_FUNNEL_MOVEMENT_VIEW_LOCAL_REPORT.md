# STAGE227A — Sales Funnel Movement View — local report

Data: 2026-06-06 15:35 Europe/Warsaw
Tryb: LOCAL-ONLY
Status: PATCH PREPARED / PENDING LOCAL TEST

## Teza

Stage227A dodaje pierwszy właścicielski lejek ruchu sprzedażowego: read-only, bez drag/drop, bez mutacji, bez klasycznego CRM-kanbana.

## Co wdrożono

1. Nowy widok `/funnel` jako `src/pages/SalesFunnel.tsx`.
2. Nowy helper `src/lib/owner-control/sales-funnel-movement.ts`.
3. Guard `scripts/check-stage227a-sales-funnel-movement-view.cjs`.
4. Runtime test `tests/stage227a-sales-funnel-movement-view.test.cjs`.
5. Route w `src/App.tsx`.
6. Sidebar menu `Lejek` w `src/components/Layout.tsx`.
7. Skrypty `check:stage227a-sales-funnel-movement-view` i `test:stage227a-sales-funnel-movement-view` w `package.json`.
8. Stage227A dopięty do `scripts/closeflow-release-check-quiet.cjs` jako dodatkowa bramka lokalna.

## Granice

- Nie ma drag/drop.
- Nie ma zmiany statusu z lejka.
- Nie ma automatycznego tworzenia zadań.
- Nie ma wysyłki maili.
- Nie ma AI scoringu.
- Nie ma zmian DB/RLS.

## Audyt ryzyk po etapie

1. Ryzyko: widok może liczyć za dużo rekordów, jeśli API zwróci archiwalne sprawy/leady. Mitigacja: fetch aktywnych leadów i spraw bez archive, guard read-only.
2. Ryzyko: ostatni kontakt może być fałszowany przez fallbacki. Mitigacja: helper sanitizuje `updatedAt/createdAt` dla truth records, test sprawdza `updatedAt` jako brak kontaktu.
3. Ryzyko: wartość sprawy może udawać prowizję. Mitigacja: case card bierze `commissionAmount` z `getCaseFinanceSummary`, test blokuje `contractValue` jako prowizję.
4. Ryzyko: lejek może stać się kanbanem CRM. Mitigacja: guard blokuje drag/drop i mutacje.
5. Ryzyko: mobile może mieć szeroki scroll. Mitigacja: poziomy scroll w kontenerze, brak ingerencji w shell/sidebar.
6. Ryzyko: stage może zasłonić błąd R10/R11. Mitigacja: skrypt lokalny uruchamia regresje R10/R11, jeśli pliki istnieją.

## Testy

Status w tym raporcie: PENDING_LOCAL_RUN. Wynik dopisuje lokalny skrypt po uruchomieniu.
