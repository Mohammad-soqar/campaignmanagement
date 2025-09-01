"use client";

import RequireAuth from "@/components/RequireAuth";
import { trpc } from "@/utils/trpc";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const campaignId = params.id;

  const campaign = trpc.campaign.getById.useQuery({ id: campaignId });
  const myInfluencers = trpc.influencer.listAll.useQuery();
  const listAssigned = trpc.campaignInfluencer.listForCampaign.useQuery({
    campaignId,
  });

  const addMutation = trpc.campaignInfluencer.addToCampaign.useMutation();
  const removeMutation =
    trpc.campaignInfluencer.removeFromCampaign.useMutation();
  const updateMutation = trpc.campaign.update.useMutation();

  const [selected, setSelected] = useState<string>("");

  // ---- Edit state ----
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: 0,
    startDate: "",
    endDate: "",
  });

  // hydrate form when campaign loads
  useEffect(() => {
    const c = campaign.data;
    if (!c) return;
    setForm({
      title: c.title ?? "",
      description: c.description ?? "",
      budget: Number(c.budget ?? 0),
      startDate: c.startDate ?? "",
      endDate: c.endDate ?? "",
    });
  }, [campaign.data?.id]); // re-init if you navigate to another id

  const canSave = useMemo(() => {
    if (!form.title.trim()) return false;
    if (!form.startDate || !form.endDate) return false;
    // (Optional) simple date check
    if (form.startDate > form.endDate) return false;
    return true;
  }, [form]);

  const add = async () => {
    if (!selected) return;
    await addMutation.mutateAsync({ campaignId, influencerId: selected });
    setSelected("");
    listAssigned.refetch();
  };

  const remove = async (influencerId: string) => {
    await removeMutation.mutateAsync({ campaignId, influencerId });
    listAssigned.refetch();
  };

  const save = async () => {
    if (!campaign.data?.id || !canSave) return;
    await updateMutation.mutateAsync({
      id: campaign.data.id,
      title: form.title,
      description: form.description || undefined,
      budget: Number(form.budget) || 0,
      startDate: form.startDate,
      endDate: form.endDate,
    });
    await campaign.refetch();
    setIsEditing(false);
  };

  const cancel = () => {
    // reset to server values
    const c = campaign.data;
    if (c) {
      setForm({
        title: c.title ?? "",
        description: c.description ?? "",
        budget: Number(c.budget ?? 0),
        startDate: c.startDate ?? "",
        endDate: c.endDate ?? "",
      });
    }
    setIsEditing(false);
  };

  return (
    <RequireAuth>
      <main className="mx-auto max-w-5xl p-6">
        {/* Header row */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {!isEditing ? (
            <div>
              <h1 className="text-xl font-semibold">
                {campaign.data?.title ?? "Campaign"}
              </h1>
              {campaign.data?.description && (
                <p className="mt-1 text-zinc-600">
                  {campaign.data.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-600">
                <span>Budget: {String(campaign.data?.budget ?? "")}</span>
                <span>
                  Dates: {campaign.data?.startDate} → {campaign.data?.endDate}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-xl border bg-white p-4">
              <div className="grid gap-3 md:grid-cols-2">
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
                      className="h-28 w-full rounded-md border p-2"
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
                        setForm((f) => ({
                          ...f,
                          budget: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-zinc-600">
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
                  <label className="block text-sm text-zinc-600">
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
              </div>

              <div className="mt-4 flex flex-col gap-2 md:flex-row md:justify-end">
                <button
                  onClick={cancel}
                  className="w-full rounded-md border px-4 py-2 md:w-auto"
                  disabled={updateMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="w-full rounded-md bg-black px-4 py-2 text-white md:w-auto disabled:opacity-50"
                  disabled={!canSave || updateMutation.isPending}
                  title={!canSave ? "Fill required fields" : "Save changes"}
                >
                  {updateMutation.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          )}

          {/* Edit toggle */}
          {!isEditing && (
            <div className="flex gap-2 md:self-start">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md border px-3 py-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Assignment section */}
        <div className="mt-8 grid gap-3 rounded-lg border bg-white p-4">
          <div className="flex flex-col gap-2 md:flex-row">
            <select
              className="flex-1 rounded-md border p-2"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Select influencer…</option>
              {myInfluencers.data?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.platform} · {i.handle} ({i.followerCount})
                </option>
              ))}
            </select>
            <button
              onClick={add}
              className="rounded-md bg-black px-4 py-2 text-white"
              disabled={addMutation.isPending || !selected}
            >
              {addMutation.isPending ? "Assigning…" : "Assign"}
            </button>
          </div>

          <div className="mt-4">
            <h3 className="mb-2 font-medium">Assigned Influencers</h3>
            <div className="grid gap-2">
              {listAssigned.data?.map((row) => (
                <div
                  key={row.influencer?.id}
                  className="flex flex-col gap-3 rounded-md border p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {row.influencer?.handle}
                    </div>
                    <div className="text-sm text-zinc-600">
                      {row.influencer?.platform} •{" "}
                      {row.influencer?.followerCount} followers
                    </div>
                  </div>
                  <button
                    onClick={() => remove(row.influencer!.id)}
                    className="w-full rounded-md border px-3 py-2 md:w-auto"
                    disabled={removeMutation.isPending}
                  >
                    {removeMutation.isPending ? "Removing…" : "Remove"}
                  </button>
                </div>
              ))}

              {!listAssigned.data?.length && (
                <p className="text-sm text-zinc-600">No assignments yet.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
