# STAGE187_HIDE_APP_PREFERENCES_SECTION_LOCAL_ONLY_REPORT

FAKTY:
- Usunięto z widoku sekcję Preferencje aplikacji w Settings.tsx.
- Sekcja zawierała widoczny panel z checkboxem ostrzeżeń o konfliktach.
- Nie wykonano git add, commita ani pusha.

DECYZJA DAMIANA:
- Po wycofaniu motywów nie chcemy widzieć sekcji Preferencje aplikacji.

TESTY:
- npm run build
- Ręcznie: /settings, sprawdzić że sekcja Preferencje aplikacji nie jest widoczna.

RYZYKA:
- Funkcja ostrzegania o konfliktach zostaje w kodzie/preferencjach, ale nie ma już UI do zmiany jej wartości.

NASTĘPNY KROK:
- Jeśli to ma być całkowicie wyczyszczone z logiki, osobny etap powinien usunąć state/importy/handler konfliktów.
