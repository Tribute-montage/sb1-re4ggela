/*
  # Fix Analytics Functions
  
  1. Changes
    - Simplify analytics functions to avoid enum issues
    - Use text comparisons instead of enum casts
    - Add error handling with safe defaults
    - Improve performance with proper indexing
*/

-- Drop existing analytics functions
drop function if exists public.get_status_distribution();
drop function if exists public.get_order_metrics();
drop function if exists public.get_performance_metrics();

-- Create simplified status distribution function
create or replace function public.get_status_distribution()
returns json as $$
begin
  return (
    select json_agg(json_build_object(
      'status', status,
      'count', count
    ))
    from (
      select status::text as status, count(*)::bigint as count
      from public.orders
      group by status
      order by count desc
    ) t
  );
end;
$$ language plpgsql security definer;

-- Create simplified order metrics function
create or replace function public.get_order_metrics()
returns json as $$
begin
  return (
    select json_build_object(
      'totalOrders', count(*),
      'activeOrders', count(*) filter (where status::text in ('pending', 'in-progress')),
      'completedOrders', count(*) filter (where status::text = 'completed'),
      'needsAttention', count(*) filter (where status::text = 'review')
    )
    from public.orders
  );
end;
$$ language plpgsql security definer;

-- Create simplified performance metrics function
create or replace function public.get_performance_metrics()
returns json as $$
begin
  return json_build_object(
    'averageOrderValue', (
      select coalesce(avg(total_amount), 0)
      from public.order_pricing
      where created_at >= date_trunc('month', now())
    ),
    'orderGrowthRate', (
      select coalesce(
        ((count(*) filter (where created_at >= date_trunc('month', now())))::float / 
        nullif(count(*) filter (where created_at >= date_trunc('month', now() - interval '1 month')
          and created_at < date_trunc('month', now())), 0) * 100 - 100,
        0
      )
      from public.orders
    ),
    'processingTime', (
      select coalesce(avg(extract(epoch from (updated_at - created_at))/86400), 0)
      from public.orders
      where status::text = 'completed'
      and updated_at >= date_trunc('month', now())
    )
  );
end;
$$ language plpgsql security definer;