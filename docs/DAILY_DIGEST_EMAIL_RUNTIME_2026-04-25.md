# Daily digest email runtime

Data: 2026-04-25

## Cel

Dowieźć realną wysyłkę porannego maila z planem dnia oraz możliwość ustawienia godziny i odbiorcy w menu.

## Problem

Backend digestu i ustawienia były częściowo obecne, ale cron działał raz dziennie. Przy takim układzie ustawienie godziny w menu nie mogło działać dla innych godzin.

## Co zmienia etap

- cron /api/daily-digest działa co godzinę i dopiero backend sprawdza godzinę workspace,
- /api/daily-digest ma tryb testowy workspace-test dla aktualnego workspace,
- Settings ma przycisk Wyslij test teraz,
- test regresyjny sprawdza cron, API i UI ustawień.

## Wymagane zmienne ENV na Vercel

- RESEND_API_KEY
- DIGEST_FROM_EMAIL
- APP_URL albo NEXT_PUBLIC_APP_URL
- opcjonalnie CRON_SECRET dla zwykłego crona

## Jak działa wysyłka

1. Vercel odpala /api/daily-digest co godzinę.
2. Endpoint pobiera workspace z włączonym daily_digest_enabled i adresem daily_digest_recipient_email.
3. Dla każdego workspace sprawdza daily_digest_hour i daily_digest_timezone.
4. Jeśli godzina pasuje i nie wysłano już dzisiaj, buduje mail i wysyła przez Resend.
5. Log trafia do digest_logs.

## Zakres

Nie zmieniano leadów, spraw, tasków, eventów ani modelu danych poza użyciem istniejących pól digestu.

## Kryterium zakończenia

- npm.cmd run verify:closeflow:quiet przechodzi,
- w Ustawieniach można zapisać odbiorcę, godzinę i strefę,
- kliknięcie Wyslij test teraz wysyła mail albo pokazuje konkretny błąd ENV/wysyłki.
