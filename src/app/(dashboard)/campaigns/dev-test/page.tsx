'use client';

import { api } from '@/lib/trpc/client';
import { useState } from 'react';

export default function DevTest() {
  const [title, setTitle] = useState('');
  const create = api.campaign.create.useMutation();
  const list = api.campaign.listMine.useQuery({});

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Dev tRPC Test</h1>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title) return;
          create.mutate({
            title,
            description: '',
            budget: 0,
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
          }, { onSuccess: () => { setTitle(''); list.refetch(); } });
        }}
      >
        <input className="border p-2 rounded" placeholder="Campaign title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white" disabled={create.isPending}>{create.isPending ? '...' : 'Create'}</button>
      </form>

      {list.isLoading ? (
        <div>Loading…</div>
      ) : list.error ? (
        <div className="text-red-600">Error</div>
      ) : (
        <ul className="space-y-1">
          {list.data?.map((c: any) => <li key={c.id} className="border p-2 rounded">{c.title}</li>)}
        </ul>
      )}
    </div>
  );
}
