# CloseFlow — handoff do nowego okna AI

Wklej w nowym oknie:

```text
Kontynuujemy projekt CloseFlow / LeadFlow.
Repo: dkknapikdamian-collab/leadflowv1.
Gałąź robocza: dev-rollout-freeze.
Lokalna ścieżka Windows: C:\Users\malim\Desktop\biznesy_ai\2.closeflow.
Tryb pracy: zawsze przygotuj ZIP z apply script + jedno polecenie PowerShell; nie rób samodzielnego push bez paczki, chyba że wyraźnie napiszę inaczej.

Aktualny etap UI:
- UI Map Inventory v1 jest gotowe.
- Skaner mapy jest oczyszczony: CLEAN_SCANNER_V4.
- UI Semantic Contract v1 jest gotowy.
- UI-2 SemanticIcon + pierwszy guard jest wdrożony albo jest następnym etapem do sprawdzenia.

Najważniejsze zasady:
1. Nie zaczynaj od refaktoru wizualnego.
2. Nie poprawiaj kolorów na oko.
3. Każda ikona, kafelek i region mają iść przez kontrakt UI.
4. Nie ruszaj naraz LeadDetail, ClientDetail i CaseDetail.
5. Nie mieszaj UI Contract z Finance Ledger.
6. Najpierw sprawdź repo i aktualne pliki w docs/ui.
7. Aktualne checki UI do odpalenia:
   npm run check:closeflow-ui-map-inventory-v1
   npm run check:closeflow-ui-semantic-contract-v1
   npm run check:closeflow-ui-semantic-icon-v1
   npm run build

Następny kierunek po UI-2:
UI-3: EntityInfoRow dla wspólnego stylu telefonu, e-maila, osoby, firmy, źródła i danych kontaktowych w LeadDetail + ClientDetail.
Nie wdrażaj notatek ani shell layoutu przed EntityInfoRow.
```

## Ostatnia znana kolejność UI

1. UI-1A: mapa ikon/kafelków/położeń.
2. UI-1A repair: CLEAN_SCANNER_V4.
3. UI-1B: semantic contract.
4. UI-2: SemanticIcon + baseline guard.
5. UI-3: EntityInfoRow.
6. UI-4: EntityNoteCard / EntityNoteComposer / EntityNoteList.
7. UI-5: EntityDetailShell dla LeadDetail + ClientDetail.
8. UI-6: CaseDetail extension.
