# Email digest UI silent gate

Data: 2026-04-25

## Cel

Schowac mailowy digest w ustawieniach bez pokazywania uzytkownikowi dodatkowych komunikatow.

## Decyzja

- panel mailowego digestu nie jest renderowany,
- przyciski testu i diagnostyki nie sa widoczne,
- backend, cron i handlery zostaja w kodzie,
- po podpieciu domeny wystarczy zmienic DAILY_DIGEST_EMAIL_UI_VISIBLE na true.

## Powod

Resend bez zweryfikowanej domeny pozwala wysylac tylko na adres wlasciciela konta. Pokazywanie tej opcji zwyklemu uzytkownikowi powoduje blad i zamieszanie.

## Kryterium zakonczenia

- w ustawieniach nie widac sekcji mailowego digestu,
- test email-digest-domain-gate przechodzi,
- backend daily digest zostaje dostepny na pozniej.
