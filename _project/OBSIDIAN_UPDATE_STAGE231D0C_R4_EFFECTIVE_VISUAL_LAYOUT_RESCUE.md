# STAGE231D0C-R4 — Effective Visual Layout Rescue

Data: 2026-06-10 22:35 Europe/Warsaw
Canonical name: CloseFlow / LeadFlow
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Decyzja / korekta

D0C formalnie przeszedł testy, ale wizualnie nie dowiózł celu. R4 ma wymusić realny efekt na live /clients, nie tylko markery.

## Zakres

- Trial banner jako top-card.
- Usunięcie martwego luzu nad metrykami.
- Przesunięcie prawej kolumny filtrów bliżej środka.
- Zachowanie kontraktu D0B dla ClientListCard.

## Audyt ryzyk

Największe ryzyko: zbyt agresywne przesunięcie prawej kolumny na bardzo szerokich ekranach. Dlatego CSS ma media query i ręczny test /clients jest wymagany.
