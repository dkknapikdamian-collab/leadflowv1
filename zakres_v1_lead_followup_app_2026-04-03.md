# Zakres V1 po scaleniu Lead Flow i Fortecy

**Data aktualizacji:** 2026-04-07  
**Status:** obowiązująca wersja zakresu po scaleniu kierunku produktu  
**Uwaga:** nazwa pliku została zachowana dla ciągłości historii, ale opis dotyczy już produktu po scaleniu.

## 1. Cel dokumentu

Ten dokument zamyka zakres produktu na poziomie definicji po połączeniu:
- Lead Flow,
- Fortecy,
- modułu spraw operacyjnych po sprzedaży.

To nie jest już opis wyłącznie lead follow-up app.

## 2. Jednozdaniowa definicja produktu

To jest **jeden system do domykania i uruchamiania klienta**.

## 3. Zasada nadrzędna

- **Sprzedaż = Lead Flow**
- Po statusie **won** albo **ready to start** lead może przejść do **sprawy operacyjnej**
- Użytkownik nie ma czuć przeskoku między dwoma aplikacjami
- `Sprawy` są modułem tego samego systemu
- `Forteca` nie jest osobną apką

## 4. Co pozostaje rdzeniem produktu

Rdzeniem nadal jest warstwa pilnowania ruchu sprzedażowego.

System ma pilnować:
- kto wymaga ruchu dziś,
- kto jest zagrożony,
- jaki jest next step,
- co jest overdue,
- które leady wiszą za długo,
- gdzie kasa może uciec.

## 5. Co dochodzi po scaleniu

Po stronie operacyjnej system ma pilnować:
- czy klient dosłał materiały,
- czy podjął decyzje,
- czy zaakceptował to, co trzeba,
- czy sprawa może wystartować,
- co blokuje start,
- jaki jest kolejny ruch po sprzedaży.

## 6. Model produktu

### Poziom 1 — kontakt / klient
Jedna osoba lub jedna firma.

### Poziom 2 — lead
Warstwa sprzedaży:
- status,
- wartość,
- priorytet,
- next step,
- risk,
- historia sprzedażowa.

### Poziom 3 — sprawa
Warstwa operacyjna po sprzedaży:
- status sprawy,
- kompletność,
- blokery,
- aktywności,
- terminy,
- odpowiedzialność.

### Poziom 4 — checklista kompletności
Do sprawy przypinamy:
- materiały,
- pliki,
- akceptacje,
- decyzje,
- zgody,
- braki,
- blokery.

### Poziom 5 — aktywność i przypomnienia
System liczy:
- zaległości,
- oczekiwanie na klienta,
- oczekiwanie na nas,
- brak kolejnego kroku,
- ryzyko utknięcia,
- najbliższe ważne ruchy.

## 7. Finalne menu operatora

Obowiązujący kierunek menu:
- `Dziś`
- `Leady`
- `Sprawy`
- `Zadania`
- `Kalendarz`
- `Aktywność`
- `Rozliczenia`
- `Ustawienia`

Później:
- `Szablony`
- `Klienci`

## 8. Kierunek UI

Nowa skórka UI ma być oparta o kierunek **Forteca**.

To oznacza:
- jeden spójny shell operatora,
- jeden spójny styl kart i list,
- jeden spójny system statusów i badge'y,
- jeden spójny styl formularzy i dialogów,
- brak mieszania dwóch różnych klimatów produktu.

## 9. Co nie zmienia się w tym etapie

Ten etap nie zmienia jeszcze:
- kodu aplikacji,
- logiki danych,
- auth,
- billingu,
- flow dostępu,
- relacyjnego modelu przejścia lead -> sprawa w bazie.

To jest etap dokumentacyjny.

## 10. Co ma zostać z wcześniejszego V1

Z wcześniejszego V1 nadal obowiązuje:
- prostota,
- mobile-first,
- PWA,
- `Dziś` jako centrum pracy,
- niebudowanie ciężkiego CRM enterprise,
- pilnowanie next step, overdue, waiting i priorytetów,
- jedna baza prawdy,
- prywatność danych użytkownika,
- trial / billing / access jako ważna część produktu.

## 11. Czego nie wolno interpretować po staremu

Od teraz nie wolno zakładać, że:
- produkt kończy się na leadach,
- Forteca to osobna apka,
- portal klienta to osobny system,
- `Sprawy` są dodatkiem bez znaczenia architektonicznego.

To wszystko jest częścią jednego produktu.

## 12. Reguła dla AI developera

Jeżeli trafisz na starszy opis produktu, a nie zgadza się on z poniższym zdaniem, traktuj go jako historyczny:

> **To jest jeden system do domykania i uruchamiania klienta.**
