# Obsidian update - STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT

Date: 2026-06-14 20:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## 02_AKTUALNY_STAN

- Status: PRZYJETE_DO_ETAPU / DO_WDROZENIA_PO_DETAIL_CLOSEOUT_ALBO_PRZY_STAGE_A36.
- Damian doprecyzowal, ze `Szybki szkic` i `Szkic AI` to dwa rozne produkty.
- Szybki szkic ma byc zwykla notatka/raw capture, mozliwa do zapisania i dyktowania bez AI gate.
- Szkic AI ma byc osobnym AI parserem/klasyfikatorem, ktory proponuje akcje i zapisuje je dopiero po akceptacji uzytkownika.

## 04_KIERUNEK_DO_WDROZENIA

Dopisac do centralnego kierunku przy AI Drafts / szybkie szkice:

1. Szybki szkic:
   - prosty zapis notatki/szkicu,
   - moze byc dyktowany,
   - nie wymaga `fullAi`,
   - nie moze rzucac `WORKSPACE_AI_ACCESS_REQUIRED`,
   - sluzy jako szybka skrzynka raw input.

2. Szkic AI:
   - osobny flow AI,
   - wymaga AI feature access,
   - AI analizuje tekst i proponuje rekordy do zatwierdzenia,
   - confirm-first,
   - brak automatycznego finalnego zapisu bez akceptacji.

Przyklad: `Dzwonil do mnie Piotrek. Zapisz, ze mam sie jutro z nim skontaktowac w sprawie umowy.`

- szybki szkic: zapisuje raw note,
- szkic AI: proponuje task/follow-up na jutro z kontekstem Piotrek/umowa.

## 08_HISTORIA_ZMIAN

- Dodano decyzje produktowa STAGE231J2: rozdzielic szybki szkic raw note od AI draft parsera.
- Powod: blad `WORKSPACE_AI_ACCESS_REQUIRED` przy zapisie szkicu pokazal, ze podstawowy zapis szkicu zostal pomylony z platna/AI funkcja.

## 09_TESTY_DO_WYKONANIA_I_WYNIKI

Plan testow dla przyszlego wdrozenia:

1. Szybki szkic bez AI:
   - wpisz tekst,
   - zapisz,
   - brak `WORKSPACE_AI_ACCESS_REQUIRED`,
   - hard refresh: szkic zostaje.

2. Szybki szkic dyktowany:
   - dyktuj tekst,
   - autosave/raw save dziala,
   - hard refresh: szkic zostaje.

3. Szkic AI:
   - uzytkownik z AI access dostaje propozycje klasyfikacji,
   - wynik trafia do zatwierdzenia,
   - finalny task/event/lead/note powstaje dopiero po akceptacji.

4. Uzytkownik bez AI access:
   - szybki szkic nadal dziala,
   - AI draft pokazuje jasny komunikat o niedostepnej funkcji AI,
   - UI nie pokazuje surowego `WORKSPACE_AI_ACCESS_REQUIRED`.

## 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

- Ryzyko: szybki szkic nie moze byc zablokowany przez `fullAi`.
- Ryzyko: AI draft nie moze udawac zwyklego szkicu.
- Ryzyko: dwa podobne przyciski moga mylic uzytkownika, jesli copy i kontrakt nie beda jednoznaczne.
- Ryzyko: AI nie moze tworzyc finalnych rekordow bez approval.
- Ryzyko: trzeba uniknac rozproszonych lokalnych przyciskow szkicu w Today/LeadDetail/ClientDetail/CaseDetail.

## 15_SQL_LEDGER_AND_TESTED_SQL

SQL: NIE RUSZANO.

Przy wdrozeniu developer ma najpierw sprawdzic, czy obecna tabela/kontrakt wystarcza do raw draft capture. Jesli nie, SQL ma byc osobnym plikiem z guardem.

## Next step

Dopisac STAGE231J2 do `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` przy najblizszym bezpiecznym update centralnego pliku etapow albo podczas wdrozenia STAGE231J2. Run decision istnieje w `_project/runs/STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT.md`.
