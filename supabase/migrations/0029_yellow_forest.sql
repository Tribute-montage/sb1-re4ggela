-- Drop existing function first
drop function if exists public.get_draft_feedback(uuid);

-- Recreate function with fixed query structure
create function public.get_draft_feedback(p_user_id uuid)
returns json as $$
begin
  return (
    select json_agg(feedback_data order by feedback_data->>'created_at' desc)
    from (
      select json_build_object(
        'id', df.id,
        'draft_id', df.draft_id,
        'type', df.type,
        'comment', df.comment,
        'created_at', df.created_at,
        'user', json_build_object(
          'id', up.id,
          'name', up.full_name,
          'role', up.role
        )
      ) as feedback_data
      from draft_feedback df
      join user_profiles up on up.id = df.user_id
      where df.user_id = p_user_id
    ) subq
  );
end;
$$ language plpgsql security definer;