-- Analytics Functions
create or replace function public.get_client_metrics()
returns json as $$
declare
  total_clients integer;
  new_clients integer;
  retention_rate decimal;
begin
  -- Get total clients
  select count(*) into total_clients
  from public.user_profiles
  where role = 'client';

  -- Get new clients this month
  select count(*) into new_clients
  from public.user_profiles
  where role = 'client'
  and created_at >= date_trunc('month', now());

  -- Calculate retention rate
  with monthly_active_clients as (
    select distinct client_id
    from public.orders
    where created_at >= date_trunc('month', now() - interval '1 month')
  ),
  previous_clients as (
    select distinct client_id
    from public.orders
    where created_at < date_trunc('month', now() - interval '1 month')
  )
  select 
    coalesce(
      (count(distinct mac.client_id)::decimal / nullif(count(distinct pc.client_id), 0) * 100),
      0
    ) into retention_rate
  from previous_clients pc
  left join monthly_active_clients mac on mac.client_id = pc.client_id;

  return json_build_object(
    'totalClients', total_clients,
    'newClientsThisMonth', new_clients,
    'retentionRate', retention_rate
  );
end;
$$ language plpgsql security definer;

create or replace function public.get_order_metrics()
returns json as $$
declare
  total_orders integer;
  completed_orders integer;
  avg_completion_time decimal;
begin
  -- Get total and completed orders
  select 
    count(*),
    count(*) filter (where status = 'completed')
  into total_orders, completed_orders
  from public.orders;

  -- Calculate average completion time
  select 
    avg(extract(epoch from (updated_at - created_at))/3600)
  into avg_completion_time
  from public.orders
  where status = 'completed';

  return json_build_object(
    'totalOrders', total_orders,
    'completedOrders', completed_orders,
    'averageCompletionTime', coalesce(avg_completion_time, 0)
  );
end;
$$ language plpgsql security definer;

create or replace function public.get_revenue_data()
returns json as $$
declare
  revenue_data json;
begin
  select json_agg(
    json_build_object(
      'month', to_char(date_trunc('month', created_at), 'YYYY-MM'),
      'revenue', sum(total_amount)
    )
  )
  into revenue_data
  from public.order_pricing
  where created_at >= date_trunc('month', now() - interval '11 month')
  group by date_trunc('month', created_at)
  order by date_trunc('month', created_at);

  return revenue_data;
end;
$$ language plpgsql security definer;

create or replace function public.get_status_distribution()
returns json as $$
declare
  status_data json;
begin
  select json_agg(
    json_build_object(
      'status', status,
      'count', count(*)
    )
  )
  into status_data
  from public.orders
  group by status;

  return status_data;
end;
$$ language plpgsql security definer;