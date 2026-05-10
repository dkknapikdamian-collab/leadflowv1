# CloseFlow - PERF-0 - Render/performance audit without feature cuts

**Data etapu:** 2026-05-09  
**Repo:** `dkknapikdamian-collab/leadflowv1`  
**Branch:** `dev-rollout-freeze`  
**Status:** etap audytowy, bez zmian runtime  
**Cel:** przyspieszyć aplikację bez usuwania funkcji, bez zmiany UX i bez uproszczania logiki biznesowej przez kasowanie.

---

## 1. Werdykt

PERF-0 nie jest etapem refaktoru ani przepisywania ekranów. To bramka audytowa, która ma zostawić w repo listę miejsc do bezpiecznej optymalizacji.

**Teza:** najpierw mierzymy i zapisujemy konkretne kandydaty do optymalizacji, dopiero potem robimy małe etapy naprawcze.  
**Poziom przekonania:** 8/10.  
**Argument za:** repo ma wiele ekranów, wiele źródeł danych, guardów i warstw CSS, więc ślepe poprawianie wydajności może łatwo popsuć dane albo UI.  
**Argument przeciw:** samo PERF-0 jeszcze nie przyspiesza aplikacji, tylko przygotowuje czyste pole do bezpiecznych zmian.  
**Co zmieniłoby zdanie:** twarde profile z przeglądarki pokażą jeden oczywisty hot spot, który można naprawić lokalnie bez ryzyka regresji.  
**Najkrótszy test:** sprawdzić w DevTools Network i React Profiler, czy po małej mutacji, np. oznaczeniu taska jako done, aplikacja robi zbędne pełne odświeżenie list lub powtarza te same fetch requesty.

---

## 2. Zakres

### W zakresie

- audyt renderowania,
- audyt fetchy,
- audyt reloadów po mutacjach,
- audyt cache invalidation,
- audyt selektorów, normalizacji danych, sortowania i filtrowania,
- audyt importów ikon,
- lista konkretnych optymalizacji do następnych etapów,
- guard pilnujący, że dokument PERF-0 istnieje i zawiera wymagany zakres.

### Poza zakresem

- usuwanie funkcji,
- uproszczenie logiki biznesowej przez kasowanie,
- zmiana UX,
- przebudowa layoutu,
- zmiana visual systemu,
- migracje bazy,
- zmiana kontraktu API,
- podpinanie nowych bibliotek do cache, jeśli nie ma dowodu z pomiaru.

---

## 3. Pliki do sprawdzenia

Audyt ma objąć dokładnie te miejsca:

```text
src/lib/supabase-fallback.ts
src/pages/TodayStable.tsx
src/pages/TasksStable.tsx
src/pages/Leads.tsx
src/pages/Clients.tsx
src/pages/Cases.tsx
src/pages/Calendar.tsx
src/pages/ClientDetail.tsx
src/pages/CaseDetail.tsx
src/lib/work-items/*
src/lib/nearest-action.ts
src/lib/relation-value.ts
```

---

## 4. Co sprawdzić

### 4.1. Podwójne fetchowanie

Sprawdzić, czy te same dane nie są pobierane więcej niż raz przez:

- mount komponentu,
- zmianę filtrów,
- powrót z modala,
- mutation bus,
- ręczny refresh,
- loader ekranowy,
- osobne hooki w child komponentach.

**Dowód do zebrania:** tabela endpointów, liczba requestów przy wejściu na ekran i liczba requestów po jednej mutacji.

### 4.2. Reload całej listy po drobnej mutacji

Sprawdzić, czy akcje typu:

- task done,
- event done,
- szybka edycja statusu,
- snooze,
- dodanie notatki,
- zmiana relacji lead/client/case,

nie odświeżają całej paczki danych, jeśli wystarczy lokalna aktualizacja jednego rekordu lub entity-scoped invalidation.

### 4.3. Brak cache invalidation tylko dla encji

Sprawdzić, czy po mutacji taska nie invalidujemy:

- leadów,
- klientów,
- spraw,
- całego bundle,
- Today,
- Calendar,

jeśli realnie wystarczy invalidacja `tasks` albo `work-items`.

### 4.4. Ciężkie useMemo po dużych listach

Sprawdzić, czy `useMemo` nie robi pełnego:

- mapowania,
- filtrowania,
- sortowania,
- grupowania,
- budowania relacji,

przy każdej zmianie stanu lokalnego, np. otwarciu modala albo wpisywaniu w input.

### 4.5. Filtrowanie/sortowanie bez normalizacji danych

Sprawdzić, czy listy nie normalizują dat, statusów, relacji i labeli wielokrotnie w renderze.

Preferowany kierunek: jedna normalizacja wejścia danych, potem tanie selektory.

### 4.6. Zbyt szerokie importy ikon

Sprawdzić, czy nie importujemy dużych zestawów ikon lub całych namespace, jeśli ekran używa kilku ikon.

Nie zmieniać ikon wizualnie. Audyt dotyczy tylko sposobu importu i bundle cost.

---

## 5. Lista konkretnych optymalizacji bez cięcia funkcji

### PERF-OPT-01 - Request dedupe w `src/lib/supabase-fallback.ts`

**Problem do potwierdzenia:** te same GET-y mogą być wywoływane równolegle przez kilka ekranów lub hooków.  
**Kierunek:** dodać in-flight request dedupe dla identycznych GET cache keys.  
**Ryzyko:** stare dane po mutacji, jeśli invalidation jest zbyt szeroka albo zbyt wąska.  
**Test:** dwa równoległe odczyty tego samego endpointu mają wykonać jeden request, po mutacji cache ma zostać poprawnie odświeżony.

### PERF-OPT-02 - Entity-scoped cache invalidation

**Problem do potwierdzenia:** drobna mutacja może czyścić całość GET cache.  
**Kierunek:** mutacje powinny emitować typ encji, np. `tasks`, `events`, `leads`, `cases`, `clients`; invalidacja powinna usuwać tylko powiązane klucze.  
**Ryzyko:** Today i Calendar mogą nie odświeżyć zależnych widoków, jeśli mapa zależności będzie zbyt uboga.  
**Test:** po zmianie taska odświeża się task i widoki zależne, ale nie robi się pełny reset całego repo danych.

### PERF-OPT-03 - Coalescing mutation bus

**Problem do potwierdzenia:** kilka mutacji w krótkim oknie może odpalić kilka refreshy pod rząd.  
**Kierunek:** zebrać eventy mutacji przez krótkie okno, np. microtask lub 50-100 ms, i wykonać jeden refresh zależny od encji.  
**Ryzyko:** zbyt długi debounce może dać wrażenie opóźnienia UI.  
**Test:** szybkie oznaczenie 3 tasków jako done nie powoduje 3 pełnych reloadów.

### PERF-OPT-04 - TodayStable: jeden indeks relacji dla lead/client/case/task/event

**Problem do potwierdzenia:** TodayStable może wielokrotnie szukać powiązań po dużych listach.  
**Kierunek:** zbudować jednorazowy `relationIndex` na podstawie danych wejściowych i używać map `id -> entity`.  
**Ryzyko:** źle zbudowany indeks pokaże błędne etykiety.  
**Test:** liczby i linki w Today pozostają identyczne przed i po zmianie.

### PERF-OPT-05 - TodayStable: rozdzielenie danych wejściowych od stanu UI

**Problem do potwierdzenia:** otwieranie modala, toggle sekcji lub zmiana lokalnego inputu może przeliczać całe sekcje Today.  
**Kierunek:** pochodne sekcje liczyć wyłącznie od stabilnych zależności danych, nie od stanu UI.  
**Ryzyko:** sekcje mogą przestać reagować na realne zmiany danych, jeśli dependency array będzie zbyt ciasne.  
**Test:** toggle UI nie przelicza dużych list, ale dodanie taska aktualizuje sekcję.

### PERF-OPT-06 - TasksStable: lokalna aktualizacja po `done/snooze`

**Problem do potwierdzenia:** po drobnej zmianie taska może iść pełny fetch listy.  
**Kierunek:** po sukcesie API aktualizować lokalny rekord i dopiero w tle robić lekki refresh zależny od encji.  
**Ryzyko:** optimistic update może pokazać fałsz, jeśli API zwróci błąd.  
**Test:** błąd API cofa lokalny stan, sukces nie robi pełnego migania listy.

### PERF-OPT-07 - Calendar: oddzielne bucketowanie miesiąca i tygodnia

**Problem do potwierdzenia:** zmiana widoku lub daty może ponownie grupować całą listę tasków i eventów.  
**Kierunek:** budować bucket `dateKey -> items` raz dla aktualnego zakresu.  
**Ryzyko:** błędy timezone i all-day.  
**Test:** wydarzenia all-day, zadania bez godziny i eventy z godziną trafiają do tych samych dni co wcześniej.

### PERF-OPT-08 - Leads/Clients/Cases: stabilne sort keys

**Problem do potwierdzenia:** sortowanie po dacie/statusie/wartości może przeliczać `Date.parse` i normalizacje przy każdym renderze.  
**Kierunek:** przy normalizacji rekordu dopisać tanie pola pochodne, np. `sortUpdatedAt`, `sortNextActionAt`, `searchText`.  
**Ryzyko:** searchText może się zestarzeć po edycji rekordu, jeśli nie jest regenerowany.  
**Test:** wyniki wyszukiwania i sortowania identyczne przed i po zmianie.

### PERF-OPT-09 - ClientDetail/CaseDetail: indeks work-items zamiast filter po całej liście

**Problem do potwierdzenia:** detail może filtrować wszystkie taski/eventy po `clientId/caseId/leadId` przy każdym renderze.  
**Kierunek:** helper w `src/lib/work-items/*` buduje mapy relacji raz, potem detail pobiera tylko potrzebne elementy.  
**Ryzyko:** rekord powiązany po leadzie i sprawie może zostać zgubiony, jeśli relacje są mapowane za płytko.  
**Test:** `Ostatnie ruchy`, `Najbliższa zaplanowana akcja`, taski i eventy pokazują ten sam zestaw jak przed zmianą.

### PERF-OPT-10 - `src/lib/nearest-action.ts`: precomputed timestamp

**Problem do potwierdzenia:** nearest action może wiele razy parsować daty.  
**Kierunek:** helper powinien przyjąć już znormalizowane timestampy albo sam normalizować raz na wejściu.  
**Ryzyko:** różnica w interpretacji dat bez timezone.  
**Test:** najbliższa akcja jest identyczna dla taska, eventu, sprawy i klienta.

### PERF-OPT-11 - `src/lib/relation-value.ts`: memoizowany resolver etykiet

**Problem do potwierdzenia:** etykiety relacji mogą być liczone wielokrotnie w listach i kaflach.  
**Kierunek:** resolver dostaje indeks encji i zwraca stabilny wynik, bez chodzenia po wielu listach.  
**Ryzyko:** etykieta może nie odświeżyć się po edycji nazwy klienta.  
**Test:** po edycji klienta etykieta w leadzie/sprawie/tasku aktualizuje się.

### PERF-OPT-12 - Icon import audit

**Problem do potwierdzenia:** ekrany mogą importować ikony szerzej niż potrzebują.  
**Kierunek:** używać named imports z aktualnie stosowanej biblioteki, bez namespace importów i bez własnych kopii ikon.  
**Ryzyko:** brak, jeśli nazwy i wizualny wygląd pozostają te same.  
**Test:** build przechodzi, UI pokazuje te same ikony, bundle nie rośnie.

---

## 6. Dane, które trzeba zebrać przed wdrożeniem optymalizacji

### Network

Dla każdego ekranu:

```text
TodayStable
TasksStable
Leads
Clients
Cases
Calendar
ClientDetail
CaseDetail
```

Zebrać:

- liczba requestów przy wejściu,
- liczba requestów po odświeżeniu,
- liczba requestów po jednej mutacji,
- powtarzające się endpointy,
- endpointy wolniejsze niż 300 ms lokalnie lub w preview.

### React Profiler

Zebrać:

- największy render duration,
- komponenty renderujące się po zmianie lokalnego stanu,
- komponenty renderujące się mimo braku zmiany danych,
- listy renderujące się po otwarciu/zamknięciu modala.

### Bundle

Zebrać:

- czy importy ikon zwiększają chunk danego ekranu,
- czy CSS danego ekranu ładuje się tam, gdzie nie trzeba,
- czy helpery z `src/lib/work-items/*` nie importują UI albo ciężkich zależności.

---

## 7. Czego nie zmieniać

- Nie usuwać funkcji.
- Nie usuwać ekranów.
- Nie zmieniać UX.
- Nie zmieniać nazw, copy, ikon ani layoutu.
- Nie kasować działających flow.
- Nie skracać logiki biznesowej tylko po to, żeby było mniej kodu.
- Nie przepinać od razu całego repo na nową bibliotekę cache.
- Nie mieszać tego etapu z visual systemem.
- Nie mieszać tego etapu z billingiem, auth, AI, Google Calendar ani PWA.

---

## 8. Proponowana kolejność po PERF-0

### PERF-1 - Pomiar i request log evidence

Dodać tymczasowy, developerski licznik requestów i dokument wyników z DevTools. Bez zmian UI.

### PERF-2 - Supabase fallback dedupe i entity invalidation

Naprawić źródło nadmiarowych fetchy w warstwie danych, jeśli pomiary to potwierdzą.

### PERF-3 - Work-items relation index

Ujednolicić indeks relacji dla TodayStable, ClientDetail i CaseDetail.

### PERF-4 - TodayStable render pass cleanup

Ograniczyć ciężkie liczenie sekcji Today bez zmiany wyglądu.

### PERF-5 - TasksStable/Calendar mutation refresh narrowing

Po drobnych mutacjach odświeżać tylko właściwy zakres.

### PERF-6 - List screens derived data normalization

Leads, Clients, Cases: stabilne pola wyszukiwania, sort keys i filtry.

### PERF-7 - Icon import and bundle audit

Dopiero po danych z builda. Bez zmian wizualnych.

---

## 9. Kryterium zakończenia PERF-0

Etap PERF-0 jest zakończony, gdy w repo istnieją:

```text
docs/perf/CLOSEFLOW_RENDER_PERFORMANCE_AUDIT_2026-05-09.md
scripts/check-closeflow-render-performance-audit.cjs
```

oraz check potwierdza, że dokument zawiera:

- zakres audytu,
- pełną listę plików do sprawdzenia,
- tematy: podwójne fetchowanie, reload całej listy, cache invalidation, ciężkie useMemo, filtrowanie/sortowanie, importy ikon,
- minimum 10 konkretnych optymalizacji,
- jasne `Nie zmieniaj`,
- kolejność kolejnych etapów PERF,
- kryterium zakończenia.

---

## 10. Komenda weryfikacji

```powershell
node scripts/check-closeflow-render-performance-audit.cjs
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

`npm.cmd run verify:closeflow:quiet` może potrwać i może wykryć inne stare problemy. PERF-0 sam dotyka tylko dokumentacji i jednego guard scriptu.
