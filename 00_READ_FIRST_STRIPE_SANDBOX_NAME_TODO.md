# 00 READ FIRST — Stripe sandbox name TODO

Data: 2026-05-05  
Priorytet: P2, ale widoczne przed publicznym testowaniem płatności.

## Co zauważono

W Stripe Dashboard sandbox/test account ma nazwę:

`Bezrobotny sandbox`

Na zrzucie obok nazwy widać też etykietę `Piaskownica`.

## Decyzja

Nie walczymy z etykietą `Piaskownica`, bo to informacja Stripe o trybie testowym.

Trzeba zmienić nazwę `Bezrobotny sandbox`, gdy tylko panel Stripe na to pozwoli.

## Docelowa nazwa

Preferowane:

`CloseFlow Sandbox`

Alternatywa:

`CloseFlow Test`

## Dlaczego to ważne

Nazwa może pojawić się w panelach, testach, logach, webhookach, materiałach QA albo u kolejnego auditora. Tekst `Bezrobotny` wygląda nieprofesjonalnie i może powodować pomyłki przy diagnozie płatności.

## Gdzie szukać

Stripe Dashboard:
- nazwa sandboxa / test account
- Settings → Business details
- Settings → Branding
- Public business name
- Statement descriptor

## Status

Na teraz użytkownik nie może zmienić tej nazwy. Ten plik ma zostać przeczytany przez kolejnego agenta przed dalszym domykaniem Stripe/Billing.
