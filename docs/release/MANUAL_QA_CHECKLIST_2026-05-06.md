# Manual QA Checklist - Release Candidate 2026-05-06

Status: do wykonania ręcznie przed daniem zielonego światła użytkownikowi.

## Zasada
Nie podpisuj release tylko dlatego, że build przeszedł. Build mówi, że kod się składa. QA ma potwierdzić, że użytkownik może przejść główne ścieżki bez ślepych przycisków, krzaków w tekście i przecieków danych.

## Routing smoke
- [ ] `/` ładuje Today dla zalogowanego usera.
- [ ] `/today` ładuje Today albo poprawny alias.
- [ ] `/login` działa dla niezalogowanego usera.
- [ ] `/leads` lista leadów.
- [ ] `/leads/:id` szczegóły leada.
- [ ] `/clients` lista klientów.
- [ ] `/clients/:id` szczegóły klienta.
- [ ] `/cases` lista spraw.
- [ ] `/cases/:id` szczegóły sprawy.
- [ ] `/tasks` zadania.
- [ ] `/calendar` kalendarz.
- [ ] `/activity` aktywność.
- [ ] `/billing` billing i status konfiguracji.
- [ ] `/settings` ustawienia.
- [ ] `/templates` szablony.
- [ ] `/ai-drafts` szkice AI.
- [ ] `/support` centrum pomocy albo alias do SupportCenter.

## Przyciski krytyczne
- [ ] Dodaj lead.
- [ ] Edytuj lead.
- [ ] Rozpocznij obsługę / przenieś lead do sprawy.
- [ ] Dodaj klienta.
- [ ] Edytuj klienta.
- [ ] Dodaj sprawę.
- [ ] Edytuj sprawę.
- [ ] Dodaj notatkę do sprawy.
- [ ] Dodaj zadanie.
- [ ] Oznacz zadanie jako zrobione.
- [ ] Dodaj wydarzenie.
- [ ] Zapisz ustawienia.
- [ ] Zapisz szablon.
- [ ] Zatwierdź szkic AI.
- [ ] Odrzuć szkic AI.
- [ ] Zapisz zgłoszenie support.
- [ ] Zapisz odpowiedź support.

## Access gate i prawda UI
- [ ] Zwykły user nie widzi admin-only jako działającej funkcji.
- [ ] Admin AI działa tylko dla admina po backendowym sprawdzeniu.
- [ ] Funkcje bez env mają status `Wymaga konfiguracji`, a nie udają działania.
- [ ] AI tworzy szkic, nie zapisuje finalnych rekordów bez potwierdzenia.
- [ ] Stripe bez konfiguracji pokazuje brak konfiguracji, nie udaje płatności.
- [ ] Google Calendar bez OAuth pokazuje brak konfiguracji.

## Workspace isolation
- [ ] User A nie widzi leadów usera B.
- [ ] User A nie może pobrać `/api/leads?id=<cudzy-id>`.
- [ ] User A nie może zmienić cudzego leada przez PATCH.
- [ ] User A nie może usunąć cudzego taska/eventu/sprawy/klienta.
- [ ] `body.workspaceId` nie zmienia kontekstu dostępu.

## Mobile/PWA
- [ ] Aplikacja da się dodać do ekranu głównego.
- [ ] Today działa po reloadzie na telefonie.
- [ ] Modale mieszczą się na ekranie telefonu.
- [ ] Przyciski są klikalne palcem.
- [ ] Service worker nie cache'uje API, auth ani storage.

## Decyzja
- [ ] PASS - można pokazać użytkownikom testowym.
- [ ] WARN - można pokazać tylko jako kontrolowany preview z listą ograniczeń.
- [ ] FAIL - nie pokazywać użytkownikom.
