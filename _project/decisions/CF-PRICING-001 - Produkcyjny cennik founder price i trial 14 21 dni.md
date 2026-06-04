# CF-PRICING-001 — Produkcyjny cennik, founder price i trial 14/21 dni

Data: 2026-06-04  
Status: decyzja pricingowa + kierunek launchu produkcyjnego  
Projekt: CloseFlow / LeadFlow / CaseFlow  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`  
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

---

## 1. Zweryfikowany stan aktualny

Aktualne ceny w aplikacji są zapisane w `src/pages/Billing.tsx`:

- Free: 0 zł / 0 zł rocznie
- Basic: 19 zł / 30 dni, 190 zł rocznie
- Pro: 39 zł / 30 dni, 390 zł rocznie
- AI: 69 zł / 30 dni, 690 zł rocznie

Trial jest obecnie komunikowany jako 21 dni testu i zapisany w `src/lib/plans.ts` jako `TRIAL_DAYS = 21`.

---

## 2. Decyzja strategiczna

Jeżeli CloseFlow ma wyjść jako aplikacja produkcyjna z pełnym zakresem funkcji, obecne ceny 19 / 39 / 69 zł nie powinny być normalnym publicznym cennikiem docelowym.

Obecne ceny mogą zostać użyte jako:

- cena beta,
- founder price,
- cena dla pierwszych klientów,
- cena dla ograniczonej liczby kont albo ograniczonego czasu.

Nie traktować ich jako docelowego cennika produkcyjnego.

---

## 3. Docelowy cennik produkcyjny — rekomendacja

Rekomendowany publiczny cennik produkcyjny po pełnym zakresie funkcji:

```text
Basic: 49 zł / 30 dni
Pro: 99 zł / 30 dni
AI / Owner: 179 zł / 30 dni
```

Roczne warianty do ustalenia osobno, najlepiej z umiarkowaną zniżką, nie zbyt agresywną.

Przykładowo:

```text
Basic: 490 zł / rok
Pro: 990 zł / rok
AI / Owner: 1790 zł / rok
```

Nie wdrażać bez osobnej decyzji i testu płatności.

---

## 4. Founder price / cena dla pierwszych klientów

Aktualne ceny 19 / 39 / 69 zł mogą działać jako founder price:

```text
Basic: 19 zł / 30 dni zamiast ceny produkcyjnej 49 zł
Pro: 39 zł / 30 dni zamiast ceny produkcyjnej 99 zł
AI: 69 zł / 30 dni zamiast ceny produkcyjnej 179 zł
```

Komunikować ostrożnie jako:

```text
Cena dla pierwszych klientów.
Obowiązuje dla pierwszych [X] kont albo do [DATA].
```

Nie komunikować jako fałszywa promocja, jeśli cena produkcyjna nie była realnie wcześniejszą ceną sprzedaży.

Bezpieczniejszy wording:

```text
Cena produkcyjna po starcie: 99 zł / 30 dni
Cena dla pierwszych klientów: 39 zł / 30 dni
```

Nie pisać agresywnie:

```text
PROMOCJA -60%
```

chyba że warunki prawne i historia cen są spełnione.

---

## 5. Guard prawny / komunikacyjny dla przekreślonych cen

Przekreślone ceny można rozważyć, ale wymagają ostrożności.

Zasada:

- nie udawać rabatu z ceny, która nie była realnie stosowana,
- nie pisać „było 99, teraz 39”, jeśli cena 99 zł nie była realną wcześniejszą ceną sprzedaży,
- lepiej pisać „cena produkcyjna” i „cena dla pierwszych klientów”,
- ograniczyć founder price liczbą kont albo datą,
- przed publicznym wdrożeniem sprawdzić zgodność z zasadami informowania o obniżkach cen.

---

## 6. Trial — decyzja 14/21 dni

Docelowo dla publicznej produkcji:

```text
Standardowy trial: 14 dni
Trial z kodem / founder / early access: 21 dni
```

Powód:

- 14 dni szybciej pokazuje, czy klient widzi wartość,
- zmniejsza liczbę kont, które zakładają i zapominają,
- lepiej pasuje do produktu, który powinien pokazać wartość po kilku leadach/follow-upach,
- 21 dni zostaje jako benefit dla kodu polecającego, founder price albo wybranych testów.

Aktualne 21 dni w kodzie zostawić do czasu osobnego etapu zmiany triala.

---

## 7. Dla kogo są te ceny

Ceny 49 / 99 / 179 zł są dla:

- solo usługodawcy,
- małej firmy,
- pośrednika,
- wykonawcy,
- mikrozespołu,
- osoby lub małego zespołu obsługującego leady samodzielnie.

To nie jest jeszcze pełny cennik dla większych firm.

Dla większych firm zapisać późniejszy kierunek:

```text
Team / Business: od 299 zł miesięcznie albo cena zależna od liczby użytkowników / seatów.
```

Nie mieszać tego w pierwszym prostym cenniku, żeby nie zrobić chaosu.

---

## 8. Powiązanie z kodem polecającym

Kod polecający nie powinien dawać dużej zniżki cenowej, zwłaszcza jeśli użytkownik ma founder price.

Kod powinien dawać:

### Poleconemu

- 21 dni triala zamiast standardowych 14 dni,
- pakiet szybkiego startu,
- ewentualny bonus po przejściu na płatny plan.

### Polecającemu

- kredyt CloseFlow albo bonus produktowy po płatności poleconego,
- bonus po kilku skutecznych poleceniach zależny od planu i zatwierdzany ręcznie w MVP.

Nie dawać:

- gotówki,
- dużych rabatów,
- darmowego miesiąca za samą rejestrację,
- automatycznego darmowego miesiąca dla najwyższego planu.

---

## 9. Pakiet szybkiego startu

Pakiet szybkiego startu ma być niskokosztowym benefitem, nie ręczną usługą.

Zakres:

- gotowy przykład leada DEMO,
- checklista pierwszych 5 kroków,
- przykładowy follow-up,
- przykładowe zadanie,
- krótki schemat: jak dodać pierwszego prawdziwego leada i nie zgubić kontaktu.

Guard:

- nie tworzyć śmieciowych danych bez zgody użytkownika,
- przykład powinien być kartą onboardingową albo opcjonalnym przyciskiem „Utwórz przykładowy lead DEMO”.

---

## 10. Rekomendowany widok cennika

### Basic

```text
49 zł / 30 dni
Cena dla pierwszych klientów: 19 zł / 30 dni
```

Opis:

```text
Dla jednej osoby, która chce pilnować leadów i follow-upów.
```

### Pro

```text
99 zł / 30 dni
Cena dla pierwszych klientów: 39 zł / 30 dni
```

Opis:

```text
Najlepszy wybór dla firmy usługowej, która prowadzi leady, sprawy, zadania i terminy.
```

### AI / Owner

```text
179 zł / 30 dni
Cena dla pierwszych klientów: 69 zł / 30 dni
```

Opis:

```text
Dla właściciela, który chce raporty, szkice AI i więcej automatyzacji.
```

---

## 11. Czego nie robić

Nie robić:

- fałszywego „było / jest”, jeśli cena produkcyjna nie była realnie sprzedawana,
- agresywnej promocji procentowej bez podstawy,
- pełnego darmowego planu jako zamiennika płatnego produktu,
- dużych rabatów przy kodach polecających,
- darmowych miesięcy z automatu,
- ceny 19 / 39 / 69 zł jako docelowego produkcyjnego cennika po pełnym zakresie funkcji.

---

## 12. Decyzja końcowa

ROBIĆ.

Finalny kierunek:

```text
Produkcyjnie: 49 / 99 / 179 zł
Founder price: 19 / 39 / 69 zł
Standardowy trial: 14 dni
Trial z kodem/founder: 21 dni
Kod polecający: pakiet szybkiego startu + dłuższy trial + reward po płatności
```

Obecnych cen w kodzie nie zmieniać w tej decyzji.
Wdrożenie cennika zrobić jako osobny etap po potwierdzeniu pełnego zakresu funkcji i gotowości produkcyjnej.

---

## 13. Następny krok

Przygotować etap:

```text
CF-PRICING-001 — produkcyjny cennik, founder price i trial 14/21 dni
```

Zakres przyszłego etapu:

1. aktualizacja `BILLING_PLANS`,
2. aktualizacja rocznych cen,
3. aktualizacja komunikacji triala,
4. dodanie founder price / early access copy,
5. guardy cen i copy,
6. testy UI billing/rejestracja,
7. aktualizacja Obsidiana i `_project`.
