# STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT

Data: 2026-06-22 Europe/Warsaw  
Status: BRIEF_CORRECTED / AUDIT_TEMPLATE / DO_WYPELNIENIA_PRZEZ_WYKONAWCE  
Canonical name: CloseFlow / LeadFlow  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App  

## PROSTO

Robimy audyt kalendarza jako operacyjnego źródła prawdy, nie naprawę runtime.

Sprawdzamy, czy `/calendar`, Today, LeadDetail, CaseDetail i ClientDetail patrzą na te same terminy zadań/wydarzeń, czy każdy ekran ma własną prawdę.

## STATUS_PRECONDITION

Status: DO_WYPELNIENIA

Wykonawca musi sprawdzić przed audytem:

- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `_project/CODEX_CONTEXT_INDEX.md`
- run reporty I3/K
- Obsidian 04 dla CloseFlow

Wynik:

```txt
STAGE232I3: DO_POTWIERDZENIA
STAGE232K: DO_POTWIERDZENIA
00_START: DO_POTWIERDZENIA
_project/04: DO_POTWIERDZENIA
Obsidian 04: DO_POTWIERDZENIA
STATUS_PRECONDITION_RESULT: DO_POTWIERDZENIA
```

Nie wolno pisać `CLOSED`, jeśli centralne pliki tego nie potwierdzają.

## ACTIVE_ROUTE_MAP

Status: DO_WYPELNIENIA

Wymagane:

- aktywna trasa `/calendar`,
- plik aktywnego ekranu,
- czy istnieje legacy Calendar,
- czy route ładuje aktualny komponent.

## CALENDAR_RENDER_FILES_MAP

Status: DO_WYPELNIENIA

Wymagane minimum:

- `src/pages/Calendar.tsx`
- CSS aktywnie importowane przez Calendar
- komponenty kart/wpisów kalendarza
- helpery renderu month/week/day/selected-day

## CALENDAR_DATA_MODEL_MAP

Status: DO_WYPELNIENIA

Sprawdzić dane:

- events
- tasks
- leads
- cases
- clients
- operator-today catch-up / derived entries
- source id / relation id / title / date / time / status

Ważne: nie zakładać, że kalendarz ma tylko events/tasks. Sprawdzić wpisy pochodne z leadów.

## LEAD_SHADOW_ENTRY_STATUS

Status: DO_WYPELNIENIA

Sprawdzić:

- czy `lead` jest nadal typem `ScheduleEntry`,
- czy lead entry jest pochodną `nextActionAt/followUpAt`,
- czy dubluje task,
- kiedy działa `removeLeadShadowEntries`,
- czy Today pokazuje to tak samo jak Calendar,
- czy lead shadow ma być utrzymany w R1, czy wygaszany.

Wynik:

```txt
LEAD_SHADOW_ENTRY_STATUS: PASS / PARTIAL / BROKEN / DO_POTWIERDZENIA
```

## TODAY_CALENDAR_PARITY_STATUS

Status: DO_WYPELNIENIA

Sprawdzić:

- czy Today i Calendar używają tych samych pól daty,
- czy Today ma własne selektory zamiast `combineScheduleEntries`,
- czy po przesunięciu w Calendar Today widzi zmianę,
- czy po przesunięciu w Today Calendar widzi zmianę,
- czy `+1D/+3D/+1W` w Today jest zgodne z `+1H/+1D/+1W` w Calendar,
- czy lead shadow / task nie dublują się między ekranami.

Wynik:

```txt
TODAY_CALENDAR_PARITY_STATUS: PASS / PARTIAL / BROKEN / DO_POTWIERDZENIA
```

## ACTION_FIELD_MATRIX

Status: DO_WYPELNIENIA

Dla każdej akcji wypełnić macierz:

| Akcja | Typ | Rekord źródłowy | scheduledAt | dueAt | date | time | leadId | caseId | clientId | Po F5 Calendar | Po F5 Today | Ryzyko |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Edytuj | DO_WYPELNIENIA | DO_WYPELNIENIA | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| +1H | DO_WYPELNIENIA | DO_WYPELNIENIA | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| +1D | DO_WYPELNIENIA | DO_WYPELNIENIA | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| +1W | DO_WYPELNIENIA | DO_WYPELNIENIA | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| Zrobione | DO_WYPELNIENIA | DO_WYPELNIENIA | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| Przywróć | DO_WYPELNIENIA | DO_WYPELNIENIA | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |
| Usuń | DO_WYPELNIENIA | DO_WYPELNIENIA | ? | ? | ? | ? | ? | ? | ? | ? | ? | ? |

## SELECTED_DAY_WEEK_MONTH_VERIFICATION

Status: DO_WYPELNIENIA

Sprawdzić:

- selected day,
- week view / week rail,
- month view,
- czy widoki używają tego samego modelu wpisu,
- czy month/week/day nie mają osobnego legacy renderu.

## LEGACY_AND_ACTIVE_DOM_NORMALIZERS_FOUND

Status: DO_WYPELNIENIA

Dla każdego normalizatora / legacy renderu:

| Plik | Marker / useEffect / CSS | Aktywne runtime? | Co modyfikuje | Ryzyko | Rekomendacja R1 |
|---|---|---|---|---|---|
| DO_WYPELNIENIA | DO_WYPELNIENIA | ? | ? | ? | ? |

Uwaga: aktywne DOM normalizatory nie są tylko historią. Trzeba odróżnić legacy martwe od legacy działającego.

## GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS

Status: DO_WYPELNIENIA

Sprawdzić:

- czy Calendar odpala Google background sync,
- czy blokuje pierwszy render,
- czy może zmienić dane po renderze,
- czy R0 to rusza,
- czy manual smoke może być zaburzony przez background refresh.

Wynik:

```txt
GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS: PASS / PARTIAL / BROKEN / DO_POTWIERDZENIA
```

## CALENDAR_SOURCE_TRUTH_STATUS

Status: DO_WYPELNIENIA

Wniosek główny:

```txt
CALENDAR_SOURCE_TRUTH_STATUS: PASS / PARTIAL / BROKEN / DO_POTWIERDZENIA
```

Definicje:

- PASS: Calendar/Today/details faktycznie widzą jeden stan po F5.
- PARTIAL: część działa, ale są rozjazdy lub derived entries.
- BROKEN: są realne sprzeczne źródła albo akcje zapisują nie te rekordy.
- DO_POTWIERDZENIA: brak dowodu, potrzebny runtime smoke albo dodatkowy scan.

## DO_POTWIERDZENIA

- aktualny status I3/K w lokalnym repo po pull,
- aktualny status Obsidiana po sync,
- czy lead shadow entry zostaje jako świadomy mechanizm,
- czy Today ma zostać refaktorowany do wspólnego source truth z Calendar,
- czy Google background sync ma osobny etap.

## ZAKAZY_ZAKRESU_R0

R0 nie rusza:

- SQL / RLS,
- finanse / prowizje,
- Braki / Blokady runtime,
- Owner Control runtime,
- MissingItemsManagerDialog,
- CaseDetail runtime,
- ClientDetail runtime,
- LeadDetail runtime,
- Google Calendar OAuth / produkcyjny sync,
- runtime Calendar / Today.

## R1_DECISION_GATE


R1 runtime fix dopiero po peĹ‚nym R0, status-precheck i decyzji Damiana; R0 pozostaje docs-only bez runtime.
Po R0:

```txt
IF CALENDAR_SOURCE_TRUTH_STATUS == PASS:
  R1 = STAGE232G_R1_CALENDAR_STATUS_SYNC_AND_GUARD_CLOSE

IF CALENDAR_SOURCE_TRUTH_STATUS == PARTIAL/BROKEN/DO_POTWIERDZENIA:
  R1 = STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX
```

Nie decydować o R1 przed pełnym R0.

## TESTY_R0

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
node scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs
node --test tests/stage232g-calendar-operational-source-truth-r0-audit.test.cjs
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## RUNTIME_TOUCHED

```txt
RUNTIME_TOUCHED: NIE
```

## NASTĘPNY_KROK

Damian sprawdza diff po korekcie briefu. Dopiero po akceptacji wykonawca robi właściwy audyt R0 i wypełnia ten raport faktami z repo.

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
