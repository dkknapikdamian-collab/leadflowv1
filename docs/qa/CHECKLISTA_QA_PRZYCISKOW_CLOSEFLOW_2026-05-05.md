# CHECKLISTA QA PRZYCISKÓW CLOSEFLOW 2026-05-05

Status: DO_UZUPEŁNIENIA_LIVE  
Cel: nie udawać, że każdy przycisk został kliknięty. Ta lista ma prowadzić realny test.

## Zasady testu

Dla każdego przycisku wpisz wynik po realnym kliknięciu w aplikacji.

Kolumny:

- Trasa: ekran, na którym kliknięto.
- Przycisk / akcja: widoczny tekst albo selector.
- Oczekiwany efekt: co powinno się stać.
- Typ efektu: modal / nawigacja / API / lokalny stan / download / clipboard.
- Wynik po reloadzie: czy efekt przetrwał reload, jeśli powinien.
- Test / guard: nazwa istniejącego testu albo `BRAK - dodać`.
- Status live: PASS / FAIL / N/A / PENDING.
- Uwagi: co poprawić.

## Matrix obowiązkowy V1

| Trasa | Przycisk / akcja | Oczekiwany efekt | Typ efektu | Wynik po reloadzie | Test / guard | Status live | Uwagi |
|---|---|---|---|---|---|---|---|
| /today | Odśwież / reload danych | Odświeża sekcje Today bez white screen | API + UI | Dane nadal widoczne | check:p0-today-stable-rebuild | PENDING | |
| /today | Przejście do Leady | Nawiguje do listy leadów | nawigacja | Po reloadzie /leads działa | check:a13-critical-regressions | PENDING | |
| /leads | Nowy lead / Dodaj lead | Otwiera formularz albo flow dodania | modal/form | Po zapisie lead widoczny | check-stage84-lead-detail-work-center | PENDING | |
| /leads | Filtry / search | Filtruje listę bez utraty danych | UI | Po reloadzie zachowanie zgodne z produktem | BRAK - dodać jeśli brak | PENDING | |
| /leads/:id | Edytuj | Otwiera edycję leada | modal/form | Zmiana zostaje po reloadzie | lead-detail-visual-rebuild | PENDING | |
| /leads/:id | Rozpocznij obsługę | Tworzy/uruchamia flow Lead → Client/Case | API + UI | Case/client nadal istnieje po reloadzie | check:a24-lead-to-case-flow | PENDING | |
| /leads/:id | Dodaj notatkę | Dodaje aktywność/notatkę | API + UI | Notatka widoczna po reloadzie | check:a26-activities-ai-drafts-supabase | PENDING | |
| /leads/:id | Dyktuj notatkę | Uruchamia capture/draft, nie zapisuje final bez potwierdzenia | UI/draft | Draft zgodny z zasadą AI draft-only | BRAK - dodać jeśli brak | PENDING | |
| /clients | Nowy klient | Otwiera formularz klienta | modal/form | Klient widoczny po reloadzie | client-detail visual/guards | PENDING | |
| /clients/:id | Edytuj klienta | Edycja danych klienta | modal/form/API | Zmiana po reloadzie | check-stage50-client-detail-edit-header-polish | PENDING | |
| /clients/:id | Dodaj sprawę | Tworzy sprawę klienta | API + UI | Sprawa widoczna po reloadzie | case-detail visual/guards | PENDING | |
| /cases | Nowa sprawa | Otwiera tworzenie sprawy | modal/form/API | Sprawa widoczna po reloadzie | case-detail-visual-rebuild | PENDING | |
| /cases/:id | Dodaj notatkę | Dodaje aktywność sprawy | API + UI | Widoczna po reloadzie | case-detail-visual-rebuild | PENDING | |
| /tasks | Nowe zadanie | Tworzy zadanie | modal/form/API | Zadanie widoczne po reloadzie | TasksStable guards | PENDING | |
| /calendar | Dodaj wydarzenie | Tworzy wydarzenie lokalne / sync jeśli Google skonfigurowany | modal/API | Widoczne po reloadzie | Google Calendar smoke | PENDING | |
| /billing | Wybierz plan | Startuje Stripe Checkout, bez fałszywego paid_active przed webhookiem | API + Stripe redirect | Po webhooku access refresh | verify:stage86-billing-google-hardening | PENDING | |
| /billing | Anuluj / Resume | Wykonuje billing action przez workspace-scoped API | API | Status zgodny po reloadzie | check:stage86m-billing-google-regression-suite | PENDING | |
| /settings | Połącz Google Calendar | Startuje OAuth albo pokazuje wymaga konfiguracji | OAuth/API | Status po callback/reload | google-calendar-stage07-oauth-smoke-evidence-gate | PENDING | |
| /settings | Rozłącz Google Calendar | Rozłącza integrację | API + UI | Status rozłączony po reloadzie | Google Calendar smoke | PENDING | |
| /client-portal | Upload pliku z tokenem | Upload przechodzi tylko z ważną sesją portalu | storage/API | Plik widoczny w portalu/backendzie | stage90 portal smoke | PENDING | |
| /client-portal | Upload bez tokenu | Brak dostępu / 401/403 | API security | Brak dostępu po reloadzie | stage90 portal smoke | PENDING | |
| Admin toolbar | Bug | Tryb click-to-annotate, quick editor, Enter zapisuje | localStorage/UI | Licznik rośnie, export czyści | verify:admin-tools | PASS | Potwierdzone Stage89C |
| Admin toolbar | Copy | Tryb click-to-annotate dla tekstu | localStorage/UI | Licznik rośnie, export czyści | verify:admin-tools | PASS | Potwierdzone Stage89C |
| Admin toolbar | Review | Tryb review/candidate selection | localStorage/UI | Licznik rośnie, export czyści | verify:admin-tools | PASS | Potwierdzone Stage89C |
| Admin toolbar | Buttons | Generuje Button Matrix dla aktywnego ekranu | localStorage/UI | Export czyści licznik | verify:admin-tools | PASS | Potwierdzone Stage89C |
| Admin toolbar | Export JSON/Markdown | Pobiera plik i czyści liczniki | download/localStorage | Liczniki 0 po eksporcie | check:stage89-right-rail-export-clear | PASS | Potwierdzone Stage89C |

## Wynik końcowy

- PENDING dopóki test nie zostanie wykonany live.
- FAIL tworzy nowy etap naprawczy.
- PASS bez uwag oznacza zamknięcie przycisku w matrixie.
