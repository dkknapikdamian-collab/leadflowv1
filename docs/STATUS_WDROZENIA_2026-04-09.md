# Status wdrożenia (dev-rollout-freeze) — 2026-04-09

Ten dokument odpowiada na pytanie: **co jest już wdrożone** vs **co jest jeszcze do domknięcia** w etapach ETAP 0–16.

## Stan gałęzi

- Gałąź robocza/wdrożeniowa: `dev-rollout-freeze`
- HEAD na dziś: ETAP 15 (security hardening) + wcześniejsze etapy do ETAP 14 w historii commitów
- Testy: `cmd /c "npm test"` — PASS
- Build: `cmd /c "npm run build"` — PASS

## ETAP 0 — dokumentacja i jedna prawda produktu

**Status: DONE**

Jedna definicja produktu jest spójna w dokumentach:
- produkt to **jeden system do domykania i uruchamiania klienta**
- **Sprzedaż = Lead Flow**
- po **won** albo **ready to start** lead może przejść do **sprawy operacyjnej**
- **Forteca nie jest osobną aplikacją**
- **Sprawy są modułem tego samego systemu**
- finalne menu operatora: `Dziś`, `Leady`, `Sprawy`, `Zadania`, `Kalendarz`, `Aktywność`, `Rozliczenia`, `Ustawienia` (później: `Szablony`, `Klienci`)
- kierunek UI: nowa skórka oparta o przesłany kierunek **Forteca**

Source of truth: `product-scope-v2.md`.

## ETAP 1 — visual system lock nowej skórki

**Status: DONE / USTABILIZOWANE**

Szkielet i wspólny shell istnieją, a widoki są spójne stylistycznie (jeden system kart/list/shell):
- shell + sidebar: `components/dashboard-shell.tsx`
- wspólny wrapper: `components/layout/page-shell.tsx`
- style globalne: `app/globals.css` (+ override’y skórki w `app/clientpilot-overrides.css`)

## ETAP 2 — rdzeń Lead Flow w nowej skórce

**Status: DONE**

Główne powierzchnie Lead Flow działają w nowej skórce:
- `Today`: `components/today-page-view.tsx`
- `Leads` + `LeadDetail`: `components/views.tsx`, `components/lead-pipeline-page-view.tsx`
- `Tasks`: `app/tasks`, logika wspólnych wpisów `WorkItem` w `lib/*`
- `Calendar`: `app/calendar`

## ETAP 3 — wspólny model danych: Lead → Case

**Status: DONE**

Most lead → case + tabele i relacje są wdrożone:
- migracja: `supabase/011_lead_case_bridge.sql`
- typy domenowe: `lib/types.ts` (m.in. `Lead.caseId`, `Case.sourceLeadId`)
- dokument modelu danych: `docs/data-model-lead-case-v2.md`

## ETAP 4 — statusy sprzedażowe i operacyjne jako 2 warstwy

**Status: DONE**

- status sprzedażowy leada: `LeadStatus` w `lib/types.ts`
- status operacyjny sprawy: `CaseStatus` w `lib/types.ts`
- statusy checklisty / próśb / akceptacji: `CaseItemStatus`, `ApprovalStatus` w `lib/types.ts`

## ETAP 5 — sekcja „Start realizacji” w Lead Detail

**Status: DONE**

Sekcja istnieje i ma CTA tworzenia sprawy w 3 trybach:
- UI: `components/views.tsx` (sekcja „Start realizacji” + akcje)
- akcje: `startCaseFromLead(...)` + opcjonalne linkowanie klienta

## ETAP 6 — moduł Spraw: lista + dashboard

**Status: DONE**

- widok i dashboard: `components/cases-page-view.tsx`
- KPI: „Sprawy aktywne / Czeka na klienta / Zablokowane / Gotowe do startu”
- filtry i karty spraw (kompletność, brakujące elementy, termin, aktywność)

## ETAP 7 — Case detail: checklista, blokery, oś czasu, quick actions

**Status: DONE**

Case detail jest dostępny jako panel/drawer i zawiera:
- checklistę elementów
- „Ostatnie aktywności”
- „Blokery”
- panel szybkich akcji (reminder, link klienta, zmiana statusu, notatka)

Implementacja: `components/cases-page-view.tsx`.

## ETAP 8 — szablony checklist i tworzenie sprawy z szablonu

**Status: DONE**

- widok szablonów: `components/templates-page-view.tsx` + `app/templates`
- tworzenie sprawy (pusta / z szablonu / z szablonu + link): `components/case-create-modal.tsx`
- seed bazowych szablonów: `lib/seed.ts`

## ETAP 9 — publiczny panel klienta

**Status: DONE**

- UI portalu: `components/client-portal-view.tsx` + `app/portal/[token]`
- backend: `app/api/client-portal/[token]/route.ts`
- dostęp: token + wygasanie + revoke (po stronie danych)

## ETAP 10 — uploady, decyzje, akceptacje, weryfikacja

**Status: DONE / MINIMUM WORKFLOW**

Workflow jest wdrożony w modelu danych i w portalu:
- tabele: `file_attachments`, `approvals` (migracja `supabase/011_lead_case_bridge.sql`)
- signed access (kontrolowany odczyt): `app/api/client-portal/[token]/attachments/[attachmentId]`
- akcje portalu + walidacje i rate limit: `app/api/client-portal/[token]/route.ts`

## ETAP 11 — automatyzacje Lead → Case → Blocker → Ready

**Status: DONE**

- automatyzacje domenowe + zadania ownera: `lib/domain/*`, `lib/data/actions.ts`
- testy automatyzacji: `tests/case-automation.test.ts`

## ETAP 12 — połączyć Today z Leadami i Sprawami

**Status: DONE**

- Today jako command center (liczniki + sekcje sprzedaż/operacje/execution): `components/today-page-view.tsx`
- testy Today: `tests/*` (m.in. sekcje, liczniki, sortowanie)

## ETAP 13 — powiadomienia i przypomnienia dla nowych modułów

**Status: DONE**

- planner powiadomień: `lib/*` + testy (workflow planner)
- wysyłka: `app/api/system/workflow-notifications/route.ts`

## ETAP 14 — billing, access i nowe moduły

**Status: DONE**

- centralny model dostępu i blokady pracy po trialu: `lib/*` + testy access policy
- UI statusu konta/billing: `components/account-status-panel.tsx`, `app/billing`

## ETAP 15 — security, storage, tokens, RLS, audit

**Status: DONE**

- migracja hardening: `supabase/012_security_storage_portal_hardening.sql`
- rate limiting portalu + neutralne odpowiedzi: `app/api/client-portal/[token]/route.ts`
- audit/aktywności: `activity_log` + eventy domenowe

## ETAP 16 — full QA, mobile pass, consistency pass

**Status: TODO (manual pass) + smoke automatyczny dostępny**

Automatyczne minimum jest zaliczone:
- testy jednostkowe/behawioralne w repo przechodzą: `npm test`
- build produkcyjny przechodzi: `npm run build`

Do domknięcia pozostaje **manualny** pakiet ETAP 16 (bez dodawania nowych funkcji):
0. Smoke prod w jednym kroku: `cmd /c "npm run smoke:prod:build"` (raport statusów route’ów)
1. `cmd /c "npm run start"` i smoke test w trybie produkcyjnym: Today/Leads/Tasks/Calendar/Cases/Templates/Billing/Settings/Portal.
2. Mobile pass: sidebar, karty, formularze, portal klienta, upload/akcje, date pickery, status badge, hit targety.
3. Consistency pass: nazewnictwo, badge’y, empty/loading/error states, komunikaty błędów, CTA.
4. Security pass (RLS/portal): user A nie widzi danych usera B; token revoke działa; brak publicznego dostępu do plików bez podpisu.

Do udokumentowania wyniku użyj: `docs/ETAP16_RAPORT_TEMPLATE.md`.
