# AI handoff — CloseFlow Supabase direction

Ten plik jest krótką notatką dla kolejnego AI / agenta kodującego.

## Nie zgaduj schematu

Live Supabase został zweryfikowany ręcznie 2026-04-24.

Najważniejsze fakty:

```text
workspaces.owner_user_id -> auth.users.id
profiles.user_id -> auth.users.id
workspace_members.user_id -> auth.users.id
```

To nie jest schema oparta o `public.users`.

## Czego nie robić

Nie pisz SQL-a ani kodu zakładającego:

```text
profiles.id
public.users.id jako owner
workspace_members.user_id jako text
Firebase jako źródło prawdy
```

Te założenia już raz wywołały serię błędów FK.

## Aktualny kierunek produktu

CloseFlow ma być jednym systemem do:

1. pozyskania tematu jako lead,
2. rozpoczęcia obsługi przez sprawę,
3. pilnowania działań, zadań, wydarzeń, kompletności i blokad.

Użytkownik ma rozumieć:

```text
Lead = temat do pozyskania
Sprawa = temat już prowadzony operacyjnie
Klient = osoba/firma w tle, która może mieć wiele tematów
```

Po pozyskaniu lead nie jest już głównym miejscem pracy. Główna praca przechodzi do sprawy.

## Aktualna decyzja UI/UX

Nie przywracać ciężkiego CRM-owego języka.

Nie używać:

```text
lead zamknięty sprzedażowo
sales closed
zamknięty sprzedażowo
```

Używać:

```text
Rozpocznij obsługę
Ten temat jest już w obsłudze
Otwórz sprawę
Temat pozyskany do obsługi
```

## Następne prace techniczne

Najpierw domknąć Supabase/auth/workspace.

Potem dopiero:

1. twardy kontrakt API,
2. normalizacja tasków/eventów/leadów/spraw,
3. prawdziwy ekran Dziś,
4. lead detail jako centrum pracy,
5. flow lead -> sprawa.
