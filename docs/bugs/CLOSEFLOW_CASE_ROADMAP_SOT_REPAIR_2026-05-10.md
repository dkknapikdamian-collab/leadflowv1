# CLOSEFLOW CASE ROADMAP SOT REPAIR — 2026-05-10

## Cel

Zastąpić panel `Ostatnie 5 ruchów` w `CaseDetail.tsx` roadmapą sprawy z jednego wspólnego modelu UI.

Ważne doprecyzowanie: tu chodzi o jedno źródło prawdy wizualne/modelowe dla roadmapy, a nie o mieszanie zakresów danych. Roadmapa sprawy pokazuje tylko dane tej sprawy. Roadmapa klienta może później agregować wiele spraw, ale nie jest wdrażana w tym etapie.

## Zakres

Dodano:

- `src/lib/activity-roadmap.ts`
- `src/components/ActivityRoadmap.tsx`
- `scripts/check-closeflow-case-roadmap-source-of-truth.cjs`
- `check:closeflow-case-roadmap-sot` w `package.json`

Zmieniono:

- `src/pages/CaseDetail.tsx`

## Model źródła prawdy UI

`src/lib/activity-roadmap.ts` eksportuje wspólny typ `ActivityRoadmapItem` oraz funkcję `buildCaseActivityRoadmap()`.

Dla sprawy helper scala:

- aktywności z `activities`,
- notatki z aktywności/notatek,
- zadania z `work_items` widoczne jako taski,
- wydarzenia z `work_items` widoczne jako eventy,
- płatności z `payments`,
- seed lifecycle z rekordu `cases`.

Filtr dla sprawy jest intencjonalnie restrykcyjny: `caseId` musi wskazywać tę sprawę. Nie agregujemy po `clientId`, żeby sprawa nie pokazywała ruchów całej relacji klienta.

## Reguły roadmapy sprawy

- sortowanie malejąco po `happenedAt`,
- deduplikacja po `sourceTable + sourceId + kind`,
- czytelny `title`, bez twardego fallbacku `Dodano ruch w sprawie`,
- notatki oznaczane jako `editable/deletable`,
- płatności mają `editable/deletable` tylko, jeśli rekord jawnie niesie `editable/canEdit` albo `deletable/canDelete`.

## Dlaczego nie używać globalnej Aktywności

Globalna zakładka `Activity.tsx` pozostaje bez zmian. Ten etap nie tworzy nowego ekranu i nie miesza globalnej zupy aktywności z roadmapą sprawy.

`ActivityRoadmap` ma wbudowane rozwijanie `Pokaż całą roadmapę`, więc prawy panel może pokazać 5 ruchów, a pełna lista pozostaje w `CaseDetail` bez nowego route.

## Test manualny

1. Otwórz `/cases/ef32d02c-9c34-4bf1-a158-cab0d28401d1`.
2. Dodaj notatkę do sprawy.
3. Dodaj zadanie do sprawy.
4. Dodaj wydarzenie do sprawy.
5. Dodaj wpłatę do sprawy.
6. Sprawdź, czy `Roadmapa sprawy` pokazuje wszystkie rzeczy w kolejności od najnowszej.
7. Odśwież stronę.
8. Sprawdź, czy roadmapa nadal pokazuje ten sam stan.

## Check automatyczny

Uruchom:

```bash
npm run check:closeflow-case-roadmap-sot
```

Oczekiwany wynik:

```text
CLOSEFLOW_CASE_ROADMAP_SOURCE_OF_TRUTH_CHECK_OK
```
