# Pomysł biznesowy — Allegro Alert Karty Produktu

Data: 2026-06-03
Status: pomysł zapisany do dalszego rozwijania
Typ: produkt diagnostyczny + usługa cykliczna
Model: Furtka–Renta
Canonical name: Allegro Alert Karty Produktu
Alias: Marketplace Compliance Repair Desk / Allegro Offer Repair Desk

---

## Cel wpisu

Zachować pomysł biznesowy do dalszej rozmowy i testu sprzedażowego.

To nie jest jeszcze aktywny projekt wdrożeniowy. To jest kandydat do rozwinięcia w Business Ideas.

---

## Decyzja Damiana

Damian uznał pomysł za ciekawy i chce zapisać go do pomysłów biznesowych oraz wrócić do niego później.

---

## Teza

Sprzedać najpierw tani, prosty produkt diagnostyczny dla sprzedawców Allegro, a potem sprzedawać usługę naprawy, wdrożenia i monitoringu.

Nie zaczynać od pełnej aplikacji ani od wchodzenia na konto klienta.

---

## Produkt wejściowy — furtka

Nazwa robocza:

**Allegro Alert Karty Produktu**

Prosta obietnica:

> Sprawdzamy wybrane oferty Allegro i pokazujemy, które mogą mieć braki w parametrach, danych produktu, opisie albo elementach wymagających poprawy przed edycją, wznowieniem lub dalszą sprzedażą.

Zakres MVP:

- klient przesyła eksport ofert, plik roboczy albo linki,
- bez hasła do konta,
- bez dostępu do panelu,
- bez wdrażania zmian na starcie,
- wynik: arkusz + krótki raport.

Cena testowa:

- 99–149 PLN za mini-skan 30 ofert,
- 299–499 PLN za większy skan,
- cena do potwierdzenia testem sprzedażowym.

---

## Usługa późniejsza — renta

Po raporcie sprzedawać:

1. **Pakiet naprawczy**
   - poprawione tytuły,
   - poprawione opisy,
   - lista parametrów do uzupełnienia,
   - dane wymagające potwierdzenia przez klienta,
   - plik XLSX/CSV gotowy do pracy,
   - instrukcja wdrożenia.

2. **Konsultacja wdrożeniowa**
   - klient sam klika,
   - operator prowadzi go krok po kroku,
   - bez przejmowania konta.

3. **Wdrożenie premium**
   - tylko po umowie,
   - bez proszenia o hasło,
   - przez czasowy dostęp / uprawnionego użytkownika / OAuth, jeśli będzie wdrożone,
   - każda zmiana po akceptacji klienta,
   - log zmian,
   - zakaz zmian cen i stanów magazynowych bez osobnej zgody.

4. **Monitoring miesięczny**
   - okresowy skan ofert,
   - nowe braki,
   - zmiany wymagań,
   - lista ofert do poprawy,
   - upsell do pakietu naprawczego.

---

## Dlaczego to pasuje do Modelu Furtka–Renta

Furtka:

- tani produkt,
- niski próg wejścia,
- klient nie musi dawać dostępu do konta,
- prosty wynik: lista ryzyk i braków.

Renta:

- naprawa ofert,
- wdrożenie,
- konsultacje,
- monitoring,
- aktualizacje po zmianach Allegro,
- praca na większych katalogach ofert.

---

## Źródła i założenia z researchu

FAKTY:

- Allegro publikuje zmiany w kategoriach i parametrach, a brak obowiązkowych parametrów może ograniczać wystawianie, edycję albo wznowienie ofert.
  Źródło: https://help.allegro.com/pl/sell/c/zmiany-w-kategoriach-i-parametrach

- Allegro obsługuje pracę na ofertach z pliku; jedna oferta to jeden wiersz, a w pliku nie może być więcej niż 10 000 ofert.
  Źródło: https://help.allegro.com/pl/sell/c/jak-wystawiac-oferty-z-pliku

- Allegro ma mechanizm „Uprawnieni użytkownicy”, gdzie właściciel konta może nadać innym osobom wybrane zakresy dostępu i później je wycofać albo zablokować.
  Źródło: https://help.allegro.com/pl/sell/c/zarzadzanie-dostepem-do-konta

HIPOTEZY:

- Sprzedawcy z większą liczbą ofert mają realny ból związany z parametrami, danymi produktu i zmianami wymagań marketplace.
- Tani alert może być łatwiejszy do sprzedaży niż pełna usługa wdrożeniowa.
- Największa marża może być w pakietach naprawczych i monitoringu, nie w samym raporcie.

---

## Czego nie obiecywać

Nie komunikować jako:

- pełna zgodność prawna,
- gwarancja braku blokad,
- automatyczna naprawa Allegro bez akceptacji,
- zastępstwo za kancelarię albo oficjalne doradztwo compliance,
- magiczne AI, które samo zna prawdę o produkcie.

Komunikować jako:

> Porządkujemy dane ofert, wskazujemy braki, przygotowujemy gotowe poprawki i pomagamy utrzymać katalog w lepszym stanie.

---

## Guardy jakości i ryzyka

- AI nie może wymyślać EAN/GTIN, producenta, kraju pochodzenia, certyfikatów, parametrów technicznych, ostrzeżeń ani danych bezpieczeństwa.
- Dane niepewne muszą być oznaczone jako „do potwierdzenia przez klienta”.
- Wdrożenie na koncie klienta wymaga umowy, zakresu odpowiedzialności, zasad dostępu i logu zmian.
- Na starcie nie brać haseł klienta.
- Nie zmieniać cen, stanów magazynowych, dostaw ani warunków sprzedaży bez osobnej zgody.

---

## Prosty format raportu

Arkusz wynikowy:

```text
ID oferty
Tytuł
Kategoria
Problem
Priorytet
Czy może blokować edycję / wznowienie
Czy wymaga danych od klienta
Sugerowana poprawka
Czy można przygotować w pakiecie naprawczym
Status
```

Krótki PDF:

```text
3 największe ryzyka
10 ofert do poprawy jako pierwsze
co klient może zrobić sam
co możemy przygotować za klienta
co wymaga danych od klienta
propozycja pakietu naprawczego
```

---

## Test sprzedażowy

Najkrótszy test:

1. Przygotować landing lub prostą ofertę tekstową.
2. Przygotować przykładowy raport dla 10–30 ofert.
3. Sprzedać 5 testowych mini-skanów po 99–149 PLN.
4. Sprawdzić, ilu klientów chce dopłacić za pakiet naprawczy.
5. Dopiero po sygnałach sprzedażowych rozważyć aplikację/panel/API.

Kryterium PASS:

- minimum 5 rozmów z realnymi sprzedawcami,
- minimum 1 płatny mini-skan albo wyraźna deklaracja zakupu,
- minimum 1 klient zainteresowany pakietem naprawczym.

Kryterium FAIL:

- sprzedawcy nie widzą problemu,
- nie chcą przesłać pliku/linków,
- raport nie prowadzi do upsellu,
- naprawa wymaga zbyt dużo ręcznej pracy przy niskiej cenie.

---

## Werdykt roboczy

ROZWIJAĆ JAKO POMYSŁ.

Nie budować od razu aplikacji.

Najlepszy pierwszy produkt:

> Allegro Alert 30 ofert — tani skan wejściowy, który otwiera drogę do pakietu naprawczego i monitoringu.

---

## Następny krok

Przy kolejnym powrocie do tematu przygotować:

- nazwę finalną,
- ofertę sprzedażową,
- landing one-page,
- przykładowy raport,
- wiadomość do sprzedawcy,
- checklistę danych wejściowych,
- warunki pakietu naprawczego,
- prostą umowę/zakres dla wdrożenia premium.
