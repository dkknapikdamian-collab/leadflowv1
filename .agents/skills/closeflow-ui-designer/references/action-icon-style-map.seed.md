# Action Icon Style Map Seed

This is a seed. Refresh with generated audits before editing.

| Action intent | Polish labels / examples | Icon candidates | Target tone | Target source |
|---|---|---|---|---|
| delete | Usuń, Usuń notatkę, Usuń klienta, Usuń sprawę | Trash2 | danger/destructive | shared action icon/button contract |
| edit | Edytuj, Edytuj dane | Pencil | neutral/primary | entity header action cluster |
| save | Zapisz | Save | primary/success depending context | form footer / edit form action |
| cancel | Anuluj | none or X | neutral | form footer |
| add note | Dodaj notatkę | Plus/FileText | primary/subtle | activity-panel-header |
| add task | Dodaj zadanie | Plus/CheckCircle2 | primary/subtle | tasks-panel-header |
| copy | Kopiuj | Copy | neutral | inline info row action |
| dictation | Dyktuj, Mikrofon | Mic/MicOff | accent/active | note/task input toolbar |

## Rule

If the same action intent appears on multiple screens, do not style icons locally. Route through the same helper/component/variant.
