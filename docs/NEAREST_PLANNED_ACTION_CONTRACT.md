# CloseFlow - kontrakt najbliższej zaplanowanej akcji

## Źródło prawdy

Najbliższa zaplanowana akcja pochodzi z:

- `tasks`,
- `events`.

Nie pochodzi z wolnego pola tekstowego `nextStep`.

## Helper

```ts
getNearestPlannedAction(recordType, recordId, tasks, events)
```

Obsługiwane typy:

```text
lead
case
client
```

## Wynik

Helper zwraca najbliższą otwartą akcję:

```ts
{
  id: string
  kind: 'task' | 'event'
  title: string
  when: string
  status: string
  leadId?: string | null
  caseId?: string | null
  clientId?: string | null
}
```

Jeżeli nie ma otwartego zadania ani wydarzenia, zwraca `null`.

## Copy UI

| Stan | Tekst |
|---|---|
| ma akcję | Najbliższa zaplanowana akcja |
| nie ma akcji | Brak zaplanowanych działań |
| kafel/filtr Today | Bez zaplanowanej akcji |

## Legacy

`nextActionTitle` i `nextActionAt` mogą jeszcze istnieć jako dane legacy, ale nie są rdzeniem logiki A25.
