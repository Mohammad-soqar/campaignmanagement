-- Enable RLS
alter table public.campaigns enable row level security;
alter table public.influencers enable row level security;
alter table public.campaign_influencers enable row level security;

-- Campaigns: only owner can CRUD
create policy "campaigns_select_own"
on public.campaigns
as permissive
for select
to authenticated
using (user_id = auth.uid());

create policy "campaigns_insert_own"
on public.campaigns
as permissive
for insert
to authenticated
with check (user_id = auth.uid());

create policy "campaigns_update_own"
on public.campaigns
as permissive
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "campaigns_delete_own"
on public.campaigns
as permissive
for delete
to authenticated
using (user_id = auth.uid());

-- Influencers: only owner can CRUD
create policy "influencers_select_own"
on public.influencers
as permissive
for select
to authenticated
using (owner_user_id = auth.uid());

create policy "influencers_insert_own"
on public.influencers
as permissive
for insert
to authenticated
with check (owner_user_id = auth.uid());

create policy "influencers_update_own"
on public.influencers
as permissive
for update
to authenticated
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

create policy "influencers_delete_own"
on public.influencers
as permissive
for delete
to authenticated
using (owner_user_id = auth.uid());

-- Join table: allow only when the underlying campaign belongs to the user
-- SELECT
create policy "campaign_influencers_select_by_owner"
on public.campaign_influencers
as permissive
for select
to authenticated
using (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_influencers.campaign_id
      and c.user_id = auth.uid()
  )
);

-- INSERT
create policy "campaign_influencers_insert_by_owner"
on public.campaign_influencers
as permissive
for insert
to authenticated
with check (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_influencers.campaign_id
      and c.user_id = auth.uid()
  )
);

-- DELETE
create policy "campaign_influencers_delete_by_owner"
on public.campaign_influencers
as permissive
for delete
to authenticated
using (
  exists (
    select 1 from public.campaigns c
    where c.id = campaign_influencers.campaign_id
      and c.user_id = auth.uid()
  )
);
