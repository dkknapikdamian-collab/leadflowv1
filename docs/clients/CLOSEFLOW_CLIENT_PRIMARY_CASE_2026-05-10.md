# CLOSEFLOW_CLIENT_PRIMARY_CASE_2026-05-10

## Status
ETAP 7: klient może wskazywać jedną główną sprawę przez `clients.primary_case_id`.

## Decyzja danych
Preferowany i wdrożony kierunek: `clients.primary_case_id`.

Główna sprawa jest wyborem klienta. Nie jest globalną cechą rekordu `cases`. Dzięki temu jeden klient ma jedno jawne wskazanie i nie trzeba utrzymywać wielu flag `is_primary_for_client` na sprawach.

## Zasady produktu
- Klient może mieć wiele spraw.
- Tylko jedna sprawa może być główna.
- Główna sprawa ma być pierwsza na liście spraw klienta.
- Główna sprawa ma być wizualnie odróżniona od pozostałych.
- Skrót „Otwórz główną sprawę” prowadzi do `/cases/:caseId` dla `primaryCaseId`.
- Główne kafelki klienta, na przykład wartość i liczby u góry, pozostają globalne dla wszystkich spraw klienta.
- Dane tylko z głównej sprawy wolno pokazywać wyłącznie tam, gdzie UI wyraźnie mówi „główna sprawa”.

## Dodawanie nowej sprawy
Przy tworzeniu sprawy API może przyjąć:

```ts
primaryForClient?: boolean
replacePrimaryCase?: boolean
```

Jeżeli klient ma już główną sprawę i `replacePrimaryCase` nie jest true, API ma zwrócić konflikt `PRIMARY_CASE_ALREADY_EXISTS`. UI powinno wtedy spytać użytkownika, czy zastąpić istniejącą główną sprawę.

## Usunięcie głównej sprawy
Migracja używa `ON DELETE SET NULL`, więc usunięcie głównej sprawy czyści `clients.primary_case_id`.

Jeżeli frontend zobaczy `primaryCaseId`, którego nie ma na liście spraw, może pokazać fallback do najnowszej aktywnej sprawy tylko do wyświetlenia. Nie wolno automatycznie zapisywać nowej głównej sprawy bez zgody użytkownika.

## Guard polskich znaków
ETAP 7 dodaje stage-scoped guard `check:closeflow-stage-polish-guard`, który pilnuje nowych i zmienianych plików etapu przed mojibake typu `Ĺ›`, `Ä‡`, `Ăł`, `Â`.
