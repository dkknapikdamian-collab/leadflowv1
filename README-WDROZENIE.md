# LeadFlow / Forteca — paczka robocza gotowa do testu lokalnego

## Co jest dopchnięte w tej paczce

- mobilny shell bez pełnego sidebara na telefonie,
- górne menu mobilne i dolna nawigacja dla głównych modułów,
- mniejszy, czytelniejszy badge trialu,
- skórki aplikacji:
  - Forteca Light,
  - Forteca Dark,
  - Midnight Graphite,
  - Sandstone,
- zapis aktywnej skórki lokalnie i do profilu w Firestore,
- odczyt skórki po zalogowaniu na innym urządzeniu,
- przebudowany ekran ustawień pod telefon,
- poprawiony hook `useWorkspace`, żeby reagował poprawnie na zmianę sesji użytkownika,
- usunięty martwy przycisk „wyloguj ze wszystkich urządzeń” i zastąpiony realną akcją wylogowania bieżącego urządzenia,
- lazy loading ekranów, żeby aplikacja nie ładowała całego frontu naraz przy wejściu,
- launchery `.bat` i folder `logs/`,
- mocniejszy ekran `Dziś` jako centrum decyzji,
- szybkie dodawanie leada z `next step` i terminem ruchu,
- globalny pass kontrastu dla współdzielonych komponentów i ekranów.


## Co doszło teraz w tym etapie

### 1. Leady dostały szybkie akcje bez wchodzenia w szczegóły

Ekran `Leady` został przebudowany pod realną pracę operacyjną.

Doszło:
- nowy, spójny układ zgodny ze skórkami,
- mocniejszy kontrast kart, badge'y, ikon i tekstu,
- karty leadów z prawdziwym kontekstem procesu:
  - wartość,
  - termin ruchu,
  - next step,
  - dni bez ruchu,
  - powód, dlaczego lead wymaga uwagi,
- szybkie akcje bezpośrednio z listy:
  - `Follow-up jutro`,
  - `Czekamy 3 dni`,
  - `Ustaw spotkanie`,
  - `Oznacz jako zagrożony / zdejmij ryzyko`,
  - `Wygrany`,
  - `Stracony`.

Czyli lista leadów nie jest już tylko przeglądem rekordów. Stała się miejscem, z którego można realnie pchać proces.

### 2. Doszedł widok `Pipeline`

Na ekranie `Leady` doszedł drugi tryb pracy:
- `Lista`,
- `Pipeline`.

Pipeline daje:
- kolumny etapów sprzedaży,
- liczbę leadów i sumę wartości w kolumnie,
- szybki podgląd terminu i wartości na karcie,
- szybką zmianę etapu bez wchodzenia do szczegółów.

To nie jest jeszcze ciężki drag & drop CRM, tylko lekki pipeline roboczy, zgodny z założeniami V1.

### 3. Lepsze filtrowanie i priorytetyzacja

Leady są teraz sortowane bardziej sprzedażowo:
- po terminie i stanie procesu,
- po brakującym kroku,
- po ryzyku,
- po wartości.

Czyli wyżej wpadają leady, które faktycznie trzeba ruszyć, a nie przypadkowa kolejność.

### 4. Lead Detail jako realne centrum pracy

Ekran `Lead Detail` został mocno przebudowany i przestał być starym, jaśniejszym formularzem z innego stylu.

Doszło:
- nowy układ w tym samym visual systemie co reszta aplikacji,
- staty na górze:
  - wartość,
  - źródło,
  - kolejny ruch,
  - dni bez ruchu,
- sekcja `Centrum ruchu` z szybkimi akcjami:
  - rozmowa wykonana,
  - follow-up jutro,
  - czekamy 3 dni,
  - spotkanie w 2 dni,
  - wygrany,
  - stracony,
- sekcja planowania kolejnego kroku z presetami terminów,
- lepsza oś historii działań,
- czytelniejsze dane kontaktowe,
- lepszy panel stanu procesu,
- panel uruchamiania sprawy z leada.

Czyli karta leada jest teraz bardziej pod:
- prowadzenie,
- pchanie procesu,
- ustawianie kolejnego ruchu,
a mniej pod samo oglądanie danych.

### 5. Mocniejsza logika `waiting too long` na ekranie `Dziś`

Na ekranie `Dziś` doszła osobna warstwa dla leadów, które:
- nie są jeszcze technicznie overdue,
- ale wiszą już za długo bez odpowiedzi lub bez ruchu.

Doszło:
- osobna sekcja `Czekają za długo`,
- lepsze wyłapywanie leadów zawieszonych po kontakcie / ofercie / follow-upie,
- dodatkowy sygnał w bocznej kolumnie, że część leadów robi się niebezpieczna mimo braku formalnego przeterminowania.

To jest ważne, bo właśnie takie leady często „umierają po cichu”.

### 6. Kolejny pass kontrastu tam, gdzie było jeszcze za słabo

Przebudowany `Lead Detail` od razu wylądował na tym samym systemie kontrastu i powierzchni co reszta paczki, więc:
- mniej starych białych kart,
- mniej jasnych ikon na jasnym tle,
- mniej fragmentów odstających od skórek,
- lepsza czytelność na telefonie i desktopie.


### 7. Moduł `Sprawy` przeszedł na nową skórkę i logiczne handoffy

Ekrany `Sprawy` i `Case Detail` nie odstają już wizualnie od reszty aplikacji.

Doszło:
- nowy, spójny layout zgodny ze skórkami,
- lepszy kontrast kart, postępu, badge'y i przycisków,
- filtry widoku spraw: wszystkie / aktywne / czekają / zablokowane / gotowe / domknięte,
- karty spraw z czytelnym postępem kompletności,
- pokazywanie, czy sprawa przyszła z leada,
- szybki powrót do źródłowego leada z poziomu sprawy,
- bardziej bojowy `Case Detail` z checklistą, historią, blokadami i panelem operatora,
- czytelniejszy panel portalu klienta i kopiowania linku.

Czyli warstwa po sprzedaży przestała wyglądać jak osobna, starsza aplikacja.

### 8. Lepsze przejście `lead -> case`


### 9. Portal klienta przeszedł na nowy styl i mocniejszą logikę

Ekran `Client Portal` nie odstaje już od reszty produktu.

Doszło:
- nowy układ zgodny ze skórkami i lepszym kontrastem,
- licznik postępu oraz boczny panel tego, co jeszcze blokuje sprawę,
- filtry checklisty: wszystko / do zrobienia / wysłane / gotowe / do poprawy,
- czytelniejsze statusy elementów,
- lepsze dialogi do wysyłania plików, odpowiedzi i danych dostępowych,
- pokazywanie ostatnio wysłanej odpowiedzi lub pliku bezpośrednio na karcie elementu,
- prostszy ekran błędnego lub wygasłego linku,
- walidacja tokenu z obsługą wygaszenia / unieważnienia, jeśli takie pola są zapisane.

Czyli po wysłaniu klientowi linku portal nie wygląda już jak obca część aplikacji, tylko jak naturalna kontynuacja całego flow.


Samo utworzenie sprawy z leada zostało domknięte mocniej niż wcześniej.

Doszło:
- zapis `linkedCaseId` i tytułu sprawy na leadzie,
- zapis źródła leadowego na sprawie,
- przeniesienie otwartych tasków powiązanych z leadem do kontekstu sprawy,
- bogatszy log aktywności po utworzeniu sprawy.

To ogranicza moment, w którym po wygraniu leada znika część kontekstu operacyjnego.

## Status techniczny tej paczki

Sprawdzone lokalnie na tej paczce:

- `npm install` ✅
- `npm run lint` ✅
- `npm run build` ✅

## Ważne pliki zmienione

- `src/pages/Leads.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/Today.tsx`
- `src/pages/Cases.tsx`
- `src/pages/CaseDetail.tsx`
- `README-WDROZENIE.md`

oraz wcześniej dopchnięte i nadal obecne:

- `src/App.tsx`
- `src/hooks/useWorkspace.ts`
- `src/pages/Tasks.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Login.tsx`
- `src/pages/Billing.tsx`
- `src/pages/Settings.tsx`
- `src/components/Layout.tsx`
- `src/components/appearance-provider.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/badge.tsx`
- `src/lib/appearance.ts`
- `src/index.css`
- `src/main.tsx`
- `URUCHOM_APLIKACJE.bat`
- `URUCHOM_TESTY_I_APLIKACJE.bat`
- `logs/app.log`
- `logs/error.log`
- `logs/test.log`

## Jak uruchomić

### Szybki start
Uruchom:

```text
URUCHOM_APLIKACJE.bat
```

### Start z pełnym sprawdzeniem przed uruchomieniem
Uruchom:

```text
URUCHOM_TESTY_I_APLIKACJE.bat
```

## Co nadal jest sensownym kolejnym etapem

Najmocniejszy kolejny ruch bez wrzucania tego jeszcze na Git:

- dopchnąć następne szybkie akcje także na ekran `Dziś`,
- domknąć bardziej bojowe operacje na taskach powiązanych z leadem,
- dalej czyścić stare fragmenty stylu w mniej używanych ekranach,
- rozważyć lekki drag & drop pipeline dopiero po stabilizacji tej wersji.

- dashboard operatora `/dashboard` z przekrojowymi statami leadów, spraw, tasków, wydarzeń i ostatniej aktywności,
- ekran `Aktywność` przebudowany na prawdziwą taśmę operacyjną z filtrami, szybkimi skokami do rekordu i lepszą czytelnością,
- desktopowe menu dostało pozycję `Panel`, bez zaśmiecania dolnej nawigacji na telefonie.

### 10. Warstwa dostępu i billingu przestała być tylko atrapą

Doszło mocniejsze domknięcie stanu komercyjnego aplikacji:
- wspólna logika `access state` dla trialu, planu płatnego, wygaszenia, `payment_failed` i `canceled`,
- sidebar, mobile header i banner blokady pokazują już prawdziwy stan dostępu zamiast prostego `trial / nie trial`,
- ekran `Billing` pozwala teraz testować pełen przepływ stanów bez Stripe:
  - aktywacja planu,
  - symulacja wygaśnięcia trialu,
  - `payment_failed`,
  - `canceled`,
  - wznowienie planu,
  - ponowne uruchomienie trialu,
- dashboard pokazuje już skrót stanu dostępu workspace, żeby nie trzeba było wchodzić do rozliczeń,
- blokada dostępu ma teraz spójne komunikaty w całej aplikacji.

Czyli warstwa `trial / billing / access` nie jest już tylko tekstem i jednym badge'em, tylko realnym stanem produktu gotowym pod późniejsze podpięcie prawdziwej płatności.


### 11. Doszedł pełny moduł `Szablony`

Dodałem osobny ekran `Szablony`, żeby warstwa `lead -> case` nie kończyła się na wyborze kilku zasianych gotowców.

Doszło:
- osobny route `/templates`,
- nowa pozycja `Szablony` w nawigacji,
- lista istniejących szablonów z wyszukiwarką,
- staty szablonów i pozycji checklist,
- tworzenie nowego szablonu,
- edycja istniejącego szablonu,
- duplikowanie szablonu,
- usuwanie szablonu,
- edycja pozycji checklisty w szablonie:
  - tytuł,
  - opis,
  - typ,
  - obowiązkowość,
- link z `Lead Detail` do zarządzania szablonami przy uruchamianiu sprawy.

To domyka ważny brak produktu: operator może już sam budować gotowce dla różnych typów realizacji zamiast polegać tylko na seedzie startowym.


### 12. Doszedł moduł `Klienci` jako warstwa pośrednia

Dodałem osobny ekran `Klienci`, żeby domknąć ścieżkę między leadem i sprawą.

Doszło:
- route `/clients`,
- nowa pozycja `Klienci` w nawigacji desktopowej,
- lista klientów z wyszukiwarką i filtrami,
- staty: wszyscy / w sprzedaży / onboarding / w realizacji / do spięcia,
- ręczne dodawanie klienta,
- fallbackowe rekordy budowane z istniejących leadów i spraw, więc moduł nie jest pusty na starych danych,
- szybkie przejścia do źródłowego leada i sprawy,
- akcja spinania fallbackowego rekordu w stałego klienta.

Dodatkowo domknąłem powiązania danych:
- `lead -> case` tworzy i aktualizuje rekord klienta,
- sprawa zapisuje `clientId`, `clientEmail`, `clientPhone`, `company`,
- lead zapisuje `linkedClientId`,
- wygenerowanie portalu oznacza sprawę i klienta jako `portalReady`.


### 13. Doszło prawdziwe `Centrum klienta`

Moduł `Klienci` nie jest już tylko listą rekordów.

Doszło:
- route `/clients/:clientId`,
- pełny ekran szczegółu klienta,
- edycja danych klienta:
  - nazwa,
  - firma,
  - e-mail,
  - telefon,
  - notatka operatora,
- możliwość spięcia fallbackowego klienta do stałego rekordu bez wychodzenia ze szczegółu,
- widok wszystkich powiązań klienta w jednym miejscu:
  - leady,
  - sprawy,
  - zadania,
  - wydarzenia,
- tworzenie zadania bezpośrednio z poziomu klienta,
- tworzenie wydarzenia bezpośrednio z poziomu klienta,
- automatyczne zapisywanie przy nowych zadaniach i wydarzeniach pól:
  - `clientId`,
  - `clientName`,
  - `leadId`,
  - `leadName`,
  - `caseId`,
  - `caseTitle`,
- mocniejsze linkowanie między modułami: klient → lead / sprawa / kalendarz.

Dodatkowo dopiąłem ekran `Zadania`, żeby lepiej pokazywał kontekst procesu:
- karta taska pokazuje już klienta i sprawę,
- z taska można wejść bezpośrednio do klienta, sprawy albo leada.

To jest ważne, bo klient staje się teraz realnym centrum pracy po sprzedaży, a nie tylko warstwą pośrednią na liście.
