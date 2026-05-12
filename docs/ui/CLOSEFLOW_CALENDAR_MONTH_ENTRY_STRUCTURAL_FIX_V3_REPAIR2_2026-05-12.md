# CloseFlow — Calendar Month Entry Structural Fix V3 Repair2 Masscheck

## Dlaczego istnieje

V3 i Repair1 miały ten sam błąd klasy: generator patcha nie był sprawdzany składniowo przed uruchomieniem. To złe. Repair2 dodaje masową kontrolę składni przed właściwym patchem.

## Co robi

- `node --check` na każdym `.cjs` w paczce przed kopiowaniem,
- kopiuje tylko pliki Repair2,
- usuwa ewentualne stare efekty V3/V3 Repair1 z `Calendar.tsx`,
- wstawia poprawiony efekt V3 Repair2,
- odpala audyt,
- odpala check,
- odpala build,
- commit/push.

## Cel funkcjonalny

W widoku miesiąca wpisy mają być stabilnym układem:

```txt
[Zad] 12:41 Wysłać dokumenty...
```

## Nie rusza

- API,
- Supabase,
- danych,
- handlerów,
- sidebaru,
- panelu bocznego kalendarza.
