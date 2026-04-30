# STAGE 31 - Mobile polish całej aplikacji

## Cel

Stage31 dokłada ostatnią warstwę CSS dla widoków mobilnych CloseFlow. Zakres jest wizualny i działa głównie poniżej `900px`, z dodatkowymi progami `768px`, `430px` i `390px`.

## Zakres

Poprawka obejmuje:

- Dziś,
- Leady,
- LeadDetail,
- Klienci,
- ClientDetail,
- Sprawy,
- CaseDetail,
- Zadania,
- Kalendarz,
- Aktywność,
- Szkice AI,
- Powiadomienia,
- Rozliczenia,
- Pomoc,
- AI admin,
- Ustawienia,
- formularze i modale.

## Zmiany

- globalne ograniczenie poziomego scrolla na mobile,
- wymuszenie `max-width: 100%` i `min-width: 0` dla głównych shelli,
- karty i sekcje w jednej kolumnie na telefonie,
- right raile pod contentem na mobile,
- jasne tło prawych paneli i side paneli,
- bez czarnych wrapperów przy prawych kolumnach,
- tabs jako kontrolowany poziomy scroll,
- tabele przewijane wewnątrz własnej karty, nie na poziomie całej strony,
- modale z limitem wysokości, wewnętrznym scrollem i sticky header/footer,
- górne akcje jako przewijane chipy bez wypychania layoutu,
- dopracowanie szerokości 390px, 430px i 768px,
- czytelny wybrany dzień w kalendarzu.

## Nie zmienia

- logiki biznesowej,
- API,
- routingu,
- modelu danych,
- desktop layoutu poza ochroną przed regresją szerokości.

## Pliki

- `src/styles/stage31-full-mobile-polish.css`
- `scripts/check-stage31-full-mobile-polish.cjs`
- `docs/STAGE31_FULL_MOBILE_POLISH.md`
- import w `src/index.css`

## Testy

Skrypt wdrożeniowy uruchamia:

1. `node scripts/check-stage31-full-mobile-polish.cjs`
2. `node scripts/check-polish-mojibake.cjs`, jeśli istnieje
3. `npm.cmd run lint`
4. `npm.cmd run build`

Commit i push następują dopiero po zielonych testach.

## Test ręczny

Sprawdź szerokości:

- 390px,
- 430px,
- 768px.

Ścieżki:

1. Zaloguj.
2. Dziś.
3. Leady.
4. LeadDetail.
5. Klienci.
6. ClientDetail.
7. Sprawy.
8. CaseDetail.
9. Zadania.
10. Kalendarz.
11. Aktywność.
12. Szkice AI.
13. Powiadomienia.
14. Billing.
15. Ustawienia.
16. Formularze i modale.

## Kryterium zakończenia

- brak poziomego scrolla strony,
- wszystko da się kliknąć,
- modale nie są przycięte,
- prawy panel nie ma czarnych wrapperów,
- build PASS.
