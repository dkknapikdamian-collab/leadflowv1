# STAGE212W - Notifications guard BOM repair

## FAKTY
- Stage212V doprowadził build do PASS, ale guard był fałszywie czerwony przez początek pliku runtime.
- Naprawiono scripts/check-stage212v-notifications-width-runtime-repair.cjs, żeby normalizował BOM i whitespace.
- Przepisano src/components/VisualFoundationRuntimeStage212M.tsx jako UTF-8 bez BOM.
- Nie zmieniano logiki powiadomień.

## TESTY
- node scripts/check-stage212v-notifications-width-runtime-repair.cjs
- npm run build

## CZEGO NIE RUSZANO
- Supabase
- RLS
- dane
- logika powiadomień
- deployment
- push

## BACKUP
_project\backups\stage212w_guard_bom_repair_20260531_144602