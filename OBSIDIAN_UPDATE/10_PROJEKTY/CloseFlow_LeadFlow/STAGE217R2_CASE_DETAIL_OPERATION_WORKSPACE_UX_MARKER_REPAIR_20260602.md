# STAGE217R2 - CaseDetail Operation Workspace UX marker repair

## FAKTY
- Stage217 R1 nie przeszedł przez brak markera `notes tab trigger`.
- Build po R1 był buildem bez pełnego wdrożenia Stage217.
- R2 zmienia strategię: nie opiera się na dokładnym markerze zakładek, tylko dodaje panel operacyjny i panel notatek w głównej kolumnie sprawy.

## DECYZJE DAMIANA
- Wdrażamy zmianę widoku Sprawy i sprawdzamy ekran lokalnie przed pushem.

## HIPOTEZY AI
- Lepszy będzie kokpit sprawy niż kolejna pasywna zakładka.
- Notatki muszą być osobno od historii aktywności.

## TESTY
- `node scripts/check-stage217-case-detail-operation-workspace.cjs`
- `npm run build`
- test ręczny widoku sprawy.

## NASTĘPNY KROK
Uruchomić R2, wkleić wynik guarda/builda i screen widoku Sprawy.
