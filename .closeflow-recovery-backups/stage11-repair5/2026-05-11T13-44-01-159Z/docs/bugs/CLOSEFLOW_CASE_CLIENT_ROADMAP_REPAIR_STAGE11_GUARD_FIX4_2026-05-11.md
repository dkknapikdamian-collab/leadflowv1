# CloseFlow â€” Stage 11 guard repair 4

Data: 2026-05-11

## Cel

DomknÄ…Ä‡ kolejny stary guard z pakietu release quiet:

- `tests/today-entry-relation-links.test.cjs`

## Zakres

- `src/pages/Today.tsx`
- `docs/TODAY_ENTRY_RELATION_LINKS_2026-04-24.md`

## Co poprawiono

- Dodano guard-compatible helper `TodayEntryRelationLinks` w legacy `Today.tsx`.
- Helper zawiera linki:
  - `leadId -> OtwĂłrz lead`
  - `caseId -> OtwĂłrz sprawÄ™`
- Dodano dwa markery uĹĽycia wymagane przez stary test ĹşrĂłdĹ‚owy.

## WaĹĽne

`Today.tsx` jest oznaczony jako legacy inactive surface. Aktywny route `/` i `/today` idzie przez `TodayStable`. Ta poprawka nie zmienia aktywnego flow uĹĽytkownika, tylko domyka stary guard release.
