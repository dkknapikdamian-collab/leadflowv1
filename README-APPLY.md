# closeflow_client_relation_command_center_2026-04-24

Ta paczka wdraża najważniejszy bezpieczny etap po naprawie Supabase i domknięciu filtrów:

```text
Client Detail jako centrum relacji Lead -> Klient -> Sprawa -> Rozliczenia
```

## Pliki zmieniane

- `src/pages/ClientDetail.tsx`
- `docs/CLIENT_RELATION_COMMAND_CENTER_2026-04-24.md`
- `tests/client-relation-command-center.test.cjs`
- `README-APPLY.md`

## Test

```powershell
npm.cmd run build
node --test tests/client-relation-command-center.test.cjs
```

## Commit

```powershell
git add src/pages/ClientDetail.tsx docs/CLIENT_RELATION_COMMAND_CENTER_2026-04-24.md tests/client-relation-command-center.test.cjs README-APPLY.md
git commit -m "Add client relation command center"
git push origin dev-rollout-freeze
```
