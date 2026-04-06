# LISTA DO ZROBIENIA

## ETAP 1 — ZROBIĆ REALNĄ WERYFIKACJĘ PRODUKCYJNEGO BUILDA W ŚRODOWISKU Z DOSTĘPNYMI ZALEŻNOŚCIAMI

### Cel

Potwierdzić, że projekt nie tylko przechodzi testy, ale naprawdę buduje się i uruchamia jako wersja produkcyjna.

### Pliki do sprawdzenia

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- całość projektu po zmianach

### Zmień

1. Uruchom projekt w realnym środowisku, w którym dostępne są wszystkie wymagane zależności i w którym możliwe jest pełne wykonanie:
   - `npm ci` albo `npm install`
   - `npm test`
   - `npm run build`
   - `npm run start`

2. Nie uznawaj etapu za zakończony na podstawie częściowego wyniku typu:
   - „kompilacja wygląda dobrze”,
   - „TypeScript przeszedł”,
   - „build doszedł prawie do końca”.

   Etap jest zaliczony tylko wtedy, gdy:
   - `npm run build` kończy się pełnym sukcesem,
   - build generuje kompletny artefakt produkcyjny,
   - `npm run start` uruchamia produkcyjną wersję aplikacji,
   - główne widoki dają się otworzyć bez błędów runtime.

3. Jeśli build pokaże błędy:
   - napraw je bez zmiany zaakceptowanego UI,
   - nie rób przy okazji refaktoru niezwiązanych rzeczy,
   - nie zmieniaj logiki produktu poza tym, co realnie blokuje build albo start produkcyjny.

4. Sprawdź, czy po buildzie:
   - nie ma błędów typów,
   - nie ma błędów importów,
   - nie ma błędów wynikających z podziału client/server,
   - nie ma błędów routingu,
   - build kończy się w pełni i generuje kompletny artefakt produkcyjny.

5. Po `npm run start` wykonaj realny smoke test produkcyjny i sprawdź ręcznie wejście na:
   - `Today`
   - `Leads`
   - `Tasks`
   - `Calendar`
   - `Billing`
   - `Settings`

6. Dla każdego z tych widoków potwierdź:
   - strona otwiera się poprawnie,
   - nie ma błędu runtime,
   - nie ma błędu routingu,
   - nie ma błędu wynikającego z server/client split.

7. Zapisz wynik w krótkim raporcie lub logu:
   - install: pass/fail
   - testy: pass/fail
   - build: pass/fail
   - start: pass/fail
   - Today: pass/fail
   - Leads: pass/fail
   - Tasks: pass/fail
   - Calendar: pass/fail
   - Billing: pass/fail
   - Settings: pass/fail
   - ewentualne błędy do poprawy
   - dokładny etap, na którym proces się zatrzymał, jeśli nie uda się go domknąć

### Nie zmieniaj

- wyglądu aplikacji bez potrzeby,
- logiki produktu przy okazji,
- struktury UI poza tym, co blokuje build/start.

### Po wdrożeniu sprawdź

- `npm test` przechodzi,
- `npm run build` przechodzi w pełni,
- `npm run start` uruchamia aplikację bez błędów,
- aplikacja działa po buildzie w trybie produkcyjnym,
- główne widoki otwierają się bez błędów runtime.

### Kryterium zakończenia

- projekt ma potwierdzony działający build produkcyjny i start produkcyjny w realnym środowisku,
- `npm run build` kończy się pełnym sukcesem, a nie częściowym logiem,
- `npm run start` został realnie uruchomiony po buildzie,
- wszystkie główne widoki zostały sprawdzone po starcie produkcyjnym,
- jeśli którykolwiek z tych warunków nie został spełniony, etap nie jest zakończony.
