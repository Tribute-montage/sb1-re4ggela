/*
  # Fix Analytics Functions

  1. Changes
    - Drop and recreate analytics functions with proper enum handling
    - Fix status text conversion
    - Add proper error handling
    - Improve type safety
*/

-- Drop existing analytics functions
drop function if exists public.get_status_distribution();
drop function if exists public.get_order_metrics();
drop function if exists public.get_performance_metrics();

-- Create status distribution function with proper enum handling
create or replace function public.get_status_distribution()
returns table (
  status text,
  count bigint
) as $$
begin
  return query
  select 
    case status::text
      when 'in-progress' then 'in_progress'
      else status::text
    end as status,
    count(*)::bigint
  from public.orders
  group by status
  order by count(*) desc;
exception
  when others then
    raise log 'Error in get_status_distribution: %', SQLERRM;
    return query select null::text, null::bigint where false;
end;
$$ language plpgsql security definer;

-- Create order metrics function with proper enum handling
create or replace function public.get_order_metrics()
returns json as $$
declare
  v_metrics json;
begin
  select json_build_object(
    'totalOrders', count(*),
    'activeOrders', count(*) filter (where status in ('pending'::order_status, 'in-progress'::order_status)),
    'completedOrders', count(*) filter (where status = 'completed'::order_status),
    'needsAttention', count(*) filter (where status = 'review'::order_status)
  ) into v_metrics
  from public.orders;

  return coalesce(v_metrics, '{}'::json);
exception
  when others then
    raise log 'Error in get_order_metrics: %', SQLERRM;
    return '{}'::json;
end;
$$ language plpgsql security definer;

-- Create performance metrics function with proper enum handling
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
       where status = 'completed'::order_status
       and updated_at >= date_trunc('month', now())),
      0
    )
  ) into v_metrics;

  return coalesce(v_metrics, '{}'::json);
exception
  when others then
    raise log 'Error in get_performance_metrics: %', SQLERRM;
    return '{}'::json;
end;
$$ language plpgsql security definer;