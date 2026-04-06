# LeadFlow

Ten pakiet działa na:
- Next.js
- TypeScript
- App Router

## Co jest wdrożone teraz
- prosty shell aplikacji
- 6 głównych sekcji: Dziś / Leady / Zadania / Kalendarz / Billing / Ustawienia
- mobilny układ pod telefon i desktop
- pamięć danych po odświeżeniu dzięki localStorage
- warstwa repository oddzielająca UI, mutacje snapshotu i persystencję
- next action leada spięty z prawdziwym taskiem / eventem zamiast osobnego martwego tekstu
- pusty stan startowy zamiast domyślnego demo
- zakładka `Dziś` przebudowana na sekcje zgodne z aktualnym układem
- sekcje `Dziś` można zwijać i rozwijać
- kliknięcie licznika sekcji przenosi ją na górę i rozwija
- dodawanie / edycja / usuwanie leadów i działań
- drawer szczegółów leada
- snooze i oznaczanie jako zrobione
- logi uruchomienia i osobny launcher z testami
- testy dla nowych funkcji i poprawek w warstwie logiki

## Jak uruchomić zwykły start
Na Windows najlepiej:
- `start_leadflow.bat`

albo:
- `start_leadflow.ps1`

Po uruchomieniu:
- serwer dev startuje,
- przeglądarka otwiera się sama,
- log standardowy zapisuje się do `logs/app.log`,
- błędy zapisują się do `logs/error.log`.

## Jak uruchomić z testami
Na Windows:
- `start_leadflow_with_tests.bat`

albo:
- `start_leadflow_with_tests.ps1`

Ten tryb:
1. odpala testy,
2. zapisuje wynik do `logs/test.log`,
3. jeśli testy przejdą, uruchamia aplikację,
4. otwiera stronę automatycznie w przeglądarce.

## Uruchomienie ręczne
```bash
npm install
npm run test
npm run dev
```

## Ważne
To nadal jest etap frontendowy przygotowywany pod późniejsze wdrożenie online.
W tej paczce dane zapisują się lokalnie w przeglądarce, ale CRUD przechodzi już przez warstwę `lib/data/*`, więc późniejsza podmiana `localStorage -> backend` jest prostsza. Docelowo dane mają trafić do chmury i być powiązane z kontem użytkownika.
Nowy użytkownik startuje teraz z pustą aplikacją. Demo nie jest już domyślnym stanem startowym.
Start produkcyjny ma być pusty. Dataset demo może istnieć tylko jako opcjonalny techniczny zestaw pokazowy i nie ładuje się automatycznie użytkownikowi.
