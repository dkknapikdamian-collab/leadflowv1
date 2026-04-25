# Email digest domain gate

Data: 2026-04-25

## Cel

Ukryc przyciski mailowego digestu w ustawieniach do czasu podpiecia domeny nadawczej.

## Powod

Resend bez zweryfikowanej domeny pozwala wysylac tylko na adres wlasciciela konta Resend. Dla normalnego uzytkownika zalogowanego innym mailem test wysylki konczy sie bledem 403.

## Decyzja

- backend daily digest zostaje,
- cron zostaje,
- ustawienia i handlery zostaja w kodzie,
- UI mailowego digestu jest ukryte za flaga DAILY_DIGEST_EMAIL_UI_VISIBLE=false,
- uzytkownik widzi tylko informacje, ze mailowy digest wroci po podpieciu domeny.

## Jak wlaczyc pozniej

Po zakupie i weryfikacji domeny w Resend:

1. ustaw w Vercel:
   DIGEST_FROM_EMAIL = CloseFlow <powiadomienia@twojadomena.pl>

2. zmien w Settings.tsx:
   DAILY_DIGEST_EMAIL_UI_VISIBLE = true

3. uruchom:
   npm.cmd run verify:closeflow:quiet

4. deploy.

## Kryterium zakonczenia

- w ustawieniach nie widac przyciskow wysylki/diagnostyki email digestu,
- backend digestu dalej przechodzi testy,
- release gate zawiera tests/email-digest-domain-gate.test.cjs.
