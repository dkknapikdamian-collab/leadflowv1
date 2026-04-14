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


- twardsze, wspólne blokady zapisu po utracie dostępu,
- notice `Tryb podglądu` na ekranach roboczych,
- prawdziwe wiązanie tasków z leadami,
- automatyczne przygotowanie portalu przy przejściu `lead -> case`,
- lepsze blokowanie akcji operatora w `Lead Detail`, `Case Detail`, `Today`, `Tasks`, `Leady` i `Kalendarz`.

## Co doszło teraz w najnowszym etapie

### 9. Jedna logika dostępu zamiast porozrzucanych wyjątków

Warstwa dostępu została spięta w jedną wspólną logikę.

Doszło:
- centralne liczenie stanu dostępu workspace,
- wspólna decyzja, czy zapis jest dozwolony,
- wspólne komunikaty blokady dla całej aplikacji,
- wspólne metadane statusu do sidebaru, mobile headera i ekranów roboczych.

To ogranicza sytuację, w której jeden ekran pozwala pisać, a drugi tylko częściowo blokuje akcje.

### 10. Twardsze blokady zapisu po utracie dostępu

Najważniejsze akcje operatora są teraz realnie blokowane po utracie dostępu, a nie tylko oznaczane wizualnie.

Objęte zostały m.in.:
- dodawanie leadów,
- dodawanie tasków,
- dodawanie wydarzeń,
- szybkie akcje na leadach,
- zmiany etapu w pipeline,
- edycja i ruchy na `Lead Detail`,
- operacje checklisty i portalu na `Case Detail`,
- część akcji z `Dziś` i `Kalendarza`.

Gdy workspace traci zapis, użytkownik dostaje jasny komunikat i przejście do `Billing`, zamiast cichego pół-działania.

### 11. Notice `Tryb podglądu` na ekranach roboczych

Na kluczowych ekranach roboczych doszedł wspólny notice, który mówi wprost, że zapis jest zablokowany i dlaczego.

Notice został dodany do:
- `Dziś`,
- `Leady`,
- `Zadania`,
- `Kalendarz`,
- `Lead Detail`,
- `Case Detail`.

To jest ważne, bo user nie musi zgadywać, czemu przycisk nie działa.

### 12. Taski są naprawdę powiązane z leadami

Taski nie są już tylko luźną listą obok procesu leadowego.

Doszło:
- wybór leada podczas tworzenia taska,
- zapis `leadId` i `leadName` na tasku,
- widoczna etykieta powiązanego leada na kartach tasków,
- filtrowanie: wszystkie / tylko z leadem / bez leada,
- szybkie przejście z taska bezpośrednio do leada.

To wzmacnia jeden z najważniejszych elementów produktu: zadanie ma wspierać ruch na leadzie, a nie żyć osobno.

### 13. `lead -> case -> portal` jest mocniej domknięte

Przy utworzeniu sprawy z leada system nie kończy już pracy na samym rekordzie `case`.

Doszło:
- automatyczne zapewnienie tokenu portalu po utworzeniu sprawy z leada,
- zapis gotowości portalu także na sprawie,
- możliwość kopiowania linku do portalu z poziomu `Lead Detail`, jeśli lead ma już powiązaną sprawę,
- wspólny helper do pilnowania, czy token portalu istnieje i jest aktywny.

To skraca drogę po wygraniu leada: nie trzeba już ręcznie dopychać portalu osobno.

### 14. `Case Detail` i `Lead Detail` są bardziej operator-first

Oba ekrany zostały dodatkowo dopięte pod realny przepływ operatora.

Doszło:
- blokowanie akcji edycyjnych zgodnie z realnym stanem dostępu,
- mocniejsze spięcie działań z portalem,
- bezpieczniejsze operacje wokół checklisty i szybkich akcji,
- mniej pół-stanów, w których UI udawał, że coś można zrobić.
