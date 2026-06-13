# CLOSEFLOW_CLIENT_CASE_URGENT_FIX - run report

project_id: closeflow_lead_app
canonical_name: CloseFlow / LeadFlow
stage_id: DO_POTWIERDZENIA
date: 2026-06-13 Europe/Warsaw

## FAKTY Z KODU / PLIKOW
- Owner Control uzywal zbyt szerokiego resolvera obejmujacego `amount` i prowizje.
- `Razem do pobrania` dostawalo pozostala wartosc transakcji zamiast pozostalej prowizji.
- Klient nie mial widocznej akcji tworzenia kolejnej sprawy w kartotece.
- Naglowek sprawy kierowal zawsze do `/cases`.

## DECYZJE DAMIANA
- Istniejaca glowna sprawa pozostaje glowna; nowa jest nizej na liscie.
- `Cofnij` prowadzi do kartoteki powiazanego klienta.
- Bez commit i push bez osobnej zgody.

## DO POTWIERDZENIA
- Formalny identyfikator etapu.
- Test reczny Damiana.

## AUDYT PRZED ETAPEM
- Ekrany: `/clients/:id`, `/cases/:id`, `/today`, lista spraw.
- Podobne miejsca: ClientCreateDialog, Cases create modal, FIN10 finance source, Stage231F R3 owner control.
- Obce zmiany 231D zostaly zachowane i nie sa czescia zakresu.

## ZMIANY
- Dodano wspolny helper starterowej sprawy i modal nazwy sprawy.
- Przepieto aktywny ClientCreateDialog na ten helper.
- Dodano akcje `Dodaj sprawe`, zachowanie primary i sortowanie primary-first.
- Naprawiono settlement total, wartosc Owner Control i nawigacje `Cofnij`.

## TESTY AUTOMATYCZNE / GUARDY
- PASS: dedykowany guard i test wrapper.
- PASS: Stage231F R3 guard.
- PASS: production build.
- FAIL pre-existing: Stage231D2 marker guard.
- FAIL pre-existing: Stage98 mojibake/BOM quiet gate.

## TESTY RECZNE
- TEST RECZNY DO WYKONANIA.
- Browser automation SKIP: lokalny URL zablokowany przez polityke narzedzia.

## AUDYT PO ETAPIE
- Przyczyny poprawiono w zrodlach danych, nie tylko w opisach UI.
- Tworzenie sprawy ma jeden helper, wartosc sprawy jeden finance resolver, saldo jeden commission source.
- Nie zmieniono SQL, API, RLS ani cudzych plikow 231D.
- Znalezione problemy: FOUND-20260613-04.

## GIT / ZIP STATUS
- Backup kompletny.
- Commit: NIE.
- Push: NIE.
