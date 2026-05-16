# RUN — Stage105 / Paczka G — Templates delete + visual contract

Data: 2026-05-16
Projekt: CloseFlow / LeadFlow
Branch: dev-rollout-freeze
Tryb: ZIP lokalny, bez commita i bez pusha

## Cel etapu

Naprawić osobny tor `/templates`: brak czytelnego usuwania szablonu i styl kart niezgodny z aktualnym źródłem prawdy kart czytelnych/record-list.

## Scan-first confirmation

- Repo: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Branch wymagany: `dev-rollout-freeze`
- Tryb: lokalny ZIP, bez push do GitHub
- Pliki sprawdzone / dotykane:
  - `src/pages/Templates.tsx`
  - `src/lib/supabase-fallback.ts`
  - `src/components/entity-actions.tsx`
  - `src/styles/closeflow-record-list-source-truth.css`
  - `tests/stage105-templates-delete-and-visual-contract.test.cjs`
  - `_project/03_CURRENT_STAGE.md`
  - `_project/06_GUARDS_AND_TESTS.md`
  - `_project/07_NEXT_STEPS.md`
  - `_project/08_CHANGELOG_AI.md`
  - `_project/10_PROJECT_TIMELINE.md`
  - `_project/14_TEST_HISTORY.md`
  - Obsidian: `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
  - Obsidian: `10_PROJEKTY/CloseFlow_Lead_App/2026-05-16_stage105_templates_delete_and_visual.md`

## FAKTY Z KODU / PLIKÓW

- `Templates.tsx` miał już import `deleteCaseTemplateFromSupabase` i funkcję `handleDeleteTemplate`, ale akcja była ukryta w menu i nie miała potwierdzenia `window.confirm`.
- `entity-actions.tsx` ma wspólny source of truth dla destrukcyjnych akcji: `EntityTrashButton`, `trashActionButtonClass`, `trashActionIconClass`, `CLOSEFLOW_TRASH_ACTION_SOURCE_OF_TRUTH`.
- `closeflow-record-list-source-truth.css` był głównie scope'owany do leads/clients. Stage105 dopisuje osobny scope dla `main-templates-html`.
- Backend helper `deleteCaseTemplateFromSupabase(id)` istnieje i wywołuje `DELETE /api/case-templates?id=...`.

## DECYZJE DAMIANA

- Nie mieszać Paczki G z kalendarzem.
- Nie robić commita ani pusha teraz.
- `/templates` ma dostać delete i lepszy styl jako osobny tor.
- Delete ma używać wspólnego destructive action source of truth.
- Szablonu / pozycji checklisty nie usuwać bez świadomego potwierdzenia.

## HIPOTEZY / PROPOZYCJE AI

- Najbardziej prawdopodobna przyczyna feedbacku „nie da się usunąć”: akcja była schowana w dropdownie, wyglądała jak przypadkowa pozycja menu i nie miała czytelnego destrukcyjnego CTA.
- Nie znaleziono jawnej informacji o relacjach szablon -> aktywne sprawy w payloadzie template, więc etap nie próbuje zgadywać powiązań runtime. Zamiast tego wymusza potwierdzenie usunięcia szablonu i jego pozycji wzorcowych.

## Zmienione pliki

- `src/pages/Templates.tsx`
- `src/styles/closeflow-record-list-source-truth.css`
- `tests/stage105-templates-delete-and-visual-contract.test.cjs`
- `_project/*`
- `obsidian_updates/*` / docelowy Obsidian

## Zakres naprawy

1. Dodać widoczny przycisk `Usuń` na karcie szablonu.
2. Przepiąć delete na `EntityTrashButton` i `trashActionIconClass`.
3. Dodać `window.confirm` przed delete.
4. Dodać drugie potwierdzenie, jeśli szablon ma pozycje checklisty.
5. Oznaczyć `/templates` jako `main-templates-html` i `data-cf-templates-page-source="record-list-source-truth"`.
6. Oznaczyć kartę jako `data-cf-template-card-source="record-list-source-truth"`.
7. Usunąć aktywny marker `data-a16-template-light-ui` jako źródło stylu.
8. Dopisać scope stylu templates do `closeflow-record-list-source-truth.css`.

## TESTY AUTOMATYCZNE

Wymagane po wdrożeniu:

```powershell
node tests/stage105-templates-delete-and-visual-contract.test.cjs
npm run build
```

## GUARDY

`tests/stage105-templates-delete-and-visual-contract.test.cjs` sprawdza:

- template card ma widoczny delete marker,
- delete używa `EntityTrashButton`,
- icon używa `trashActionIconClass`,
- delete ma `window.confirm`,
- confirm uwzględnia pozycje checklisty,
- karta ma marker record-list source truth,
- root ma `main-templates-html`,
- stary marker `data-a16-template-light-ui` nie jest aktywnym source of truth,
- CSS zawiera Stage105 templates visual contract.

## TESTY RĘCZNE

Status: TEST RĘCZNY DO WYKONANIA.

Do sprawdzenia:

1. Wejść na `/templates`.
2. Sprawdzić, czy karty wyglądają jak jasne czytelne karty, a nie panel debug/admin.
3. Utworzyć testowy szablon.
4. Sprawdzić widoczny przycisk `Usuń` na karcie.
5. Kliknąć `Usuń` i anulować pierwszy confirm, rekord ma zostać.
6. Kliknąć `Usuń`, potwierdzić pierwszy confirm i anulować drugi, rekord ma zostać.
7. Kliknąć `Usuń`, potwierdzić oba confirmy, rekord ma zniknąć po refreshu listy.
8. Sprawdzić delete także z menu `...`.
9. Sprawdzić, czy edycja i duplikowanie nadal działają.

## BRAKI I RYZYKA

- Etap nie dodaje backendowego wykrywania, czy szablon był użyty w aktywnych sprawach. Brak potwierdzonego pola/API do takiej relacji w skanie tego etapu.
- Jeśli wymagany będzie miękki archive zamiast hard delete, potrzebny będzie osobny etap backend/API.
- Manualny test UI jest nadal wymagany.

## WPŁYW NA OBSIDIANA

- Dodano notatkę Stage105 w `10_PROJEKTY/CloseFlow_Lead_App/`.
- Dashboard CloseFlow dostaje wpis z decyzją, testami i ryzykami.

## GIT / ZIP STATUS

- ZIP lokalny.
- Brak commita.
- Brak pusha.
- Skrypt pokazuje status po aplikacji.

## NASTĘPNY KROK

Po Stage105: ręczny test `/templates`; dopiero potem zdecydować, czy robimy jeszcze jeden mały etap lokalny, czy pakujemy Stage104+105 do jednego commita/pusha.
