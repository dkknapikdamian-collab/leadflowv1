# A16 v2 - Zbędne zapisy Firestore / onChange write storm

## Cel

Usunąć przypadkowe zapisy danych kontaktowych przy każdej zmianie inputa, bez psucia szybkich notatek głosowych.

## Decyzja produktowa

Dane kontaktowe i ustawienia rekordu mają działać przez tryb:

```text
Edytuj -> Zapisz
```

Dyktowane notatki są wyjątkiem, bo użytkownik świadomie uruchamia dyktafon. Po ciszy notatka może zapisać się automatycznie, żeby nie zgubić treści podczas jazdy albo po rozmowie.

## Co jest dozwolone

- lokalny `setState` w `onChange`,
- zapis po kliknięciu `Zapisz`,
- anulowanie lokalnych zmian,
- szybki autosave dyktowanej notatki po krótkiej ciszy,
- ręczne dodanie notatki przyciskiem `Dodaj`,
- edycja istniejącej notatki przez osobną akcję edycji.

## Czego nie wolno robić

- nie zapisywać danych kontaktowych w `onChange`,
- nie zastępować tego debounce, jeśli nadal zapisuje każdą literę,
- nie przenosić write storm z Firestore do Supabase,
- nie wracać do `firebase/firestore` w sprawdzanych plikach.

## Guard

Dodano:

```text
scripts/check-a16-no-onchange-write-storm.cjs
npm run check:a16-no-onchange-write-storm
```

Guard sprawdza, że:

- nie ma importów `firebase/firestore` w pilnowanych plikach,
- mutacje Supabase/API nie są wołane bezpośrednio z `onChange`,
- `LeadDetail` zachowuje autosave dyktowanej notatki,
- skrypt jest zapisany jako UTF-8 bez BOM.

## Ręczne sprawdzenie

1. Wejdź w szczegóły leada.
2. Zmień dane kontaktowe dopiero po kliknięciu `Edytuj`.
3. Wpisywanie w polu nie powinno robić requestu.
4. Kliknięcie `Zapisz` powinno zrobić jeden request.
5. `Anuluj` powinien cofnąć lokalne zmiany.
6. Podyktuj notatkę w lead detail.
7. Po 2-3 sekundach ciszy notatka powinna zapisać się sama.
8. Wpisz notatkę ręcznie i kliknij `Dodaj`.
9. Istniejąca notatka powinna mieć możliwość edycji.
