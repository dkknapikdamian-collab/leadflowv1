# CloseFlow — Page Header V2 Surgery Repair 2

## Powód

Repair1 zatrzymał się poprawnie, ale check był za głupi:
szukał stringa `page-head`, a ten występuje też w poprawnym imporcie `closeflow-page-header-v2.css`.

Repair2:
- poprawia check,
- dopuszcza brudny stan po nieudanym Repair1 tylko w plikach headerowej naprawy,
- ponownie przepina 4 headery,
- commituje dopiero po zielonym checku i buildzie.

## Zakres

Tylko:
- `TasksStable.tsx`
- `Templates.tsx`
- `Activity.tsx`
- `Clients.tsx`
- `CloseFlowPageHeaderV2.tsx`
- `closeflow-page-header-v2.css`

## Kryterium

Check blokuje:
- `data-cf-page-header="true"`
- `className="cf-page-header`
- `cf-page-header-row`
- `cf-page-hero-layout`
- `activity-page-header`
- stare importy header-locków

w czterech problematycznych plikach.
