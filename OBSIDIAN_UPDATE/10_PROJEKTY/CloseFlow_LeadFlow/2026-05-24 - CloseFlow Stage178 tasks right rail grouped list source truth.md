# CloseFlow Stage178 — Tasks Right Rail and Grouped List Source Truth

Data: 2026-05-24  
Status: przygotowano ZIP lokalny  
Typ: UI / tasks operational panel / right rail / grouped list

## FAKTY

- Po Stage177 zakładki Lead/Klient zostały objęte parity source truth.
- Zakładka `Zadania` wygląda pusto: lista jest samotna i prawa część ekranu nie pracuje.
- Search zadań ma być skrócony do kolumny roboczej, tak jak inne listy.

## DECYZJE DAMIANA

- Dodać elementy do zakładki Zadania w tym samym stylu wizualnym.
- Kolorystyka może nawiązywać do kafelków.
- Skrócić search do tego samego wymiaru.
- Zachować jedno źródło prawdy wizualnej.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## HIPOTEZY AI

- Najlepszy kierunek to prawy rail + grupowanie, nie losowe ozdobniki.
- `/tasks` powinno stać się centrum egzekucji dnia.
- Rail powinien zawierać: `Filtry zadań`, `Najpilniejsze zadania`.

## TESTY

```powershell
node scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs
npm.cmd run build
```

## NASTĘPNY KROK

Test wizualny `/tasks` oraz szybka regresja dodawania/edycji zadania.


## Stage179 update

- Poprawiono polskie znaki w tekstach panelu zadań.
- Usunięto kartę `Szybki fokus` z prawego panelu.
- Pozostają: `Filtry zadań` i `Najpilniejsze zadania`.
