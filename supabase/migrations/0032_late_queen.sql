-- Revenue metrics function
create or replace function public.get_revenue_metrics()
returns json as $$
declare
  v_current_month_revenue decimal;
  v_previous_month_revenue decimal;
  v_total_revenue decimal;
  v_avg_order_value decimal;
  v_revenue_growth decimal;
begin
  -- Get current month revenue
  select coalesce(sum(total_amount), 0)
  into v_current_month_revenue
  from order_pricing
  where created_at >= date_trunc('month', now());

  -- Get previous month revenue
  select coalesce(sum(total_amount), 0)
  into v_previous_month_revenue
  from order_pricing
  where created_at >= date_trunc('month', now() - interval '1 month')
    and created_at < date_trunc('month', now());

  -- Calculate total revenue
  select coalesce(sum(total_amount), 0)
  into v_total_revenue
  from order_pricing;

  -- Calculate average order value
  select coalesce(avg(total_amount), 0)
  into v_avg_order_value
  from order_pricing;

  -- Calculate revenue growth
  v_revenue_growth := case
    when v_previous_month_revenue = 0 then 0
    else ((v_current_month_revenue - v_previous_month_revenue) / v_previous_month_revenue * 100)
  end;

  return json_build_object(
    'totalRevenue', v_total_revenue,
    'averageOrderValue', v_avg_order_value,
    'revenueGrowth', v_revenue_growth,
    'projectedRevenue', v_current_month_revenue * 1.1 -- Simple projection
  );
end;
$$ language plpgsql security definer;

-- Completion metrics function
create or replace function public.get_completion_metrics()
returns json as $$
declare
  v_avg_completion_time decimal;
  v_prev_avg_completion_time decimal;
  v_completion_improvement decimal;
  v_on_time_rate decimal;
  v_completed_count integer;
begin
  -- Calculate current average completion time
  select coalesce(
    avg(extract(epoch from (updated_at - created_at))/3600),
    0
  )
  into v_avg_completion_time
  from orders
  where status = 'completed'
    and updated_at >= date_trunc('month', now());

  -- Calculate previous month's average completion time
  select coalesce(
    avg(extract(epoch from (updated_at - created_at))/3600),
    0
  )
  into v_prev_avg_completion_time
  from orders
  where status = 'completed'
    and updated_at >= date_trunc('month', now() - interval '1 month')
    and updated_at < date_trunc('month', now());

  -- Calculate improvement percentage
  v_completion_improvement := case
    when v_prev_avg_completion_time = 0 then 0
    else ((v_prev_avg_completion_time - v_avg_completion_time) / v_prev_avg_completion_time * 100)
  end;

  -- Calculate on-time delivery rate
  select
    (count(*) filter (
      where updated_at <= requested_delivery_date
    )::decimal / nullif(count(*), 0) * 100)
  into v_on_time_rate
  from orders
  where status = 'completed';

  -- Get total completed projects
  select count(*)
  into v_completed_count
  from orders
  where status = 'completed';

  return json_build_object(
    'averageCompletionTime', v_avg_completion_time,
    'completionTimeImprovement', v_completion_improvement,
    'onTimeDeliveryRate', v_on_time_rate,
    'projectsCompleted', v_completed_count
  );
end;
$$ language plpgsql security definer;