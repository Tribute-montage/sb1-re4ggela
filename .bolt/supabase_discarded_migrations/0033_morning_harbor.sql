/*
  # Analytics Functions Update
  
  1. Changes
    - Simplify analytics functions
    - Add proper error handling
    - Improve type safety
    - Fix status text handling
*/

-- Drop existing functions
drop function if exists public.get_status_distribution();
drop function if exists public.get_order_metrics();
drop function if exists public.get_performance_metrics();

-- Create simplified analytics functions
create or replace function public.get_status_distribution()
returns json as $$
begin
  return (
    select json_agg(json_build_object(
      'status', status::text,
      'count', count(*)
    ))
    from (
      select status, count(*)
      from public.orders
      group by status
      order by count(*) desc
    ) t
  );
exception
  when others then
    raise log 'Error in get_status_distribution: %', SQLERRM;
    return null;
end;
$$ language plpgsql security definer;

create or replace function public.get_order_metrics()
returns json as $$
begin
  return json_build_object(
    'totalOrders', count(*),
    'activeOrders', count(*) filter (where status::text in ('pending', 'in-progress')),
    'completedOrders', count(*) filter (where status::text = 'completed'),
    'needsAttention', count(*) filter (where status::text = 'review')
  )
  from public.orders;
exception
  when others then
    raise log 'Error in get_order_metrics: %', SQLERRM;
    return '{}'::json;
end;
$$ language plpgsql security definer;

create or replace function public.get_performance_metrics()
returns json as $$
begin
  return json_build_object(
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
       where status::text = 'completed'
       and updated_at >= date_trunc('month', now())),
      0
    )
  );
exception
  when others then
    raise log 'Error in get_performance_metrics: %', SQLERRM;
    return '{}'::json;
end;
$$ language plpgsql security definer;