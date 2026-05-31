# STAGE184_FOREST_NAVY_DARK_SETTINGS_HARDENING_LOCAL_ONLY_REPORT

FAKTY:
- Screenshot pokazał, że Forest Navy zostawiał białe tło w headerze, kafelkach zakładek i prawej karcie.
- Dodano hardening CSS importowany w Settings.tsx po stylach ustawień.
- Dodano ten sam hardening w Layout.tsx, żeby objąć main/global-bar/view.
- Motyw Forest Navy ma teraz wymuszać ciemne tło i jasny tekst na ustawieniach.
- Nie wykonano git add, commita ani pusha.

DECYZJA DAMIANA:
- Tło ma być ciemne.
- Tekst ma być biały/czytelny.
- Zakładki mają zmieniać kolor w spójnej palecie.
- Motyw ma wyglądać porządnie, a nie jak losowe nadpisanie kolorów.

TESTY:
- npm run build
- Ręcznie: /settings, szczególnie zakładka PWA / Telefon i Preferencje aplikacji.
- Sprawdzić header Ustawienia, kafelki zakładek, prawa karta, tekst i inputy.
- Sprawdzić powrót na Klasyczny jasny.

RYZYKA:
- Inne widoki mogą wymagać osobnego hardeningu po ocenie Settings.

NASTĘPNY KROK:
- Po akceptacji Settings przejść widok po widoku: Dziś, Leady, Kalendarz.
