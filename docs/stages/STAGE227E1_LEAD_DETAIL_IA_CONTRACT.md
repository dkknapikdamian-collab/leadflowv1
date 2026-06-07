# Stage227E1 — Lead Detail IA Contract + Visual Source of Truth

Status: do wdrożenia lokalnie
Data: 2026-06-06 15:00 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Stage marker: STAGE227E1_LEAD_DETAIL_IA_CONTRACT
Runtime scope: NO_RUNTIME_REBUILD_STAGE227E1

## Werdykt

LeadDetail ma zostać przebudowany jako karta sprzedażowa, nie jako kopia sprawy.
Poziom przekonania: 9/10.

## Granica etapu

Stage227E1 jest etapem kontraktowym. Nie przebudowuje jeszcze runtime UI, nie dodaje tabel, nie zmienia Supabase, nie zmienia flow tworzenia sprawy i nie przesuwa sekcji w `LeadDetail.tsx`.

Ten etap ma zatrzymać chaos przed przebudową: AI developer nie może zacząć Stage227E2 ani większej przebudowy LeadDetail bez tego kontraktu i guarda.

## Teza produktowa

Lead odpowiada na pytania sprzedażowe:

1. kto to jest,
2. skąd przyszedł,
3. czego chce,
4. czy mamy kontakt,
5. co blokuje decyzję,
6. jaki jest następny krok,
7. czy temat stygnie,
8. czy warto rozpocząć obsługę,
9. czy temat trzeba odpuścić.

Sprawa odpowiada na inne pytania:

1. co trzeba dowieźć,
2. jakie są braki formalne,
3. jaki jest postęp,
4. jakie są płatności,
5. co blokuje zamknięcie.

Wniosek: LeadDetail i CaseDetail mają mieć podobny język wizualny i wspólne źródło prawdy akcji, ale inne treści.

## Visual Source of Truth

Obowiązuje jedno źródło prawdy wizualne dla tych samych albo podobnych akcji.

LeadDetail musi używać albo respektować wspólne źródła z CaseDetail:

- `actionButtonClass` z `src/components/entity-actions`,
- `getCloseFlowActionKindClass`,
- `getCloseFlowActionVisualClass`,
- `getCloseFlowActionVisualDataKind`,
- `inferCloseFlowActionVisualKind`,
- istniejące klasy akcji typu `cf-entity-action-cluster`, `cf-panel-header-actions`, `cf-panel-action-row`, `cf-danger-action-zone`, `cf-inline-secondary-action`,
- istniejące klasy i wzorce w CaseDetail, w tym `case-detail-work-row`, `case-detail-section-card`, `CaseQuickActions` albo ich następne wspólne odpowiedniki.

Zakazane w kolejnych etapach bez osobnej decyzji:

- osobne style typu `lead-quick-button-blue-new`,
- osobne style typu `lead-special-action-box`,
- osobne style typu `lead-custom-card`,
- nowy równoległy zestaw kolorów dla tych samych akcji,
- osobne rozmieszczenie szybkich akcji w LeadDetail, jeżeli CaseDetail ma już wzorzec dla tej samej klasy akcji,
- kopiowanie CaseDetail 1:1 bez sprzedażowego sensu LeadDetail.

## Docelowe sekcje LeadDetail

Kolejność i odpowiedzialność sekcji:

1. Header
   - identyfikacja leada,
   - status,
   - kontakt,
   - źródło,
   - ostatni kontakt.

2. Quick Actions
   - ten sam styl i miejsce wzorca co w sprawie,
   - akcje: Notatka, Zadanie, Wydarzenie, Brak, Utracony, Rozpocznij obsługę,
   - nie wciskać jako przypadkowy zestaw ikon bez wspólnego VST.

3. Decision Cards
   - tylko trzy główne karty na start:
     - Następny krok,
     - Cisza / ryzyko,
     - Potencjał.
   - nie robić pełnego panelu finansowego leada jako głównej karty.

4. Sales Signal
   - nazwa UI: Sygnał sprzedażowy,
   - nie używać suchego CRM-owego „Kwalifikacja” jako głównego języka,
   - pola docelowe:
     - Problem / potrzeba,
     - Powód kontaktu,
     - Termin / pilność,
     - Budżet / wartość,
     - Decyzja,
     - Blokada,
     - Następny krok.

5. Work Action Center
   - centrum pracy leada,
   - najbliższe działania,
   - braki i blokady,
   - wszystkie aktywne,
   - akcje rzędów: Edytuj, Jutro, Zrobione, Usuń.

6. Notes
   - notatki zostają notatkami,
   - „obserwacja” jest wariantem/prefillem notatki, nie nowym modelem danych w E1,
   - nie tworzyć osobnego bytu „obserwacje”.

7. Source/History
   - dane źródłowe i historia są niżej albo w bocznej kolumnie,
   - nie sterują decyzją na górze,
   - historia nie może powielać notatek w sposób mylący.

## Decyzja: Dodaj brak

`Dodaj brak` zostaje w leadzie, bo ma sens operacyjny.
Poziom przekonania: 8/10.

W Stage227E1/Stage227E2 `Dodaj brak` nie wymaga nowej tabeli. Ma działać jako brak/blokada przy leadzie przez istniejący bezpieczny model: task/event/note z typem, helperem albo prefiksem, zależnie od obecnego kontraktu danych.

Przykłady braków:

- Brakuje umowy,
- Brakuje telefonu,
- Brakuje decyzji,
- Brakuje informacji o budżecie,
- Czeka na zdjęcia.

Docelowa wybieralna lista braków i ustawienia własnych braków to późniejszy etap, nie Stage227E1.

## Mobile contract

Mobile nie ma trzech kolumn. Kolejność mobile:

1. Header leada,
2. Quick Actions,
3. Następny krok,
4. Cisza / ryzyko,
5. Potencjał,
6. Work Action Center,
7. Braki i blokady,
8. Notes,
9. Dane leada,
10. Decyzja: Rozpocznij obsługę / Otwórz sprawę.

## Warunki wejścia do Stage227E2

Stage227E2 jest zablokowany, dopóki:

- istnieje ten dokument,
- istnieje guard `scripts/check-stage227e1-lead-detail-ia-contract.cjs`,
- istnieje test `tests/stage227e1-lead-detail-ia-contract.test.cjs`,
- `package.json` ma skrypty `check:stage227e1-lead-detail-ia-contract` i `test:stage227e1-lead-detail-ia-contract`,
- guard potwierdza, że LeadDetail i CaseDetail mają wspólne źródła klas/akcji,
- guard potwierdza zakaz osobnych styli dla tych samych akcji.

## Najkrótszy test praktyczny

Po wejściu w leada w 10 sekund operator ma wiedzieć:

- kim jest lead,
- czego chce,
- co blokuje temat,
- jaki jest następny krok,
- czy cisza robi się groźna,
- czy warto rozpocząć obsługę.

Jeżeli układ nie odpowiada na te pytania, Stage227E2 nie jest gotowy.

## Ryzyka po etapie

1. Ryzyko: kontrakt stanie się martwym dokumentem.
   - Guard wymusza obecność kontraktu, pakietu npm i kluczowych fragmentów.

2. Ryzyko: LeadDetail zostanie skopiowany z CaseDetail 1:1.
   - Dokument rozdziela pytania sprzedażowe leada od pytań wykonawczych sprawy.

3. Ryzyko: powstaną nowe style i kolory dla tych samych akcji.
   - Guard wymusza wspólne źródła: `actionButtonClass` i action visual taxonomy.

4. Ryzyko: `Dodaj brak` zrobi chaos danych.
   - E1 blokuje nową tabelę i pełne ustawienia; najpierw ręczny brak/blokada, potem lista.

5. Ryzyko: mobile zostanie potraktowany jak mini-desktop.
   - Kontrakt wymusza kolejność operacyjną mobile zamiast trzech kolumn.

## Czego nie ruszać w Stage227E1

- Supabase schema,
- migracje SQL,
- runtime przebudowa LeadDetail,
- nowy model braków,
- ustawienia typów braków,
- CaseDetail runtime,
- flow rozpoczynania obsługi,
- płatności/finanse,
- Google Calendar,
- powiadomienia,
- routing aplikacji.
---

## Guard marker

This contract uses one visual source of truth for LeadDetail and CaseDetail quick actions, work rows, status/risk pills and decision cards.

Marker wymagany przez guard: visual source of truth
