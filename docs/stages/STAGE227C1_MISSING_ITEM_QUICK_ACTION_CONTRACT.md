# STAGE227C1 — Missing Item Quick Action Contract

Data: 2026-06-07 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: local-only, bez pushu
Marker: STAGE227C1_MISSING_ITEM_QUICK_ACTION_CONTRACT

## Cel

Doprecyzować minimalny model funkcji **Brak** jako szybkiej akcji dla LeadDetail, ClientDetail i CaseDetail bez migracji SQL i bez nowej tabeli.

Ten etap jest kontraktem i adapterem decyzji. Nie buduje jeszcze pełnego runtime UI.

## Decyzja

**Brak** ma być lekką akcją operacyjną, nie osobnym dużym modułem.

Na start:
- Lead / Client: zapis przez istniejący kanał task/activity jako typ `missing_item` albo `blocker`.
- Case: zapis przez istniejący model `case_items`, jeśli w danym runtime jest dostępny.
- Bez nowej tabeli.
- Bez migracji SQL.
- Bez checklist jako osobnego systemu.
- Bez mieszania luźnych notatek z brakami.

## Zakres C1

1. Spisać kontrakt szybkiej akcji `Brak`.
2. Ustalić routing persystencji:
   - `lead` -> `task_or_activity_missing_item`
   - `client` -> `task_or_activity_missing_item`
   - `case` -> `case_items_missing`
3. Dopisać guardy i testy, które blokują rozdmuchanie zakresu.
4. Przygotować podstawowy adapter typów dla kolejnego etapu runtime.

## Poza zakresem C1

- brak nowego SQL,
- brak Supabase migration,
- brak RLS/GRANT,
- brak pełnego modala runtime,
- brak nowej tabeli,
- brak pełnego systemu checklist,
- brak automatycznego przenoszenia braków lead -> client -> case.

## Scan lokalny wykonany przez patcher

```json
{
  "package.json": {
    "exists": true,
    "hasQuickActionsBar": false,
    "hasBrak": false,
    "hasMissingItem": false,
    "hasBlocker": true,
    "hasCaseItems": false,
    "hasContextActionDialogs": false
  },
  "src/pages/LeadDetail.tsx": {
    "exists": true,
    "hasQuickActionsBar": true,
    "hasBrak": true,
    "hasMissingItem": false,
    "hasBlocker": true,
    "hasCaseItems": false,
    "hasContextActionDialogs": true
  },
  "src/pages/ClientDetail.tsx": {
    "exists": true,
    "hasQuickActionsBar": false,
    "hasBrak": true,
    "hasMissingItem": false,
    "hasBlocker": true,
    "hasCaseItems": true,
    "hasContextActionDialogs": true
  },
  "src/pages/CaseDetail.tsx": {
    "exists": true,
    "hasQuickActionsBar": false,
    "hasBrak": true,
    "hasMissingItem": true,
    "hasBlocker": true,
    "hasCaseItems": true,
    "hasContextActionDialogs": true
  },
  "src/components/detail/QuickActionsBar.tsx": {
    "exists": true,
    "hasQuickActionsBar": true,
    "hasBrak": false,
    "hasMissingItem": false,
    "hasBlocker": false,
    "hasCaseItems": false,
    "hasContextActionDialogs": false
  },
  "src/components/ContextActionDialogs.tsx": {
    "exists": true,
    "hasQuickActionsBar": false,
    "hasBrak": false,
    "hasMissingItem": false,
    "hasBlocker": false,
    "hasCaseItems": false,
    "hasContextActionDialogs": true
  }
}
```

## Reguły dla C2/C3

C2 może dodać mały modal:
- pole wymagane: `title`,
- opcjonalnie: krótka notatka,
- zapis,
- bez opisowego copy.

C3 może dodać adapter zapisu:
- Lead/Client przez istniejący task/activity,
- Case przez istniejący case_items,
- bez migracji.

## Kryterium sukcesu przyszłego runtime

Użytkownik może:
- wejść w lead / klient / sprawę,
- kliknąć `Brak`,
- wpisać np. `Brak podpisanej umowy`,
- zobaczyć osobny wpis w `Braki i blokady`,
- mieć wiele braków jako wiele wpisów,
- oznaczyć brak jako zrobiony,
- usunąć błędny brak,
- nie zgubić kontekstu encji.

## Audyt ryzyk

- Największe ryzyko: zrobienie z `Brak` ciężkiego systemu przed walidacją użycia.
- Drugi problem: pomieszanie notatek, zadań i braków w jednym tekście.
- Trzeci problem: rozjechanie CaseDetail, jeśli ominiemy istniejące case_items.
- Warunek zmiany decyzji: nowa tabela dopiero po potwierdzeniu, że istniejący model task/activity/case_items nie wystarcza.
