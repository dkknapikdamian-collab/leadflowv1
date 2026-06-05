# STAGE222 R4 V2 - lead/client operational badges partial apply fix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## Cel

Naprawić częściowo wdrożoną paczkę R4 V1. V1 spatchował Leady, ale zatrzymał się na kruchym anchorze w Clients.tsx, więc guard wykrył brak importu w klientach i brak skryptów package.json.

## FAKTY

- V1 log: `Anchor not found for Clients operational badges calculation`.
- Po V1 lokalny status zawierał zmieniony `src/pages/Leads.tsx` i nieśledzone helper/test/skrypt, ale `Clients.tsx` i `package.json` nie były poprawnie spatchowane.
- V2 jest idempotentne: działa zarówno po częściowym V1, jak i na czystszym stanie.

## DECYZJE

- Docelowy wzór UI zostaje: `[Oferta wysłana] [Sprawa] [14+ dni bez ruchu] [brak akcji]`.
- Dopiski trafiają do statusline leadów i klientów.
- Nie ruszamy Today.
- Nie dodajemy nowego CSS.
- Nie pushujemy bez akceptacji.

## ZAKRES

- Upewnia się, że `Leads.tsx` ma helper i badge.
- Patchuje `Clients.tsx` elastycznym anchorowaniem.
- Uzupełnia `package.json`.
- Nadpisuje guard/test R4.
- Dopisuje wpisy `_project`.
- Dodaje manifest Obsidiana V2.

## TESTY

```powershell
node scripts/check-stage222-r4-lead-client-operational-badges.cjs
node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
npm run build
git diff --check
```

## TEST RĘCZNY

- `/leads`
- `/clients`
- Sprawdzić statusline:
  - [Oferta wysłana] [Sprawa] [14+ dni bez ruchu] [brak akcji]
  - [Bez sprawy] [brak kontaktu] [brak akcji]
- Sprawdzić, czy badge nie rozpychają wierszy.

## RYZYKA

- Badge opierają się o dostępne daty `lastContactAt/lastActivityAt/updatedAt/createdAt` oraz powiązane rekordy; dokładniejszy model aktywności to osobny A35C.
- Jeżeli lista jest za gęsta, ograniczyć badge do 2 albo skrócić tekst.

## NEXT STEP

Po zielonych testach i screenie: commit/push albo R5 micro polish.
