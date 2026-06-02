# STAGE217 CASE_DETAIL_OPERATION_WORKSPACE_UX

## Cel

Przebudować widok szczegółu sprawy w CloseFlow tak, żeby działał jako kokpit operacyjny jednej sprawy, a nie luźny zestaw kafli.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian: 10_PROJEKTY/CloseFlow_Lead_App
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA

## Fakty z kodu

- `src/pages/CaseDetail.tsx` renderuje nagłówek sprawy, kafle operacyjne, zakładki, historię, checklisty i panel boczny.
- `src/components/CaseQuickActions.tsx` obsługuje dodawanie notatki, zadania, wydarzenia, braku i wpłaty z kontekstem `caseId`, `clientId`, `leadId`.
- W `CaseDetail.tsx` występowały dwa dialogi płatności spięte tym samym stanem `isCasePaymentOpen`.
- Historia aktywności i treści notatek były zbyt mocno zlane wizualnie.

## Decyzje Damiana

- Zakładka Sprawy ma być realnym miejscem obsługi sprawy.
- Notatek nie mieszać z historią aktywności.
- Dodane elementy z poziomu sprawy muszą przypisywać się do sprawy i powiązanego klienta/leada.
- Styl ma być spójny z LeadDetail i ClientDetail.

## Zakres wdrożenia

- Dodano zakładkę `Notatki`.
- Przebudowano zakładkę `Obsługa` na kokpit: następna akcja, blokady, działania, rozliczenie.
- Historia aktywności pokazuje streszczenie notatek zamiast mieszać pełne treści z logiem działań.
- Usunięto duplikat dialogu płatności spiętego tym samym stanem.
- Dodano osobny CSS stage217 dla układu kokpitu.
- Dodano guard `scripts/check-stage217-case-detail-operation-workspace.cjs`.

## Testy automatyczne

Uruchomić:

```powershell
node scripts/check-stage217-case-detail-operation-workspace.cjs
npm run build
```

## Testy ręczne

1. Otworzyć dowolną sprawę.
2. Sprawdzić zakładki: Obsługa, Notatki, Ścieżka, Checklisty, Historia.
3. Dodać notatkę z prawego panelu szybkich akcji.
4. Sprawdzić, że pełna treść notatki jest w zakładce Notatki.
5. Sprawdzić, że Historia pokazuje ruch w sprawie bez mieszania pełnych notatek z logiem działań.
6. Dodać zadanie i wydarzenie z poziomu sprawy.
7. Sprawdzić, że akcje mają kontekst sprawy, klienta i leada.
8. Kliknąć dodanie wpłaty i potwierdzić, że otwiera się jeden modal.

## Czego nie ruszano

- Nie ruszano migracji SQL.
- Nie zmieniano schematu Supabase.
- Nie zmieniano finansów jako osobnego modułu prowizji poza usunięciem duplikatu modalnego renderu.
- Nie wykonywano push do GitHuba w tej paczce.

## Następny krok

Po lokalnym teście screenowym i buildzie zdecydować, czy dopracować mikrocopy/spacing, czy pushować razem z kolejną paczką poprawek CloseFlow.
