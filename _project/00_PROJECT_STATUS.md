# 00_PROJECT_STATUS - CloseFlow / LeadFlow

Status: projekt kodowo-biznesowy w trybie ciaglosci.

Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Lokalna sciezka: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Teza
CloseFlow ma codziennie pokazywac komu odpisac, co ruszyc, czego nie przegapic i ktore leady moga uciec.

## Wymaganie operacyjne
Po kazdym etapie aktualizuj _project, Obsidiana, test history, implementation ledger i run report.

<!-- STAGE228R2_ADMIN_FEEDBACK_RAIL_CLEANUP_STATUS -->
## 2026-06-08 08:58 Europe/Warsaw - Stage228R2 admin feedback rail cleanup

STATUS: LOCAL ONLY, build PASS, test reczny DO WYKONANIA.

FAKT:
- Wdrozono waski cleanup po `closeflow_admin_feedback_2026-06-08_08-43.json`.
- Zakres dotyczy copy/kafelkow prawego raila oraz separatora w `/funnel`.
- Lokalny browser smoke zatrzymal sie na `Ladowanie widoku...`, wiec nie zapisano pelnego sukcesu wizualnego.
<!-- /STAGE228R2_ADMIN_FEEDBACK_RAIL_CLEANUP_STATUS -->

## 2026-06-08 21:05 Europe/Warsaw - STAGE228R14_C5_STATUS_LOCAL_ONLY

FAKT:
- Brak C1-C5 jest domykany lokalnie bez SQL.
- Ostatni push przed local-only batch: Stage228R12R2.
- Stage228R13/R13R2/R14 pozostaja lokalnie do manualnego PASS C5.

STATUS:
- LOCAL_ONLY_UNTIL_MANUAL_C5_PASS.

<!-- STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->
## 2026-06-08 20:45 Europe/Warsaw - Stage228R17 missing_item delete contract

STATUS: LOCAL_ONLY_APPLIED_BY_ZIP, test reczny DO WYKONANIA.

FAKTY:
- Objaw: klikniecie Usuń przy Braku usuwa wpis optymistycznie, ale po refetchu/odswiezeniu wpis wraca.
- Przyczyna naprawiana: niespojny kontrakt soft-delete missing_item/task oraz ryzyko ustawiania usuwanego taska jako lead.next_action_item_id.
- LeadDetail usuwa Brak natychmiast z lokalnego stanu, wykonuje backendowy soft-delete i robi silent refresh bez pelnego loadera.
- Task route nie promuje missing_item ani zamknietych/usunietych taskow do lead next action; deleted/done task czysci matching next_action_item_id.

TESTY/GUARDY:
- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

TEST RECZNY:
- Lead -> dodaj Brak -> odswiez -> Brak widoczny -> Usuń -> znika od razu -> odczekaj -> hard refresh -> Brak nie wraca.
- Sprawdzic, ze Następny krok nie pokazuje usunietego Braku.

RYZYKA:
- Jesli baza ma stare rekordy missing_item juz podpiete jako next_action, delete czysci tylko matching next_action_item_id.
- Nie wykonano twardego DELETE, zgodnie z obecnym kierunkiem soft-delete.
- Nie ruszano ukladu UI ani styli kafelkow.

NASTEPNY KROK:
- Po PASS recznym wykonac selektywny commit/push repo i osobny commit/push vaultu Obsidian.
<!-- /STAGE228R17_MISSING_ITEM_DELETE_CONTRACT -->
