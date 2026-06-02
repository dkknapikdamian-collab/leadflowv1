# STAGE217R4 - CaseDetail UTF-8 note summary repair

## FAKTY
R2/R3 częściowo wdrożyły Stage217, ale guard nadal blokował etap na `Stage217 note history summary missing`.

## DECYZJE DAMIANA
Kontynuujemy naprawę zakładki Sprawy jako kokpitu operacyjnego, bez pushowania w ciemno.

## HIPOTEZY AI
Przyczyną był problem z wstawianiem polskiego tekstu przez PowerShell albo niedopasowanie miejsca renderowania historii notatek.

## ZAKRES
R4 używa Node.js do poprawnego UTF-8 patcha `CaseDetail.tsx`.

## TESTY
- `node scripts/check-stage217-case-detail-operation-workspace.cjs`
- `npm run build`

## NASTĘPNY KROK
Po przejściu guarda i builda wykonać test ręczny widoku sprawy i dopiero potem zdecydować o pushu.
