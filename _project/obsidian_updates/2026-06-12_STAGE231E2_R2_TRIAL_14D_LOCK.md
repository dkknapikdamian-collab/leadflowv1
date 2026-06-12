# CloseFlow / LeadFlow â€” STAGE231E2_R2_TRIAL_14D_LOCK

- data i godzina: 2026-06-12 24:10 Europe/Warsaw
- nazwa / alias wejĹ›ciowy: STAGE231E2_R2_TRIAL_14D_LOCK
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow â€” DO_POTWIERDZENIA formalne ID
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- typ wpisu: zmiana produktu / plan access / trial duration / ZIP local-only
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Decyzja

Trial CloseFlow ma mieÄ‡ 14 dni, nie 21 dni.

Zmiana obejmuje:
- centralny model planĂłw,
- backend bootstrap nowego workspace przez `api/me.ts` poprzez import `TRIAL_MS`,
- lokalny fallback bez Supabase,
- teksty logowania/rejestracji,
- guard chroniÄ…cy przed powrotem do 21 dni.

## WaĹĽne rozrĂłĹĽnienie

- Nowe konto ma dostaÄ‡ 14 dni trialu.
- Stare wiersze w bazie mogÄ… nadal mieÄ‡ `trial_21d` albo stare `trial_ends_at`; kod trzyma legacy alias, ĹĽeby ich nie wysadziÄ‡.
- Zmiana istniejÄ…cych kont wymaga osobnego SQL/admin cleanup z precyzyjnym filtrem.

## Testy

Do uruchomienia lokalnie:

```powershell
node scripts/check-stage231e2-r2-trial-14d-lock.cjs
node scripts/check-stage231e2-account-trial-bootstrap.cjs
npm run build
git diff --check
```

## Audyt ryzyk

- NajwiÄ™ksze ryzyko: istniejÄ…ce testowe konto moĹĽe nadal pokazywaÄ‡ stary licznik, bo ma stary `trial_ends_at` w bazie albo zostaĹ‚o podpiÄ™te do starego workspace.
- Nie ruszano SQL/RLS ani pĹ‚atnoĹ›ci.
- Nie pushowano z chatu, ĹĽeby nie odpalaÄ‡ Vercela.

## NastÄ™pny krok

Po lokalnym PASS i rÄ™cznym teĹ›cie Ĺ›wieĹĽego konta Damian decyduje, czy pushowaÄ‡ selektywnie.