# STAGE231L_STAGE_QUEUE_CANONICAL_SYNC

Date: 2026-06-14 20:05 Europe/Warsaw
Status: PASS / DOCS_ONLY / CENTRAL_QUEUE_UPDATED
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Cel

Uregulować rozrzucone decyzje etapowe i przenieść aktywną kolejkę do jednego centralnego pliku:

- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`

Run reporty i payloady Obsidiana zostają jako szczegóły, dowody skanu, testy i historia, ale nie są już samodzielnym źródłem kolejności etapów.

## Scan-first

Przeczytano:

- `AGENTS.md`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- aktualne run decisions / payloady z ostatnich etapów omawianych w rozmowie

## Decyzja

Od tego etapu aktywna kolejka jest w jednym miejscu. Nowy etap może mieć run report i Obsidian payload, ale musi też trafić do `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` jako ID, status i miejsce w kolejce.

## Uregulowana kolejka

Aktualnie centralny plik wskazuje kolejność:

1. `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`
2. `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`
3. `STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT`
4. `STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT`
5. `STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION`
6. `STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS`
7. `STAGE231K3_OWNER_DIGEST_EMAILS_DAILY_AND_WEEKLY`
8. `STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING`
9. `CODEX-AUTO-CONTEXT-001`

## Zakres zmian

Zmieniono tylko dokumentację / pamięć projektu.

Nie ruszano:

- runtime aplikacji,
- SQL,
- Supabase,
- Google Calendar,
- billing/trial,
- AI Drafts runtime,
- UI.

## Testy

Automatyczne testy runtime: SKIP — docs-only stage.

Weryfikacja wykonana:

- centralny plik etapów został podmieniony na uporządkowaną wersję aktywnej kolejki,
- plik zachowuje backlog produktowy i techniczny,
- najbliższy etap jest jasno wskazany jako `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`.

## Ryzyka

- Stare run reporty i payloady nadal istnieją, ale nie mogą być traktowane jako kolejka etapów.
- Jeśli developer dopisze przyszły etap tylko do `_project/runs` albo `_project/obsidian_updates`, etap może znowu zginąć; guard organizacyjny powinien to blokować w przyszłości.

## Następny krok

Wdrożyć:

`STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`
