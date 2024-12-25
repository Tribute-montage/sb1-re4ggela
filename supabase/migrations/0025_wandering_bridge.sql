-- Drop all existing draft and feedback related policies to start fresh
do $$
begin
  -- Drop draft policies
  drop policy if exists "Draft access policy" on public.order_drafts;
  drop policy if exists "Feedback access policy" on public.draft_feedback;
  drop policy if exists "Draft access and management" on public.order_drafts;
  drop policy if exists "Feedback access and management" on public.draft_feedback;
  drop policy if exists "draft_access_and_management_policy" on public.order_drafts;
  drop policy if exists "feedback_access_and_management_policy" on public.draft_feedback;
  drop policy if exists "Editors can manage drafts" on public.order_drafts;
  drop policy if exists "Clients can view drafts for their orders" on public.order_drafts;
  drop policy if exists "Users can manage their own feedback" on public.draft_feedback;
  drop policy if exists "Editors can view feedback for their drafts" on public.draft_feedback;
end $$;

-- Create unified policies with clear, unique names
create policy "editors_manage_own_drafts"
  on public.order_drafts
  for all
  to authenticated
  using (
    -- Editors can access their own drafts
    editor_id = auth.uid() or
    -- Clients can view drafts for their orders
    exists (
      select 1 from public.orders
      where orders.id = order_drafts.order_id
      and orders.client_id = auth.uid()
    )
  )
  with check (
    -- Only editors can modify their own drafts
    editor_id = auth.uid()
  );

create policy "users_manage_draft_feedback"
  on public.draft_feedback
  for all
  to authenticated
  using (
    -- Users can see their own feedback
    user_id = auth.uid() or
    -- Editors can see feedback for their drafts
    exists (
      select 1 from public.order_drafts
      where order_drafts.id = draft_feedback.draft_id
      and order_drafts.editor_id = auth.uid()
    )
  )
  with check (
    -- Users can only create/modify their own feedback
    user_id = auth.uid()
  );