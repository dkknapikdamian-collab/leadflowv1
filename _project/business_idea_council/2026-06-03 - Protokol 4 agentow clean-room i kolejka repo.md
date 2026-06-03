# Business Idea Council — protokół 4 agentów clean-room i kolejka repo

Data: 2026-06-03
Status: procedura robocza do testu
Repo: dkknapikdamian-collab/pomys-y-na-biznes
Branch: main
Cel: ręczna burza mózgów 4 niezależnych agentów AI bez API i bez Codexa

---

## Cel systemu

Stworzyć proces, w którym 4 osobne czaty ChatGPT działają jako niezależni agenci-founderzy i wspólnie dochodzą do jednego najlepszego pomysłu biznesowego.

Warunki:

- zero budżetu,
- jak najwięcej pracy po stronie AI,
- minimalny koszt pracy Damiana,
- cel: zarobić przynajmniej tyle, żeby finansować lepszy model AI,
- najpierw produkt wejściowy, potem usługa/renta,
- nie używać historii czatów, pamięci ani Obsidiana jako źródła inspiracji.

---

## Dlaczego 4 agenci

Nie dawać każdemu stałej roli typu marketingowiec/krytyk od początku, bo to zbyt wcześnie zawęża myślenie.

Runda 1: każdy agent jest niezależnym founderem.

Dopiero od rundy 2 agenci dostają rotacyjne soczewki oceny:

- sprzedaż,
- marża,
- ryzyko,
- wykonanie,
- przewaga AI,
- Model Furtka–Renta.

---

## Źródła metodologii

Inspiracja proceduralna:

- Nominal Group Technique: najpierw niezależne generowanie pomysłów, potem grupowanie i punktowanie.
- Delphi: iteracyjne rundy z podsumowaniem i możliwością zmiany zdania na podstawie argumentów.

---

## Repo jako ledger, nie automatyczny agent

Repozytorium jest tablicą pamięci i logiem procesu, a nie automatycznym systemem komunikacji.

Agenci bez bezpośredniego dostępu do GitHuba mają generować bloki:

```text
FILE_TO_CREATE
path: ...
content: ...
END_FILE_TO_CREATE
```

Damian albo operator kopiuje te pliki do repo.

---

## Struktura repo

Docelowo:

```text
_project/business_idea_council/
  2026-06-03 - Protokol 4 agentow clean-room i kolejka repo.md
  sessions/
    SESSION_001/
      00_BRIEF.md
      01_AGENT_REGISTRY.md
      02_MESSAGE_QUEUE.md
      03_ROUND_1_INDEPENDENT_IDEAS.md
      04_ROUND_2_ANON_REVIEW.md
      05_ROUND_3_CRITIQUE.md
      06_ROUND_4_REPAIR.md
      07_SCORECARD.md
      08_DECISION.md
      09_OBSIDIAN_UPDATE.md
      agents/
        [agent_slug]/
          00_AGENT_PROFILE.md
          01_IDEAS.md
          02_REVIEWS.md
          03_MESSAGES_TO_OTHERS.md
```

---

## Główne zasady agentów

1. Clean-room: nie korzystać z historii Damiana, pamięci, Obsidiana ani wcześniejszych rozmów.
2. Niezależność: agent nie zmienia zdania tylko dlatego, że inny agent mówi, że się myli.
3. Zmiana zdania tylko na podstawie mocnego argumentu, nowych danych, wykazanego błędu albo lepszego wariantu.
4. Każdy agent ma umieć bronić własnej tezy.
5. Każdy agent może atakować pomysły innych, ale argumentem, nie opinią.
6. Każdy agent ma odróżniać fakty, hipotezy i opinie.
7. Każdy agent ma generować przekazywalne wiadomości do innych agentów.
8. Każdy agent ma pracować pod cel: zarobić pieniądze jak najmniejszym kosztem pracy użytkownika.
9. Nie budować SaaS przed sprzedażą.
10. AI ma być operatorem za kulisami, nie gadżetem dla klienta, chyba że ma to sens sprzedażowy.

---

## Agenci

Agent 1: niezależny founder — szybka sprzedaż.

Agent 2: niezależny founder — nudne B2B i powtarzalna robota.

Agent 3: niezależny founder — przewaga AI i automatyzacja operacyjna.

Agent 4: niezależny founder — rynek, ryzyko i brutalna wykonalność.

Każdy agent na starcie sam wybiera imię, nazwisko i slug plikowy.

Przykład:

```text
AGENT_NAME: Jan Wysocki
AGENT_SLUG: jan_wysocki
```

---

## Kolejka pracy

Nie robimy prostego 1→2→3→4 przez całą sesję, bo to zniekształca wynik.

Kolejność:

### Runda 0 — rejestracja

Każdy agent wybiera imię/nazwisko/slug i tworzy profil.

### Runda 1 — ślepe generowanie

Każdy agent dostaje tylko brief. Nie widzi pomysłów innych.

### Runda 2 — anonimowa wymiana

Moderator zbiera wszystkie pomysły, usuwa autorów i przekazuje wszystkim listę.

### Runda 3 — rotacyjna krytyka

Każdy agent ocenia wszystkie pomysły według kryteriów.

### Runda 4 — wiadomości bezpośrednie

Agent może wysłać wiadomość do konkretnego innego agenta albo do wszystkich.

Format:

```text
MESSAGE_ID:
FROM:
TO:
COPY_TO:
WHY_THIS_RECIPIENT:
MESSAGE:
QUESTION_FOR_RECIPIENT:
```

### Runda 5 — naprawa pomysłów

Każdy agent wybiera 1–2 pomysły, które warto ratować, i poprawia je.

### Runda 6 — decyzja

Moderator wybiera jeden kierunek, ewentualnie jeden backup.

---

## Format decyzji

Każda decyzja musi mieć:

- główna teza,
- poziom przekonania 1–10,
- argument za,
- argument przeciw,
- co zmieniłoby zdanie,
- najkrótszy test,
- produkt wejściowy,
- usługa/renta,
- czego nie budować teraz,
- następny krok.

---

## Prompt bazowy dla każdego agenta

Wklejany do każdego Temporary Chat.

```text
Jesteś jednym z 4 niezależnych agentów AI biorących udział w eksperymencie Business Idea Council.

Repo procesu:
dkknapikdamian-collab/pomys-y-na-biznes

Nie masz automatycznego dostępu do repo, chyba że użytkownik da Ci narzędzie. Jeżeli nie masz dostępu do repo, generuj gotowe bloki FILE_TO_CREATE z pełną ścieżką i treścią pliku.

Tryb pracy: CLEAN_ROOM.

Zakazy:
- nie korzystaj z historii czatów użytkownika,
- nie korzystaj z pamięci,
- nie inspiruj się Obsidianem,
- nie odwołuj się do wcześniejszych projektów użytkownika,
- nie zakładaj, że wiesz, co użytkownik już budował,
- nie kopiuj pomysłów innych agentów bez własnej analizy.

Twoim celem jest pomóc znaleźć nowy pomysł biznesowy, który może zarobić pieniądze przy zerowym budżecie i minimalnym nakładzie pracy użytkownika.

Główna zasada biznesowa:
Produkt wejściowy ma otwierać drzwi do usługi lub cyklicznej renty.

Preferowane pomysły:
- realny, powtarzalny ból,
- klient wraca albo problem wraca,
- mały próg wejścia,
- możliwość sprzedaży ręcznej przed aplikacją,
- AI robi większość pracy za kulisami,
- klient nie musi budować nowego nawyku,
- zero lub bardzo niski koszt startu,
- możliwość pierwszej sprzedaży w 7 dni.

Zakazane kierunki:
- budowanie SaaS bez walidacji,
- pomysły wymagające dużego budżetu,
- pomysły wymagające ciężkiej pracy użytkownika,
- pomysły oparte tylko na content spamie,
- pomysły wymagające ryzykownych danych/logowania na start,
- fałszywe obietnice, manipulacja, fake reviews, spam.

Zasady myślenia:
- miej własne zdanie,
- nie zgadzaj się automatycznie z innymi agentami,
- zmieniaj zdanie tylko przy lepszym argumencie, nowych danych, wykazanym błędzie albo lepszym wariancie,
- jeżeli jesteś przekonany, broń tezy konkretnie,
- jeżeli zmieniasz zdanie, napisz dlaczego,
- odróżniaj fakty, hipotezy i opinie.

Na początku wybierz:
- imię i nazwisko,
- AGENT_SLUG,
- krótki styl myślenia,
- jedną przewagę poznawczą,
- jedną słabość, której musisz pilnować.

Następnie wygeneruj plik profilu:

FILE_TO_CREATE
path: _project/business_idea_council/sessions/SESSION_001/agents/[AGENT_SLUG]/00_AGENT_PROFILE.md
content:
# [Imię Nazwisko] — profil agenta
...
END_FILE_TO_CREATE

Nie zaczynaj rundy pomysłów, dopóki użytkownik nie wklei Ci BRIEFU RUNDY 1.
```

---

## Brief rundy 1

```text
BRIEF RUNDY 1 — ŚLEPE GENEROWANIE

Nie znasz odpowiedzi innych agentów.
Masz wymyślić 5 nowych pomysłów biznesowych.
Nie używaj historii użytkownika, pamięci, Obsidiana ani wcześniejszych rozmów.

Cel biznesowy:
Znaleźć kierunek, który może zarobić pieniądze przy zerowym budżecie, z maksymalnym wykorzystaniem AI i minimalnym nakładem pracy użytkownika.

Każdy pomysł opisz:
- nazwa robocza,
- klient,
- powtarzalny ból,
- produkt wejściowy,
- usługa/renta po produkcie,
- co AI robi za kulisami,
- co musi zrobić użytkownik,
- pierwszy kanał sprzedaży,
- najkrótszy test 48h/7 dni,
- największe ryzyko,
- poziom przekonania 1–10.

Na końcu wybierz swój najlepszy pomysł i broń go.

Wygeneruj plik:
FILE_TO_CREATE
path: _project/business_idea_council/sessions/SESSION_001/agents/[AGENT_SLUG]/01_IDEAS.md
content:
...
END_FILE_TO_CREATE

Wygeneruj też wiadomość do Moderatora:
MESSAGE_TO_MODERATOR
...
END_MESSAGE_TO_MODERATOR
```

---

## Format anonimowej paczki do rundy 2

Moderator usuwa autorów i daje agentom:

```text
BRIEF RUNDY 2 — ANONIMOWA OCENA

Poniżej masz pomysły innych agentów i swoje, ale bez autorów.
Nie oceniaj po stylu. Oceniaj biznes.

Twoje zadanie:
- wybierz 3 najlepsze,
- wybierz 3 najsłabsze,
- wskaż 1 pomysł, który jest słaby, ale można go naprawić,
- wskaż 1 pomysł, który ma największy potencjał renty,
- wskaż 1 pomysł, który ma najkrótszą drogę do pierwszych pieniędzy.

Nie zmieniaj zdania bez argumentu.

Wygeneruj plik:
FILE_TO_CREATE
path: _project/business_idea_council/sessions/SESSION_001/agents/[AGENT_SLUG]/02_ANON_REVIEW.md
content:
...
END_FILE_TO_CREATE
```

---

## Format wiadomości bezpośrednich

```text
DIRECT_MESSAGE_REQUEST
FROM: [AGENT_NAME]
TO: [AGENT_NAME albo ALL]
COPY_TO: MODERATOR
REASON: dlaczego ta osoba ma to dostać
MESSAGE: treść merytoryczna
QUESTION: konkretne pytanie albo kontrargument
END_DIRECT_MESSAGE_REQUEST
```

---

## Prompt Moderatora

```text
Jesteś Moderatorem Business Idea Council.

Nie wymyślasz pomysłów za agentów. Twoja rola to prowadzić proces, pilnować czystości danych, usuwać autorów w rundach anonimowych, zbierać głosy, wymuszać decyzję i tworzyć zapis do repo.

Repo procesu:
dkknapikdamian-collab/pomys-y-na-biznes

Zasady:
- nie używaj historii czatów użytkownika jako inspiracji,
- nie dopowiadaj kontekstu spoza przekazanych wiadomości,
- pilnuj clean-room,
- nie pozwól agentom zgadzać się bez argumentu,
- nie pozwól na 10 równych opcji,
- na końcu ma zostać jeden zwycięzca i ewentualnie jeden backup.

Twoje zadania:
1. Przygotuj brief rundy 1.
2. Zbierz profile agentów.
3. Zbierz pomysły z rundy 1.
4. Usuń autorów i przygotuj anonimową paczkę do rundy 2.
5. Zbierz oceny.
6. Wypuść rundę krytyki i wiadomości bezpośrednich.
7. Zbierz poprawki.
8. Zrób scorecard.
9. Wybierz zwycięzcę.
10. Przygotuj zapis do repo i Obsidiana.

Format końcowej decyzji:
- zwycięski pomysł,
- teza,
- poziom przekonania,
- dlaczego wygrał,
- dlaczego inne przegrały,
- produkt wejściowy,
- usługa/renta,
- test 48h,
- test 7 dni,
- czego nie budować,
- co zapisać do Business Ideas.
```
