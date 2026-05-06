# CloseFlow — aktualizacja specyfikacji po uwagach użytkownika (2026-04-23)

## Najważniejsza zmiana kierunku

Dotychczasowy model był za ciężki i zbyt „CRM-owy”.
Po uwagach użytkownika obowiązuje prostsza zasada:

- **Lead** = temat do pozyskania
- **Sprawa** = temat już prowadzony operacyjnie
- **Klient** = osoba / firma w tle, która może mieć wiele tematów

## Zmiana języka produktu

Nie używać sformułowań:
- „lead zamknięty sprzedażowo”
- „zamknięty sprzedażowo”
- „sales closed”

Używać:
- **Temat pozyskany do obsługi**
- **Temat jest już w obsłudze**
- **Przeniesiony do obsługi** tylko tam, gdzie potrzebny jest status techniczny
- **Otwórz sprawę**

Dla zwykłego użytkownika najlepsze główne copy to:

## **Ten temat jest już w obsłudze**

---

## Usunięcie pola „Następny krok”

Pole **„Następny krok”** ma zostać usunięte z głównej logiki produktu.

### Powód
To pole jest:
- zbędne,
- nieintuicyjne,
- dubluje zadania / wydarzenia,
- tworzy chaos, bo użytkownik musi pamiętać osobny tekstowy „kolejny ruch” zamiast po prostu planować realną akcję w czasie.

### Nowa zasada
Zamiast pola „Następny krok” system ma pokazywać:

## **Najbliższą zaplanowaną akcję**

Czyli najbliższy w czasie element spośród:
- zadania,
- wydarzenia,
- innych akcji, które mają przypisany termin / czas.

### Docelowy blok
#### Najbliższa akcja
- typ: Zadanie / Wydarzenie
- tytuł
- termin
- powiązanie z leadem / sprawą / klientem
- przycisk otwierający szczegóły

Jeśli nic nie ma:
- `Brak zaplanowanych działań`

---

## Usunięcie placeholdera „Co teraz zrobić z tym leadem”

Blok:

## `Co teraz zrobić z tym leadem`

ma zostać usunięty.

### Powód
To jest sztuczny placeholder i tylko zwiększa chaos.
Nie wnosi nowej informacji.
Użytkownik ma działać przez:
- zadania,
- wydarzenia,
- sprawę,
- historię.

Nie przez dodatkowy, opisowy blok „co teraz zrobić”.

---

## Nowa zasada po pozyskaniu leada

### Co się dzieje, gdy lead jest pozyskany
Gdy temat jest już realnie pozyskany do współpracy i wchodzi do prowadzenia:

użytkownik klika:

## **Rozpocznij obsługę**

Po tym kliknięciu system:
1. tworzy sprawę,
2. podpina ją do klienta,
3. podpina ją do leada jako źródła,
4. oznacza lead jako przeniesiony / pozyskany do obsługi,
5. usuwa go z aktywnej listy leadów,
6. przenosi główną pracę do sprawy,
7. najlepiej od razu przekierowuje użytkownika do sprawy.

---

## Co dzieje się z leadem po pozyskaniu

Lead **nie znika**.
Ale też **nie jest już głównym miejscem pracy**.

Lead po pozyskaniu ma zostać:
- historią pozyskania,
- źródłem kontaktu,
- źródłem sprawy,
- archiwalnym śladem rozmów i działań sprzedażowych.

## Ważne
Lead po pozyskaniu **nie „ląduje do klienta” jako ekran roboczy**.

### Finalny model pracy
- **Lead aktywny** → miejsce pracy sprzedażowej
- **Sprawa** → miejsce pracy operacyjnej
- **Klient** → wspólny rekord w tle, łączący tematy

Czyli:
po pozyskaniu użytkownik nie ma dalej pracować głównie na leadzie ani na „kliencie”, tylko na **sprawie**.

---

## Co zostaje na leadzie po pozyskaniu

Po pozyskaniu lead ma pokazywać tylko:

### 1. Box główny
## **Ten temat jest już w obsłudze**
- sprawa
- status sprawy
- data przejścia
- przycisk `Otwórz sprawę`

### 2. Informacje źródłowe
- wartość
- źródło
- kontakt
- firma
- dane historyczne

### 3. Historia kontaktu
- notatki
- aktywności
- dawne rozmowy
- dawne działania sprzedażowe

### 4. Powiązana sprawa
- nazwa sprawy
- status
- link do sprawy

I tyle.

---

## Co trzeba wyrzucić z leada po pozyskaniu

Po statusie „pozyskany do obsługi” / „w obsłudze” z ekranu leada trzeba usunąć albo całkowicie ukryć:

- pole `Następny krok`
- blok `Co teraz zrobić z tym leadem`
- blok `Planowanie ruchu`
- ręczne ustawianie kolejnego kroku
- przyciski `Dodaj zadanie`
- przyciski `Dodaj wydarzenie`
- inne szybkie akcje sprzedażowe
- wszystko, co sugeruje, że lead nadal jest aktywnym miejscem codziennej pracy

### Powód
Po pozyskaniu użytkownik ma już pracować na sprawie.
Jeśli te elementy zostaną na leadzie, user znowu nie będzie wiedział:
- gdzie ma działać,
- czy to nadal lead,
- czy już sprawa.

---

## Co ma być głównym miejscem pracy po pozyskaniu

## Sprawa

To na sprawie mają być:
- dodawanie notatek,
- zadania,
- wydarzenia,
- checklisty,
- dokumenty,
- postęp,
- planowanie dalszych działań.

### Klient
Klient ma być bardziej rekordem wspólnym w tle:
- pokazuje, z kim pracujemy,
- łączy leady i sprawy,
- pomaga przy kolejnych tematach tego samego człowieka,
- ale nie powinien być teraz głównym ekranem roboczym zamiast sprawy.

---

## Finalny prosty flow użytkownika

### 1. Dzwonię do właściciela działki
Dodaję go jako **leada**.

Na leadzie mam:
- notatki,
- zadania,
- wydarzenia,
- historię rozmów.

### 2. Właściciel mówi „działamy”
Klikam:

## **Rozpocznij obsługę**

### 3. System robi automatycznie
- tworzy sprawę,
- oznacza lead jako pozyskany do obsługi,
- chowa go z aktywnych leadów,
- przenosi mnie do sprawy.

### 4. Dalej pracuję już tylko w sprawie
Tam dodaję:
- notatki,
- zadania,
- wydarzenia,
- kolejne działania.

### 5. Gdy wrócę do leada
Widzę tylko:
- że temat jest już w obsłudze,
- skąd przyszedł,
- jaka sprawa powstała,
- i przycisk `Otwórz sprawę`.

---

## Nowy blok zamiast „Następny krok”

Na aktywnym leadzie można zostawić blok:

## `Najbliższa akcja`

### Logika
Pokazuje najbliższy termin spośród:
- zadań,
- wydarzeń,
- innych terminowych elementów.

### Przykład
- `Telefon do właściciela` — jutro 10:00
- `Spotkanie na działce` — 25 kwi 16:00

Jeśli nic nie ma:
- `Brak zaplanowanych działań`

### Ważne
To nie jest nowe ręczne pole.
To tylko inteligentny podgląd z istniejących zadań i wydarzeń.

---

## Finalne zasady UX

### Lead aktywny
Pokazuje:
- dane,
- źródło,
- wartość,
- historię,
- zadania,
- wydarzenia,
- najbliższą akcję,
- przycisk `Rozpocznij obsługę`.

### Lead pozyskany
Pokazuje:
- tylko informację,
- historię,
- dane źródłowe,
- przycisk `Otwórz sprawę`.

### Sprawa
Pokazuje:
- całą dalszą pracę operacyjną.

---

## Kryterium zakończenia po tej aktualizacji

Zmiana jest zakończona dopiero wtedy, gdy użytkownik:
- nie widzi pola „Następny krok”,
- nie widzi placeholdera „Co teraz zrobić z tym leadem”,
- po pozyskaniu nie ma już na leadzie akcji typu zadanie / wydarzenie,
- po kliknięciu `Rozpocznij obsługę` naturalnie przechodzi do sprawy,
- rozumie bez tłumaczenia:
  - lead = temat do pozyskania,
  - sprawa = miejsce dalszej pracy,
  - klient = rekord w tle.
