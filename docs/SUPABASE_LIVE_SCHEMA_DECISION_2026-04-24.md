# CloseFlow — decyzja techniczna: Supabase jako źródło prawdy

**Data:** 2026-04-24  
**Dotyczy:** auth, workspace, profile, membership, access, billing  
**Status:** obowiązuje dla dalszych wdrożeń

---

## Decyzja

Aplikacja CloseFlow / leadflowv1 ma być rozwijana dalej na Supabase.

Supabase jest źródłem prawdy dla:

- logowania,
- użytkowników,
- profili,
- workspace,
- członkostwa w workspace,
- leadów,
- zadań,
- wydarzeń,
- spraw,
- klientów,
- rozliczeń,
- ustawień.

Firebase nie jest już aktywnym źródłem prawdy. Wszelkie pola Firebase traktować wyłącznie jako legacy / migrację.

---

## Zweryfikowany constraint

W live bazie istnieje:

```text
workspaces_owner_user_id_fkey
public.workspaces.owner_user_id -> auth.users.id ON DELETE CASCADE
```

To oznacza, że `owner_user_id` musi być realnym użytkownikiem Supabase Auth.

---

## Najważniejsza zasada

Nie tworzyć ownera workspace przez losowy UUID.

Poprawnie:

```text
owner_user_id = auth.users.id
```

Błędnie:

```text
owner_user_id = gen_random_uuid()
owner_user_id = public.users.id
owner_user_id = profiles.id
```

---

## Ustalony model V1

V1 zakłada:

```text
1 użytkownik = 1 konto
1 użytkownik = 1 workspace
brak zespołów i rozbudowanych ról w V1
```

`workspace_members` istnieje, ale w V1 służy głównie do pewnego scope danych i przyszłej gotowości pod teamy.

---

## Konsekwencje dla API

Każdy endpoint operujący na danych użytkownika musi mieć workspace scope.

Minimalny flow:

1. Ustal `authUserId`.
2. Znajdź `profiles.user_id = authUserId`.
3. Ustal `workspace_id`.
4. Ogranicz SELECT / INSERT / UPDATE / DELETE do tego workspace.
5. Nie zwracaj danych z innych workspace.

---

## Konsekwencje dla SQL

Wszystkie nowe migracje muszą:

- żyć w `supabase/sql/`,
- być additive, jeśli dotykają produkcyjnej bazy,
- nie usuwać danych bez osobnej decyzji,
- uwzględniać FK do `auth.users`,
- kończyć się diagnostyką, jeśli naprawiają dane.

---

## Konsekwencje dla kolejnych AI

Kolejny AI developer ma mieć ten plik jako pierwszy kontekst przed zmianami w bazie lub API.

Jeśli model proponuje `public.users` jako głównego ownera workspace, to jest to błąd względem live schematu.
