-- Update feedback query function
create or replace function public.get_draft_feedback(p_user_id uuid)
returns json as $$
begin
  return (
    select json_agg(
      json_build_object(
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
      )
    )
    from draft_feedback df
    join user_profiles up on up.id = df.user_id
    where df.user_id = p_user_id
    order by df.created_at desc
  );
end;
$$ language plpgsql security definer;