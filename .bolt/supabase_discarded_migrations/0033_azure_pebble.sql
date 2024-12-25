/*
  # Analytics Functions Migration
  
  1. Changes
    - Create unified analytics function
    - Add proper error handling
    - Use proper type casting
    - Return consistent JSON structure
    - Add detailed comments
  
  2. Functions
    - get_analytics_data: Returns all analytics metrics in a single call
*/

-- Create unified analytics function
create or replace function public.get_analytics_data()
returns jsonb as $$
declare
  v_result jsonb;
begin
  -- Combine all analytics data into a single JSON response
  select jsonb_build_object(
    'statusDistribution', (
      select jsonb_agg(
        jsonb_build_object(
          'status', status::text,
          'count', count
        )
      )
      from (
        select status, count(*)
        from public.orders
        group by status
        order by count(*) desc
      ) status_counts
    ),
    'orderMetrics', (
      select jsonb_build_object(
        'totalOrders', count(*),
        'activeOrders', count(*) filter (where status in ('pending', 'in-progress')),
        'completedOrders', count(*) filter (where status = 'completed'),
        'needsAttention', count(*) filter (where status = 'review')
      )
      from public.orders
    ),
    'performanceMetrics', (
      select jsonb_build_object(
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
      )
    )
  ) into v_result;

  -- Return empty structures if any part is null
  return coalesce(v_result, jsonb_build_object(
    'statusDistribution', '[]',
    'orderMetrics', '{}',
    'performanceMetrics', '{}'
  ));

exception
  when others then
    -- Log error and return empty structure
    raise log 'Error in get_analytics_data: %', SQLERRM;
    return jsonb_build_object(
      'statusDistribution', '[]',
      'orderMetrics', '{}',
      'performanceMetrics', '{}'
    );
end;
$$ language plpgsql security definer;