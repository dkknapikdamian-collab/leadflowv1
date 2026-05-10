# CLOSEFLOW — FIN-0 — Finance model audit

**Data:** 2026-05-09  
**Repo:** `dkknapikdamian-collab/leadflowv1`  
**Branch:** `dev-rollout-freeze`  
**Status etapu:** audyt modelu finansowego bez zmian funkcjonalnych  
**Zakres:** płatności, prowizje, wartość, rozliczenie lead → sprawa → klient

---

# 1. Cel

FIN-0 ma ustalić, co faktycznie istnieje w kodzie, API, modelu danych i UI w obszarze finansów.

Ten etap **nie wdraża płatności ani prowizji**. To jest mapa prawdy przed dalszym kodowaniem.

Celem jest uniknięcie sytuacji, w której UI pokazuje „rozliczenia”, ale backend albo baza nie mają pełnego kontraktu. To byłby dokładnie ten typ długu, który później gryzie po kostkach jak miniaturowy fiskus.

---

# 2. Zakres audytu

Sprawdzone obszary:

- `src/lib/relation-value.ts`
- `src/lib/supabase-fallback.ts`
- `src/lib/data-contract.ts`
- `api/leads.ts`
- `api/clients.ts`
- `api/cases.ts`
- `api/system.ts`
- `api/payments.ts`
- `src/pages/Leads.tsx`
- `src/pages/Clients.tsx`
- `src/pages/Cases.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `supabase/migrations/*`
- `docs/*`

---

# 3. Werdykt

## Główna teza

Model finansowy w CloseFlow **częściowo istnieje**, ale nie jest jeszcze pełnym, twardym modułem finansów.

Najważniejszy problem: frontend i kontrakt danych znają `payments`, a część logiki spraw potrafi liczyć wartość / wpłaty / pozostało, ale w repo na tym etapie nie ma potwierdzonego endpointu `api/payments.ts`.

## Poziom przekonania

**8/10**

## Argument za

W kodzie są realne ślady finansów:

- wartości leadów,
- wartości spraw,
- wpłaty częściowe,
- statusy billingowe,
- model płatności,
- normalizacja rekordu płatności,
- UI finansów na sprawie,
- klient API wołający `/api/payments`.

## Argument przeciw

Nie ma jeszcze spójnej osi finansowej end-to-end. Szczególnie brakuje potwierdzonego backendowego endpointu `api/payments.ts`, a statusy finansowe są rozrzucone między `api/leads.ts`, `api/cases.ts`, `src/lib/data-contract.ts` i UI.

## Co zmieniłoby zdanie

Zielone światło na „model finansowy gotowy” dałbym dopiero po:

1. realnym endpointzie `api/payments.ts`,
2. migracji tabeli `payments`,
3. jednym centralnym kontrakcie statusów płatności i modeli rozliczeń,
4. testach create/read/update/delete płatności,
5. dowodzie, że `CaseDetail` po reloadzie pokazuje tę samą sumę: wartość / wpłacono / pozostało,
6. rozstrzygnięciu, czy prowizja to osobna encja, pole w `payments`, czy pole w `cases`.

## Najkrótszy test

1. Utwórz sprawę z `expectedRevenue = 10000 PLN`.
2. Dodaj wpłatę `2500 PLN`.
3. Odśwież `CaseDetail`.
4. Sprawdź, czy pokazuje:
   - wartość: `10000 PLN`,
   - wpłacono: `2500 PLN`,
   - pozostało: `7500 PLN`.
5. Wejdź w klienta i lead powiązany ze sprawą.
6. Sprawdź, czy nie ma sprzecznej sumy albo zera.

---

# 4. Co istnieje

## 4.1. Wyciąganie wartości z relacji

**Status:** istnieje

Plik:

- `src/lib/relation-value.ts`

Istnieje helper `getRelationValue`, który szuka wartości w wielu polach, m.in.:

- `dealValue`,
- `net_value`,
- `gross_value`,
- `expected_revenue`,
- `total_revenue`,
- `lifetime_value`,
- `client_value`,
- `deal_value`,
- `estimatedValue`,
- `projectValue`,
- `contractValue`,
- `budget`,
- `amount`,
- `price`.

Istnieje też `buildRelationValueEntries`, który składa wartości dla leadów, klientów i spraw oraz deduplikuje po relacji.

Istnieje `buildRelationFunnelValue`, który sumuje aktywną wartość lejka z leadów i klientów, ale celowo nie podbija głównej sumy sprawami.

### Ocena

To jest przydatny agregator wartości, ale nie jest pełnym modelem finansowym. To warstwa odczytu i prezentacji wartości, nie księgowość ani rozliczenia.

---

## 4.2. Kontrakt danych dla wartości leadów i spraw

**Status:** istnieje

Plik:

- `src/lib/data-contract.ts`

Dla leadów istnieje:

- `dealValue`,
- `currency`.

Dla spraw istnieje:

- `expectedRevenue`,
- `paidAmount`,
- `remainingAmount`,
- `currency`.

Istnieje też typ:

- `NormalizedPaymentRecord`

oraz funkcja:

- `normalizePaymentContract`.

### Ocena

Kontrakt danych jest mocnym zalążkiem. Brakuje jednak potwierdzenia, że każdy poziom aplikacji korzysta z niego jako jedynego źródła prawdy.

---

## 4.3. Statusy billingowe i model rozliczenia w leadach

**Status:** częściowo istnieje

Plik:

- `api/leads.ts`

W `api/leads.ts` istnieją statusy billingowe:

- `not_applicable`,
- `not_started`,
- `awaiting_payment`,
- `deposit_paid`,
- `partially_paid`,
- `fully_paid`,
- `commission_pending`,
- `commission_due`,
- `paid`,
- `refunded`,
- `written_off`.

Istnieją też modele billingowe:

- `upfront_full`,
- `deposit_then_rest`,
- `after_completion`,
- `success_fee`,
- `recurring`,
- `manual`.

Istnieje obsługa `partial_payments` oraz funkcja `sumLeadPaidPayments`, która próbuje sumować wpłacone płatności z tabeli `payments`.

Przy `start_service` lead może przenieść do sprawy:

- `expected_revenue`,
- `paid_amount`,
- `remaining_amount`,
- `billing_status`,
- `billing_model_snapshot`,
- `currency`.

### Ocena

To jest realna logika finansowa na przejściu lead → sprawa. Problem: zależy od tabeli / endpointu `payments`, którego obecność trzeba domknąć.

---

## 4.4. Finanse sprawy w API cases

**Status:** częściowo istnieje

Plik:

- `api/cases.ts`

W `api/cases.ts` istnieją pola opcjonalne:

- `billing_status`,
- `billing_model_snapshot`,
- `expected_revenue`,
- `paid_amount`,
- `remaining_amount`,
- `currency`.

Tworzenie i edycja sprawy potrafią przyjąć i zapisać te wartości.

### Ocena

Sprawa jest obecnie najbliżej realnego centrum rozliczenia. To dobry kierunek, bo po pozyskaniu temat przechodzi do sprawy i tam powinna być kontrola operacyjna oraz finansowa.

---

## 4.5. Frontendowy klient płatności

**Status:** częściowo istnieje

Plik:

- `src/lib/supabase-fallback.ts`

Istnieją typy i funkcje:

- `PaymentUpsertInput`,
- `fetchPaymentsFromSupabase`,
- `createPaymentInSupabase`,
- `updatePaymentInSupabase`,
- `deletePaymentFromSupabase`.

Te funkcje wołają:

- `GET /api/payments`,
- `POST /api/payments`,
- `PATCH /api/payments`,
- `DELETE /api/payments`.

Istnieją też mockowe płatności w dev preview.

### Ocena

Frontend jest przygotowany na płatności. Ale bez backendowego `api/payments.ts` to może być ślepa uliczka w produkcji.

---

## 4.6. UI finansów na sprawie

**Status:** częściowo istnieje

Plik:

- `src/pages/CaseDetail.tsx`

Widoczne ślady:

- import `fetchPaymentsFromSupabase`,
- import `createPaymentInSupabase`,
- typ `CasePaymentRecord`,
- `getCaseFinanceSummary`,
- `getCaseExpectedRevenue`,
- `billingStatusLabel`,
- liczenie `expected`, `paid`, `remaining`, `progress`.

### Ocena

Na sprawie istnieje realna logika prezentacyjna dla rozliczenia. To nie jest już tylko suchy tekst. Nadal wymaga potwierdzenia backendu płatności i reload persistence.

---

# 5. Co częściowo istnieje

## 5.1. Płatności jako encja

**Status:** częściowo istnieje

Istnieje:

- typ `NormalizedPaymentRecord`,
- normalizacja `normalizePaymentContract`,
- frontendowe funkcje CRUD,
- mockowe płatności,
- odczyt płatności w `CaseDetail`,
- logika sumowania płatności przy lead → sprawa.

Brakuje / do potwierdzenia:

- `api/payments.ts`,
- migracja tabeli `payments`,
- testy API płatności,
- spójne statusy płatności w jednym pliku domenowym,
- reguły walidacji kwot,
- decyzja, czy płatność może być przypięta jednocześnie do `leadId`, `caseId` i `clientId`.

---

## 5.2. Prowizje

**Status:** częściowo istnieje jako status, brakuje jako model

Istnieją statusy:

- `commission_pending`,
- `commission_due`.

Brakuje:

- `commissionAmount`,
- `commissionRate`,
- `commissionReceivedAt`,
- `commissionStatus` jako osobny stan,
- historii rozliczenia prowizji,
- UI rozróżniającego przychód klienta / wartość sprawy / prowizję użytkownika.

### Ocena

Słowo „prowizja” jest obecne, ale model prowizji nie jest wdrożony. Nie wolno jeszcze komunikować tego jako działającej funkcji.

---

## 5.3. Wartość klienta

**Status:** częściowo istnieje

Istnieją ślady wartości klienta w helperach:

- `clientValue`,
- `client_value`,
- `lifetimeValue`,
- `lifetime_value`,
- `totalRevenue`,
- `total_revenue`.

Brakuje twardego modelu w `clients` API. `api/clients.ts` nie zapisuje wprost wartości finansowych klienta poza komentarzem technicznym na końcu pliku.

### Ocena

Wartość klienta jest dziś raczej odczytywana heurystycznie niż prowadzona jako twarda encja finansowa.

---

# 6. Czego brakuje

## 6.1. Backend endpoint `api/payments.ts`

**Status:** brakuje

Na tym etapie audytu plik:

```text
api/payments.ts
```

nie jest potwierdzony jako istniejący na branchu.

To jest najważniejsza dziura, bo `src/lib/supabase-fallback.ts` już zakłada `/api/payments`.

## 6.2. Migracja tabeli `payments`

**Status:** do potwierdzenia lokalnie

Trzeba sprawdzić `supabase/migrations/*` pod kątem tabeli:

```sql
payments
```

Minimalny model powinien mieć:

- `id`,
- `workspace_id`,
- `client_id`,
- `lead_id`,
- `case_id`,
- `type`,
- `status`,
- `amount`,
- `currency`,
- `paid_at`,
- `due_at`,
- `note`,
- `created_at`,
- `updated_at`.

## 6.3. Jeden centralny model statusów finansowych

**Status:** brakuje

Dzisiaj statusy finansowe są powtarzane w API leadów i spraw. Powinny trafić do jednego pliku domenowego, np.:

```text
src/lib/finance-statuses.ts
```

albo do istniejącego `domain-statuses`, jeśli pasuje do obecnej architektury.

## 6.4. Testy CRUD płatności

**Status:** brakuje

Potrzebne testy:

- create payment,
- read payments by case,
- read payments by lead,
- update payment,
- delete payment,
- workspace isolation,
- calculation after reload.

## 6.5. Rozróżnienie wartości biznesowej i realnie pobranych pieniędzy

**Status:** częściowo istnieje, do doprecyzowania

Trzeba jasno rozdzielić:

- wartość potencjalna leada,
- wartość sprawy / umowy,
- wpłacono,
- pozostało,
- prowizja należna,
- prowizja otrzymana,
- przychód powtarzalny.

Bez tego aplikacja może mieszać „wartość klienta” z realną kasą.

---

# 7. Nie ruszać w tym etapie

FIN-0 nie może zmieniać działania aplikacji.

Nie ruszać:

- UI,
- formularzy,
- migracji Supabase,
- endpointów danych,
- statusów biznesowych,
- logiki lead → sprawa,
- billing/subskrypcji aplikacji,
- Stripe / checkout,
- Google Calendar,
- AI Drafts,
- access gates.

Ten etap ma tylko udokumentować stan i dodać guard audytu.

---

# 8. Rekomendacja kolejnego etapu

## FIN-1 — Payments backend contract

Cel: domknąć brakujący endpoint i kontrakt płatności.

Pliki do sprawdzenia:

- `api/payments.ts`
- `src/lib/data-contract.ts`
- `src/lib/supabase-fallback.ts`
- `supabase/migrations/*`
- `src/pages/CaseDetail.tsx`
- `tests/*payments*`

Zmień:

1. Dodać `api/payments.ts` z metodami:
   - `GET`,
   - `POST`,
   - `PATCH`,
   - `DELETE`.
2. Każda operacja musi być scopeowana po `workspace_id`.
3. Dodać walidację:
   - kwota >= 0,
   - currency ISO 3 znaki,
   - status z dozwolonej listy,
   - minimum jedno powiązanie: `caseId`, `leadId` albo `clientId`.
4. Dodać migrację tabeli `payments`, jeśli jej nie ma.
5. Dodać testy CRUD i workspace isolation.

Nie zmieniaj:

- wyglądu `CaseDetail`,
- logiki billing/subskrypcji CloseFlow,
- prowizji jako osobnego modelu, dopóki płatności nie są domknięte.

Kryterium zakończenia:

- `CaseDetail` po reloadzie pokazuje poprawne wpłaty z backendu,
- płatność nie przecieka między workspace,
- brak `404` na `/api/payments`.

---

# 9. Kryterium zakończenia FIN-0

FIN-0 jest zakończony, jeśli:

1. istnieje dokument:

```text
docs/finance/CLOSEFLOW_FINANCE_MODEL_AUDIT_2026-05-09.md
```

2. istnieje guard:

```text
scripts/check-closeflow-finance-model-audit.cjs
```

3. dokument jawnie mówi:

- istnieje,
- częściowo istnieje,
- brakuje,
- nie ruszać.

4. guard sprawdza, że audyt nie jest pustą notatką, tylko odnosi się do realnych plików i realnych śladów finansów.
