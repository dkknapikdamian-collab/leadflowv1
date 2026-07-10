# LF-PROD-SOT-G2 — Lists/Cards Status/Date SOT Map and Contract

DATA_I_CZAS: 2026-07-10 16:11 Europe/Warsaw
STAGE: LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT
G2_FINAL_STATUS: PASS_MAP_AND_CONTRACT

R28_PREREQUISITE: PASS_WITH_ALLOWED_LOCAL_EXCEPTIONS
G1_R1_PREREQUISITE: PASS_AFTER_R28_REVERIFY
RUNTIME_CHANGED: NO
SRC_CHANGED: NO
UI_CSS_CHANGED: NO
SQL_API_SUPABASE_CHANGED: NO
TASK_GROUPING_CHANGED: NO

G2_FIRST_SAFE_CANDIDATE: src/pages/TodayStable.tsx :: RowLink :: data-cf-status-tone={badgeTone || semanticBadgeTone(badge)}
G3_CREATED: NO
NEXT_STAGE_SELECTED: LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP

LEADS_CALLSITE_COUNT: 9
CASES_CALLSITE_COUNT: 9
TASKSSTABLE_CALLSITE_COUNT: 8
TODAYSTABLE_CALLSITE_COUNT: 13
TOTAL_CALLSITE_COUNT: 39

VERIFY_R28: PASS
VERIFY_G2: PASS
BUILD: PASS
GIT_DIFF_CHECK_APP: PASS
GIT_DIFF_CHECK_OBSIDIAN: PASS

## Wynik mapowania

Zmapowano realne callsite’y statusów, labeli, tonów, badge’y i dat na:
- Leads,
- Cases,
- TasksStable,
- TodayStable.

Jawnie rozdzielono:
- LEAD_STATUS_DOMAIN,
- CASE_STATUS_DOMAIN,
- TASK_DISPLAY_STATUS_DOMAIN,
- TASK_GROUPING_DOMAIN,
- OPERATIONAL_BADGE_DOMAIN,
- GENERIC_VISUAL_TONE_DOMAIN,
- DATE_TIME_DOMAIN.

## Decyzja

Pierwszym bezpiecznym kandydatem mapowym jest readonly fallback tonu badge’a w `TodayStable.RowLink`.

Kandydat nie został wdrożony.
Nie zmieniono runtime, src, UI, CSS, SQL, API ani Supabase.
Nie zmieniono lokalnych wyjątków groupingowych R28.
Nie utworzono G3.

## Findings

- FINDING_G2_001: Cases form hard-codes case status options.
- FINDING_G2_002: Cases row has a local closed-tone override.
- FINDING_G2_003: TodayStable.semanticBadgeTone is a local label-driven tone map.
- FINDING_G2_004: Leads.buildNextActionMeta locally parses/formats date and appends raw action status.
- FINDING_G2_005: Leads cadence/rescue tones are locally duplicated.
- FINDING_G2_006: TasksStable date formatting remains local; R28 grouping exceptions stay untouched.
- FINDING_G2_007: ASCII/mojibake-style copy remains outside G2.
- FINDING_G2_008: today-work-item-status internals were not read because that file was outside the explicit G2 input allowlist.
- FINDING_G2_009: shared StatusPill exists, but some list screens still render raw span.cf-status-pill.

## Files etapu

App:
- `package.json`
- `scripts/guards/verify-lf-prod-sot-g2-lists-cards-status-date-map-contract.cjs`
- `tests/lf-prod-sot-g2-lists-cards-status-date-map-contract.test.cjs`
- `_project/runs/LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT.md`

Obsidian:
- `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G2_LISTS_CARDS_STATUS_DATE_SOT_MAP_AND_CONTRACT_MAP.md`
- `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md`

## G2-R1 — UTF-8 human text repair

G2_R1_STATUS: PASS_UTF8_REPAIR_AND_GUARD
G2_R1_REPAIR_AT: 2026-07-10 16:22 Europe/Warsaw
MOJIBAKE_REMOVED: YES
G2_R1_GUARD_ADDED: YES
RUNTIME_CHANGED_IN_G2_R1: NO
SRC_CHANGED_IN_G2_R1: NO
G3_CREATED_IN_G2_R1: NO

Naprawiono wyłącznie tekst dokumentacji i dodano osobny guard kodowania. Macierz callsite’ów, decyzja G2 i zakres runtime pozostały bez zmian.
