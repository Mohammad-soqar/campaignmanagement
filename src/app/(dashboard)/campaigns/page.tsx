'use client';

import { api } from '@/lib/trpc/client';

export default function CampaignsPage() {
  const { data, isLoading, error } = api.campaign.listMine.useQuery({});
  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error</div>;
  return (
    <div>
      <h1>My Campaigns</h1>
      <ul>
        {data?.map((c: any) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  );
}
