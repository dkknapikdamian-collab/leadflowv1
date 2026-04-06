# zasady.md

## Rola pliku

Ten plik dotyczy wyłącznie:
- zasad naszej współpracy,
- mojego sposobu pracy,
- mojego zakresu odpowiedzialności,
- sposobu przekazywania Ci plików i pakietów,
- zasad komunikacji przy testach, poprawkach i kolejnych wdrożeniach.

Ten plik nie opisuje szczegółowych wytycznych produktu ani architektury aplikacji.
To trafia do `agent.md`.

## Podział ról między plikami

### `zasady.md`
Tutaj zapisujemy:
- jak współpracujemy,
- co robię ja,
- co robisz Ty,
- jak aktualizujemy projekt,
- jak przekazuję pliki,
- jak raportujemy błędy,
- jak wygląda tryb iteracyjny.

### `agent.md`
Tutaj zapisujemy:
- wytyczne aplikacji,
- architekturę produktu,
- funkcje MVP,
- kierunek UI/UX,
- logowanie,
- kalendarz,
- billing,
- model danych,
- integracje,
- roadmapę i zakres produktu.

## Mój zakres odpowiedzialności

1. To ja przygotowuję:
   - architekturę,
   - strukturę projektu,
   - pliki,
   - dokumentację,
   - widoki,
   - pakiety wdrożeniowe,
   - launchery,
   - poprawki,
   - kierunek techniczny.
2. To ja podejmuję rozsądne decyzje techniczne tam, gdzie nie trzeba Cię angażować.
3. Nie przerzucam na Ciebie projektowania technicznego, jeśli mogę sam to sensownie rozstrzygnąć.
4. Gdy w projekcie pojawia się luka, mam ją domknąć zamiast zostawiać miejsce do zgadywania.

## Twój zakres odpowiedzialności

1. Ty głównie:
   - odpalasz aplikację,
   - testujesz,
   - dajesz mi wyniki,
   - wysyłasz screeny,
   - wysyłasz logi,
   - zgłaszasz błędy,
   - wskazujesz co poprawić,
   - oceniasz czy kierunek wizualny i użytkowy Ci pasuje.
2. Nie musisz sam wymyślać architektury, jeśli nie chcesz.
3. Masz testować i podejmować decyzje produktowe, a ja mam przygotowywać wykonanie techniczne.

## Zasada aktualizacji plików specyfikacji

1. `zasady.md` aktualizuję tylko wtedy, gdy zmieniają się:
   - zasady naszej współpracy,
   - mój zakres zadań,
   - sposób przekazywania plików,
   - sposób raportowania i poprawiania błędów,
   - ogólne zasady pracy nad projektem.
2. `agent.md` aktualizuję wtedy, gdy zmieniają się:
   - wymagania aplikacji,
   - funkcje,
   - architektura,
   - UI/UX,
   - flow użytkownika,
   - logowanie,
   - kalendarz,
   - integracje,
   - billing,
   - roadmapa produktu.
3. Gdy aktualizuję któryś z tych plików, mówię Ci o tym wyraźnie.
4. Przy zwykłych poprawkach kodu lub UI nie ruszam tych plików bez potrzeby.

## Zasada przekazywania plików

1. Gdy daję Ci pliki, zawsze podaję:
   - dokładną nazwę pliku,
   - dokładną ścieżkę wdrożenia,
   - jasną informację, czy to:
     - nowy plik,
     - nadpisanie pliku,
     - nowy folder,
     - cały pakiet projektu,
     - osobny moduł.
2. Ścieżki zapisuję tak, żeby dało się je łatwo skopiować 1:1.
3. Jeżeli mogę, daję pliki do pobrania.
4. Jeżeli trzeba wkleić coś ręcznie, daję pełny plik, a nie urwane fragmenty.

## Zasada pracy iteracyjnej

1. Ja przygotowuję kolejny pakiet.
2. Ty go uruchamiasz i testujesz.
3. Odsyłasz mi:
   - błędy,
   - logi,
   - screeny,
   - opis co działa,
   - opis co nie działa,
   - uwagi do wyglądu i flow.
4. Ja poprawiam konkretnie to, co wyszło w testach, bez rozwalania działających części.
5. Pracujemy etapami, ale bez zgadywania i bez zostawiania pustych miejsc w planie.

## Zasada odpowiedzi technicznych

1. Mam pisać konkretnie.
2. Mam unikać ogólników.
3. Mam podawać werdykt, a nie zostawiać Ci kilku równych opcji bez decyzji.
4. Jeśli coś jest słabe technicznie, mam to powiedzieć wprost.
5. Jeśli coś można zrobić lepiej, mam to zaproponować zamiast tylko potwierdzać bieżący kierunek.

## Zasada lokalnego testu i drogi do produkcji

1. Lokalnie projekt ma dać się uruchomić możliwie prosto.
2. Jednocześnie architektura ma być od początku przygotowana tak, żeby później dało się ją wdrożyć na serwer i obsługiwać wielu użytkowników.
3. Wygoda lokalnego testowania nie może rozwalić architektury docelowej.

## Zasada domyślnego formatu przekazywania projektu

1. Dopóki użytkownik nie napisze inaczej, domyślnym formatem przekazywania aktualnego stanu projektu jest cały projekt w pliku ZIP.
2. Przy kolejnych etapach mam generować pełny ZIP całego projektu, a nie pojedyncze pliki, chyba że użytkownik wyraźnie zmieni tę zasadę.
3. Jeśli dodatkowo są ważne pliki specyfikacji, mają być dołączone do pełnego ZIP-a projektu.

## Zasada stałej nazwy paczki ZIP

1. Jeżeli użytkownik wskaże jedną, stałą nazwę paczki ZIP, mam jej używać 1:1 przy wszystkich kolejnych wydaniach.
2. Nie dopisuję do tej nazwy wersji, dat, sufiksów ani dodatkowych opisów, dopóki użytkownik sam tego nie zmieni.
3. Nowe wydanie ma nadpisywać poprzednią paczkę pod tą samą nazwą.

## Zasada launcherów

1. Każda kolejna paczka projektu ma zawierać gotowy plik do uruchomienia aplikacji lokalnie.
2. Po uruchomieniu launcher ma sam otwierać stronę aplikacji w przeglądarce, bez ręcznego wpisywania adresu.
3. Każda paczka ma też zawierać drugi launcher: uruchomienie aplikacji z testami.
4. Launcher z testami ma najpierw odpalać testy, a dopiero po ich przejściu uruchamiać aplikację.

## Zasada logów i błędów

1. Każda paczka ma zawierać pliki logów uruchomieniowych.
2. Standard minimalny:
   - `logs/app.log`
   - `logs/error.log`
3. Jeżeli dochodzi tryb z testami, paczka ma też zawierać:
   - `logs/test.log`
4. Logi mają być aktualizowane przez launchery, żeby dało się łatwo sprawdzić co nie działa.

## Zasada testów

1. Do każdej nowej funkcji mam dodawać testy, jeśli da się ją sensownie przetestować.
2. Do każdej poprawki błędu mam dodawać albo aktualizować test, żeby ten sam problem nie wracał.
3. Funkcja albo poprawka nie jest dla mnie domknięta, jeśli nie ma pokrycia testowego tam, gdzie jest to technicznie uzasadnione.
4. Paczka z projektem ma zawierać możliwość uruchomienia testów osobnym launcherem.
5. Jeżeli czegoś nie da się dobrze pokryć testem automatycznym, mam to jasno zaznaczyć i opisać ręczny sposób sprawdzenia.
