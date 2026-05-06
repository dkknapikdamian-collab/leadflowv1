# Active Product Direction Files - CloseFlow / LeadFlow

Status: AKTYWNE ZRODLO KIERUNKU PRODUKTU
Data: 2026-05-06

Ten plik ustala jedyny aktualny zestaw dokumentow, ktore wolno traktowac jako kierunek produktowy CloseFlow / LeadFlow.

## Aktywne pliki kierunkowe

1. `docs/product-direction/closeflow_spec_lead_klient_sprawa_info_i_przejscia_2026-04-23_AKTUALIZACJA_PO_UWAGACH (1).md`
   - glowny model produktu: lead, klient, sprawa, przejscie do obslugi.

2. `docs/product-direction/produkt koncowy .txt`
   - wizja koncowa produktu i sens biznesowy aplikacji.

3. `docs/product-direction/closeflow_plany_cennik_i_wdrozenia_ai_google_calendar_2026-04-26.md`
   - plany, trial, billing, Google Calendar, PWA, digest i kolejnosc monetyzacji.

4. `docs/product-direction/AI_APPLICATION_OPERATOR_V1_PLAN_2026-04-26.md`
   - zasady AI: AI czyta dane aplikacji albo tworzy szkic do zatwierdzenia; nie tworzy finalnych rekordow bez potwierdzenia.

## Zasada nadrzedna

Jesli inne dokumenty w repo sa sprzeczne z powyzszymi czterema plikami, to nie wyznaczaja kierunku produktu.

Pozostale dokumenty w `docs/`, `docs/release/`, `docs/technical/`, `docs/architecture/`, `docs/qa/`, `docs/security/` i podobnych katalogach sa traktowane jako historia, evidence, guardy, release notes, dokumentacja techniczna albo slad poprzednich etapow.

Nie nalezy kasowac tych dokumentow tylko dlatego, ze nie wyznaczaja kierunku produktu, poniewaz moga byc wymagane przez testy, guardy, release evidence albo proces wdrozeniowy.

## Hierarchia decyzji

1. `closeflow_spec_lead_klient_sprawa_info_i_przejscia_2026-04-23_AKTUALIZACJA_PO_UWAGACH (1).md` wygrywa dla modelu lead -> klient -> sprawa.
2. `produkt koncowy .txt` wygrywa dla wizji koncowej.
3. `closeflow_plany_cennik_i_wdrozenia_ai_google_calendar_2026-04-26.md` wygrywa dla planow, triala, billing, Google Calendar, PWA i digestu.
4. `AI_APPLICATION_OPERATOR_V1_PLAN_2026-04-26.md` wygrywa dla zachowania AI.

## Zakaz

Nie wolno przywracac starego kierunku produktu na podstawie historycznych plikow bez swiadomej decyzji wlasciciela projektu.

W szczegolnosci nie wracamy do starego modelu, w ktorym reczne pole `Nastepny krok` jest glownym zrodlem pracy. Aktualny kierunek to najblizsza akcja liczona z realnych zadan i wydarzen.
