# STAGE231E2 — Plan entitlement matrix

Status: ACTIVE_MATRIX
Data: 2026-06-13
Projekt: CloseFlow / LeadFlow
Powiązanie: STAGE231E2_R5_TRIAL_14D_WORKSPACE_FALLBACK_AND_PLAN_MATRIX

## Decyzje

- DECYZJA: aktywny trial produktu ma 14 dni.
- DECYZJA: `trial_21d` zostaje tylko jako legacy alias w `src/lib/plans.ts` dla starych workspace, bez aktywnego tworzenia nowych triali 21-dniowych.
- DECYZJA: wariant dla starych workspace z dłuższym `trial_ends_at`: A — nie przycinamy danych bez osobnej decyzji SQL/admin. UI i nowe ścieżki mają trzymać kontrakt 14 dni.

## Matrix

| Funkcja | Free | Basic | Pro | AI | Trial | UI | Backend / plans.ts | Billing | Werdykt |
|---|---:|---:|---:|---:|---:|---|---|---|---|
| `ai` | Nie | Nie | Nie | Tak | Tak | AI jako beta / provider + env | minimum `PLAN_IDS.ai`; Trial dziedziczy AI | AI Beta, Pro/Basic niedostępne | OK |
| `fullAi` | Nie | Nie | Nie | Tak | Tak | pełny AI tylko AI/Trial | minimum `PLAN_IDS.ai` | AI Beta | OK |
| `digest` | Nie | Tak | Tak | Tak | Tak | wymaga konfiguracji mail providera | minimum `PLAN_IDS.basic` | Basic/Pro/AI: wymaga konfiguracji | KONFIG |
| `lightParser` | Nie | Tak | Tak | Tak | Tak | parser tekstu w Basic+ | minimum `PLAN_IDS.basic` | Parser tekstu: Gotowe | OK |
| `lightDrafts` | Nie | Tak | Tak | Tak | Tak | szkice do sprawdzenia w Basic+ | minimum `PLAN_IDS.basic` | Szkice do sprawdzenia: Gotowe | OK |
| `googleCalendar` | Nie | Nie | Tak | Tak | Tak | Settings blokuje po planie i konfiguracji aplikacji | minimum `PLAN_IDS.pro` | Basic niedostępne; Pro/AI wymaga konfiguracji | KONFIG |
| `weeklyReport` | Nie | Nie | Tak | Tak | Tak | planowane/warunkowe | minimum `PLAN_IDS.pro` | Pro/AI wymaga konfiguracji | KONFIG |
| `csvImport` | Nie | Nie | Tak | Tak | Tak | funkcja Pro+ | minimum `PLAN_IDS.pro` | w opisie Pro jako import CSV | OK |
| `recurringReminders` | Nie | Nie | Tak | Tak | Tak | funkcja Pro+ | minimum `PLAN_IDS.pro` | Pro/AI po konfiguracji | KONFIG |
| `browserNotifications` | Nie | Tak | Tak | Tak | Tak | powiadomienia przeglądarki Basic+ | minimum `PLAN_IDS.basic` | Basic opisuje powiadomienia | OK |
| `activeLeads` | 5 | bez limitu | bez limitu | bez limitu | bez limitu | limity widoczne w modelu planu | `FREE_LIMITS.activeLeads = 5` | Free opisuje limity | OK |
| `activeTasks` | 5 | bez limitu | bez limitu | bez limitu | bez limitu | limity widoczne w modelu planu | `FREE_LIMITS.activeTasks = 5` | Free opisuje limity | OK |
| `activeEvents` | 5 | bez limitu | bez limitu | bez limitu | bez limitu | limity widoczne w modelu planu | `FREE_LIMITS.activeEvents = 5` | Free opisuje limity | OK |
| ctiveTasksAndEvents | 5 | bez limitu | bez limitu | bez limitu | bez limitu | limit laczny zadan i wydarzen w trybie Free | ctiveTasksAndEvents = 5 | Free opisuje limity | OK |
| `activeDrafts` | 3 | bez limitu | bez limitu | bez limitu | bez limitu | limity widoczne w modelu planu | `FREE_LIMITS.activeDrafts = 3` | Free opisuje limity | OK |
| `aiDaily` | null | null | null | 30 | 30 | AI limit tylko AI/Trial | `AI_FEATURES`, `aiDaily=30` | AI: 30/dzień | OK |
| `aiMonthly` | null | null | null | 300 | 300 | AI limit tylko AI/Trial | `AI_FEATURES`, `aiMonthly=300` | AI: 300/miesiąc | OK |

## Znalezione problemy / decyzje danych

- LEGACY_DECISION: stare workspace mogą mieć `trial_ends_at` ustawione według starego 21-dniowego triala. Wariant przyjęty na teraz: nie przycinamy bez osobnego SQL/admin action.
- DO_SPRAWDZENIA: Billing i Settings nadal mają copy „wymaga konfiguracji” przy funkcjach zależnych od providerów. To jest poprawne dla admina/operatora, ale w przyszłym UI dla zwykłego usera wymaga uproszczenia języka.
- DO_SPRAWDZENIA: Google Calendar ma osobny etap STAGE231F — ten matrix tylko potwierdza plan gate, nie naprawia sync runtime.

## Test ręczny

1. Nowe konto: sidebar pokazuje maksymalnie 14 dni.
2. Billing pokazuje datę triala liczona z aktywnego kontraktu 14 dni.
3. Stare konto z większą datą końca triala traktować jako legacy data case, nie jako nowy trial.
4. Basic nie widzi Google Calendar jako dostępnego, Pro/AI/Trial mają dostęp zgodnie z planem i konfiguracją aplikacji.
## STAGE231E2_R8_PLAN_WIRING_CONFIRMATION

Data: 2026-06-13

- Potwierdzenie guardem: `free`, `basic`, `pro`, `ai`, `trial_14d` maja wpisy w `PLAN_IDS` i `PLAN_DEFINITIONS`.
- Potwierdzenie guardem: kazdy plan ma pelny zestaw `PlanFeatures` i `PlanLimits`.
- Potwierdzenie guardem: minimum planow jest spojne:
  - Basic: `digest`, `lightParser`, `lightDrafts`, `browserNotifications`;
  - Pro: `googleCalendar`, `weeklyReport`, `csvImport`, `recurringReminders`;
  - AI: `ai`, `fullAi`;
  - Trial: dziedziczy AI/Pro w czasie aktywnego triala 14 dni.
- Potwierdzenie guardem: sidebar nie moze zawierac mojibake.
## STAGE231E2_R8A_MATRIX_LIMIT_ROW_HOTFIX

Data: 2026-06-13

- Hotfix po R8: dedykowany guard R8 wymaga w matrixie limitu `activeTasksAndEvents`, bo ten limit istnieje w `PlanLimits`.
- Dodano row `activeTasksAndEvents` do centralnej matrycy planow.
- Zakres: dokumentacja/matrix + raport; bez zmian runtime, SQL, Stripe, Google Calendar.
