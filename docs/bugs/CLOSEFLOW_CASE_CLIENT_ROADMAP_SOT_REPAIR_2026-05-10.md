# CloseFlow — ETAP 0 — audyt realnego kodu przed naprawą Case / Client / Roadmap SOT

**Data audytu:** 2026-05-10  
**Repo:** `dkknapikdamian-collab/leadflowv1`  
**Branch:** `dev-rollout-freeze`  
**Tryb:** audyt bez zmiany UI, logiki i danych  
**Cel:** ustalić, gdzie dziś są liczone aktywności, roadmapa/kartoteka klienta, płatności, finanse, lista spraw klienta i najbliższa zaplanowana akcja.

---

## 0. Twardy werdykt

Ten etap NIE naprawia jeszcze błędów.

Ten etap zamyka mapę źródeł prawdy przed naprawą, żeby kolejny developer nie grzebał po omacku.

Największy problem w kodzie: część domeny ma już wspólne helpery, ale ekrany nadal liczą ważne rzeczy lokalnie.

Najbardziej ryzykowne miejsca:
- `src/pages/CaseDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/Clients.tsx`
- `src/pages/Cases.tsx`

Najważniejszy istniejący kandydat na źródło prawdy:
- `src/lib/work-items/planned-actions.ts`
- `src/lib/work-items/normalize.ts`
- `src/lib/data-contract.ts`
- `src/lib/finance/finance-calculations.ts`
- `src/lib/finance/finance-client-summary.ts`
- `api/activities.ts`
- `api/work-items.ts`

---

## 1. Sprawdzone pliki i realne odpowiedniki

| Plik z etapu | Status | Wniosek |
|---|---:|---|
| `src/pages/CaseDetail.tsx` | ISTNIEJE | Liczy lokalnie część finansów sprawy, aktywności sprawy, ostatnie ruchy i listę pracy sprawy. Używa też `getNearestPlannedAction`. |
| `src/pages/ClientDetail.tsx` | ISTNIEJE | Liczy lokalnie roadmapę/kartotekę klienta, ostatnie ruchy klienta, listę spraw klienta i najbliższy ruch klienta. Używa `ClientFinanceRelationSummary` oraz `getNearestPlannedAction`. |
| `src/pages/Clients.tsx` | ISTNIEJE | Lista klientów liczy lokalnie wartość relacji klienta i najbliższą zaplanowaną akcję. To dubluje logikę z ClientDetail i modułów finansowych. |
| `src/pages/Activity.tsx` | ISTNIEJE | Globalna aktywność pobiera `activities`, `leads`, `cases`, ale ma własne lokalne etykiety, klasyfikację encji i relacji. |
| `src/pages/Cases.tsx` | ISTNIEJE | Lista spraw liczy lifecycle, filtry spraw i najbliższą akcję po bezpośrednim `caseId`. |
| `src/lib/supabase-fallback.ts` | ISTNIEJE | Główna warstwa klienta API. Pobiera leads/clients/cases/tasks/events/payments/activities i normalizuje dane przez `data-contract`. |
| `src/lib/calendar-items.ts` | ISTNIEJE | Buduje paczkę kalendarza z tasks/events/leads/cases. Normalizuje taski/eventy do kalendarza. |
| `src/lib/scheduling.ts` | ISTNIEJE | Łączy eventy, taski i lead shadow entries do widoków planowania. Ma logikę operator-today i deduplikację shadow leadów. |
| `src/lib/case-finance.ts` | BRAK | Realny odpowiednik: `src/lib/finance/finance-calculations.ts` + lokalne funkcje w `CaseDetail.tsx`. |
| `src/lib/client-finance.ts` | BRAK | Realny odpowiednik: `src/lib/finance/finance-client-summary.ts` + `ClientFinanceRelationSummary`. |
| `src/lib/activities.ts` | BRAK | Realny odpowiednik: `api/activities.ts` + `src/lib/data-contract.ts::normalizeActivityContract` + lokalne label-helpery w ekranach. |
| `src/lib/case-activity.ts` | BRAK | Realny odpowiednik: lokalne helpery w `CaseDetail.tsx` oraz `api/activities.ts`. |
| `src/lib/client-activity.ts` | BRAK | Realny odpowiednik: lokalne helpery w `ClientDetail.tsx` oraz `api/activities.ts`. |
| `api/cases.ts` | ISTNIEJE | Główne API spraw. Tworzy sprawy, linkuje lead -> case, patchuje lead jako `moved_to_service`. |
| `api/clients.ts` | ISTNIEJE | Główne API klientów. Nie agreguje spraw, finansów ani aktywności klienta. |
| `api/tasks.ts` | BRAK | Realny odpowiednik: `api/work-items.ts` z `kind=tasks`, plus frontendowe wywołania `/api/tasks`. Trzeba potwierdzić routing/rewrites przed zmianą. |
| `api/events.ts` | BRAK | Realny odpowiednik: `api/work-items.ts` z `kind=events`, plus frontendowe wywołania `/api/events`. Trzeba potwierdzić routing/rewrites przed zmianą. |
| `api/activities.ts` | ISTNIEJE | Główne API aktywności. GET filtruje po `caseId`, `leadId`, `clientId`, POST zapisuje `activities`. |
| `package.json` | ISTNIEJE | Ma wiele checków domenowych; w tym istnieją checki dla nearest planned action, client operational recent moves, client cases, case operational UI. |

---

## 2. Mapa obecnych źródeł danych

### 2.1. Aktywności sprawy

**Obecnie liczone / formatowane w:**
- `src/pages/CaseDetail.tsx`
  - `getActivityText`
  - `sortActivities`
  - `getCaseActivityActorLabel`
  - `getCaseRecentMoveMeta`
  - panel ostatnich ruchów i historia sprawy
- `api/activities.ts`
  - faktyczny odczyt/zapis tabeli `activities`
  - filtry `caseId`, `leadId`, `clientId`
- `src/lib/data-contract.ts`
  - `normalizeActivityContract`

**Obecne źródło danych:**
- tabela/API `activities`
- lokalne tłumaczenie eventów w `CaseDetail.tsx`

**Docelowe źródło danych:**
- `api/activities.ts` + `normalizeActivityContract`
- jeden wspólny helper domenowy, np. `src/lib/activity-formatting.ts` albo `src/lib/activities.ts`
- ekran `CaseDetail.tsx` ma tylko renderować gotowy model, a nie mieć własny słownik znaczeń eventów.

**Ryzyko obecne:**
- `Activity.tsx`, `CaseDetail.tsx` i `ClientDetail.tsx` mogą inaczej nazwać ten sam event.
- Zmiana etykiety activity w jednym ekranie nie naprawi pozostałych ekranów.

---

### 2.2. Aktywności klienta

**Obecnie liczone / formatowane w:**
- `src/pages/ClientDetail.tsx`
  - `normalizeClientActivitiesForA1`
  - `activityLabel`
  - `getActivityTime`
  - lokalna detekcja notatek klienta
- `src/pages/Activity.tsx`
  - własna klasyfikacja encji jako `client`, `lead`, `case`, `task`, `event`
- `api/activities.ts`
  - filtr `clientId`

**Obecne źródło danych:**
- tabela/API `activities`
- częściowo payload activity
- częściowo lokalne warunki po `eventType` i `payload.recordType`

**Docelowe źródło danych:**
- `ActivityDto` z `src/lib/data-contract.ts`
- jeden wspólny formatter activity dla lead/client/case
- osobna funkcja selektora: `getRecentActivitiesForRecord(recordType, recordId, activities, relationIds?)`

**Ryzyko obecne:**
- klient może pokazywać inną historię niż globalna aktywność.
- notatki klienta są normalizowane lokalnie i mogą nie pokrywać wszystkich eventów z API.

---

### 2.3. Roadmapa / kartoteka klienta

**Obecnie liczone w:**
- `src/pages/ClientDetail.tsx`
  - `buildClientNextAction`
  - `getCaseTitle`
  - `getCaseValueLabel`
  - `getCaseCompleteness`
  - `getCaseBlocker`
  - `getCaseSourceLead`
  - `getCaseNextAction`
  - lokalne typy `ClientNextAction`, `ClientCaseRow`
- `src/pages/Clients.tsx`
  - `countersByClientId`
  - `nearestActionByClientId`
  - lokalne wartości relacji

**Obecne źródło danych:**
- `clients`
- `leads`
- `cases`
- `tasks`
- `events`
- `payments`
- lokalne mapy w ekranach

**Docelowe źródło danych:**
- jeden selektor relacji klienta, np. `src/lib/client-relations.ts`:
  - `buildClientRoadmap(client, leads, cases, tasks, events, payments, activities)`
  - `getClientCases`
  - `getClientLeads`
  - `getClientPayments`
  - `getClientNearestAction`
  - `getClientRecentMoves`

**Ryzyko obecne:**
- lista klientów i szczegół klienta mogą pokazać inne liczby, inną wartość i inną najbliższą akcję.
- developer może naprawić `ClientDetail.tsx`, a bug zostanie w `Clients.tsx`.

---

### 2.4. Płatności sprawy

**Obecnie liczone / pobierane w:**
- `src/pages/CaseDetail.tsx`
  - `fetchPaymentsFromSupabase`
  - `getPaymentAmount`
  - `getCaseFinanceSummary`
  - `sortCasePayments`
  - `billingStatusLabel`
  - `isPaidPaymentStatus`
- `src/lib/supabase-fallback.ts`
  - `fetchPaymentsFromSupabase({ leadId, caseId, clientId, status })`
- API płatności jest używane przez frontend jako `/api/payments`, ale nie było częścią listy etapu.

**Obecne źródło danych:**
- płatności z `fetchPaymentsFromSupabase({ caseId })`
- pola finansowe case: `contractValue`, `expectedRevenue`, `paidAmount`, `remainingAmount`, `commission*`
- lokalny kalkulator w `CaseDetail.tsx`

**Docelowe źródło danych:**
- `src/lib/finance/finance-calculations.ts`
  - `buildFinanceSnapshot`
  - `buildFinanceSummary`
  - `calculatePaidAmount`
  - `calculateRemainingAmount`
- `src/components/finance/CaseSettlementPanel.tsx` jako UI, ale nie jako jedyne miejsce reguł finansowych.

**Ryzyko obecne:**
- CaseDetail może liczyć finansowanie inaczej niż wspólny silnik FIN.
- Statusy płatności w `CaseDetail.tsx` nie są tym samym kontraktem co `finance-normalize`.

---

### 2.5. Finanse klienta

**Obecnie liczone w:**
- `src/components/finance/FinanceMiniSummary.tsx`
  - `ClientFinanceRelationSummary`
- `src/lib/finance/finance-client-summary.ts`
  - `buildClientFinanceSummary`
- `src/pages/Clients.tsx`
  - `paymentValueByClientId`
  - `caseValueByClientId`
  - `leadValueByClientId`
  - `clientFieldValueByClientId`
  - `clientValueByClientId`

**Obecne źródło danych:**
- w `ClientDetail`: komponent `ClientFinanceRelationSummary` i `buildClientFinanceSummary`
- w `Clients`: lokalny, osobny algorytm wyboru wartości

**Docelowe źródło danych:**
- `src/lib/finance/finance-client-summary.ts::buildClientFinanceSummary`
- ewentualnie cienki helper dla listy: `buildClientFinanceSummaryByClientId(clients, cases, payments)`

**Ryzyko obecne:**
- lista klientów może pokazywać inną wartość relacji niż karta klienta.
- `Clients.tsx` ma własne listy aliasów kwot, więc każda zmiana kontraktu finansów wymaga poprawki w kilku miejscach.

---

### 2.6. Lista spraw klienta

**Obecnie liczona w:**
- `src/pages/ClientDetail.tsx`
  - lokalne filtrowanie `cases` po `clientId`
  - budowanie `ClientCaseRow`
  - lokalne `getCaseNextAction`
- `src/pages/Clients.tsx`
  - `countersByClientId`
- `api/cases.ts`
  - obsługuje GET `clientId`

**Obecne źródło danych:**
- `fetchCasesFromSupabase({ clientId })` lub globalne `fetchCasesFromSupabase()` + lokalny filtr

**Docelowe źródło danych:**
- jeden selektor lub loader:
  - API: `fetchCasesFromSupabase({ clientId })` jako źródło pobrania
  - frontend: `getCasesForClient(clientId, cases)` jako wspólny selektor dla listy i detailu
- `ClientDetail` i `Clients` nie powinny mieć dwóch różnych definicji “klient ma sprawę”.

**Ryzyko obecne:**
- `Clients.tsx` liczy klienta ze sprawą po `clientId`, a `ClientDetail.tsx` może wciągać też sprawy przez lead/source fallbacki. To daje rozjazd liczników.

---

### 2.7. Najbliższa zaplanowana akcja klienta

**Obecnie liczona w:**
- `src/lib/work-items/planned-actions.ts`
  - `getNearestPlannedAction`
- `src/pages/ClientDetail.tsx`
  - `buildClientNextAction`
  - dodatkowe fallbacki: overdue task, next task, next event, active case, open lead
- `src/pages/Clients.tsx`
  - `nearestActionByClientId`

**Obecne źródło danych:**
- `tasks`
- `events`
- related lead ids
- related case ids
- czasami fallback do aktywnej sprawy/leada, nawet gdy nie ma zaplanowanego work itemu

**Docelowe źródło danych:**
- `src/lib/work-items/planned-actions.ts::getNearestPlannedAction`
- cienki wrapper klienta, np. `getClientNearestPlannedAction(clientId, relations, workItems)`
- fallback “aktywny lead/sprawa” ma być osobnym stanem roadmapy, nie udawać zaplanowanej akcji.

**Ryzyko obecne:**
- w ClientDetail “najbliższy ruch” może nie być realną zaplanowaną akcją, tylko fallbackiem do aktywnej sprawy/leada.
- w Clients lista pokazuje tylko wynik `getNearestPlannedAction`, więc może pokazać “Brak zaplanowanych działań”, gdy ClientDetail pokaże aktywną sprawę jako ruch.

---

## 3. Lista bugów do naprawy po Etapie 0

| ID | Bug | Plik odpowiadający dziś | Obecne źródło danych | Docelowe źródło danych | Następny etap |
|---|---|---|---|---|---|
| BUG-01 | Finanse sprawy liczone lokalnie w widoku sprawy zamiast przez wspólny silnik FIN. | `src/pages/CaseDetail.tsx` | lokalne `getCaseFinanceSummary` + `fetchPaymentsFromSupabase` | `src/lib/finance/finance-calculations.ts::buildFinanceSnapshot/buildFinanceSummary` | Etap 1 |
| BUG-02 | Finanse klienta są liczone inaczej w liście klientów i w karcie klienta. | `src/pages/Clients.tsx`, `FinanceMiniSummary.tsx` | lokalne mapy wartości w `Clients.tsx`; `buildClientFinanceSummary` w detailu | `src/lib/finance/finance-client-summary.ts::buildClientFinanceSummary` | Etap 1 |
| BUG-03 | “Najbliższa zaplanowana akcja” ma dwa zachowania: w detailu klienta ma fallbacki, w liście klientów nie. | `src/pages/ClientDetail.tsx`, `src/pages/Clients.tsx` | `getNearestPlannedAction` + lokalne fallbacki | jeden wrapper klienta na `getNearestPlannedAction`; fallbacki jako osobny stan roadmapy | Etap 2 |
| BUG-04 | Aktywności mają lokalne etykiety w kilku ekranach. | `CaseDetail.tsx`, `ClientDetail.tsx`, `Activity.tsx` | lokalne `getActivityText`, `activityLabel`, `getActivityTitle` | wspólny formatter activity oparty o `ActivityDto` | Etap 2 |
| BUG-05 | Roadmapa/kartoteka klienta jest składana lokalnie w ClientDetail bez wspólnego selektora. | `src/pages/ClientDetail.tsx` | `leads/cases/tasks/events/payments/activities` + lokalne helpery | `src/lib/client-relations.ts` albo `src/lib/client-roadmap.ts` | Etap 3 |
| BUG-06 | Lista spraw klienta i liczniki klientów mogą używać różnych definicji relacji. | `src/pages/ClientDetail.tsx`, `src/pages/Clients.tsx`, `api/cases.ts` | `clientId`, czasem fallback przez lead/sprawę | jeden selektor `getCasesForClient` + API `clientId` | Etap 3 |
| BUG-07 | CaseDetail może nadmiarowo wciągać task/event po samym `clientId`, bo `belongsToCase` akceptuje `clientId == case.clientId`. | `src/pages/CaseDetail.tsx` | `caseId OR leadId OR clientId` | dla sprawy: głównie `caseId`; `leadId` tylko jawnie dla sprawy źródłowej; `clientId` tylko w roadmapie klienta | Etap 1 |
| BUG-08 | W etapie wskazano `api/tasks.ts` i `api/events.ts`, ale realny plik to `api/work-items.ts`. | API routing | frontend woła `/api/tasks` i `/api/events`, endpoint realny jest w `api/work-items.ts` | jawny kontrakt endpointów albo potwierdzone rewrite/aliasy | Etap 0.1 techniczny |

---

## 4. Pliki do ruszenia w następnym etapie

### Etap 1 — naprawa bez UI, tylko SOT/selekcja danych

Najpierw ruszać:
- `src/pages/CaseDetail.tsx`
- `src/pages/Clients.tsx`
- `src/lib/finance/finance-calculations.ts`
- `src/lib/finance/finance-client-summary.ts`
- `src/lib/work-items/planned-actions.ts`
- `src/lib/work-items/normalize.ts`

Nie ruszać jeszcze:
- CSS
- layoutu
- copy ekranów
- routingu
- pól w bazie

### Etap 2 — wspólne activity formatting

Dodać albo odbudować:
- `src/lib/activities.ts` albo `src/lib/activity-formatting.ts`

Potem uprościć:
- `src/pages/Activity.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/ClientDetail.tsx`

### Etap 3 — klient jako relacja, nie osobny CRM

Dodać:
- `src/lib/client-relations.ts` albo `src/lib/client-roadmap.ts`

Potem przepiąć:
- `src/pages/ClientDetail.tsx`
- `src/pages/Clients.tsx`

---

## 5. Testy / checki dodane w tej paczce

Dodany plik:

```text
scripts/check-closeflow-case-client-roadmap-sot-audit.cjs
```

Co sprawdza:
- istnieje dokument `docs/bugs/CLOSEFLOW_CASE_CLIENT_ROADMAP_SOT_REPAIR_2026-05-10.md`,
- dokument zawiera listę bugów,
- dokument zawiera mapę obecnych i docelowych źródeł danych,
- dokument wymienia pliki istniejące i brakujące,
- dokument wskazuje realne odpowiedniki brakujących plików,
- dokument nie udaje naprawy UI/logiki/danych.

Rekomendowana komenda:

```powershell
node scripts/check-closeflow-case-client-roadmap-sot-audit.cjs
git status --short
```

Ten check jest celowo dokumentacyjny. Nie sprawdza jeszcze runtime, bo Etap 0 nie zmienia runtime.

---

## 6. Kryterium zakończenia Etapu 0

Etap 0 jest zakończony, jeśli:

1. Dokument audytu istnieje w repo.
2. Developer widzi, gdzie dziś jest każda logika.
3. Developer widzi, które pliki są realnym źródłem prawdy.
4. Developer wie, które pliki są brakujące i jakie są ich odpowiedniki.
5. `git status --short` pokazuje tylko:
   - nowy dokument audytu,
   - nowy check dokumentacyjny,
   - ewentualnie brak zmian w `package.json`, jeśli check uruchamiany jest bez npm scriptu.

---

## 7. Czego nie wolno robić w tym etapie

Nie zmieniać:
- UI,
- logiki,
- danych,
- endpointów,
- schema fallbacków,
- statusów,
- finansów,
- aktywności,
- sposobu renderowania ClientDetail / CaseDetail / Clients / Cases.

Ten etap to mapa, nie operacja na żywym organizmie.
