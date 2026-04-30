# STAGE29_BROWSER_NOTIFICATIONS_SNOOZE

## Cel

Dodać realne przypomnienia w przeglądarce oraz snooze bez budowania ciężkiego systemu push.

## Założenia

- Browser notifications działają tylko, gdy aplikacja jest otwarta w przeglądarce.
- Jeśli przeglądarka nie wspiera powiadomień albo użytkownik je zablokuje, aplikacja używa toastów / alertów in-app.
- Snooze nie zmienia terminu zadania, wydarzenia ani leada.
- Snooze nie tworzy nowego taska.
- Snooze zapisuje się lokalnie, żeby nie znikał po odświeżeniu strony.

## Deduplikacja

Klucz powiadomienia składa się z:

```text
record type + record id + reminder type + time window
```

Przykłady:

```text
task:abc:30min:2026-04-30T10:00
event:def:overdue:2026-04-30T09:15
lead:ghi:today_morning:2026-04-30
```

## Snooze

Dostępne tryby:

- `15m` - odłożenie o 15 minut,
- `1h` - odłożenie o godzinę,
- `tomorrow` - jutro o 09:00.

Dane lokalne:

```text
closeflow:notifications:snoozed:v1
```

## Kryterium zakończenia

- Runtime pokazuje powiadomienia bez spamu.
- Permission flow obsługuje `default`, `granted`, `denied`, `unsupported`.
- Snooze 15m, 1h i jutro działa.
- Odłożone powiadomienia widać w centrum powiadomień.
- Build przechodzi.
- Brak mojibake.
