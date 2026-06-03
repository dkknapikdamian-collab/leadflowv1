# STAGE220A11 CaseDetail tabs production repair — R5

Data: 2026-06-03
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Cel

Domknąć produkcyjny układ zakładek w `src/pages/CaseDetail.tsx` po wadliwych paczkach Stage220A9/A10/R1/R2/R4.

## Zakres R5

- marker-safe hotfix dla zakładek `Obsługa`, `Checklisty`, `Historia`,
- brak zakładki `Ścieżka`,
- realne markery `data-stage220a11-*` na triggerach i panelach,
- historia przez `buildCaseHistoryItemsStage14D`,
- formatowanie historii bez JSON/technicznego payloadu,
- CSS nie ukrywa aktywnych paneli tabów,
- większe kontrolki i `line-height: 1.25`.

## Czego nie ruszano

- Supabase,
- SQL,
- RLS,
- API,
- routing aplikacji,
- logika finansowa poza usunięciem starego panelu historii wpłat z głównej kolumny.

## Testy wymagane po apply

```powershell
npm run build
node scripts/check-stage220a11-case-detail-tabs-production.cjs
```

## Test ręczny

Otworzyć szczegół sprawy i sprawdzić:

1. Pod nagłówkiem są tylko `Obsługa`, `Checklisty`, `Historia`.
2. Polskie znaki nie są ucięte.
3. Kliknięcie zakładki realnie przełącza treść.
4. Checklisty mają akcje `Brak`, `Wysłane`, `Akceptuj`, `Odrzuć`.
5. Historia nie pokazuje JSON ani technicznego payloadu.
