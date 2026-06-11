# UI Dictionary — STAGE231D0A / STAGE231D0B

Status: ACTIVE
Last updated: 2026-06-10 Europe/Warsaw

## ClientListCard

Nazwa ludzka:
Kafelek klienta na liście klientów

Nazwa systemowa:
ClientListCard

Wariant:
client-relationship-row-2line

Rola:
Szybka ocena relacji z klientem.

Wiersz 1:
- nazwa
- telefon
- e-mail
- aktywna prowizja
- akcje

Wiersz 2:
- firma
- sprawy count
- zarobione łącznie
- najbliższa akcja
- ryzyka/statusy pomocnicze

Zakaz:
Nie używać badge „Aktywna sprawa”, bo klient może mieć wiele spraw.
Nie pokazywać „Leady”, bo klient jest już pozyskanym leadem.

Źródła finansowe:
- Aktywna prowizja = suma prowizji z aktywnych spraw.
- Zarobione łącznie = suma wpłaconej prowizji ze wszystkich spraw klienta.


## LeadListCard

Nazwa ludzka:
Kafelek leada na liście leadów

Nazwa systemowa:
LeadListCard

Wariant:
lead-opportunity-row

Rola:
Szybka ocena szansy sprzedażowej.

Pokazuje:
- nazwa / temat
- telefon albo e-mail
- źródło
- status
- potencjał
- najbliższa akcja
- ryzyka
- akcje

Nie pokazuje:
- spraw klienta
- kosztów sprawy
- zarobione łącznie
- wpłaconej prowizji

Źródło wizualne:
Ten sam record-list source truth co ClientListCard, ale inny payload biznesowy.

Status:
MAPPING_ONLY_STAGE231D0B_R9 — runtime leadów nie jest przebudowywany w tym etapie.

## ClientDetailWorkspace

Nazwa ludzka:
Karta klienta / widok klienta detail

Nazwa systemowa:
ClientDetailWorkspace

Rola:
Centrum relacji z klientem: dane, aktywne sprawy, najbliższy ruch, finanse i historia.

Główne obszary:
- ClientDetailHeader
- ClientDataRail
- ClientWorkspaceCenter
- ClientRightRail
- ClientTabs

## ClientActiveCaseCard

Nazwa ludzka:
Kafelek aktywnej sprawy w kliencie

Nazwa systemowa:
ClientActiveCaseCard

Wariant:
case-active-compact-in-client

Rola:
Szybka ocena aktywnej sprawy klienta.

Pokazuje:
- tytuł sprawy
- status
- kompletność
- najbliższy ruch
- prowizja
- wpłacono
- zostało
- akcje Otwórz / Edytuj

Nie pokazuje:
- wielkiego zielonego panelu finansowego
- kosztów
- pełnej historii płatności
- labela SPRAWA jako głównego elementu

## ClientOverviewTile

Nazwa ludzka:
Kafelek podsumowania klienta u góry

Nazwa systemowa:
ClientOverviewTile

Wariant:
client-overview-compact

Rola:
Krótki sygnał: najbliższy ruch / finanse / sprawy.

Zasada:
Ma być kompaktowy i nie dublować pełnego prawego panelu.

## DetailHeader

Nazwa ludzka:
Górny kafel / header karty detail

Nazwa systemowa:
DetailHeader

Wariant:
client-detail-header-baseline

Rola:
Stały nagłówek karty encji: powrót, typ kartoteki, nazwa rekordu, akcje główne.

Źródło wzorca:
ClientDetailHeader

Pliki:
src/pages/ClientDetail.tsx
src/styles/visual-stage12-client-detail-vnext.css

Zasady:
- powrót po lewej,
- kicker nad nazwą,
- nazwa rekordu czytelna,
- akcje po prawej,
- ikony w akcjach zawsze widoczne,
- nie dublować danych z paneli niżej.



---

## CaseDetailWorkspace

Nazwa ludzka: Karta sprawy / widok sprawy detail
Nazwa systemowa: CaseDetailWorkspace
Rola: Centrum pracy nad konkretną sprawą: działania, notatki, rozliczenie, koszty i historia.
Obszary: CaseDetailHeader, CaseServiceTab, CaseNotesPanel, CaseAllNotesModal, CaseSettlementRailCard, CaseQuickActionsRail, CaseContextRailCard

## CaseServiceTab

Nazwa ludzka: Zakładka Obsługa w sprawie
Nazwa systemowa: CaseServiceTab
Rola: Bieżąca praca: zadania, wydarzenia, braki i blokady.
Zasada: Jedno źródło prawdy. Nie wolno mieć dwóch równoległych sekcji Obsługa.

## CaseNotesPanel

Nazwa ludzka: Notatki sprawy
Nazwa systemowa: CaseNotesPanel
Rola: Szybki podgląd ostatnich notatek sprawy.
Pokazuje: max 3-5 ostatnich notatek, Dodaj notatkę, Dyktuj notatkę, Wszystkie notatki.

## CaseAllNotesModal

Nazwa ludzka: Okno wszystkich notatek sprawy
Nazwa systemowa: CaseAllNotesModal
Rola: Pełna lista notatek przypiętych do sprawy.
Źródło wizualne: Wspólny modal/dialog CloseFlow, ten sam styl co dodawanie wydarzenia/leada.

## CaseSettlementRailCard

Nazwa ludzka: Prawy kafel rozliczenia sprawy
Nazwa systemowa: CaseSettlementRailCard
Rola: Najważniejsze finanse sprawy: prowizja, wpłaty, koszty i razem do pobrania.
Pozycja: Pierwszy kafel w prawym panelu sprawy.
Kolory: prowizja = finance-positive, koszty = cost-warning/case-cost, razem do pobrania = case-total-to-collect.

## CaseQuickActionsRail

Nazwa ludzka: Szybkie akcje sprawy w prawym panelu
Nazwa systemowa: CaseQuickActionsRail
Rola: Kompaktowe akcje operacyjne po rozliczeniu sprawy.

## CaseContextRailCard

Nazwa ludzka: Dane sprawy i klienta w prawym panelu
Nazwa systemowa: CaseContextRailCard
Rola: Kompaktowy kontekst sprawy: klient, status, źródłowy lead, działania i notatki.




---

## CaseDetailWorkspace

Nazwa ludzka: Karta sprawy / widok sprawy detail
Nazwa systemowa: CaseDetailWorkspace
Rola: Centrum pracy nad konkretną sprawą: działania, notatki, rozliczenie, koszty i historia.
Obszary: CaseDetailHeader, CaseServiceTab, CaseNotesPanel, CaseAllNotesModal, CaseSettlementRailCard, CaseQuickActionsRail, CaseContextRailCard

## CaseServiceTab

Nazwa ludzka: Zakładka Obsługa w sprawie
Nazwa systemowa: CaseServiceTab
Rola: Bieżąca praca: zadania, wydarzenia, braki i blokady.
Zasada: Jedno źródło prawdy. Nie wolno mieć dwóch równoległych sekcji Obsługa.

## CaseNotesPanel

Nazwa ludzka: Notatki sprawy
Nazwa systemowa: CaseNotesPanel
Rola: Szybki podgląd ostatnich notatek sprawy.
Pokazuje: max 3-5 ostatnich notatek, Dodaj notatkę, Dyktuj notatkę, Wszystkie notatki.

## CaseAllNotesModal

Nazwa ludzka: Okno wszystkich notatek sprawy
Nazwa systemowa: CaseAllNotesModal
Rola: Pełna lista notatek przypiętych do sprawy.
Źródło wizualne: Wspólny modal/dialog CloseFlow, ten sam styl co dodawanie wydarzenia/leada.

## CaseSettlementRailCard

Nazwa ludzka: Prawy kafel rozliczenia sprawy
Nazwa systemowa: CaseSettlementRailCard
Rola: Najważniejsze finanse sprawy: prowizja, wpłaty, koszty i razem do pobrania.
Pozycja: Pierwszy kafel w prawym panelu sprawy.
Kolory: prowizja = finance-positive, koszty = cost-warning/case-cost, razem do pobrania = case-total-to-collect.

## CaseQuickActionsRail

Nazwa ludzka: Szybkie akcje sprawy w prawym panelu
Nazwa systemowa: CaseQuickActionsRail
Rola: Kompaktowe akcje operacyjne po rozliczeniu sprawy.

## CaseContextRailCard

Nazwa ludzka: Dane sprawy i klienta w prawym panelu
Nazwa systemowa: CaseContextRailCard
Rola: Kompaktowy kontekst sprawy: klient, status, źródłowy lead, działania i notatki.

---

## 2026-06-11 Europe/Warsaw - STAGE231D0D_R4_TOTAL_TO_COLLECT_AND_JSX_RESCUE

Status: PATCH_RESCUE / CONTINUES_STAGE231D0D_R2

Zakres:
- naprawa częściowo zastosowanego D0D-R3 po guard fail,
- dopisanie widocznego wiersza "Razem do pobrania" do pierwszej karty "Rozliczenie sprawy",
- podpięcie totalu do istniejącego caseCostsSummaryStage231D2.totalToCollectAmount,
- naprawa JSX service tab po usunięciu legacy Stage220A10 duplicate block,
- bez SQL, bez nowego modelu kosztów, bez wykresów.

Testy wymagane:
- D0D-R2 guard/test,
- D0C ClientDetail baseline regression,
- D0B ClientListCard regression,
- npm run build,
- git diff --check.

Audyt ryzyk:
- nie dublować osobnej karty kosztów jako drugiego źródła rozliczenia; wiersz totalu w pierwszej karcie jest obowiązkowy dla skanowalności prawego panelu,
- po deployu manualnie sprawdzić kolejność raila: Rozliczenie -> Szybkie akcje -> Dane sprawy i klienta.
