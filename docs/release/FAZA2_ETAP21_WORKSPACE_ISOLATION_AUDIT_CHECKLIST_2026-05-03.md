# FAZA 2 - Etap 2.1 - Workspace isolation i request scope audit checklist

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** audit checklist + static guard, bez zmian runtime.

## Cel

Udowodnić, że aplikacja nie miesza danych między workspace i użytkownikami.

To jest P0 przed płatną wersją. Jeżeli user B widzi dane usera A, produkt nie może iść do użytkowników.

## Co sprawdzamy

Obszary wymagane przez audyt:

```text
src/hooks/useWorkspace.ts
src/server/_request-scope.ts
src/server/_access-gate.ts
src/server/_supabase-auth.ts
api/me.ts
api/*.ts
Supabase RLS
```

Każdy endpoint musi mieć dowód na:

```text
user
workspace
role
plan/access, jeśli dotyczy
```

## Automatyczny zakres Etapu 2.1

Ten etap nie wykonuje jeszcze pełnego E2E z dwoma kontami. Dodaje:

1. checklistę audytu,
2. static guard dla request scope i access guard,
3. instrukcję manualnego testu dwóch kont,
4. wymaganie dowodu screen/log przed release sign-off.

## Aktualny znany dług

`src/server/_request-scope.ts` nadal zawiera kompatybilne fallbacki do nagłówków/body/query:

```text
x-workspace-id
body.workspaceId
query.workspaceId
```

To może być akceptowalne tylko wtedy, gdy endpoint dodatkowo weryfikuje usera, scoped row albo membership. Nie wolno traktować samego `workspaceId` z body jako dowodu dostępu.

Ten etap nie usuwa fallbacków. Ten etap wymusza, żeby dług był widoczny i testowany.

## Manualny test dwóch kont

### Dane testowe

Przygotuj:

```text
User A
Workspace A
Lead A
Task A
Event A
Case A

User B
Workspace B
Lead B
Task B
Event B
Case B
```

Nie używaj tego samego workspace dla obu kont.

### Kroki testu

1. Zaloguj się jako User A.
2. Utwórz leada `AUDIT_A_LEAD`.
3. Utwórz zadanie `AUDIT_A_TASK`.
4. Utwórz wydarzenie `AUDIT_A_EVENT`.
5. Rozpocznij obsługę i utwórz sprawę `AUDIT_A_CASE`.
6. Zrób reload aplikacji.
7. Potwierdź, że dane A nadal są widoczne dla User A.
8. Wyloguj się.
9. Zaloguj się jako User B.
10. Sprawdź Today, Leads, Tasks, Calendar, Cases, Clients, AiDrafts.
11. User B nie może widzieć żadnego tekstu:
    - `AUDIT_A_LEAD`
    - `AUDIT_A_TASK`
    - `AUDIT_A_EVENT`
    - `AUDIT_A_CASE`
12. Spróbuj wejść bezpośrednio w URL szczegółu rekordu A, jeśli znasz ID.
13. API/UI musi zwrócić brak dostępu albo brak rekordu, nie cudzy rekord.
14. Zwykły User B nie może widzieć admin-only route ani Admin AI.
15. Zrób screenshoty albo nagranie.

## Dowód wymagany przed sign-off

Przed finalnym release wymagane są:

```text
screen/log: User A widzi swoje dane
screen/log: User B nie widzi danych User A
screen/log: bezpośredni URL do rekordu A nie działa dla User B
screen/log: zwykły user nie widzi admin-only route
screen/log: po reload workspace pozostaje poprawny
```

## Endpointy do ręcznej kontroli kodu

W kolejnym etapie trzeba przejść wszystkie pliki:

```text
api/*.ts
api/assistant/*
```

I oznaczyć każdy jako:

```text
scoped
needs_fix
manual_evidence_required
internal_only
```


## Guard compatibility marker

Legacy guard `check:p0-api-workspace-scope` wymaga tekstu:

```text
WORKSPACE_OWNER_REQUIRED
```

Aktualny runtime używa dokładniejszego błędu:

```text
WORKSPACE_OWNER_OR_ADMIN_REQUIRED
```

Etap 2.1 zostawia zachowanie runtime bez zmian i dodaje tylko komentarzowy marker kompatybilności, żeby stary guard nadal widział wymagany kontrakt.


## A22 hotfix in this package

Etap 2.1 v3 adds the missing compatibility export:

```text
api/_supabase.ts
```

It also hardens `getRequestIdentity` so it no longer derives identity from spoofable frontend headers/body/query. Auth identity should come from Supabase request context.

This does not complete full RLS proof. Full RLS/backend hardening remains Etap 2.2.

## Kryterium zakończenia Etapu 2.1

Etap 2.1 jest zakończony, gdy:

- repo ma tę checklistę,
- repo ma static guard,
- `package.json` ma skrypt `check:faza2-etap21-workspace-isolation`,
- `verify:closeflow:quiet` wymaga testu Etapu 2.1,
- manualny test dwóch kont ma jasną instrukcję.

## Czego ten etap NIE zamyka

Ten etap nie jest jeszcze pełnym dowodem RLS.

Nie twierdzimy, że security jest gotowe produkcyjnie tylko dlatego, że static guard przeszedł.

Następny logiczny etap:

```text
Faza 2 - Etap 2.2 - RLS / backend security proof
```
