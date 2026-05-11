# CloseFlow Modal Dark Shell Skin Only — 2026-05-11

## Cel

Ujednolicić wszystkie modale / podzakładki operatora wizualnie:

- ciemne tło modala w stylu aplikacji,
- białe pola formularzy,
- czarny tekst w polach,
- zielony focus i główny przycisk,
- jeden plik CSS jako źródło prawdy,
- bez ruszania logiki, routingu i handlerów przycisków.

## Zakres

Zmieniany plik:

```text
src/styles/closeflow-modal-visual-system.css
```

Dodawany guard:

```text
scripts/check-closeflow-modal-dark-shell-skin-only.cjs
```

## Dlaczego to jest bezpieczne

Aplikacja już ma wspólny mechanizm modali:

- `src/components/ui/dialog.tsx` dodaje `data-closeflow-modal-visual-system="true"` do `DialogContent`,
- `src/App.tsx` importuje `src/styles/closeflow-modal-visual-system.css` globalnie.

Dlatego ta paczka zmienia skórkę, nie funkcje.

## Czego nie zmieniać

Nie zmieniać:

- handlerów przycisków,
- `onSubmit`,
- API,
- danych,
- routingu,
- nazw przycisków,
- flow dodawania leada / zadania / wydarzenia / klienta / szablonu.

## Ręczny test po wdrożeniu

Sprawdzić modale:

1. Nowe zadanie.
2. Szybki szkic.
3. Nowy lead.
4. Dodaj klienta.
5. Nowy szablon sprawy.
6. Nowe wydarzenie.
7. Szkice AI.
8. Inbox / inne podzakładki otwierane jako modal.

W każdym modalu:

- pole tekstowe jest białe,
- tekst wpisany jest czarny,
- focus jest zielony,
- tło modala jest ciemne,
- przycisk główny działa jak wcześniej,
- anuluj/zamknij działa jak wcześniej,
- formularz zapisuje tak jak przed zmianą.

## Kryterium zakończenia

Wszystkie modale mają jeden spójny wygląd bez przepinania logiki.
