# STAGE228A — Funnel Truth + Clickability — aktualizacja Obsidiana

data i godzina: 2026-06-06 17:05 Europe/Warsaw
nazwa / alias wejściowy: Stage228A — Funnel Truth + Clickability
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
checkpoint przed etapem: 21eab806298d329e43bbff7cc69866a668e44ba3

## Wpis do aktualnego stanu
Stage228A naprawia wiarygodność `/funnel`: kafel `Pieniądze` ma prowadzić do widocznych rekordów źródłowych. Domyślnie lejek pokazuje wszystkie rekordy. Kliknięcie kafla właścicielskiego czyści filtr etapu, a kliknięcie etapu czyści filtr właścicielski.

## Wpis do decyzji
Lejek pozostaje widokiem globalnym `/funnel`. Nie dokładamy pełnego lejka do klienta ani leada w tym etapie. Klient dostanie później `Ruch klienta`, a lead dostanie `Co robimy z tym leadem?` jako centrum pracy.

## Testy
- Stage228A guard/test.
- Regresje Stage227A/B.
- Build.
- Verify quiet.
- Git diff check.
- Manual smoke: kliknięcie `Pieniądze` pokazuje rekord z kwotą 1380 PLN, jeśli ta kwota jest w danych.

## Ryzyka
- Jeśli kwota pochodzi ze sprawy klienta, w `/funnel` pokazujemy kartę sprawy, nie klienta. Moduł klienta zostaje do Stage228C.
- Jeżeli dane są niespójne w backendzie, UI pokaże tylko to, co zwrócą istniejące endpointy.

## Następny krok
Po Stage228A: Stage228B — Lead Work Action Center, czyli odpowiednik `Co robimy teraz?` ze sprawy, ale dla leada.
