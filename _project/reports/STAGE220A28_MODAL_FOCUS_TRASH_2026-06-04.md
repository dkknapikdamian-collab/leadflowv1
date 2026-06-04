# STAGE220A28 - Modal VST, no tab-return reload, case trash action - 2026-06-04

## Cel

Naprawić trzy zgłoszone problemy:
- modal Historia wpłat i korekt nadal wyglądał jak stary styl i miał zbędny opis,
- przejście do innej zakładki przeglądarki i powrót mogły zamykać otwarte modale przez hard reload,
- ikona kosza w liście spraw miała układ tekstowy przy tytule zamiast prawej ikony jak w klientach/leadach.

## Zmiana

- historia/korekta wpłat używa modal visual source truth: cf-modal-surface / client-case-form-content / client-case-form-section,
- usunięto opis "Wybierz wpłatę...",
- usunięto status przy wpłacie,
- kosz sprawy przeniesiono do prawego klastra akcji obok chevrona,
- chunk reload guard nie robi hard reload, gdy modal jest otwarty albo użytkownik właśnie wrócił z innej zakładki.

## Nie ruszano

- SQL
- RLS
- API
- model refund
- liczenie finansów
- routing

## Test ręczny

1. Otwórz modal Nowy klient i porównaj z modalem Historia wpłat.
2. Historia wpłat nie ma opisu pod tytułem.
3. Wpis wpłaty ma Data/Wartość/Koryguj bez Statusu.
4. Otwórz Dodaj zadanie lub Korekta wpłaty.
5. Przejdź do innej zakładki przeglądarki i wróć.
6. Modal nie powinien się zamknąć przez automatyczne odświeżenie.
7. Na liście spraw ikona kosza jest po prawej obok strzałki, nie przy tytule.
