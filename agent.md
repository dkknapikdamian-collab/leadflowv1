# agent.md

## Rola tego pliku

Ten plik jest skróconą instrukcją operacyjną dla AI developera pracującego nad repo.

## Zasada pracy (ważne)

Do odwołania zmiany robimy **tylko i wyłącznie** na gałęzi:

- `freeze`

Nie przełączaj gałęzi i nie przygotowuj merge do innych branchy, chyba że dostaniesz na to wyraźną decyzję.

Pełna, nadrzędna definicja produktu znajduje się w:

- `product-scope-v2.md`

Jeżeli ten plik i inny dokument różnią się, pierwszeństwo ma `product-scope-v2.md`.

## Aktualna definicja produktu

To nie jest już tylko lead follow-up app.

To jest **jeden system do domykania i uruchamiania klienta**.

## Twarde zasady produktu

1. **Sprzedaż = Lead Flow**
2. Po statusie **won** albo **ready to start** lead może przejść do **sprawy operacyjnej**
3. **Forteca nie jest osobną aplikacją** (w repo/historycznie mogła występować jako „ClientPilot”)
4. **Sprawy są modułem tego samego systemu**
5. Użytkownik ma czuć ciągłość pracy, a nie wejście do drugiej apki
6. `Dziś` pozostaje głównym ekranem decyzyjnym
7. Kierunek UI ma być oparty o przesłany kierunek **Forteca**

## Jak interpretować moduły

### Lead Flow
Warstwa sprzedażowa:
- leady,
- next step,
- follow-up,
- ryzyko,
- waiting,
- overdue,
- dzienny priorytet.

### Sprawy
Warstwa po sprzedaży:
- start realizacji,
- kompletność materiałów,
- checklisty,
- blokery,
- akceptacje,
- aktywności i przypomnienia operacyjne.

## Finalne menu operatora

Obowiązujące menu docelowe:
- `Dziś`
- `Leady`
- `Sprawy`
- `Zadania`
- `Kalendarz`
- `Aktywność`
- `Rozliczenia`
- `Ustawienia`

Przewidziane później:
- `Szablony`
- `Klienci`

## Portal klienta

- portal klienta nie jest osobną główną aplikacją operatora,
- jest częścią tego samego systemu,
- jest wejściem linkowym do sprawy / checklisty / kompletności.

## Granice etapu 0

Na tym etapie:
- nie zmieniaj jeszcze kodu produktu,
- nie zmieniaj jeszcze logiki danych,
- nie przebudowuj auth,
- nie przebudowuj billingu.

Najpierw ma być zamknięta jedna prawda produktu i spójna dokumentacja.

## Reguła przy starszych dokumentach

Jeżeli trafisz na opis typu:
- „lead follow-up app” jako pełna definicja produktu,
- „Forteca” jako osobna aplikacja,
- osobne byty bez wspólnego systemu,

to uznaj to za wersję historyczną.

Od teraz poprawna interpretacja jest jedna:

> Lead Flow i Forteca to jeden system, w którym warstwa sprzedaży przechodzi płynnie w warstwę uruchamiania klienta.


## Zasada wdrozeniowa git (obowiazkowa)

Po kazdej zmianie w kodzie wdrazaj od razu do gita na galezi `freeze`.

- commit i push wykonuj od razu po zakonczonej zmianie
- nie odkladaj pushowania na pozniej
- wszystko ma byc na biezaco wpychane do freeze
