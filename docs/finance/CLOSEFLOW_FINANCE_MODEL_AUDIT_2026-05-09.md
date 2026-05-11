# CloseFlow Finance Model Audit

Marker: `CLOSEFLOW_FINANCE_MODEL_AUDIT_FIN0`  
Data dokumentu: 2026-05-09  
Wygenerowano: 2026-05-11T04:50:46.053Z  
Etap: FIN-0 — Finance model audit  
Tryb: audyt bez migracji runtime, bez zmian DB, bez zmian UI

## Werdykt główny

FIN-0 ma status: **audyt wykonany, nie ruszać modelu finansowego w tym etapie**.

Ten dokument odpowiada, co **istnieje**, co **częściowo istnieje**, czego **brakuje** i czego **nie ruszać** przed wdrożeniem prowizji. Jeżeli odpowiedź brzmi „częściowo istnieje”, nie wolno traktować tego jako gotowego modelu produkcyjnego.

## Legenda statusów

| Status | Znaczenie |
|---|---|
| istnieje | Element jest wykryty w źródłach i wygląda na intencjonalny kontrakt. |
| częściowo istnieje | Są ślady w kodzie, UI, helperach albo migracjach, ale model nie jest domknięty end-to-end. |
| brakuje | Nie wykryto stabilnego źródła prawdy w sprawdzonych plikach. |
| nie ruszać | FIN-0 tylko dokumentuje. Zmiana wymaga osobnego etapu wdrożeniowego. |

## Podsumowanie statusów

| Status | Liczba |
|---|---:|
| istnieje | 2 |
| częściowo istnieje | 5 |
| brakuje | 0 |

## Odpowiedzi audytu

| Pytanie | Status | Odpowiedź | Dowód statyczny | Decyzja |
|---|---|---|---|---|
| Czy payments istnieje w DB/migracjach? | istnieje | Tabela albo alteracje `payments` są wykryte w migracjach Supabase. | Sprawdzono migracje: 35; payments_table_detected=tak | nie ruszać w FIN-0; tylko audyt i decyzja przed prowizjami |
| Czy payments ma lead_id, client_id, case_id, type, status, amount, currency, paid_at, due_at, note? | istnieje | Wykryte kolumny: lead_id, client_id, case_id, type, status, amount, currency, paid_at, due_at, note. Braki: brak. | Kolumny sprawdzono w bloku/alterach `payments` w migracjach. | nie ruszać w FIN-0; brakujące kolumny mają wejść dopiero w osobnym etapie migracji DB |
| Czy cases ma pola prowizji? | częściowo istnieje | W kodzie/migracjach są ślady prowizji przy sprawach, ale FIN-0 nie zakłada, że model jest produkcyjnie kompletny bez osobnej migracji i testu API. | api/cases.ts, src/pages/CaseDetail.tsx, src/lib/data-contract.ts, supabase/migrations/20260423_closeflow_v1_domain_model.sql, supabase/migrations/20260509_finance_contract_fin2.sql, supabase/migrations/20260509_lead_value_ux_fin4.sql | nie ruszać w FIN-0; prowizje projektować dopiero po domknięciu payments |
| Czy leads ma tylko dealValue, czy też prowizję? | częściowo istnieje | Leady mają ślady wartości/dealValue. Prowizja przy leadach: wykryto ślady, ale wymagają weryfikacji kontraktu. | dealValue: api/leads.ts, src/pages/Leads.tsx, src/pages/LeadDetail.tsx, src/lib/data-contract.ts, src/lib/relation-value.ts, supabase/migrations/2026-05-01_stage05_supabase_data_contract.sql; commission: api/leads.ts, src/lib/data-contract.ts, supabase/migrations/20260423_closeflow_v1_domain_model.sql, supabase/migrations/20260509_finance_contract_fin2.sql, supabase/migrations/20260509_lead_value_ux_fin4.sql | nie ruszać w FIN-0; nie dokładać prowizji do leadów bez decyzji modelowej |
| Czy clients ma tylko summary, czy własne pola wartości? | częściowo istnieje | Wykryto ślady własnych pól wartości klienta; trzeba zweryfikować, czy to źródło prawdy, czy tylko UI/helper. | summary/value: api/clients.ts, src/pages/Clients.tsx, src/pages/ClientDetail.tsx, src/lib/data-contract.ts, src/lib/relation-value.ts, supabase/migrations/2026-05-01_stage01_supabase_auth_identity.sql, supabase/migrations/2026-05-01_stage05_supabase_data_contract.sql, supabase/migrations/2026-05-01_stage12_data_contract_columns.sql, supabase/migrations/2026-05-01_stageA19v2_admin_role_schema_repair.sql, supabase/migrations/2026-05-01_stageA19_admin_role_policy.sql, ... +14; own-value: api/clients.ts, src/pages/Clients.tsx, src/lib/relation-value.ts | nie ruszać w FIN-0; klient powinien mieć jasne źródło wartości po decyzji payments/cases/leads |
| Czy UI pokazuje płatności? | częściowo istnieje | UI zawiera ślady płatności/kwot/statusów finansowych, ale FIN-0 traktuje to jako częściowy obraz, dopóki payments i semantyki finansowe nie są spięte end-to-end. | src/pages/Clients.tsx, src/pages/LeadDetail.tsx, src/pages/ClientDetail.tsx, src/pages/CaseDetail.tsx | nie ruszać w FIN-0; nie rozbudowywać UI płatności bez modelu DB/API |
| Czy helpery API są używane? | częściowo istnieje | api/payments.ts istnieje. Użycie helperów/callsite payments: wykryto ślady. | api: api/payments.ts, api/cases.ts, api/leads.ts, api/system.ts; helpers/callsites: src/lib/supabase-fallback.ts, src/lib/data-contract.ts, src/pages/Clients.tsx, src/pages/LeadDetail.tsx, src/pages/ClientDetail.tsx, src/pages/CaseDetail.tsx, api/payments.ts, api/cases.ts, api/leads.ts, api/system.ts | nie ruszać w FIN-0; helpery porządkować dopiero po decyzji modelu i kontraktu API |

## Kolumny payments wymagane przez FIN-0

| Kolumna | Status w migracjach |
|---|---|
| lead_id | istnieje |
| client_id | istnieje |
| case_id | istnieje |
| type | istnieje |
| status | istnieje |
| amount | istnieje |
| currency | istnieje |
| paid_at | istnieje |
| due_at | istnieje |
| note | istnieje |

## Pliki sprawdzone

### Pliki wymagane w etapie

- istnieje — `src/lib/relation-value.ts`
- istnieje — `src/lib/supabase-fallback.ts`
- istnieje — `src/lib/data-contract.ts`
- istnieje — `api/payments.ts`
- istnieje — `api/cases.ts`
- istnieje — `api/leads.ts`
- istnieje — `api/clients.ts`
- istnieje — `api/system.ts`
- istnieje — `src/pages/Leads.tsx`
- istnieje — `src/pages/Clients.tsx`
- istnieje — `src/pages/Cases.tsx`
- istnieje — `src/pages/LeadDetail.tsx`
- istnieje — `src/pages/ClientDetail.tsx`
- istnieje — `src/pages/CaseDetail.tsx`

### Migracje Supabase

- liczba plików w `supabase/migrations`: 35
- `supabase/migrations/2026-05-01_stage01_supabase_auth_identity.sql`
- `supabase/migrations/2026-05-01_stage05_supabase_data_contract.sql`
- `supabase/migrations/2026-05-01_stage06_client_portal_token_hardening.sql`
- `supabase/migrations/2026-05-01_stage07_billing_webhook_idempotency.sql`
- `supabase/migrations/2026-05-01_stage08_response_templates.sql`
- `supabase/migrations/2026-05-01_stage09_case_templates.sql`
- `supabase/migrations/2026-05-01_stage10_client_portal_tokens_v2.sql`
- `supabase/migrations/2026-05-01_stage11_access_statuses_trial21_free.sql`
- `supabase/migrations/2026-05-01_stage12_data_contract_columns.sql`
- `supabase/migrations/2026-05-01_stage13_billing_events_and_workspace_columns.sql`
- `supabase/migrations/2026-05-01_stageA19v2_admin_role_schema_repair.sql`
- `supabase/migrations/2026-05-01_stageA19_admin_role_policy.sql`
- `supabase/migrations/2026-05-01_stageA20_status_contract_checks.sql`
- `supabase/migrations/2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`
- `supabase/migrations/2026-05-01_stageA24_lead_to_case_service_rpc.sql`
- `supabase/migrations/20260422_support_requests.sql`
- `supabase/migrations/20260423_closeflow_v1_domain_model.sql`
- `supabase/migrations/20260423_lead_service_transition_simplification.sql`
- `supabase/migrations/20260423_profile_workspace_settings_unification.sql`
- `supabase/migrations/20260423_v1_unblock_minimal.sql`
- `supabase/migrations/20260423_work_items_bootstrap_digest_recovery.sql`
- `supabase/migrations/20260501192800_stage_a28_digest_logs_weekly_report.sql`
- `supabase/migrations/20260501194000_p0_supabase_rls_schema_confirmation.sql`
- `supabase/migrations/20260501_a26_ai_drafts_supabase.sql`
- `supabase/migrations/20260501_a27_response_templates_supabase.sql`
- `supabase/migrations/20260502_p13_app_owners.sql`
- `supabase/migrations/20260502_portal_uploads_storage_bucket.sql`
- `supabase/migrations/20260503_google_calendar_lead_parity_columns.sql`
- `supabase/migrations/20260503_google_calendar_stage10j_inbound_source_columns.sql`
- `supabase/migrations/20260503_google_calendar_stage10k_inbound_source_columns.sql`
- ... +5 kolejnych

## Sygnały pomocnicze

| Obszar | Trafienia |
|---|---|
| relation-value | src/lib/relation-value.ts |
| supabase-fallback | src/lib/supabase-fallback.ts |
| data-contract | src/lib/data-contract.ts |
| API payments | api/payments.ts istnieje |

## Nie ruszać w FIN-0

- Nie dodawać kolumn prowizji.
- Nie zmieniać migracji Supabase.
- Nie zmieniać API płatności, leadów, klientów ani spraw.
- Nie przepinać UI płatności.
- Nie zmieniać helperów relation-value ani supabase-fallback.
- Nie mieszać prowizji z dealValue bez osobnej decyzji modelowej.

## Minimalny następny krok po FIN-0

Najpierw wybrać model źródła prawdy:

1. czy `payments` jest osobną tabelą transakcji,
2. czy prowizja jest polem na `cases`, osobnym payment type, czy osobną tabelą commission,
3. czy `leads.dealValue` jest tylko szansą sprzedażową, czy kwotą rozliczeniową,
4. czy klient ma własną wartość, czy tylko summary liczone z leadów/spraw/płatności.

Dopiero po tej decyzji robić etap FIN-1.

## Kryterium zakończenia FIN-0

- Dokument istnieje.
- Każde pytanie audytu ma odpowiedź.
- Dokument zawiera statusy: istnieje / częściowo istnieje / brakuje / nie ruszać.
- Check przechodzi.
- Build przechodzi.

