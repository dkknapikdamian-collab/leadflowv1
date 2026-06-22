# 2026-06-22_CHATGPT_VS_CODEX_READ_SCOPE_POLICY_SYNC

Data: 2026-06-22 Europe/Warsaw
Status: APPLIED_TO_REPO / LOCAL_SYNC_PENDING
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja

Dopisano regule rozdzielenia zakresu czytania:

- ChatGPT / czat audytowy Damiana moze czytac szeroko repo, _project i Obsidian przy audycie, weryfikacji etapu, sprawdzaniu kolejki, driftu, cleanupie, mapowaniu zaleznosci i broad scan.
- Cloud Codex / AI developer / agenci wykonawczy nie maja czytac wszystkiego automatycznie. Startuja od routera, AGENTS.md, _project/00_AI_START_SPIS_TRESCI.md, centralnych plikow wymaganych dla etapu oraz konkretnych plikow runtime/guard/test.

## Pliki zmienione

- _project/04_CHATGPT_VS_CODEX_READ_SCOPE_POLICY_SYNC_2026_06_22.md
- 10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md

## Zakres

Docs/policy only.

Nie ruszano:

- runtime,
- SQL/RLS,
- finanse,
- Braki/Blokady,
- Owner Control,
- Calendar runtime,
- Google Calendar integracji.

## Local sync

Po pobraniu zmian lokalnie:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
git status --short --branch
git pull --ff-only origin dev-rollout-freeze
git status --short --branch
```

Jesli ten payload ma byc przeniesiony do osobnego lokalnego vaulta Obsidian, wykonac tez sync vaulta zgodnie z globalna instrukcja.
