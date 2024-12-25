-- Drop existing analytics functions if they exist
drop function if exists public.get_status_distribution();
drop function if exists public.get_performance_metrics();
drop function if exists public.get_order_metrics();

-- Create new analytics functions with proper error handling and type safety
create or replace function public.get_status_distribution()
returns table (
  status text,
  count bigint
) as $$
begin
  return query
  select 
    orders.status,
    count(*)::bigint
  from public.orders
  group by orders.status
  order by count(*) desc;
end;
$$ language plpgsql security definer;

create or replace function public.get_performance_metrics()
returns json as $$
declare
  v_metrics json;
begin
  select json_build_object(
    'averageOrderValue', coalesce(
      (select avg(total_amount)
       from public.order_pricing
       where created_at >= date_trunc('month', now())),
      0
    ),
    'orderGrowthRate', coalesce(
      (select (
        (count(*) filter (where created_at >= date_trunc('month', now())) * 100.0 /
        nullif(count(*) filter (where created_at >= date_trunc('month', now() - interval '1 month')
          and created_at < date_trunc('month', now())), 0)
      ) - 100)
      from public.orders),
      0
    ),
    'processingTime', coalesce(
      (select avg(extract(epoch from (updated_at - created_at))/86400)
       from public.orders
       where status = 'completed'
       and updated_at >= date_trunc('month', now())),
      0
    )
  ) into v_metrics;

  return v_metrics;
end;
$$ language plpgsql security definer;

create or replace function public.get_order_metrics()
returns json as $$
declare
  v_metrics json;
begin
  select json_build_object(
    'totalOrders', count(*),
    'activeOrders', count(*) filter (where status in ('pending', 'in_progress')),
    'completedOrders', count(*) filter (where status = 'completed'),
    'needsAttention', count(*) filter (where status = 'review')
  ) into v_metrics
  from public.orders;

  return v_metrics;
end;
$$ language plpgsql security definer;