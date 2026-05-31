# CloseFlow Stage150 — Panel Typography and Width Source Truth

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: UI / typography / visual source truth

## FAKTY

- Stage149 został zaakceptowany jako aktualny stan szerokości panelu.
- Szerokość panelu ma być jednym źródłem prawdy dla wszystkich zakładek.
- Kolejny krok: delikatne zmniejszenie czcionki bez zmiany architektury szerokości.

## DECYZJE DAMIANA

- Zapisujemy obecny stan.
- Lecimy dalej z poprawkami.
- Delikatnie zmniejszyć czcionkę.
- Szerokość panelu: jeden source truth dla wszystkich zakładek.

## HIPOTEZY AI

- Typografia powinna być ustawiona jednym plikiem source truth po Stage149.
- Nie należy wracać do osobnych poprawek per zakładka.

## TESTY

```powershell
node scripts/check-stage150-panel-typography-and-width-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Sprawdzić wszystkie główne zakładki i ewentualnie dostroić wyłącznie zmienne `--cf150-text-*`.
