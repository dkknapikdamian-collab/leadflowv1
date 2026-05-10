# CloseFlow — FIN-2 Database/API finance contract

**Data:** 2026-05-09  
**Etap:** FIN-2  
**Status:** kontrakt backend/database do wdrożenia  
**Zakres:** pola finansowe sprawy + tabela `payments` + endpoint `/api/payments`  

---

## 1. Cel

FIN-2 domyka pierwszy techniczny kontrakt finansów po FIN-1.

FIN-1 zdefiniował słownik domeny:

- `CommissionMode`
- `CommissionBase`
- `CommissionStatus`
- `PaymentType`
- `PaymentStatus`
- normalizację i obliczenia

FIN-2 przenosi ten kontrakt do warstwy database/API.

---

## 2. Decyzja zakresowa

Ten etap **nie robi jeszcze panelu finansowego**.

Ten etap **nie zmienia UI**.

Ten etap **nie wdraża prowizji jako pełnego procesu biznesowego**.

Ten etap dodaje tylko twardy fundament:

1. wymagane pola finansowe na `cases`,
2. tabelę `payments`,
3. endpoint CRUD `/api/payments`,
4. normalizację po kontrakcie FIN-1,
5. zgodność `data-contract` i `supabase-fallback`.

---

## 3. Wymagane pola `cases`

Tabela `cases` musi mieć pola:

| Pole | Typ logiczny | Znaczenie |
|---|---|---|
| `contract_value` | number | wartość umowy / sprawy |
| `commission_mode` | enum | `none | percent | fixed` |
| `commission_base` | enum | `contract_value | paid_amount | custom` |
| `commission_rate` | number | procent prowizji, jeśli `percent` |
| `commission_amount` | number | wyliczona albo ręczna kwota prowizji |
| `commission_status` | enum | status prowizji |
| `paid_amount` | number | suma opłacona po stronie klienta |
| `remaining_amount` | number | pozostało do zapłaty |

Stare pole `expected_revenue` zostaje jako kompatybilność, ale nowy kontrakt powinien traktować `contract_value` jako docelową nazwę wartości sprawy.

---

## 4. Wymagane pola `payments`

Tabela `payments` musi mieć pola:

| Pole | Wymagane | Znaczenie |
|---|---:|---|
| `workspace_id` | tak | izolacja workspace |
| `lead_id` | nie | powiązanie z leadem |
| `client_id` | nie | powiązanie z klientem |
| `case_id` | nie | powiązanie ze sprawą |
| `type` | tak | `deposit | partial | final | commission | refund | other` |
| `status` | tak | `planned | due | paid | cancelled` |
| `amount` | tak | kwota |
| `currency` | tak | kod waluty, domyślnie `PLN` |
| `paid_at` | nie | data zapłaty |
| `due_at` | nie | termin płatności |
| `note` | nie | notatka operatora |

---

## 5. Pliki zmieniane przez etap

- `api/payments.ts`
- `api/cases.ts`
- `api/leads.ts`
- `src/lib/data-contract.ts`
- `src/lib/supabase-fallback.ts`
- `supabase/migrations/20260509_finance_contract_fin2.sql`
- `scripts/check-closeflow-finance-db-api-contract.cjs`

---

## 6. API `/api/payments`

Endpoint ma obsługiwać:

- `GET /api/payments`
- `GET /api/payments?id=...`
- `GET /api/payments?leadId=...`
- `GET /api/payments?clientId=...`
- `GET /api/payments?caseId=...`
- `GET /api/payments?status=...`
- `POST /api/payments`
- `PATCH /api/payments`
- `DELETE /api/payments?id=...`

Wszystkie operacje są scopowane przez `workspace_id`.

Write actions przechodzą przez `assertWorkspaceWriteAccess`.

---

## 7. Czego nie robić w FIN-2

Nie dokładać:

- osobnego panelu finansów,
- wizualnych kart rozliczeń,
- automatycznego księgowania,
- integracji płatności Stripe / przelewów,
- faktur,
- panelu prowizji handlowca,
- zaawansowanego raportowania finansowego.

To ma wejść później jako osobne etapy.

---

## 8. Kryterium zakończenia

FIN-2 jest zakończony, gdy:

1. istnieje migracja z polami finansowymi sprawy,
2. istnieje tabela `payments`,
3. istnieje `/api/payments`,
4. frontend helpery w `supabase-fallback.ts` mają realny endpoint,
5. `data-contract.ts` normalizuje płatności po FIN-1,
6. `cases` zapisują wymagane pola finansowe,
7. guard `scripts/check-closeflow-finance-db-api-contract.cjs` przechodzi.

---

## 9. Następny etap

Następny logiczny etap:

## FIN-3 — Finance UI read-only surface

Cel: pokazać w `CaseDetail` czytelne podsumowanie finansów na podstawie `contract_value`, `paid_amount`, `remaining_amount`, `commission_amount`, `commission_status` i `payments`, bez jeszcze rozbudowanego procesu księgowego.
