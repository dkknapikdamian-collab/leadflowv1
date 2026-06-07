# Stage227E2 — Lead Detail Top Cards Polish

Data: 2026-06-06 15:20 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Branch: dev-rollout-freeze
Typ: etap runtime UI o niskim zakresie + guard

## Cel

Naprawić trzy górne kafelki LeadDetail tak, żeby pokazywały decyzję operacyjną, a nie dekorację.

## Zakres wdrożony przez etap

1. Usuwa/zastępuje dekoracyjny kafelek `Aktywny lead`.
2. Zostawia kafelek `Następny krok`, ale skraca nazwę z `Najbliższa zaplanowana akcja` do operacyjnego nagłówka.
3. Zmienia `Wartość` na `Potencjał`.
4. Dodaje kafelek `Cisza / ryzyko`.
5. Wydziela osobne źródło danych ciszy kontaktu: `getLeadContactSilenceDatesStage227E2` i `getLeadSilenceRiskStage227E2`.
6. Zabrania używania `updatedAt` / `updated_at` jako źródła ciszy kontaktu, bo edycja rekordu nie może zerować ciszy.
7. Dopina mapowanie kafelków przez atrybuty:
   - `data-stage227e2-card="next-step"`
   - `data-stage227e2-card="potential"`
   - `data-stage227e2-card="silence-risk"`

## Mapa aplikacji / źródeł danych

### Kafelek 1: Następny krok

Źródło:

- `nextTimelineEntry`
- `nearestPlannedAction`
- `timeline`
- `linkedTasks`
- `linkedEvents`

Cel decyzyjny:

- pokazać, czy lead ma konkretny następny ruch,
- jeśli nie ma ruchu, pokazać pusty stan operacyjny, nie dekorację.

### Kafelek 2: Potencjał

Źródło:

- `leadFinance.formatted`
- `sourceLabel(lead.source)`
- `statusLabel(lead.status)`

Cel decyzyjny:

- pokazać wartość sprzedażową jako potencjał, nie księgowość,
- zachować prosty kontekst: źródło + status.

### Kafelek 3: Cisza / ryzyko

Źródło:

- `lead.lastContactAt`
- `lead.last_contact_at`
- `lead.contactedAt`
- `lead.contacted_at`
- `lead.firstContactAt`
- `lead.first_contact_at`
- `activity.happenedAt`
- `activity.createdAt`
- `activity.payload.happenedAt`
- `activity.payload.createdAt`
- fallback: `lead.createdAt` / `lead.created_at`, jeśli nie ma innych danych.

Zakaz:

- `lead.updatedAt`
- `lead.updated_at`
- `activity.updatedAt`
- `activity.updated_at`

Powód:

`updatedAt` zmienia się przy zwykłej edycji rekordu. Gdyby liczyć z niego ciszę, użytkownik mógłby poprawić literówkę i aplikacja błędnie uznałaby, że kontakt jest świeży.

## Kryterium akceptacji

W trzech kafelkach widać decyzję:

1. co robić dalej,
2. jaki temat ma potencjał,
3. czy cisza albo brak kroku robi ryzyko.

Nie ma kafelka `Aktywny lead` i nie ma licznika działań jako dekoracyjnego KPI.

## Guard

`npm run check:stage227e2-lead-detail-top-cards-polish`

Sprawdza:

- obecność trzech kafelków decyzyjnych,
- brak `Aktywny lead`,
- brak `Wartość` w top grid,
- brak licznika `sortedLinkedTasks.length + sortedLinkedEvents.length`,
- brak `updatedAt` / `updated_at` w helperze ciszy kontaktu,
- brak `updatedAt` / `updated_at` w źródłach `leadWorkCenter` liczących ruch.

## Test

`npm run test:stage227e2-lead-detail-top-cards-polish`

## Ryzyka po etapie

1. Kafelek `Cisza / ryzyko` nadal zależy od jakości danych kontaktu i aktywności. Jeżeli stare dane nie mają `lastContactAt` ani aktywności, fallback do `createdAt` pokaże czas od dodania leada, nie stuprocentową datę kontaktu.
2. Etap nie dodaje nowych kolumn w bazie. Prawdziwie mocny model ciszy może później wymagać osobnego, konsekwentnie aktualizowanego `lastContactAt`.
3. Jeżeli inne moduły nadal traktują `updatedAt` jako ruch, E2 naprawia LeadDetail, ale nie całą aplikację.
4. Kafelek nie powinien dostać nowych kolorów. Używa istniejących tonów `lead-detail-callout-*` i `statusClass`.

## Czego etap nie rusza

- Supabase schema / SQL,
- CaseDetail,
- model tasków i eventów,
- pełna przebudowa LeadDetail,
- szybkie akcje / action center poza top kafelkami,
- push do GitHuba.
