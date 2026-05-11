# CloseFlow — Page Header Kicker Source Truth Packet 5

## Cel

Dopiąć trzy rzeczy jako jedno źródło prawdy dla głównych kafelków/nagłówków stron:
1. kolor górnego labela typu „CENTRUM DNIA”, „ZADANIA”, „SZKICE DO SPRAWDZENIA”,
2. identyczne położenie copy i przycisków we wszystkich headerach,
3. audyt starych importów oraz usunięcie znanych duplikatów copy pod headerem.

## Co zmienia paczka

- nadpisuje `src/styles/closeflow-page-header-v2.css` i ustawia source-of-truth tokens:
  - `--cf-ph-v2-kicker-bg`
  - `--cf-ph-v2-kicker-border`
  - `--cf-ph-v2-kicker-text`
- pilnuje jednego układu:
  - copy zawsze po lewej,
  - akcje zawsze w prawym górnym rogu,
  - ten sam padding, radius, cień i pozycja chipa nad tytułem,
- generuje audyt importów starych warstw headerów,
- usuwa znane duble copy na stronach, gdzie były zgłaszane.

## Nie zmienia

- logiki przycisków,
- routingu,
- modalów,
- list i metryk,
- backendu.

## Kryterium

Po wdrożeniu:
- wszystkie top-labels mają ten sam kolor,
- wszystkie top headers mają to samo położenie copy,
- nie ma zduplikowanego opisu pod `Biblioteka odpowiedzi`, `Szkice AI`, `Powiadomienia`, `Konfiguracja AI`.
