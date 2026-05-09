# CloseFlow UI Semantic Contract v1

Generated: 2026-05-09T06:00:33.287Z

Source scanner: **CLEAN_SCANNER_V4**

Status: **kontrakt semantyczny, nie refactor runtime UI**.

## Wynik źródłowej mapy UI

- Pliki przeskanowane: **287**
- Bezpośrednie importy ikon z lucide-react: **375**
- Użycia StatShortcutCard: **36**
- Lokalne implementacje InfoRow/InfoLine/StatCell/ActionButton: **5**
- Kontrakty akcji encji: **3**
- Dowody layoutu CSS: **800**

## Decyzja

Inventory first, contract second, runtime migration third. No visual hotfixes without semantic owner.

## Komponenty docelowe

- Ikony: `src/ui-system/icons/SemanticIcon.tsx`
- Kafelki metryk: `src/components/StatShortcutCard.tsx`
- Wiersze informacji: `src/ui-system/entity/EntityInfoRow.tsx`
- Notatki: `src/ui-system/entity/EntityNoteCard.tsx`, `src/ui-system/entity/EntityNoteComposer.tsx`, `src/ui-system/entity/EntityNoteList.tsx`
- Shell rekordu: `src/ui-system/entity/EntityDetailShell.tsx`

## Role ikon

| Rola | Importy | Użycia | Komponent | Ton | Ikona docelowa | Migracja |
|---|---:|---:|---|---|---|---|
| add | 10 | 16 | SemanticIcon | primary | Plus | UI-2 |
| ai | 14 | 17 | SemanticIcon | ai | Sparkles | UI-2 |
| auth | 5 | 6 | SemanticIcon | neutral | LogOut/LogIn | later |
| case | 8 | 11 | SemanticIcon | case | Briefcase | UI-2 |
| close | 9 | 7 | SemanticIcon | neutral | X | later |
| company_property | 2 | 1 | SemanticIcon | neutral | Building2 | later |
| copy | 9 | 9 | SemanticIcon | neutral | Copy | UI-2 |
| delete | 13 | 13 | SemanticIcon | danger | Trash2 | UI-2 |
| edit | 3 | 3 | SemanticIcon | neutral | Pencil | UI-2 |
| email | 8 | 8 | SemanticIcon | contact | Mail | UI-3 |
| event | 12 | 12 | SemanticIcon | event | CalendarClock | UI-2 |
| filter | 3 | 3 | SemanticIcon | neutral | Filter | later |
| finance | 5 | 4 | SemanticIcon | finance | DollarSign/Wallet/CreditCard | Finance V1 |
| goal | 8 | 8 | SemanticIcon | primary | Target | later |
| loading | 26 | 46 | LoadingSpinner | neutral | Loader2 | later |
| navigation | 28 | 35 | SemanticIcon | neutral | Arrow/Chevron/ExternalLink | later |
| note | 14 | 12 | SemanticIcon | note | FileText | UI-4 |
| notification | 9 | 9 | SemanticIcon | notification | Bell | later |
| person | 12 | 14 | SemanticIcon | person | UserRound | UI-3 |
| phone | 5 | 3 | SemanticIcon | contact | Phone | UI-3 |
| pin | 1 | 1 | SemanticIcon | neutral | Pin | later |
| refresh | 9 | 12 | SemanticIcon | neutral | RefreshCw/RotateCcw | later |
| risk_alert | 22 | 19 | SemanticIcon | danger | AlertTriangle | UI-2 |
| search | 14 | 16 | SemanticIcon | neutral | Search | later |
| send | 3 | 4 | SemanticIcon | primary | Send | later |
| settings | 5 | 4 | SemanticIcon | neutral | Settings | later |
| task_status | 42 | 43 | SemanticIcon | task | CheckCircle2 | UI-2 |
| time | 14 | 14 | SemanticIcon | time | Clock | UI-2 |
| unclassified | 61 | 61 | SemanticIcon | neutral | TBD | manual_review |
| view | 1 | 1 | SemanticIcon | neutral | Eye | later |

## Kafelki / metryki

Reguła teraz: Nie dodawać nowych lokalnych kafelków metryk. Istniejące użycia StatShortcutCard zostają bazą.

| Plik | Liczba użyć | Standard |
|---|---:|---|
| src/pages/Activity.tsx | 6 | StatShortcutCard |
| src/pages/Cases.tsx | 4 | StatShortcutCard |
| src/pages/Clients.tsx | 4 | StatShortcutCard |
| src/pages/Leads.tsx | 5 | StatShortcutCard |
| src/pages/NotificationsCenter.tsx | 7 | StatShortcutCard |
| src/pages/ResponseTemplates.tsx | 4 | StatShortcutCard |
| src/pages/Tasks.tsx | 1 | StatShortcutCard |
| src/pages/TasksStable.tsx | 1 | StatShortcutCard |
| src/pages/Templates.tsx | 4 | StatShortcutCard |

## Lokalne implementacje do przepięcia

| Nazwa | Plik | Linia | Docelowo |
|---|---|---:|---|
| ClientMultiContactField | src/pages/ClientDetail.tsx | 591 | EntityInfoRow / EntityNote / EntityActionButton candidate |
| InfoRow | src/pages/ClientDetail.tsx | 648 | EntityInfoRow / EntityNote / EntityActionButton candidate |
| StatCell | src/pages/ClientDetail.tsx | 667 | EntityInfoRow / EntityNote / EntityActionButton candidate |
| InfoLine | src/pages/LeadDetail.tsx | 403 | EntityInfoRow / EntityNote / EntityActionButton candidate |
| LeadActionButton | src/pages/LeadDetail.tsx | 414 | EntityInfoRow / EntityNote / EntityActionButton candidate |

## Regiony detail view

Wspólna kolejność dla `LeadDetail` i `ClientDetail`:

1. `entity-header`
2. `entity-top-tiles`
3. `entity-nearest-action`
4. `entity-contact`
5. `entity-notes`
6. `entity-history`
7. `entity-relations`
8. `entity-right-rail`

LeadDetail i ClientDetail mają mieć te same regiony logiczne. Mobile może układać je w jedną kolumnę, desktop może mieć rail, ale semantyczne regiony muszą zostać wspólne.

## Kolejność migracji

| Etap | Nazwa | Zakres |
|---|---|---|
| UI-2 | SemanticIcon + first guard | critical icon roles only |
| UI-3 | EntityInfoRow | phone, email, contact/source rows in LeadDetail and ClientDetail |
| UI-4 | EntityNoteCard / Composer / List | notes in LeadDetail and ClientDetail |
| UI-5 | EntityDetailShell | LeadDetail and ClientDetail desktop/mobile region parity |
| UI-6 | CaseDetail extension | extend same contract to CaseDetail after lead/client parity |

## Guard policy

- Teraz: Check verifies map cleanliness and semantic contract completeness. Runtime direct icon imports are allowed until migration begins.
- Po UI-2: No new direct imports for critical standard icons in pages/* without semantic exception.
- Po UI-3: No new local phone/email/contact rows in detail pages.
- Po UI-4: No new local note cards/composers/lists in detail pages.
- Po UI-5: LeadDetail and ClientDetail must expose shared data-ui-region contract.
