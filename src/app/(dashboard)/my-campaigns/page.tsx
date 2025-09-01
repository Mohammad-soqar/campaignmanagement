'use client';

import { useAuthRole } from '@/hooks/useAuthRole';
import { trpc } from '@/utils/trpc';

export default function MyCampaignsPage() {
  const { role, isLoading } = useAuthRole();
  const { data, isLoading: listLoading } = trpc.campaign.listAssignedToMe.useQuery(undefined, {
    enabled: role === 'influencer',
  });

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (role !== 'influencer') {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-white p-6">
          <div className="text-lg font-semibold">For influencers</div>
          <p className="mt-1 text-sm text-zinc-600">This page shows campaigns assigned to your influencer account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Campaigns Assigned to Me</h1>
      <div className="mt-4 grid gap-3">
        {listLoading && <p>Loading…</p>}
        {data?.map((c) =>
          c ? (
            <div key={c.id} className="rounded-xl border bg-white p-4">
              <div className="text-lg font-medium">{c.title}</div>
              {c.description && <div className="text-sm text-zinc-600">{c.description}</div>}
              <div className="mt-1 text-sm text-zinc-600">{c.startDate} → {c.endDate}</div>
            </div>
          ) : null
        )}
        {!listLoading && !data?.length && (
          <p className="text-zinc-600">No assignments yet. Ask your manager to assign you to a campaign.</p>
        )}
      </div>
    </div>
  );
}
