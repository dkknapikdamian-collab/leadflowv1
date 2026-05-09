# CloseFlow Lead/Client Conflict Resolution v1

Status: runtime patch.

Cel: przy dodawaniu leada albo klienta nie zgadywać, czy podobny rekord jest tym samym człowiekiem. System ma pokazać konflikt i oddać decyzję użytkownikowi.

## Reguła

Jeżeli pokrywa się e-mail, telefon, nazwa/imię lub firma z istniejącym leadem albo klientem, aplikacja pokazuje dialog konfliktu.

Dostępne akcje:

- Pokaż istniejący rekord.
- Przywróć, jeśli rekord jest bezpiecznie przywracalny z kosza/archiwum.
- Dodaj mimo to.
- Anuluj.

## Ważne

Nie ma automatycznego przywracania. Zbieżność imienia i nazwiska nie jest dowodem, że to ta sama osoba.

Rekord przeniesiony do obsługi / historii z powiązaną sprawą nie jest przywracany automatycznie. Użytkownik powinien najpierw kliknąć `Pokaż`.

## Check

```powershell
npm run check:lead-client-conflict-resolution-v1
npm run build
```
