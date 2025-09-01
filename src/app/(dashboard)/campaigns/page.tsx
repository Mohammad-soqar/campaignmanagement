"use client";

import { useAuthRole } from "@/hooks/useAuthRole";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function CampaignsPage() {
  const { role, isLoading } = useAuthRole();
  const {
    data,
    refetch,
    isLoading: listLoading,
  } = trpc.campaign.listMine.useQuery(undefined, {
    enabled: role === "manager",
  });
  const createMutation = trpc.campaign.create.useMutation();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: 0,
    startDate: "",
    endDate: "",
  });

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (role !== "manager") {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-white p-6">
          <div className="text-lg font-semibold">Access Denied</div>
          <p className="mt-1 text-sm text-zinc-600">
            Only managers can access Campaigns.
          </p>
        </div>
      </div>
    );
  }

  const create = async () => {
    if (!form.title || !form.startDate || !form.endDate) return;
    await createMutation.mutateAsync({
      title: form.title,
      description: form.description || undefined,
      budget: Number(form.budget) || 0,
      startDate: form.startDate,
      endDate: form.endDate,
    });
    setForm({
      title: "",
      description: "",
      budget: 0,
      startDate: "",
      endDate: "",
    });
    refetch();
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Campaigns</h1>
      </div>

      <div className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Title
            </label>
            <input
              className="w-full rounded-md border p-2"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded-md border p-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Budget
            </label>
            <input
              className="w-full rounded-md border p-2"
              type="number"
              placeholder="Budget"
              value={form.budget}
              onChange={(e) =>
                setForm((f) => ({ ...f, budget: Number(e.target.value) }))
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Start date
            </label>
            <input
              className="w-full rounded-md border p-2"
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, startDate: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              End date
            </label>

            <input
              className="w-full rounded-md border p-2"
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, endDate: e.target.value }))
              }
            />
          </div>
          <button
            onClick={create}
            className="w-full rounded-md bg-black py-2 text-white md: disabled:opacity-50"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating…" : "Create"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {listLoading && <p>Loading…</p>}
        {data?.map((c) => (
          <a
            key={c.id}
            href={`/campaigns/${c.id}`}
            className="rounded-xl border bg-white p-4 hover:bg-zinc-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-medium">{c.title}</div>
                {c.description && (
                  <div className="text-sm text-zinc-600">{c.description}</div>
                )}
              </div>
              <div className="text-right text-sm text-zinc-600">
                <div>Budget: {String(c.budget)}</div>
                <div>
                  {c.startDate} → {c.endDate}
                </div>
              </div>
            </div>
          </a>
        ))}
        {!data?.length && !listLoading && (
          <p className="text-zinc-600">No campaigns yet.</p>
        )}
      </div>
    </div>
  );
}
