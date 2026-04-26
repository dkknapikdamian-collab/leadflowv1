# Billing access plan and lead write gate fix v2

Data: 2026-04-26

## Co naprawia

- Basic za 19 zł zostaje Basic i nie jest przepisywany na Pro.
- `paid_active` z `next_billing_at` w przeszłości traci dostęp jako `payment_failed`.
- Dodawanie, edycja, usuwanie leadów i start sprawy przez `/api/leads` wymagają aktywnego dostępu.
- Testy są dopisane do release gate.

## Test ręczny

```sql
update public.workspaces
set
  plan_id = 'closeflow_basic',
  subscription_status = 'paid_active',
  next_billing_at = '2020-01-01 00:00:00+00',
  updated_at = now()
where id = '0246832c-0de6-471f-a2c7-999bd8c9f5d2';
```

Po odświeżeniu aplikacji dodanie leada powinno zostać zablokowane.
