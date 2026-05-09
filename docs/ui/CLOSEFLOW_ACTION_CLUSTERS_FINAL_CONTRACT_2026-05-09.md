# CLOSEFLOW ACTION CLUSTERS FINAL CONTRACT - VS-6

Status: contract_finalized_runtime_wrappers_not_mass_migrated

## Cel

Jedno źródło prawdy dla grup przycisków akcji: nagłówki encji, nagłówki paneli, akcje inline i strefy danger.

## Pliki kontraktu

- `src/components/ui-system/ActionCluster.tsx`
- `src/components/entity-actions.tsx`
- `src/styles/closeflow-action-clusters.css`

## Polityka migracji

- Nie wykonywać hurtowych migracji legacy stron przez regex.
- Duże strony migrować tylko ręcznie, jeden plik na etap.
- Ten etap domyka kontrakt komponentowy i CSS, nie zmienia logiki biznesowej.

## Regiony

- `entity-header-action-cluster` - occurrences: 6
- `activity-panel-header` - occurrences: 5
- `note-panel-header` - occurrences: 2
- `tasks-panel-header` - occurrences: 3
- `work-items-panel-header` - occurrences: 2
- `events-panel-header` - occurrences: 3
- `calendar-panel-header` - occurrences: 2
- `danger-action-zone` - occurrences: 14
- `info-row-inline-action` - occurrences: 4

## Kryterium zakończenia

- `ActionCluster` ma jawny marker VS-6.
- Legacy wrappery z `entity-actions.tsx` mają `data-standard-action-cluster="true"`.
- CSS zawiera metadata: owner, reason, scope, remove_after_stage.
- Check blokuje brak kontraktu.

## Wynik audytu

`CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6_AUDIT_OK`
