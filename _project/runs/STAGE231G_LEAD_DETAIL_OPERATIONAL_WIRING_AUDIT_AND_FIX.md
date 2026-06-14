# STAGE231G_LEAD_DETAIL_OPERATIONAL_WIRING_AUDIT_AND_FIX

Data: 2026-06-14 10:05 Europe/Warsaw
Status: DO_WDROZENIA_LOKALNIE_R2
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan

Repo files read:
- AGENTS.md
- src/pages/LeadDetail.tsx
- src/pages/Leads.tsx
- src/styles/visual-stage14-lead-detail-vnext.css
- _project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md
- _project/04_ETAPY_ROZWOJU_APLIKACJI.md
- _project/06_GUARDS_AND_TESTS.md

Obsidian/project-memory files read:
- brak bezpośredniego dostępu do lokalnego vaultu; payload przygotowany w _project/obsidian_updates.

## Audyt przed etapem

FAKT: LeadDetail czyta potencjał z dealValue/deal_value/expectedRevenue/expected_revenue/value i zapisuje dealValue przez updateLeadInSupabase.
FAKT: formularz tworzenia leada już posiadał pole dealValue, ale etykieta "Wartość" była za mało jednoznaczna względem kafelka "Potencjał".
FAKT: karta Potencjał była display-only bez jednoznacznego CTA.
FAKT: wiersze działań mieszały treść, status i akcje w jednym ciasnym układzie.
FAKT: overflow używał group.key poza mapą grup.

## Zmiany

- LeadDetail: CTA dla potencjału, następnego kroku, ryzyka i blokady.
- LeadDetail: akcja Edytuj potencjał w panelu finansów.
- LeadDetail: ref/focus na polu Potencjał / wartość w dialogu Edytuj leada.
- LeadDetail: layout work-row split: content/status/actions.
- Leads: pole tworzenia leada oznaczone jako Potencjał / wartość i marker guardu.
- Guard/test: STAGE231G.

## Testy do uruchomienia

- npm run build
- npm run typecheck
- node scripts/check-stage231g-lead-detail-operational-wiring.cjs
- node --test tests/stage231g-lead-detail-operational-wiring.test.cjs
- git diff --check

## Audyt po etapie

Ryzyka:
- Edycja potencjału korzysta z istniejącego dialogu Edytuj leada. To celowy kompromis, żeby nie tworzyć drugiego źródła zapisu dealValue.
- Zmiana layoutu work-row może wpływać na wszystkie trzy sekcje działań leada. Właśnie dlatego guard sprawdza wspólne klasy content/status/actions.
- Pole Potencjał / wartość w tworzeniu leada zapisuje dealValue; nie dotyka płatności.

Czego nie ruszano:
- SQL
- Google Calendar
- billing/trial
- CaseDetail
- ClientDetail
- AI Drafts
