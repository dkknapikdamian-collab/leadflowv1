# Raport Strony — kierunek rozwoju aplikacji: dowodowy audyt AI z agentami

Data: 2026-06-02
Status: kierunek strategiczny do rozwoju produktu
Repo: dkknapikdamian-collab/audytomat-stron
Branch: main
Canonical name: RaportStrony.org / Raport Strony
Entity ID: E002
Project ID: P001
Obsidian: 10_PROJEKTY/Audytomat_Strony

---

## Cel wpisu

Zapisać jako kierunek rozwoju aplikacji decyzję, że Raport Strony ma ewoluować w stronę dowodowego, częściowo automatycznego audytu strony wspieranego przez kilku agentów AI, ale bez udawania pełnego audytu agencyjnego SEO/UX/CRO bez danych, dowodów i kontroli jakości.

Ten dokument jest kierunkiem produktowo-technicznym, a nie jeszcze etapem wdrożeniowym.

---

## Routing i źródła sprawdzone

FAKTY:

- Repo projektu: `dkknapikdamian-collab/audytomat-stron`.
- Branch roboczy: `main`.
- `README.md` istnieje, ale jest bardzo bazowy i pochodzi z szablonu AI Studio.
- `AGENTS.md` nie został znaleziony w repo podczas tej pracy.
- `_project/03_CURRENT_STAGE.md` nie został znaleziony w repo podczas tej pracy.
- Nie znaleziono istniejącej struktury `_project` przez wyszukiwanie repo, dlatego ten dokument tworzy pierwszy jawny zapis kierunku w `_project/strategic_directions/`.

DO POTWIERDZENIA:

- Czy repo powinno dostać osobny `AGENTS.md` dla przyszłych etapów.
- Czy trzeba dodać pełną strukturę `_project/` dla Audytomatu Stron.
- Czy istnieje równoległy folder Obsidiana z aktualnymi notatkami, które trzeba zsynchronizować ręcznie.

---

## Decyzja Damiana

Zapisać kierunek rozwoju aplikacji w repo projektu:

> Raport Strony ma rozwijać się w stronę automatycznego, dowodowego audytu strony, gdzie kilku agentów AI analizuje różne warstwy strony, a osobne guardy sprawdzają, czy każda uwaga ma dowód i czy raport nie udaje danych, których system nie zebrał.

---

## Teza produktowa

Raport Strony nie powinien próbować od razu zastąpić pełnej agencji SEO/UX/CRO.

Najlepszy kierunek:

> automatyczny, dowodowy raport blokad zaufania, kontaktu, jasności oferty, pierwszego wrażenia, mobile i podstawowych problemów technicznych, z opcją późniejszego rozszerzenia o dane GA4, Google Search Console i narzędzia zachowania użytkowników.

---

## Pozycjonowanie produktu

Nie komunikować jako:

- pełny audyt SEO za 49 zł,
- pełny audyt UX/CRO za 49 zł,
- automatyczna agencja AI,
- AI scanner bez kontroli jakości.

Komunikować jako:

> Pierwszy dowodowy raport blokad strony. Sprawdza, czy klient rozumie ofertę, ufa stronie i wie, co kliknąć. Każda ważna uwaga powinna mieć dowód: screen, fragment strony albo wynik testu.

---

## Model Furtka–Renta

Furtka:

- tani raport publicznej części strony,
- bez logowania,
- bez dostępów do panelu,
- bez spotkań,
- PDF z konkretnymi problemami i priorytetami.

Renta:

- poprawki strony,
- ponowny audyt,
- monitoring zmian,
- kwartalna kontrola strony,
- audyt rozszerzony z danymi GA4/GSC/Clarity,
- stała opieka nad zaufaniem, CTA, widocznością kontaktu i problemami konwersji.

Jednozdaniowy test:

> Klient kupuje najpierw tani raport, bo nie wie, czy jego strona blokuje zapytania, a potem płaci za poprawki lub monitoring, bo strona, treści, formularze, mobile i oferta wymagają utrzymania oraz okresowej kontroli.

---

## Docelowa architektura agentów

### 1. Collector Agent

Zbiera materiał dowodowy:

- raw HTML,
- render DOM,
- screenshot desktop,
- screenshot mobile,
- statusy HTTP,
- linki,
- formularze,
- nagłówki,
- meta dane,
- widoczne CTA,
- widoczne dane kontaktowe,
- podstawowe dane Lighthouse/PageSpeed, jeśli dostępne.

### 2. Technical SEO Agent

Sprawdza podstawowe elementy techniczne:

- title,
- meta description,
- H1/H2,
- canonical,
- indexability,
- robots,
- sitemap,
- błędy 404,
- broken links,
- podstawowe Core Web Vitals / Lighthouse,
- podstawowe SEO techniczne.

Zakaz:

- nie pisać o realnym ruchu organicznym bez danych z GSC,
- nie udawać pełnego audytu SEO bez crawl/danych/szerszego zakresu.

### 3. UX / Conversion Agent

Sprawdza:

- pierwszy ekran,
- jasność oferty,
- widoczność CTA,
- widoczność kontaktu,
- hierarchię treści,
- tarcie formularza,
- mobile,
- elementy zaufania,
- drogę do zapytania lub zakupu.

Zakaz:

- nie pisać o realnej konwersji bez GA4, koszyka, formularzy albo danych zdarzeń.

### 4. Content / Trust Agent

Sprawdza:

- czy tekst jest konkretny,
- czy oferta jest zrozumiała,
- czy nie ma pustych obietnic,
- czy nie ma starych dat,
- czy dane firmy są spójne,
- czy są dowody zaufania,
- czy język nie brzmi jak plastikowe AI.

### 5. Evidence Critic Agent

Najważniejszy guard jakości.

Dla każdej uwagi wymaga:

```text
problem:
dowód:
screen / fragment HTML / wynik testu:
wpływ na klienta:
pewność:
priorytet:
rekomendacja:
```

Reguła:

> Nie ma dowodu = nie ma uwagi w raporcie albo uwaga trafia do sekcji hipotez o niskiej pewności.

### 6. Contradiction Agent

Szuka sprzeczności:

- raport mówi „brak telefonu”, ale telefon jest w stopce,
- raport mówi „brak CTA”, ale CTA jest w hero,
- raport mówi „mobile słabe”, ale nie ma screena mobile,
- raport mówi „problem SEO”, ale nie ma danych ani testu,
- agent używa wniosków z danych, których system nie zebrał.

### 7. Report Writer Agent

Dopiero po przejściu guardów pisze raport dla klienta:

- prosty język,
- konkretne problemy,
- priorytety,
- ograniczenia raportu,
- bez przesadnych obietnic,
- bez udawania pełnego audytu agencyjnego.

### 8. Final Quality Gate

Blokuje raport, jeśli:

- brakuje dowodów,
- raport jest zbyt ogólny,
- są sprzeczności,
- są puste rekomendacje,
- AI wymyśla dane,
- raport obiecuje pełny SEO/UX/CRO bez danych,
- materiał brzmi jak generyczny tekst AI,
- nie rozdzielono faktów, hipotez i ograniczeń.

---

## Poziomy produktu

### Poziom 1 — Raport publiczny

Zakres:

- publiczny URL,
- raw HTML,
- render Playwright,
- screenshot desktop/mobile,
- Lighthouse/PageSpeed,
- analiza treści,
- CTA,
- zaufanie,
- mobile,
- podstawowe SEO,
- PDF,
- quality gate.

Cena robocza:

- Mini: 49 zł,
- Standard: 149 zł,
- Pro: 299–349 zł.

Status:

- najbliższy sensowny kierunek rozwoju.

### Poziom 2 — Raport z danymi Google

Zakres:

- Google Search Console,
- GA4,
- podstrony z dużą liczbą wyświetleń,
- niski CTR,
- wejścia bez akcji,
- źródła ruchu,
- strony z potencjałem.

Cena robocza:

- 499–999 zł.

Warunek:

- klient musi świadomie połączyć dane albo dostarczyć eksport.

### Poziom 3 — Raport zachowania użytkowników

Zakres:

- Microsoft Clarity / podobne narzędzie,
- heatmapy,
- nagrania sesji,
- rage clicks,
- dead clicks,
- scroll depth,
- ignorowane elementy.

Cena robocza:

- 999–2500 zł.

Warunek:

- dane z zachowania użytkowników muszą realnie istnieć.

### Poziom 4 — Naprawa i monitoring

Zakres:

- poprawki strony,
- poprawki copy,
- poprawki CTA,
- formularze,
- widoczność kontaktu,
- kwartalny ponowny audyt,
- monitoring błędów i spadku jakości.

Cena robocza:

- poprawki od 999 zł,
- monitoring 199–499 zł miesięcznie lub kwartalnie.

---

## Twarde zasady jakości

1. Nie ma dowodu = nie ma mocnej uwagi.
2. Brak GA4/GSC = nie wolno pisać o realnym ruchu i konwersjach.
3. Brak Clarity/heatmap = nie wolno pisać o realnym zachowaniu użytkowników.
4. Brak screenshotu mobile = nie wolno oceniać mobile jako faktu.
5. AI ma rozdzielać fakty, hipotezy i ograniczenia.
6. Raport ma mówić prostym językiem właściciela małej firmy.
7. Raport nie ma brzmieć jak generyczne AI.
8. Raport ma prowadzić do następnego kroku: poprawka, ponowny audyt albo monitoring.
9. Nie udawać pełnego audytu agencyjnego, jeśli zakres jest publiczny i automatyczny.
10. Każda automatyczna uwaga powinna mieć priorytet i wpływ biznesowy.

---

## Czego nie robić teraz

Nie budować od razu:

- pełnej automatycznej agencji SEO/UX/CRO,
- panelu klienta tylko dla wrażenia,
- fałszywych dashboardów,
- analizy danych, których klient nie dostarczył,
- pełnych integracji GA4/GSC/Clarity przed wzmocnieniem raportu publicznego,
- ciężkiego systemu bez proof-of-value na tanim raporcie.

---

## Najbliższy kierunek wdrożeniowy

Proponowany następny etap produktowy:

> Evidence-first audit pipeline dla raportu publicznego.

Zakres etapu:

1. Collector zbiera HTML, DOM, screenshoty i wyniki testów.
2. Każde wykrycie problemu zapisuje dowód.
3. AI nie dostaje samego URL, tylko paczkę dowodową.
4. Raport rozdziela fakty od hipotez.
5. Quality gate blokuje raport bez dowodów.
6. Człowiek zatwierdza raport przed wysyłką w pierwszych wersjach.

---

## Testy wymagane przed uznaniem kierunku za wdrożony

### Testy automatyczne

- raport nie może zawierać uwagi bez pola `evidence`,
- raport nie może używać słów o konwersji/ruchu bez źródła danych,
- brak screena mobile blokuje ocenę mobile jako faktu,
- contradiction gate wykrywa sprzeczne uwagi,
- generated report przechodzi anty-plastikowy guard jakości.

### Testy ręczne

- 5 stron lokalnych usług,
- 3 sklepy internetowe,
- 2 strony B2B,
- porównanie: co wykrył system vs co widzi człowiek,
- zapis fałszywych alarmów,
- zapis brakujących detekcji,
- decyzja: PASS / LIMITED / FAIL.

---

## Ryzyka

- AI może pisać pewnie brzmiące bzdury bez dowodów.
- Kilku agentów może powielać ten sam błąd, jeśli każdy widzi te same niepełne dane.
- Klient może pomylić tani raport z pełnym audytem agencyjnym.
- Za szeroki zakres może zabić marżę.
- Bez dobrego przykładu raportu landing będzie sprzedawał słabo.
- Integracje GA4/GSC/Clarity podniosą wartość, ale zwiększą tarcie zakupu.

---

## Decyzja końcowa

ROBIĆ jako kierunek rozwoju, ale etapami.

Nie robić jako „pełny audyt agencyjny AI”.

Robić jako:

> dowodowy raport blokad strony, rozwijany od publicznego audytu URL do rozszerzonych audytów z danymi.

---

## Następny krok

Przygotować osobny etap wdrożeniowy:

`P0G / P1 - evidence-first audit pipeline`

Zakres tego etapu powinien obejmować:

- collector dowodów,
- strukturę danych `finding + evidence`,
- screenshot desktop/mobile,
- Playwright render,
- podstawowy Lighthouse/PageSpeed,
- AI analysis input oparty o dowody,
- evidence critic,
- contradiction gate,
- quality gate,
- zapis testów ręcznych i automatycznych,
- aktualizację Obsidiana.

---

## Aktualizacja Obsidiana do wykonania

Docelowa ścieżka sugerowana:

`10_PROJEKTY/Audytomat_Strony/product/2026-06-02 - Kierunek rozwoju aplikacji - dowodowy audyt AI z agentami.md`

Status:

- zapis w repo wykonany,
- synchronizacja do Obsidiana: do wykonania, jeśli vault nie jest automatycznie spięty z repo.
