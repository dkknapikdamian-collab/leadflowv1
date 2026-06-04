# STAGE220A33 - CaseDetail toast refresh memory closeout

Data: 2026-06-04
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: GitHub connector push + lokalna walidacja po pullu

## Cel etapu

Domknac najblizszy etap stabilizacyjny po Stage220A: komunikaty aplikacji maja wygladac jak CloseFlow, a nie jak systemowe/native alerty. CaseDetail nie moze miec mechanizmu odswiezania po samym focus/visibilitychange karty przegladarki. Etap ma tez zostawic dowod w repo i manifest aktualizacji Obsidiana.

## FAKTY

- Wspolny Toaster aplikacji jest w `src/components/ui/sonner.tsx`.
- `CaseDetail.tsx` mial juz eventowe odswiezanie po jawnych akcjach operatora: `closeflow:context-note-saved` i `closeflow:context-action-saved`.
- Nie wykryto wprowadzania globalnego focus/visibility reloadu w CaseDetail w ramach tego etapu.
- Connector GitHub nie pozwolil bezpiecznie nadpisac duzego `src/App.tsx`; dlatego runtime podpiecie CSS zostalo wykonane w mniejszym, wlasciwym source-of-truth: `src/components/ui/sonner.tsx`.

## DECYZJE

- Globalny visual source truth dla toastow nalezy do `src/components/ui/sonner.tsx`, nie do pojedynczych stron.
- Nie dokladamy nowej funkcji finansowej w CaseDetail w tym etapie.
- Nie dokladamy lejka sprzedazy w tym etapie. To osobny etap po stabilizacji CaseDetail i pamieci projektu.
- Refresh CaseDetail jest dozwolony po jawnych zdarzeniach zapisu operatora, ale nie po samym przejsciu na inna karte przegladarki i powrocie.

## ZMIENIONE PLIKI

- `src/components/ui/sonner.tsx`
- `src/styles/closeflow-toast-source-truth-stage220a33.css`
- `tests/stage220a33-case-detail-toast-refresh-and-memory-contract.test.cjs`
- `_project/runs/2026-06-04_stage220a33_case_detail_toast_refresh_memory_closeout.md`
- `_project/obsidian_updates/2026-06-04 - CloseFlow - Stage220A33 case detail toast refresh memory closeout.md`

## GUARDY / TESTY

Do uruchomienia lokalnie po pullu:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
git pull origin dev-rollout-freeze
node --test tests/stage220a33-case-detail-toast-refresh-and-memory-contract.test.cjs
npm run build
npm run verify:closeflow:quiet
```

## TEST RĘCZNY

1. Wejsc w szczegoly sprawy: `/cases/:caseId`.
2. Otworzyc historie wplat.
3. Dodac wplate.
4. Dodac korekte.
5. Usunac wplate albo korekte.
6. Przelaczyc karte przegladarki i wrocic.
7. Sprawdzic:
   - komunikaty maja styl CloseFlow, nie wygladaja jak systemowe,
   - widok nie robi pelnego migania/reloadu po samym powrocie do karty,
   - odswiezenie po zapisie nadal dziala,
   - historia finansowa dalej pokazuje nowe wpisy.

## RYZYKA

- Nie uruchomiono lokalnego `npm run build` w srodowisku ChatGPT, bo kontener nie ma dostepu do repo przez `git clone` ani do lokalnego `.env`.
- Zmiana jest mala i skupiona na wspolnym Toasterze oraz statycznym guardzie.
- Jezeli CSS Sonnera w runtime ma inna strukture DOM niz zakladana, guard nadal chroni import/source-truth, ale ocena finalnego wygladu wymaga testu recznego w przegladarce.

## NASTĘPNY KROK

Po zielonych testach lokalnych i manualnym sprawdzeniu CaseDetail mozna przejsc do osobnego etapu: `STAGE220A34_LEJEK_SPRZEDAZY_PRODUCT_CONTRACT`, ale dopiero po potwierdzeniu, ze CaseDetail nie regresuje.
