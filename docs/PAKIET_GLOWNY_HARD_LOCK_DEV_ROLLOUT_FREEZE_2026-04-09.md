# PAKIET GŁÓWNY — HARD LOCK DLA `dev-rollout-freeze`

## Cel

Domknąć jedną gałąź wdrożeniową, jedną prawdę produktu i jedną finalną ścieżkę klienta tak, żeby dalsze wdrożenia nie rozjeżdżały się między starą definicją Lead Flow a nowymi modułami Spraw i kompletności.

## Jedyna gałąź wdrożeniowa

Wszystkie dalsze prace wykonujemy wyłącznie na:

- `dev-rollout-freeze`

`main` nie jest source of truth dla bieżącego stanu produktu.

## Finalna definicja produktu

Produkt nie jest już tylko lekką apką lead follow-up.

To jest:

**jeden system do domykania i uruchamiania klienta**

Czyli:
- warstwa 1 = Lead Flow / sprzedaż
- warstwa 2 = Sprawy / kompletność / start realizacji
- jedna historia klienta
- jedna aplikacja
- jedno centrum dowodzenia

## Jak traktować dokumenty

### Dokument nadrzędny
- `product-scope-v2.md`

### Stare V1
- `zakres_v1_lead_followup_app_2026-04-03.md` pozostaje źródłem wymagań dla rdzenia sprzedażowego
- nie jest nadrzędną definicją całego produktu końcowego

### Merged scope
Za nadrzędne dla przejścia lead -> case uznajemy łącznie:
- `product-scope-v2.md`
- `docs/data-model-lead-case-v2.md`
- `kierunek.txt`
- `kontrola leadów.txt`
- ten plik

## Finalna ścieżka życia klienta

```text
contact -> lead -> won / ready_to_start -> case -> kompletność -> start realizacji
```

## Twarda zasada domenowa dla leada

Aktywny lead ma być pilnowany przez:
- `nextStep`
- `nextStepAt`
- `lastTouchAt`
- `riskState`
- `riskReason`
- `dailyPriorityScore`

Lead bez kolejnego kroku nie jest tylko „nieuzupełniony”.
Jest ryzykiem procesu.

## Twarda zasada domenowa dla sprawy

Po przejściu do sprawy system ma pilnować:
- kompletności
- blokera
- następnego ruchu operacyjnego
- tego, czy czekamy na klienta czy na nas
- tego, czy sprawa jest gotowa do startu

## Zasada UI / IA

Użytkownik nie ma czuć wejścia do drugiej aplikacji.
Ma czuć ciągłość tego samego systemu.

Finalne menu operatora:
- `Dziś`
- `Leady`
- `Sprawy`
- `Zadania`
- `Kalendarz`
- `Aktywność`
- `Rozliczenia`
- `Ustawienia`

Później:
- `Szablony`
- `Klienci`

## Procedura startu każdej sesji

```bash
git fetch origin
git checkout dev-rollout-freeze
git pull --ff-only origin dev-rollout-freeze
git branch --show-current
```

Oczekiwany wynik:

```text
dev-rollout-freeze
```

## Procedura końca każdej sesji

```bash
npm test
npm run build
git add .
git commit -m "ETAP X: krótki opis wdrożenia"
git push origin dev-rollout-freeze
```

## Merge do `main`

Merge do `main` robimy dopiero wtedy, gdy łącznie są spełnione warunki:
- etap albo pakiet etapów jest domknięty
- testy przechodzą
- build przechodzi
- manual QA przechodzi
- użytkownik akceptuje stan
