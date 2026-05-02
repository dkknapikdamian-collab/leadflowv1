# P12C — korekta szerokiego admin override

## Decyzja

Nie cofamy P12 do zera, bo potrzebny jest pełny dostęp twórcy aplikacji. Zmieniamy jednak regułę:

- NIE: `workspace admin = pełny dostęp do wszystkiego`
- TAK: `app owner / creator = pełny dostęp do wszystkiego`

## Dlaczego

W przyszłości administrator grupy, branży lub workspace nie może dostać pełnego AI, obejścia płatności i unlimited limitów tylko dlatego, że zarządza swoim workspace.

## Źródło prawdy

Twórca aplikacji jest rozpoznawany server-side przez env:

- `CLOSEFLOW_SERVER_ADMIN_EMAILS`
- `CLOSEFLOW_ADMIN_EMAILS`

`api/me.ts` zwraca:

- `profile.isAppOwner = true`,
- `profile.appRole = 'creator'`.

Tylko `isAppOwner` uruchamia creator override w `useWorkspace.ts`.

## Co poprawiono po P12

- Usunięto `ADMIN_FULL_FEATURES`.
- Usunięto `buildAdminAccessOverride`.
- `finalAccess` nie zależy już od `isAdmin`.
- Dodano `CREATOR_FULL_FEATURES`.
- Dodano `buildCreatorAccessOverride`.
- `TodayAiAssistant` używa `isAppOwner` do AI usage exemption.
- Stary guard `check:p12-admin-full-access-override` został podmieniony na creator-only guard, żeby nie utrwalał błędnego modelu.

## Test

1. Konto z mailem w `CLOSEFLOW_SERVER_ADMIN_EMAILS` ma pełny dostęp.
2. Konto z `role=admin`, ale bez `isAppOwner`, nie dostaje pełnego override.
3. Pakiet Pro dla klienta pozostaje bez pełnego AI.
