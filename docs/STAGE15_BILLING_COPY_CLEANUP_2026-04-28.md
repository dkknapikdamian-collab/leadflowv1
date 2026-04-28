# Stage 15 — Billing copy cleanup

## Cel

Uprościć teksty w zakładce Plan/Billing bez zmiany logiki płatności, Stripe, BLIK ani dostępu użytkownika.

## Zmieniono

1. Skrócono opis aktywnego planu z:

```text
Masz aktywny plan CloseFlow Pro, wiec caly workflow dziala bez blokad.
```

na:

```text
Masz aktywny plan CloseFlow Pro.
```

2. Usunięto martwy blok informacyjny:

```text
Jak działa V1
Prosty model bez mylących limitów i ukrytych opłat.
Trial: startujesz od 14 dni testu z odblokowanym pełnym workflow.
Po trialu: płacisz kartą albo BLIK przez Stripe i aktywujesz wybrany plan na 30 albo 365 dni.
Statusy: trial, plan aktywny, problem z płatnością albo plan anulowany.
```

## Nie zmieniaj

- checkoutu Stripe,
- BLIK/karty,
- aktywności planów,
- blokad dostępu,
- zakładki Rozliczenia,
- cen planów.

## Po wdrożeniu sprawdź

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/billing-copy-cleanup-stage15.test.cjs
```

## Kryterium zakończenia

- Tekst aktywnego planu kończy się na `Masz aktywny plan CloseFlow Pro.`
- Blok `Jak działa V1` nie jest widoczny.
- Billing nadal pokazuje plany i przyciski płatności.
