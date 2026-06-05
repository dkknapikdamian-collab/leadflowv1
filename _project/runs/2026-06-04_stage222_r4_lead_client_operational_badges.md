# STAGE222 R4 - lead/client operational badges - raport wykonania

Data: 2026-06-04
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## Routing

- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- stage id: STAGE222 R4

## Scan-first

Przeczytane pliki:
- src/pages/Leads.tsx
- src/pages/Clients.tsx
- src/components/StatShortcutCard.tsx
- src/lib/work-items/planned-actions.ts
- instrukcja BLOK 1 / A35

## FAKTY Z KODU

- Lista leadów ma już `nextActionByLeadId` i renderuje statusy przez `cf-status-pill`.
- Lista klientów ma już `nearestActionByClientId`, `Bez ruchu` jako kafelek i statusline klienta.
- Klienci mieli mylący tekst "Ostatni kontakt: jest/brak" oparty o płatności, a nie realny kontakt.
- R4 nie dodaje nowego panelu Today i nie dodaje nowego CSS.

## DECYZJE DAMIANA

- Cisza 7/14 dni i brak danych kontaktowych mają być widoczne przy leadzie/kliencie.
- Wysoka wartość / ryzyko może później agregować sprawy bez ruchu i pieniądze bez ruchu.
- Nie wrzucać tych informacji do nowego środkowego panelu Today.
- Używać jednego źródła prawdy wizualnego.

## ZAKRES WDROŻENIA

- `src/lib/record-operational-badges.ts`
- Dopiski w `Leads.tsx`:
  - brak kontaktu
  - brak akcji
  - 7+ dni bez ruchu
  - 14+ dni bez ruchu
- Dopiski w `Clients.tsx`:
  - brak kontaktu
  - brak akcji
  - 7+ dni bez ruchu
  - 14+ dni bez ruchu
- Guard/test R4.
- Wpisy `_project` i manifest Obsidiana.

## CZEGO NIE RUSZANO

- Today UI.
- Supabase schema.
- A35B Mandatory Next Step.
- A35C Activity Truth.
- Nowy CSS.
- Git push.

## GUARDY / TESTY

```powershell
node scripts/check-stage222-r4-lead-client-operational-badges.cjs
node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
npm run build
git diff --check
```

## TEST RĘCZNY

- `/leads`: sprawdzić, czy przy rekordach są krótkie dopiski, bez rozwalenia wiersza.
- `/clients`: sprawdzić, czy przy rekordach są krótkie dopiski i czy zniknął mylący tekst `Ostatni kontakt: jest/brak`.
- Sprawdzić, czy dopiski używają tego samego stylu status pill.
- Sprawdzić rekord bez telefonu/e-maila.
- Sprawdzić rekord starszy niż 7/14 dni, jeśli są takie dane.

## RYZYKA

- Last activity nadal opiera się na dostępnych polach `updatedAt/createdAt/lastActivityAt/lastContactAt` oraz powiązanych rekordach. Dokładniejszy model kontaktu powinien wejść w A35C.
- Jeżeli rekordy nie mają dat aktywności, helper pokaże neutralny badge `brak daty ruchu`.
- Jeżeli lista będzie zbyt gęsta, trzeba ograniczyć liczbę badge do 2 albo przenieść część do tooltipu.

## OBSIDIAN UPDATE

- `_project/obsidian_updates/2026-06-04 - CloseFlow - Stage222 R4 lead client operational badges.md`

## NEXT STEP

Po akceptacji R4: mapping dla `Wysoka wartość / ryzyko` — sprawy bez ruchu + pieniądze bez ruchu jako agregacja, bez nowego panelu.
