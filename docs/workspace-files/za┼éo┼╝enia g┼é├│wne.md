Założenia główne całego projektu

Zanim etapy, ustawiamy twarde zasady, których nie ruszamy bez powodu.

Model produktu
nowy użytkownik dostaje 7 dni darmowego testu
w czasie triala ma pełny dostęp
po końcu triala:
jeśli opłaci → korzysta dalej
jeśli nie opłaci → nie ma dostępu do normalnego używania aplikacji
dane użytkownika nie są kasowane od razu
Model kont
1 użytkownik = 1 konto
na start 1 użytkownik = 1 workspace
architektura ma być gotowa, żeby później można było dodać 2 workspace / 2 profile, ale nie robimy tego teraz w interfejsie
Dane
leady, taski, kalendarz i ustawienia nie mogą być trzymane jako główny stan w przeglądarce
dane użytkownika nie mogą być trzymane w .env
.env służy tylko do ustawień technicznych
dane użytkownika mają być przechowywane online
każdy użytkownik widzi tylko swoje dane
Architektura
frontend oddzielony od przechowywania danych
logowanie oddzielone od widoków
aplikacja ma być budowana tak, żeby dało się ją później przenieść na inne usługi bez rozwalania całości
Demo
domyślnie nowy użytkownik nie dostaje zasianych leadów demo
demo może istnieć tylko jako:
osobny tryb pokazowy
albo przycisk „wczytaj demo”
Bezpieczeństwo
minimum zbieranych danych
brak sekretów w kodzie frontu
pełna separacja danych użytkowników
backup danych
możliwość późniejszego usunięcia konta i danych
ETAP 0 — Ustalić architekturę i zasady, zanim ruszy dalsze wdrażanie
Cel

Ustawić jedną spójną logikę budowy aplikacji, żeby nie doklejać później rozwiązań na siłę.

Pliki do sprawdzenia
README.md
pliki dokumentacji projektu
opis zakresu V1
opis roadmapy wdrożenia
ewentualny plik z założeniami produktu
Zmień
Dopisz do dokumentacji, że:
aplikacja ma działać dla wielu użytkowników,
każdy użytkownik ma własne dane,
na start każdy użytkownik ma 1 workspace.
Dopisz, że model dostępu jest taki:
7 dni trial,
potem płatność albo blokada dostępu.
Dopisz, że dane użytkownika po końcu triala lub po wygaśnięciu płatności nie są kasowane od razu.
Dopisz, że demo nie jest domyślnym stanem produkcyjnym.
Dopisz, że płatności są późnym etapem wdrożenia, ale struktura pod trial i płatny dostęp ma być przewidziana wcześniej.
Dopisz wymagania bezpieczeństwa:
dane tylko tam, gdzie są potrzebne,
brak kluczy w kodzie klienta,
separacja danych użytkowników,
gotowość do backupów i odzyskiwania danych.
Nie zmieniaj
kodu widoków
logiki UI
obecnych funkcji, jeśli ten etap dotyczy tylko dokumentacji i zasad
Po wdrożeniu sprawdź
czy z dokumentacji jasno wynika model trial/płatność
czy jasno wynika, że demo nie jest stanem docelowym
czy jasno wynika, gdzie będą dane i kto ma do nich dostęp
Kryterium zakończenia
masz jeden spójny zestaw zasad, do którego potem wracamy przy każdym etapie
ETAP 1 — Ustabilizować obecną wersję aplikacji
Cel

Doprowadzić projekt do stanu, w którym jest technicznie stabilny i nadaje się jako baza pod wersję online.

Pliki do sprawdzenia
package.json
tsconfig.json
next.config.ts
app/layout.tsx
app/page.tsx
components/views.tsx
components/dashboard-shell.tsx
components/today-page-view.tsx
lib/types.ts
lib/store.tsx
wszystkie pliki używane przez główne widoki
Zmień
Napraw błędy, które blokują przygotowanie wersji online.
Uporządkuj typy danych, szczególnie przy formularzach i polach wyboru.
Upewnij się, że przechodzenie między głównymi sekcjami działa stabilnie.
Usuń lub odseparuj kod typowo testowy, jeśli wpływa na działanie aplikacji.
Sprawdź, czy dodawanie, edycja i usuwanie działają stabilnie w obecnej wersji.
Doprowadź projekt do stanu, w którym jego obecna wersja nie sypie się sama z siebie.
Nie zmieniaj
układu aplikacji
wyglądu, jeśli nie trzeba
logiki sekcji poza tym, co trzeba naprawić
Po wdrożeniu sprawdź
czy aplikacja odpala bez błędów
czy główne ekrany otwierają się poprawnie
czy akcje użytkownika nie powodują przypadkowych awarii
czy da się przygotować wersję do wrzucenia online
Kryterium zakończenia
aplikacja jest stabilna
nie ma błędów blokujących dalsze prace
ETAP 2 — Oddzielić demo od prawdziwego stanu użytkownika
Cel

Sprawić, żeby normalny użytkownik nie startował z gotowymi wpisami demo.

Pliki do sprawdzenia
lib/seed.ts
lib/snapshot.ts
lib/store.tsx
app/page.tsx
components/views.tsx
components/dashboard-shell.tsx
Zmień
Usuń automatyczne ładowanie demo jako domyślnego stanu.
Przygotuj pusty stan startowy:
brak leadów
brak tasków
brak wydarzeń
Dodaj czytelne komunikaty pustego stanu:
np. „dodaj pierwszego leada”
„utwórz pierwsze zadanie”
Jeśli chcesz zachować demo, przenieś je do:
osobnego przycisku
albo osobnego trybu pokazowego
Upewnij się, że pusty stan wygląda jak produkt gotowy dla użytkownika, a nie jak zepsuta aplikacja.
Nie zmieniaj
głównego układu sekcji
logiki działania list poza stanem początkowym
Po wdrożeniu sprawdź
czy nowy użytkownik startuje od pustego konta
czy demo nie włącza się samo
czy po usunięciu wszystkich danych aplikacja nadal działa poprawnie
Kryterium zakończenia
aplikacja zachowuje się jak realny produkt dla nowego użytkownika
ETAP 3 — Przygotować model danych pod użytkowników, workspace i trial
Cel

Ustawić właściwy szkielet danych, żeby później nie przebudowywać wszystkiego po logowaniu i płatnościach.

Pliki do sprawdzenia
lib/types.ts
lib/store.tsx
dokumentacja modelu danych
ewentualne pliki stałych i typów pomocniczych
Zmień
Przygotuj pojęcia danych:
profile
workspace
lead
task albo work item
calendar event
settings
access/billing status
Każdy lead, task i event ma być przypisany do workspace.
Każdy workspace ma być przypisany do konkretnego użytkownika.
Na start zakładaj 1 workspace na konto.
Przygotuj miejsce na status dostępu użytkownika:
trial_active
trial_expired
paid_active
payment_failed
canceled
Przygotuj miejsce na daty:
początek triala
koniec triala
ewentualny koniec płatnego dostępu
Przygotuj miejsce na to, czy użytkownik już wykorzystał trial.
Nie zmieniaj
nie rób jeszcze pełnego logowania
nie rób jeszcze płatności
nie rób jeszcze UI dla wielu workspace’ów
Po wdrożeniu sprawdź
czy każdy typ danych ma sensownego właściciela
czy można przypisać dane do użytkownika i workspace
czy model nie wymaga prucia, żeby dodać trial i płatność
Kryterium zakończenia
masz model danych gotowy pod konta, trial i płatny dostęp
ETAP 4 — Podłączyć miejsce do przechowywania danych online
Cel

Przygotować prawdziwe miejsce, gdzie aplikacja będzie zapisywać dane użytkowników.

Pliki do sprawdzenia
nowe pliki połączenia z usługą danych
lib/store.tsx
lib/types.ts
app/providers.tsx
.env.example
README.md
Zmień
Dodaj połączenie z usługą przechowywania danych online.
Przygotuj wzorcowy plik .env.example:
bez prawdziwych sekretów
tylko nazwy technicznych ustawień
Ustal jasny podział:
.env = ustawienia techniczne
baza = dane użytkownika
Przygotuj warstwę pośrednią do operacji na danych:
pobieranie
zapis
edycja
usuwanie
Nie pozwól, żeby komponenty widokowe rozmawiały z bazą w losowy sposób.
Zadbaj, żeby przyszłe przeniesienie aplikacji nie zależało od porozrzucanego kodu po całym projekcie.
Nie zmieniaj
nie przepinaj jeszcze wszystkiego na nowe źródło danych w jednym kroku
nie mieszaj jeszcze logowania z każdym ekranem na raz
Po wdrożeniu sprawdź
czy aplikacja umie połączyć się z miejscem przechowywania danych
czy ustawienia techniczne nie są wpisane na sztywno w kodzie
czy żadne prywatne dane nie trafiają do .env
Kryterium zakończenia
aplikacja jest gotowa do zapisu danych online
ETAP 5 — Dodać logowanie Google i tworzenie konta użytkownika
Cel

Każdy użytkownik ma własne konto i własną przestrzeń danych.

Pliki do sprawdzenia
pliki auth
app/layout.tsx
app/page.tsx
app/providers.tsx
middleware.ts jeśli istnieje
components/dashboard-shell.tsx
components/views.tsx
Zmień
Dodaj logowanie przez Google.
Po pierwszym logowaniu twórz użytkownikowi:
profil
1 domyślny workspace
domyślne ustawienia
Przy pierwszym logowaniu ustaw:
datę startu triala
datę końca triala
status trial_active
Dodaj prosty ekran logowania i wylogowania.
Dodaj ochronę prywatnych widoków:
niezalogowany nie ma wejścia do prywatnych danych
Upewnij się, że po zalogowaniu użytkownik trafia do swojego pustego albo zapisanego środowiska.
Nie zmieniaj
nie wdrażaj jeszcze checkoutu
nie wdrażaj jeszcze obsługi planów płatnych od strony użytkownika
nie rób jeszcze przełączania między wieloma workspace’ami
Po wdrożeniu sprawdź
czy użytkownik A nie widzi danych użytkownika B
czy wylogowanie naprawdę odcina dostęp
czy po ponownym logowaniu wracają własne dane
czy trial startuje tylko raz przy pierwszym założeniu konta
Kryterium zakończenia
działa logowanie
każdy użytkownik ma własne konto, własny workspace i aktywny trial
ETAP 6 — Przepiąć leady, taski, kalendarz i ustawienia na zapis online
Cel

Sprawić, żeby wszystkie ważne dane aplikacji zapisywały się online, a nie tylko lokalnie.

Pliki do sprawdzenia
lib/store.tsx
lib/snapshot.ts
lib/seed.ts
lib/today.ts
components/views.tsx
components/today-page-view.tsx
odpowiednie strony sekcji leads, tasks, calendar, settings
Zmień
Przepnij dodawanie leadów na zapis online.
Przepnij edycję leadów na zapis online.
Przepnij usuwanie leadów na zapis online.
To samo z taskami.
To samo z wydarzeniami kalendarza.
To samo z ustawieniami użytkownika.
Jeśli lokalny zapis zostaje chwilowo jako pomocniczy cache, nie może być głównym źródłem danych.
Usuń uzależnienie aplikacji od mechanizmu demo jako podstawy działania.
Nie zmieniaj
nazw sekcji
układu widoków
flow użytkownika, jeśli nie ma takiej potrzeby
Po wdrożeniu sprawdź
czy po odświeżeniu dane zostają
czy po wejściu z innego urządzenia dane są te same
czy usuwanie naprawdę usuwa dane z głównego źródła
czy nie ma podwójnych zapisów i duplikatów
Kryterium zakończenia
użytkownik pracuje już na prawdziwych danych online
ETAP 7 — Wdrożyć zasady bezpieczeństwa danych
Cel

Sprawić, żeby dane użytkowników były przechowywane sensownie i bez prostych dziur.

Pliki do sprawdzenia
pliki auth
pliki połączenia z bazą
.env.example
README.md
middleware.ts jeśli istnieje
pliki odczytu i zapisu danych
logika błędów
Zmień
Upewnij się, że prywatne klucze nie wychodzą do kodu frontu.
Upewnij się, że repo nie zawiera prawdziwych sekretów.
Zostaw tylko minimalny zakres danych potrzebnych do działania aplikacji.
Nie zapisuj rzeczy, których produkt nie potrzebuje.
Wdróż ścisłą zasadę:
każdy użytkownik ma dostęp tylko do swoich danych
Dodaj sensowną obsługę błędów:
bez technicznych ścian tekstu dla użytkownika
bez wyciekania informacji o systemie
Przygotuj backup danych.
Przygotuj prostą procedurę odzyskiwania danych po awarii.
Przygotuj miejsce pod:
eksport danych użytkownika
usunięcie konta
usunięcie danych po zgłoszeniu
Upewnij się, że logi błędów nie przechowują pełnych wrażliwych danych.
Nie zmieniaj
nie rób wielkiego panelu administracyjnego, jeśli nie jest potrzebny
nie komplikuj interfejsu dodatkowymi ekranami bezpieczeństwa bez potrzeby
Po wdrożeniu sprawdź
czy użytkownik A nie może zobaczyć danych B
czy klucze nie leżą w repo
czy .env nie trafia do repo
czy po błędach nie pokazują się wrażliwe informacje
czy dane da się odzyskać z backupu
Kryterium zakończenia
masz bezpieczne podstawy przechowywania danych
dane użytkowników są odseparowane
masz plan awaryjny
ETAP 8 — Postawić wersję testową online
Cel

Sprawdzić aplikację w prawdziwych warunkach online, a nie tylko lokalnie.

Pliki do sprawdzenia
package.json
next.config.ts
.env.example
README.md
konfiguracja hostingu
ustawienia logowania Google
Zmień
Podłącz repo do hostingu.
Ustaw zmienne środowiskowe.
Podłącz logowanie Google pod adres online.
Ustaw poprawne przekierowania po logowaniu i wylogowaniu.
Wystaw wersję testową online pod linkiem.
Przetestuj całą podstawową ścieżkę:
wejście
logowanie
dodanie leada
edycja
usunięcie
taski
kalendarz
ustawienia
wylogowanie
Nie zmieniaj
nie dokładaj jeszcze płatności
nie dokładaj jeszcze trial walla z checkoutem
nie dokładaj nowych funkcji pobocznych
Po wdrożeniu sprawdź
czy online działa tak samo jak lokalnie
czy logowanie działa poprawnie
czy sesja się nie gubi
czy dane użytkownika są poprawne po odświeżeniu
Kryterium zakończenia
masz działającą wersję testową online dla wielu użytkowników
ETAP 9 — Przygotować pełny model dostępu: trial i płatny dostęp
Cel

Zbudować logikę produktu, która rozróżnia użytkownika testowego od płacącego.

Pliki do sprawdzenia
lib/types.ts
model danych użytkownika i dostępu
app/billing/page.tsx
app/settings/page.tsx
components/views.tsx
pliki odpowiedzialne za dostęp do aplikacji
Zmień
Dodaj pełen model statusu dostępu:
trial_active
trial_expired
paid_active
payment_failed
canceled
Dodaj logikę liczenia końca triala.
Dodaj sprawdzanie, czy trial już minął.
Dodaj prosty wskaźnik w aplikacji:
ile dni triala zostało
Przygotuj ekran końca triala:
trial się skończył
wykup dostęp
Zdecyduj, które części aplikacji są po trialu blokowane:
najlepiej cały normalny dostęp roboczy
Upewnij się, że użytkownik po końcu triala nadal ma konto i zapisane dane, ale nie może normalnie pracować bez opłaty.
Przygotuj miejsce na identyfikator klienta w systemie płatności.
Przygotuj miejsce na zapis:
aktywnej subskrypcji
daty końca dostępu
ostatniego znanego statusu płatności
Nie zmieniaj
nie wdrażaj jeszcze samego checkoutu
nie wprowadzaj klasycznego darmowego planu na stałe
nie buduj skomplikowanej siatki planów
Po wdrożeniu sprawdź
czy nowy użytkownik dostaje trial
czy trial kończy się poprawnie
czy po końcu triala użytkownik nie ma pełnego dostępu
czy dane użytkownika nadal są zapisane
Kryterium zakończenia
model trial + płatny dostęp działa logicznie jeszcze przed samą płatnością
ETAP 10 — Przygotować ekran billing i flow po końcu triala
Cel

Użytkownik ma wiedzieć, co się dzieje z jego kontem i co ma zrobić dalej.

Pliki do sprawdzenia
app/billing/page.tsx
app/settings/page.tsx
komponenty komunikatów o stanie konta
ewentualny ekran blokady po trialu
Zmień
Zbuduj ekran billing, który pokazuje:
status konta
czy trial jest aktywny
ile dni zostało
czy konto jest płatne
czy trial się skończył
Dodaj ekran po końcu triala:
jasna informacja, że okres testowy się skończył
wezwanie do opłacenia dostępu
Dodaj miejsce na przyszły przycisk płatności.
Upewnij się, że flow jest proste:
trial trwa → pracujesz
trial minął → widzisz blokadę i billing
opłacisz → wracasz do pracy
Dodaj logiczne komunikaty przy:
nieudanej płatności
anulowaniu
problemie z odnowieniem
Nie zmieniaj
nie buduj jeszcze finalnej integracji płatności
nie dorabiaj kilku planów, jeśli nie są teraz potrzebne
Po wdrożeniu sprawdź
czy użytkownik rozumie stan swojego konta
czy nie ma chaosu w komunikatach
czy koniec triala nie wygląda jak bug
Kryterium zakończenia
użytkownik zawsze wie, czy jest na trialu, czy musi zapłacić
ETAP 11 — Minimum formalne i zasady danych
Cel

Nie wypuścić aplikacji do ludzi bez podstawowych zabezpieczeń formalnych i informacyjnych.

Pliki do sprawdzenia
publiczne dokumenty
ekran logowania
ekran billing
ustawienia konta
stopka i linki pomocnicze
Zmień
Dodaj politykę prywatności.
Dodaj regulamin.
Dodaj kontakt do supportu.
Dodaj informację:
jakie dane są przechowywane
po co są przechowywane
Dodaj podstawową procedurę:
usunięcia konta
kontaktu w sprawie danych
Jeśli po trialu konto ma być blokowane, opisz to jasno w zasadach produktu.
Jeśli dane mają nie być kasowane od razu po końcu triala, też trzeba to opisać w prosty sposób.
Nie zmieniaj
nie komplikuj języka dokumentów
nie rozwlekaj tego ponad minimum potrzebne do wypuszczenia produktu
Po wdrożeniu sprawdź
czy użytkownik wie, gdzie napisać
czy wie, co dzieje się z jego danymi
czy trial i blokada po trialu są opisane jasno
Kryterium zakończenia
produkt ma podstawy formalne do pokazania innym
ETAP 12 — Dopiąć płatności jako ostatni krok sprzedażowy
Cel

Uruchomić pobieranie pieniędzy dopiero wtedy, gdy cały rdzeń produktu działa.

Pliki do sprawdzenia
app/billing/page.tsx
pliki integracji płatności
model statusu dostępu
ustawienia konta
obsługa potwierdzeń płatności
dokumenty publiczne
Zmień
Wybierz dostawcę płatności.
Dodaj checkout.
Po poprawnej płatności:
zmień status użytkownika na paid_active
odblokuj dostęp
Po nieudanej płatności:
pokaż jasny komunikat
nie psuj konta i danych
Po anulowaniu lub wygaśnięciu:
odbierz pełny dostęp
ale nie kasuj od razu danych
Dodaj widok:
aktualny status
data końca płatnego dostępu
opcja zarządzania płatnością
Dodaj zabezpieczenia na przypadki typu:
użytkownik zapłacił, ale status się nie odświeżył
użytkownik przerwał płatność
odnowienie się nie udało
Upewnij się, że logika dostępu działa po stronie danych i logiki aplikacji, a nie tylko po stronie widoku.
Nie zmieniaj
nie uzależniaj całego działania aplikacji od jednego kruchego przycisku
nie kasuj danych użytkownika automatycznie po problemie z płatnością
Po wdrożeniu sprawdź
czy po opłaceniu dostęp wraca lub trwa dalej
czy po końcu płatności dostęp jest poprawnie blokowany
czy konto i dane zostają zachowane
czy błędna płatność nie rozwala konta
Kryterium zakończenia
płatność działa
trial przechodzi w płatny dostęp
brak płatności blokuje używanie
dane nie znikają bez sensu
Dodatkowe zasady, których nie pomijamy
1. Nie robić teraz 2 profili w UI

Na dziś:

1 konto
1 workspace

Ale architektura ma być gotowa, żeby później dać:

drugi workspace
limit zależny od planu
2. Nie przechowywać więcej danych niż trzeba

Na start nie zbierasz wszystkiego o wszystkich.
Im mniej trzymasz, tym lepiej dla bezpieczeństwa i prostoty.

3. Nie robić od razu uploadów plików

Załączniki i pliki:

komplikują bezpieczeństwo
komplikują backupy
komplikują migrację
podnoszą koszt

Na start bym to odłożył.

4. Nie mieszać logiki widoków z logiką dostępu

Widok ma tylko pokazywać stan.
To logika aplikacji i danych ma decydować:

czy trial trwa
czy dostęp jest aktywny
czy użytkownik ma wejść do środka
5. Nie kasować danych od razu po końcu triala

To ważne i biznesowo, i produktowo.

Lepszy model:

brak dostępu bez opłaty
ale dane jeszcze są
6. Przygotować później prostą politykę retencji danych

Czyli określić:

jak długo trzymasz dane po wygaśnięciu konta
kiedy mogą być kasowane
jak użytkownik może poprosić o usunięcie

To może dojść później, ale trzeba o tym pamiętać.

Skrót całej kolejności
ustalenie zasad i architektury
stabilizacja obecnej wersji
usunięcie domyślnego demo
model danych pod użytkownika, workspace i trial
podpięcie miejsca do przechowywania danych online
logowanie Google
migracja leadów, tasków, kalendarza i ustawień na zapis online
bezpieczeństwo, backupy i separacja danych
wersja testowa online
model trial + płatny dostęp
billing screen i flow po końcu triala
minimum formalne
płatności jako ostatni krok