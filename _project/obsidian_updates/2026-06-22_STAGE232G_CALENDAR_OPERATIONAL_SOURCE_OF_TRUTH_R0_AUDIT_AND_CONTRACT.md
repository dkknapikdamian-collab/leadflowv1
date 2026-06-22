# 2026-06-22_STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT

Data i godzina: 2026-06-22 Europe/Warsaw  
Etap: STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT  
Canonical name: CloseFlow / LeadFlow  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App  
Status: DOCS_ONLY_CORRECTION / AUDIT_TEMPLATE / DO_SPRAWDZENIA_PRZEZ_DAMIANA  

## Co robimy

Robimy poprawkę briefu przed właściwym audytem kalendarza.

Kalendarz ma być sprawdzony jako operacyjne źródło prawdy dla:
- zadań,
- wydarzeń,
- przesuwania terminów,
- statusu Zrobione/Przywróć,
- powiązań z leadem/sprawą/klientem,
- zgodności z Today.

## Korekta względem wcześniejszej instrukcji

Nie zakładamy, że I3/K są zamknięte, dopóki nie potwierdzą tego centralne pliki.

R0 dostaje obowiązkowe sekcje:
- STATUS_PRECONDITION,
- LEAD_SHADOW_ENTRY_STATUS,
- TODAY_CALENDAR_PARITY_STATUS,
- ACTION_FIELD_MATRIX,
- LEGACY_AND_ACTIVE_DOM_NORMALIZERS_FOUND,
- GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS,
- R1_DECISION_GATE.

## Czego nie ruszać

- Calendar runtime,
- Today runtime,
- Lead/Case/Client runtime,
- SQL,
- finanse,
- Braki/Blokady,
- Owner Control runtime,
- Google Calendar OAuth/sync produkcyjny.

## Testy

```powershell
node scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs
node --test tests/stage232g-calendar-operational-source-truth-r0-audit.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

## Ryzyka

- routery mogą być stale i wskazywać stare etapy;
- Calendar ma lead shadow entries, więc model events/tasks-only jest niepełny;
- Today ma własną logikę dat, więc parity jest hipotezą;
- aktywne DOM normalizatory mogą ukrywać realny stan UI;
- Google background sync może zmieniać dane po pierwszym renderze.

## Zapis do Obsidiana

save status: payload przygotowany w repo, nie zsynchronizowany z lokalnym Obsidianem  
Obsidian GitHub sync: do wykonania po akceptacji  
Obsidian local sync: LOCAL_SYNC_PENDING  

PowerShell po przyszłym pushu Obsidiana:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT"
git status --short --branch
git pull --ff-only origin main
git status --short --branch
```


## STAGE232G_R0_R1_PHRASE_HOTFIX

R1 runtime fix dopiero po peĹ‚nym R0, status-precheck i decyzji Damiana; R0 pozostaje docs-only bez runtime.

<!-- STAGE232G_R0_CF_RUNTIME_ALLOWLIST_HOTFIX_2026_06_22 -->
## 2026-06-22 Europe/Warsaw - CF_RUNTIME_00 allowlist hotfix for STAGE232G_R0

Status: DOCS_GUARD_SCOPE_FIX / RUNTIME_NOT_TOUCHED

Powod:
- 
pm run verify:closeflow:quiet odpala scripts/check-cf-runtime-00-source-truth.cjs;
- CF_RUNTIME_00 ma wlasna allowliste zmienionych plikow;
- nowe pliki R0 byly poprawne, ale nie byly jeszcze dopuszczone przez CF_RUNTIME_00 scope guard.

Dopuszczone pliki R0:
- _project/runs/STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md
- _project/obsidian_updates/2026-06-22_STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md
- scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs
- 	ests/stage232g-calendar-operational-source-truth-r0-audit.test.cjs

Zakaz:
- runtime Calendar/Today/Lead/Case/Client nadal nie moze byc zmieniany w R0.
- R1 runtime fix dopiero po pelnym R0, status-precheck i decyzji Damiana.

<!-- /STAGE232G_R0_CF_RUNTIME_ALLOWLIST_HOTFIX_2026_06_22 -->
