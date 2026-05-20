-- A20 status contract guard.
-- Supabase is the source of truth. This migration normalizes known legacy values
-- and adds lightweight check constraints where tables/columns exist.

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'leads' and column_name = 'status'
  ) then
    update public.leads
    set status = case status
      when 'follow_up' then 'waiting_response'
      when 'follow_up_needed' then 'waiting_response'
      when 'waiting_for_reply' then 'waiting_response'
      when 'accepted_waiting_start' then 'accepted'
      when 'active_service' then 'moved_to_service'
      else status
    end
    where status in ('follow_up', 'follow_up_needed', 'waiting_for_reply', 'accepted_waiting_start', 'active_service');

    alter table public.leads drop constraint if exists leads_status_domain_check;
    alter table public.leads
      add constraint leads_status_domain_check
      check (status in (
        'new','contacted','qualification','proposal_sent','waiting_response','negotiation',
        'accepted','won','lost','moved_to_service','archived'
      ));
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cases' and column_name = 'status'
  ) then
    update public.cases
    set status = case status
      when 'waiting_for_client' then 'waiting_on_client'
      when 'unstarted' then 'new'
      when 'collecting_materials' then 'waiting_on_client'
      when 'to_verify' then 'to_approve'
      when 'closed' then 'completed'
      when 'done' then 'completed'
      when 'cancelled' then 'canceled'
      else status
    end
    where status in ('waiting_for_client', 'unstarted', 'collecting_materials', 'to_verify', 'closed', 'done', 'cancelled');

    alter table public.cases drop constraint if exists cases_status_domain_check;
    alter table public.cases
      add constraint cases_status_domain_check
      check (status in (
        'new','waiting_on_client','blocked','to_approve','ready_to_start',
        'in_progress','on_hold','completed','canceled','archived'
      ));
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'work_items' and column_name = 'status'
  ) then
    update public.work_items
    set status = case status
      when 'completed' then 'done'
      when 'cancelled' then 'canceled'
      when 'postponed' then 'scheduled'
      when 'overdue' then 'todo'
      else status
    end
    where status in ('completed', 'cancelled', 'postponed', 'overdue');

    alter table public.work_items drop constraint if exists work_items_status_domain_check;
    alter table public.work_items
      add constraint work_items_status_domain_check
      check (status in ('todo','scheduled','in_progress','done','canceled'));
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'ai_drafts' and column_name = 'status'
  ) then
    update public.ai_drafts
    set status = case status
      when 'approved' then 'confirmed'
      when 'cancelled' then 'canceled'
      else status
    end
    where status in ('approved', 'cancelled');

    alter table public.ai_drafts drop constraint if exists ai_drafts_status_domain_check;
    alter table public.ai_drafts
      add constraint ai_drafts_status_domain_check
      check (status in ('draft','pending','confirmed','converted','canceled','failed'));
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'case_items' and column_name = 'status'
  ) then
    update public.case_items
    set status = case status
      when 'uploaded' then 'submitted'
      when 'accepted' then 'approved'
      when 'to_improve' then 'needs_changes'
      when 'done' then 'completed'
      when 'cancelled' then 'canceled'
      else status
    end
    where status in ('uploaded', 'accepted', 'to_improve', 'done', 'cancelled');

    alter table public.case_items drop constraint if exists case_items_status_domain_check;
    alter table public.case_items
      add constraint case_items_status_domain_check
      check (status in (
        'missing','requested','submitted','to_verify','needs_changes',
        'approved','rejected','completed','not_applicable','canceled'
      ));
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'workspaces' and column_name = 'subscription_status'
  ) then
    update public.workspaces
    set subscription_status = 'canceled'
    where subscription_status = 'cancelled';

    alter table public.workspaces drop constraint if exists workspaces_subscription_status_domain_check;
    alter table public.workspaces
      add constraint workspaces_subscription_status_domain_check
      check (subscription_status in (
        'trial_active','trial_ending','trial_expired','free_active','paid_active',
        'payment_failed','past_due','inactive','workspace_missing','canceled'
      ));
  end if;
end $$;