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

Status:
Deprecated in main rail.

Decyzja:
Nie renderować jako stałej karty w prawym panelu. Dane zostają w systemie i mogą wrócić jako modal/szczegóły sprawy.



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

## CaseServiceWorkspaceGrid

Nazwa ludzka:
Środkowy układ obsługi sprawy

Nazwa systemowa:
CaseServiceWorkspaceGrid

Rola:
Desktopowy układ 100% skali: działania sprawy obok notatek sprawy.

Układ:
- działania po lewej/szerzej,
- notatki po prawej/węziej,
- na mniejszych ekranach stack.

## CaseSettlementRailCardCompact

Nazwa ludzka:
Kompaktowe rozliczenie sprawy w prawym panelu

Nazwa systemowa:
CaseSettlementRailCardCompact

Rola:
Szybki odczyt pieniędzy bez przeładowania raila.

Stale pokazuje:
- prowizja należna
- wpłacono
- do zapłaty
- koszty do zwrotu
- razem do pobrania

Nie pokazuje stale:
- pełnej listy historii wpłat
- pełnej listy kosztów
- dużych empty states

## CaseNotesPanelCompact

Nazwa ludzka:
Kompaktowe notatki sprawy obok działań

Nazwa systemowa:
CaseNotesPanelCompact

Rola:
Szybki podgląd 3 ostatnich notatek i wejście do wszystkich notatek.


## CaseServiceWorkspaceGridR4

Nazwa ludzka:
Układ obsługi sprawy na 100%.

Nazwa systemowa:
CaseServiceWorkspaceGridR4

Rola:
Zbalansowany widok: tabs wyrównane do kolumny działań, działania po lewej, notatki po prawej, rozliczenie i szybkie akcje w railu.

Zasady:
- tabs są wyrównane do kolumny działań,
- notatki są podniesione do góry,
- prawy rail nie renderuje stałej karty danych kontekstowych.


## CaseSettlementRailCardLean

Nazwa ludzka:
Odchudzone rozliczenie sprawy.

Nazwa systemowa:
CaseSettlementRailCardLean

Rola:
Szybki odczyt pieniędzy bez dublowania historii i pełnych kosztów.

Pokazuje:
- prowizja,
- wpłacono,
- do zapłaty,
- koszty do zwrotu,
- razem do pobrania.

Nie pokazuje stale:
- pełnej historii wpłat,
- pełnej listy kosztów,
- dużych empty states.

---

## CaseQuickActionsRailR5

Nazwa ludzka:
Szybkie akcje sprawy bez duplikacji finansów

Nazwa systemowa:
CaseQuickActionsRailR5

Rola:
Prawy rail pokazuje szybkie akcje operacyjne: Notatka, Zadanie, Wydarzenie, Brak. Wpłata prowizji jest dostępna w rozliczeniu sprawy, nie jako osobna szybka akcja.

Zasady:
- nie dublować wpłaty prowizji w szybkich akcjach,
- zachować spójny odstęp kafelków,
- notatki i prawy rail mają być wyrównane wyżej bez chaosu w spacingu.

---

## CaseServiceWorkspaceGridR6

Nazwa ludzka:
Prawdziwy układ obsługi sprawy

Nazwa systemowa:
CaseServiceWorkspaceGridR6

Rola:
Jeden spójny grid dla zakładki Obsługa: lewa kolumna zawiera tabs i działania, środkowa kolumna zawiera notatki startujące od góry, prawy rail zawiera rozliczenie i szybkie akcje.

Zasady:
- tabs nie są osobną belką nad całym workspace,
- tabs są częścią lewej kolumny działań,
- notatki startują od góry tego samego gridu,
- odstęp między kafelkami używa wspólnego rytmu 14px,
- nie używać losowych marginów do maskowania złej struktury.

<!-- STAGE231D0B_CLIENT_LIST_CARD_UI_DICTIONARY_START -->
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
Nie używać badge â€žAktywna sprawaâ€ť, bo klient może mieć wiele spraw.
Nie pokazywać â€žLeadyâ€ť, bo klient jest już pozyskanym leadem.

Źródła finansowe:
- Aktywna prowizja = suma prowizji z aktywnych spraw.
- Zarobione łącznie = suma wpłaconej prowizji ze wszystkich spraw klienta.
<!-- STAGE231D0B_CLIENT_LIST_CARD_UI_DICTIONARY_END -->

<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — FunnelOwnerDashboard

Nazwa ludzka:
Lejek / panel właściciela

Nazwa systemowa:
FunnelOwnerDashboard

Rola:
Widok decyzji właściciela: co wymaga ruchu, gdzie jest cisza, gdzie ryzyko i gdzie pieniądze.

Zasada:
Nie jest kanbanem. To lista decyzji i filtrów priorytetu.

## FunnelOwnerDecisionTile

Nazwa ludzka:
Górny kafelek decyzji w lejku

Nazwa systemowa:
FunnelOwnerDecisionTile

Rola:
Szybki filtr właściciela: ruch, brak kroku, cisza, ryzyko, pieniądze.

Źródło stylu:
Wspólne metric/summary tiles CloseFlow, nie lokalny ciężki styl.

## FunnelStageFilterStrip

Nazwa ludzka:
Pasek etapów w lejku

Nazwa systemowa:
FunnelStageFilterStrip

Rola:
Etapy jako filtr, nie kolumny kanban.

Zasada:
Ma być kompaktowy i nie dominować ekranu.

## FunnelDecisionListCard

Nazwa ludzka:
Rekord decyzyjny w lejku

Nazwa systemowa:
FunnelDecisionListCard

Rola:
Jedna sprawa albo lead wymagający decyzji właściciela.

Pokazuje:
- typ rekordu,
- ryzyko,
- etap,
- kontakt/cisza,
- następny krok,
- wartość/prowizja,
- akcję otwarcia.

## FunnelOwnerPriorityRail

Nazwa ludzka:
Prawy panel priorytetu w lejku

Nazwa systemowa:
FunnelOwnerPriorityRail

Rola:
Lekki panel właściciela: najwyższy priorytet teraz + krótka reguła widoku.

Zasada:
Styl zgodny z prawym railem detail. Bez ciężkiej instrukcyjnej karty.
<!-- STAGE231D0F_FUNNEL_OWNER_DASHBOARD_VISUAL_ALIGNMENT_2026_06_12_END -->

<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_START -->
## 2026-06-12 15:00 Europe/Warsaw — FunnelOwnerDashboard R4 targeted baseline

Nazwa ludzka:
Lejek / panel właściciela

Nazwa systemowa:
FunnelOwnerDashboard

Rola:
Widok decyzji właściciela: co wymaga ruchu, gdzie jest cisza, gdzie ryzyko i gdzie pieniądze.

Zasada:
Nie jest kanbanem. To lista decyzji i filtrów priorytetu.

Komponenty wzorcowe:
- `FunnelOwnerDecisionTile`
- `FunnelStageFilterStrip`
- `FunnelDecisionListCard`
- `FunnelOwnerPriorityRail`

Guard:
- sprawdza aktywny zakres STAGE231D0F,
- nie skanuje całej historii `_project`.
<!-- STAGE231D0F_R4_FUNNEL_OWNER_DASHBOARD_TARGETED_GUARD_REPAIR_2026_06_12_END -->
