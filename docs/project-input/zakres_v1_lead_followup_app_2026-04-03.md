# Zakres V1 — warstwa sprzedaży (Lead Flow) w systemie ClientPilot

> Źródło prawdy produktu: `product-scope-v2.md` (w repo root).
>
> Ten dokument opisuje **V1 jako warstwę sprzedaży** (Lead Flow). Po scaleniu Lead Flow + Forteca (historycznie w repo mogła występować jako „ClientPilot”) produkt nie jest już “tylko lead follow-up app”, tylko **jeden system do domykania i uruchamiania klienta**.

**Data:** 2026-04-03  
**Status:** specyfikacja V1 (Lead Flow) — po scaleniu traktuj jako zakres warstwy sprzedaży  
**Cel dokumentu:** ustalić dokładnie, co wchodzi do V1, czego nie wolno teraz budować i jak traktować pomysły wykraczające poza ten zakres.

---

## Kontekst po scaleniu (żeby nie było sprzeczności)

- Produkt: **jeden system do domykania i uruchamiania klienta**
- Zasada nadrzędna: **sprzedaż = Lead Flow**
- Po statusie **won** albo **ready to start** lead może przejść do **sprawy operacyjnej**
- **Forteca nie jest osobną aplikacją** (historycznie w repo mogła występować jako „ClientPilot”); **Sprawy są modułem tego samego systemu**
- Finalne menu operatora: `Dziś`, `Leady`, `Sprawy`, `Zadania`, `Kalendarz`, `Aktywność`, `Rozliczenia`, `Ustawienia` (później: `Szablony`, `Klienci`)
- Kierunek UI: nowa skórka oparta o przesłany kierunek **Forteca**

# 1. Zasada nadrzędna dla AI dewelopera

Ten dokument opisuje **zamknięty zakres V1**.

AI deweloper ma obowiązek trzymać się tego zakresu.

## Reguła obowiązkowa

Jeżeli podczas analizy, projektowania albo wdrożenia wyjdzie funkcja, pomysł, integracja, automatyzacja albo element UX, który:
- nie jest potrzebny do domknięcia V1,
- rozszerza produkt w stronę większego CRM-a,
- wymaga nowego dużego modułu,
- zwiększa złożoność techniczną ponad sensowny poziom V1,
- dotyczy automatyzacji, AI, integracji albo zespołów ponad to, co ustalono,

to **AI deweloper nie ma tego samodzielnie dodawać do V1**.

Zamiast tego ma:
1. **jasno o tym napisać**,  
2. **wskazać, że to wychodzi poza zakres V1**,  
3. **zaproponować to jako kandydat do V2**,  
4. **nie wdrażać tego bez wyraźnej decyzji**.

## Krótka zasada robocza

**Jeśli coś wykracza poza V1 — zatrzymaj to, opisz i oznacz jako opcję do V2.**

---

# 2. Czym ma być V1

V1 nie ma być pełnym CRM-em.

V1 ma być:
- lekką aplikacją do prowadzenia leadów,
- systemem pilnowania zadań, follow-upów i wydarzeń,
- prostym plannerem dnia i tygodnia,
- narzędziem do niegubienia klientów i terminów,
- aplikacją działającą dobrze na komputerze i telefonie.

## Jednozdaniowa definicja V1 (Lead Flow)

**V1 to warstwa sprzedaży (Lead Flow) w systemie do domykania i uruchamiania klienta: prowadzenie leadów, planowanie działań i wydarzeń, przypomnienia oraz ekran `Dziś`, który codziennie mówi użytkownikowi, co ma zrobić, żeby nie gubić sprzedaży.**

---

# 3. Dla kogo jest V1

## Główny użytkownik
- freelancer,
- solo usługodawca,
- mała agencja 1–3 osoby,
- osoba, która sama ogarnia sprzedaż i follow-up,
- osoba, która bierze leady z kilku prostych źródeł i gubi je przez chaos.

## Przykładowe źródła leadów użytkownika
- Instagram,
- Facebook,
- Messenger,
- WhatsApp,
- e-mail,
- formularz,
- telefon,
- polecenie,
- cold outreach,
- inne.

## Problem użytkownika
Użytkownik nie potrzebuje ciężkiego systemu sprzedaży.

Użytkownik potrzebuje:
- wiedzieć, komu odpisać,
- wiedzieć, co zrobić dziś,
- nie zapominać o follow-upie,
- nie gubić terminów i kontaktów,
- mieć wszystko w jednym miejscu.

---

# 4. Główny cel V1

V1 ma dowozić 4 rzeczy:

1. **porządek w leadach**,  
2. **kontrolę nad next action i terminami**,  
3. **widok dnia i tygodnia bez chaosu**,  
4. **przypominanie o tym, co użytkownik miał zrobić**.

---

# 5. Platforma i forma produktu

## V1 ma być:
- aplikacją webową,
- mobile-first,
- przygotowaną jako PWA,
- działającą dobrze na laptopie i telefonie.

## To oznacza praktycznie
Nie budujemy teraz:
- osobnej aplikacji desktopowej,
- osobnej aplikacji natywnej Android,
- osobnej aplikacji natywnej iPhone.

Budujemy jedną aplikację webową, która:
- dobrze skaluje się na małym ekranie,
- ma wygodne sterowanie na telefonie,
- może zostać dodana do ekranu głównego jako PWA.

---

# 6. Model biznesowy V1

V1 ma być produktem subskrypcyjnym.

## W V1 musi istnieć
- plan płatny,
- status subskrypcji,
- ekran billingowy,
- możliwość aktywacji,
- możliwość wznowienia,
- możliwość ograniczenia funkcji po wygaśnięciu płatności.

## Na start
- jeden prosty plan,
- opcjonalny trial,
- brak chaosu planów i cen,
- brak skomplikowanego usage billing.

---

# 7. Zakres funkcjonalny V1

## 7.1. Konto, logowanie i dostęp

### V1 ma zawierać
- rejestrację,
- logowanie,
- wylogowanie,
- sesję użytkownika,
- prywatny dostęp do własnych danych,
- jeden workspace na użytkownika.

### Preferowany model logowania
- Google login.

### Dodatkowe założenia
- jeden użytkownik = jedno konto,
- jeden użytkownik = jeden workspace,
- bez rozbudowanych ról,
- bez współpracy zespołowej w V1.

---

## 7.2. Leady

To jest główny moduł V1.

### Każdy lead musi mieć

#### Dane podstawowe
- imię i nazwisko albo nazwa kontaktu,
- firma opcjonalnie,
- e-mail opcjonalnie,
- telefon opcjonalnie,
- źródło leadu,
- krótki opis,
- notatki.

#### Pola operacyjne
- status,
- priorytet,
- next action,
- data next action,
- godzina next action opcjonalnie,
- data utworzenia,
- data aktualizacji.

### Źródło leada — pole obowiązkowe
Na start lista źródeł:
- Instagram,
- Facebook,
- Messenger,
- WhatsApp,
- e-mail,
- formularz,
- telefon,
- polecenie,
- cold outreach,
- inne.

### Statusy leadów na start
- nowy,
- pierwszy kontakt wykonany,
- czekam na odpowiedź,
- follow-up potrzebny,
- spotkanie umówione,
- wygrany,
- stracony.

### Użytkownik musi móc
- dodać lead ręcznie,
- edytować lead,
- usunąć lead,
- zmienić status,
- dodać notatkę,
- ustawić next action,
- przypisać zadanie do leada,
- przypisać wydarzenie do leada,
- oznaczyć jako wygrany,
- oznaczyć jako stracony.

### Dodatkowo
- szybki formularz dodawania leada,
- prosty import CSV,
- lista leadów,
- wyszukiwarka,
- filtrowanie,
- sortowanie.

---

## 7.3. Historia działań przy leadzie

Każdy lead ma mieć prostą historię działań.

### Historia ma pokazywać
- moment dodania leada,
- zmiany statusu,
- dodane notatki,
- utworzone zadania,
- ustawione follow-upy,
- utworzone wydarzenia,
- oznaczenie jako wygrany,
- oznaczenie jako stracony.

To ma być czytelna oś czasu, a nie ciężki log systemowy.

---

## 7.4. Zadania / next action

To jest drugi najważniejszy moduł po leadach.

### Zadanie może być
- powiązane z leadem,
- niezależne od leada.

### Typy zadań / akcji
- follow-up,
- telefon,
- odpisać,
- wysłać ofertę,
- sprawdzić odpowiedź,
- spotkanie,
- inne.

### Pola zadania
- tytuł,
- typ,
- lead opcjonalnie,
- data,
- godzina opcjonalnie,
- priorytet,
- status,
- przypomnienie,
- cykliczność,
- notatka opcjonalnie.

### Status zadania
- do zrobienia,
- zrobione,
- zaległe,
- odłożone.

### Użytkownik musi móc
- dodać zadanie,
- edytować zadanie,
- usunąć zadanie,
- oznaczyć jako zrobione,
- przełożyć na później,
- powiązać z leadem,
- ustawić przypomnienie,
- ustawić cykliczność.

---

## 7.5. Wydarzenia

W V1 mają istnieć także wpisy bardziej kalendarzowe.

### Typy wydarzeń
- spotkanie,
- rozmowa telefoniczna,
- follow-up o konkretnej godzinie,
- deadline odpowiedzi,
- własne wydarzenie.

### Pola wydarzenia
- tytuł,
- typ,
- data,
- godzina startu,
- godzina końca opcjonalnie,
- lead opcjonalnie,
- opis / notatka,
- przypomnienie,
- cykliczność,
- status.

### Użytkownik musi móc
- dodać wydarzenie,
- edytować wydarzenie,
- usunąć wydarzenie,
- oznaczyć jako wykonane / zakończone,
- przełożyć wydarzenie,
- podpiąć wydarzenie pod leada.

---

## 7.6. Przypomnienia

To jest obowiązkowy moduł V1.

### Typy przypomnień

#### Jednorazowe
Przykład:
- przypomnij jutro o 10:00.

#### Cykliczne
Obsługiwane warianty:
- codziennie,
- co 2 dni,
- co tydzień,
- co miesiąc,
- w konkretny dzień tygodnia, np. co piątek.

### Przy tworzeniu przypomnienia użytkownik ma mieć opcję
- brak przypomnienia,
- przypomnij raz,
- przypominaj cyklicznie.

### Warunek zakończenia przypominania
- do oznaczenia jako zrobione,
- do konkretnej daty,
- określoną liczbę razy.

### W V1 przypomnienia mają działać
- w aplikacji,
- na ekranie „Dziś”,
- jako lista zaległych,
- opcjonalnie jako prosty e-mail reminder.

### W V1 nie wchodzi
- synchronizacja z Google Calendar,
- SMS,
- WhatsApp reminders,
- rozbudowane push workflows,
- integracja z zewnętrznymi kalendarzami.

---

## 7.7. Snooze / odłóż

To ma wejść do V1.

### Użytkownik ma móc odłożyć rzecz na
- za godzinę,
- jutro,
- za 2 dni,
- przyszły tydzień,
- własną datę.

---

## 7.8. Ekran „Dziś”

To ma być główny ekran produktu.

### Ekran „Dziś” ma pokazywać
- leady wymagające akcji dziś,
- zadania na dziś,
- wydarzenia na dziś,
- zaległe rzeczy,
- rzeczy na jutro w skrócie,
- najbliższe ważne terminy,
- szybkie dodanie leada,
- szybkie dodanie zadania,
- szybkie dodanie wydarzenia.

### Cel ekranu „Dziś”
Po wejściu do apki użytkownik ma w kilka sekund wiedzieć:
- co zrobić,
- czego nie przegapić,
- co już jest spóźnione.

---

## 7.9. Kalendarz

Kalendarz ma wejść do V1, ale w lekkiej formie.

### 1. Mini kalendarz miesięczny
Ma pokazywać:
- cały miesiąc,
- podświetlone dni, w których coś jest,
- oznaczenia dni z zadaniami, follow-upami, spotkaniami i wydarzeniami.

### Kliknięcie w dzień
Po kliknięciu użytkownik widzi:
- listę rzeczy na ten dzień,
- godzinę,
- typ,
- nazwę,
- powiązanie z leadem.

Z tego widoku musi móc:
- edytować,
- usunąć,
- oznaczyć jako zrobione,
- przełożyć.

### 2. Główny widok tygodniowy
To ma być główny widok planowania.

#### Układ
U góry:
- dni tygodnia z datami.

Pod każdym dniem:
- wydarzenia po godzinach,
- taski / follow-upy,
- wpisy bez godziny.

#### Funkcje widoku tygodniowego
- podgląd całego tygodnia,
- klik w wydarzenie,
- edycja,
- usunięcie,
- oznaczenie jako zrobione,
- szybkie dodanie nowego wpisu.

### 3. Oznaczenia typów
Warto dodać lekkie rozróżnienie typów:
- follow-up,
- spotkanie,
- telefon,
- zadanie,
- oferta.

Nie robić z tego rozbudowanego systemu kolorów.

---

## 7.10. Lista leadów

To osobny ekran.

### Musi zawierać
- wyszukiwarkę,
- filtry,
- sortowanie,
- szybki podgląd statusu,
- najbliższą akcję,
- datę kolejnego ruchu,
- oznaczenie zaległych leadów.

### Filtry
- po statusie,
- po źródle,
- po priorytecie,
- po terminie next action,
- po wygranych / straconych,
- po zaległych.

---

## 7.11. Szczegóły leada

Po wejściu w leada użytkownik ma widzieć:
- dane kontaktowe,
- źródło,
- status,
- notatki,
- historię działań,
- zadania,
- wydarzenia,
- next action,
- termin next action.

### Akcje w szczegółach leada
- zmień status,
- dodaj notatkę,
- dodaj follow-up,
- dodaj wydarzenie,
- dodaj zadanie,
- oznacz jako wygrany,
- oznacz jako stracony.

---

## 7.12. Import i szybkie dodawanie

To wchodzi do V1.

### 1. Ręczne dodawanie
Bardzo szybki formularz.

### 2. Import CSV
Minimalny import:
- nazwa,
- firma,
- e-mail,
- telefon,
- źródło,
- notatka.

### 3. Globalny przycisk szybkiego dodawania
- dodaj lead,
- dodaj zadanie,
- dodaj wydarzenie.

---

## 7.13. Subskrypcja i billing

To jest część V1.

### W V1 ma być
- ekran planu,
- status subskrypcji,
- trial albo aktywna subskrypcja,
- ekran płatności,
- możliwość anulowania,
- możliwość wznowienia.

### Zasada po wygaśnięciu
Nie usuwamy danych.

#### Blokujemy
- dodawanie nowych leadów,
- tworzenie nowych wydarzeń,
- tworzenie nowych zadań,
- inne funkcje premium.

#### Zostawiamy
- login,
- podgląd danych,
- ekran płatności,
- możliwość wznowienia.

---

## 7.14. Wersja telefoniczna

To ma być pełnoprawna część V1.

### Na telefonie aplikacja ma działać wygodnie
- duże klikalne elementy,
- prosty układ,
- brak ciężkich tabelek,
- wygodny ekran „Dziś”,
- wygodny kalendarz tygodniowy,
- mini miesiąc w lekkiej formie,
- szybkie dodawanie leada / taska / wydarzenia.

### Telefon nie jest dodatkiem
Telefon ma być normalnym urządzeniem do pracy z aplikacją.

---

## 7.15. PWA

V1 ma być przygotowane jako PWA.

### To oznacza
- możliwość dodania apki do ekranu głównego,
- własną ikonę,
- otwieranie w trybie zbliżonym do aplikacji,
- jeden kod dla komputera i telefonu.

### Nie robimy teraz
- natywnej aplikacji mobilnej,
- App Store,
- Google Play.

---

## 7.16. Ustawienia

W V1 ma być prosty ekran ustawień.

### Ustawienia użytkownika
- nazwa,
- e-mail,
- strefa czasowa,
- preferencje przypomnień.

### Ustawienia przypomnień
- przypomnienia in-app,
- e-mail reminders,
- domyślna godzina przypomnienia,
- domyślna opcja snooze.

### Ustawienia workspace
- nazwa workspace,
- plan,
- status subskrypcji.

---

# 8. Logika działania systemu

## 8.1. Zaległości

Rzecz staje się zaległa, gdy:
- termin minął,
- nie została oznaczona jako zrobiona,
- nie została przełożona.

### Zaległe rzeczy muszą być widoczne
- na ekranie „Dziś”,
- w kalendarzu,
- na liście leadów,
- w szczegółach leada.

---

## 8.2. Logika cyklicznych przypomnień

Jeśli zadanie jest cykliczne, po oznaczeniu jako zrobione system:
- tworzy kolejną instancję,
- albo przesuwa termin zgodnie z regułą.

Jeśli przypomnienie działa „do oznaczenia jako zrobione”, system przypomina dalej, dopóki użytkownik nie zamknie sprawy.

---

# 9. Dane i bezpieczeństwo

## Wszystkie dane użytkownika muszą być zapisane w chmurze
Czyli:
- leady,
- zadania,
- wydarzenia,
- notatki,
- subskrypcja,
- ustawienia.

## Każdy użytkownik widzi tylko swoje dane
Bez mieszania danych między kontami.

---

# 10. Ekrany, które muszą istnieć w V1

1. logowanie / rejestracja,  
2. onboarding prosty,  
3. ekran „Dziś”,  
4. lista leadów,  
5. szczegóły leada,  
6. kalendarz,  
7. ekran zadań / aktywności,  
8. billing / subskrypcja,  
9. ustawienia.  

---

# 11. Czego nie wolno teraz budować

To nie wchodzi do V1:
- rozbudowany AI assistant,
- automatyczne wyszukiwanie leadów po internecie,
- scraping platform,
- LinkedIn scraping,
- Facebook / Instagram scraping,
- Google Maps scraping,
- Google Contacts sync,
- Google Calendar sync,
- rozbudowane integracje z zewnętrznymi kanałami,
- zespoły i role,
- wielu użytkowników w jednym workspace,
- zaawansowane raporty,
- automatyzacje workflow,
- kampanie follow-upowe,
- natywna aplikacja mobilna,
- rozbudowany widok miesięczny jak w Google,
- drag & drop w kalendarzu,
- zapraszanie gości do wydarzeń,
- rozbudowane powiadomienia push jako rdzeń V1.

---

# 12. Co może wejść dopiero do V1.5 / V2

- inteligentne alerty,
- lead temperature / lead health,
- automatyczne sekwencje follow-upu,
- playbooki follow-upu,
- bardziej rozbudowane AI,
- szablony follow-upów,
- integracje,
- Google Calendar sync,
- zespół,
- kilka seatów,
- zaawansowane automatyzacje,
- legalny lead capture z własnych źródeł i oficjalnych API.

---

# 13. Minimalna definicja „gotowego V1”

V1 jest gotowe wtedy, gdy użytkownik potrafi:

1. założyć konto,  
2. zalogować się,  
3. dodać lead,  
4. ustawić źródło, status i next action,  
5. dodać zadanie lub wydarzenie,  
6. ustawić przypomnienie jednorazowe lub cykliczne,  
7. zobaczyć wszystko na ekranie „Dziś”,  
8. wejść do kalendarza i zaplanować tydzień,  
9. kliknąć dzień w mini miesiącu i zobaczyć listę rzeczy,  
10. edytować / usunąć / oznaczyć jako zrobione,  
11. korzystać z aplikacji na telefonie i komputerze,  
12. mieć aktywną subskrypcję i normalnie korzystać z aplikacji.  

---

# 14. Ostateczna zasada dla AI dewelopera

Jeżeli w trakcie prac pojawi się pomysł, który:
- poprawia produkt, ale nie jest konieczny do domknięcia V1,
- rozszerza produkt ponad uzgodniony zakres,
- wymaga nowego modułu lub dużej integracji,
- zmienia V1 w cięższy system,

to AI deweloper ma:
1. opisać tę rzecz osobno,  
2. napisać wprost, że to wychodzi poza V1,  
3. oznaczyć to jako potencjalną funkcję V2,  
4. nie wdrażać tego bez decyzji.  

---

# 15. Końcowy werdykt

To jest domknięty zakres V1.

Najważniejsza zasada przy budowie:
**nie dorzucać teraz rzeczy z V2 i nie zmieniać tego w duży CRM.**

