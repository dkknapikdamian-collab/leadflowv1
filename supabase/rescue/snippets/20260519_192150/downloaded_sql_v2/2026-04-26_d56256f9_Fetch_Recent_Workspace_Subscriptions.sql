update public.workspaces
set
  plan_id = 'closeflow_basic',
  subscription_status = 'paid_active',
  next_billing_at = '2090-01-01 00:00:00+00',
  updated_at = now()
where id = '0246832c-0de6-471f-a2c7-999bd8c9f5d2';
