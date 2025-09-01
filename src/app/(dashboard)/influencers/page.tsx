"use client";

import { useAuthRole } from "@/hooks/useAuthRole";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

const PLATFORMS = ["instagram", "youtube", "tiktok", "x"] as const;
type Platform = (typeof PLATFORMS)[number];

type FormState = {
  platform: Platform;
  handle: string;
  url: string;
  followerCount: number;
  engagementRate: number;
  avatarUrl: string;
  contactEmail: string;
};

export default function InfluencersPage() {
  const { role, isLoading } = useAuthRole();
  const list = trpc.influencer.listAll.useQuery(undefined, {
    enabled: role === "manager",
  });
  const createM = trpc.influencer.create.useMutation();
  const deleteM = trpc.influencer.delete.useMutation();

  // Use the tokenized onboarding link (no email)
  const createInvite = trpc.admin.createOnboardingInvite.useMutation();

  // Keep invitation URLs per influencerId
  const [inviteLinks, setInviteLinks] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormState>({
    platform: "instagram",
    handle: "",
    url: "",
    followerCount: 0,
    engagementRate: 0.03,
    avatarUrl: "",
    contactEmail: "",
  });

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (role !== "manager") {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-white p-6">
          <div className="text-lg font-semibold">Access Denied</div>
          <p className="mt-1 text-sm text-zinc-600">
            Only managers can access Influencers.
          </p>
        </div>
      </div>
    );
  }

  const create = async () => {
    await createM.mutateAsync({
      ...form,
      followerCount: Number(form.followerCount) || 0,
      engagementRate: Number(form.engagementRate) || 0,
      avatarUrl: form.avatarUrl || undefined,
      contactEmail: form.contactEmail || undefined,
    });
    setForm({
      platform: "instagram",
      handle: "",
      url: "",
      followerCount: 0,
      engagementRate: 0.03,
      avatarUrl: "",
      contactEmail: "",
    });
    list.refetch();
  };

  const generateLink = async (
    influencerId: string,
    email?: string | null,
    fullName?: string | null
  ) => {
    if (!email) return alert("No contact email set for this influencer.");
    const res = await createInvite.mutateAsync({
      influencerId,
      email,
    });
    if (res?.url) {
      setInviteLinks((prev) => ({ ...prev, [influencerId]: res.url }));
      try {
        await navigator.clipboard.writeText(res.url);
        alert("Invitation link copied to clipboard.");
      } catch {}
    } else {
      alert("Invite link created, but no URL returned.");
    }
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Copied!");
    } catch {
      alert("Copy failed. Please copy the link manually.");
    }
  };

  const remove = async (id: string) => {
    await deleteM.mutateAsync({ id });
    // Clean any old link in state
    setInviteLinks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    list.refetch();
  };

  const fmtPct = (v: number | null | undefined) =>
    `${Math.round(((v ?? 0) * 100 + Number.EPSILON) * 10) / 10}%`;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Influencers</h1>

      <div className="mt-4 grid gap-3 rounded-xl border bg-white p-4">
        <div className="grid gap-2 md:grid-cols-3">
          <select
            className="rounded-md border p-2"
            value={form.platform}
            onChange={(e) =>
              setForm((f) => ({ ...f, platform: e.target.value as Platform }))
            }
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            className="rounded-md border p-2"
            placeholder="Handle"
            value={form.handle}
            onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))}
          />
          <input
            className="rounded-md border p-2"
            placeholder="Profile URL"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          />
          <input
            className="rounded-md border p-2"
            type="number"
            placeholder="Followers"
            value={form.followerCount}
            onChange={(e) =>
              setForm((f) => ({ ...f, followerCount: Number(e.target.value) }))
            }
          />
          <input
            className="rounded-md border p-2"
            type="number"
            step="0.001"
            placeholder="Engagement Rate (0-1)"
            value={form.engagementRate}
            onChange={(e) =>
              setForm((f) => ({ ...f, engagementRate: Number(e.target.value) }))
            }
          />
          <input
            className="rounded-md border p-2"
            placeholder="Avatar URL (optional)"
            value={form.avatarUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, avatarUrl: e.target.value }))
            }
          />
          <input
            className="rounded-md border p-2"
            placeholder="Contact Email (for invite)"
            value={form.contactEmail}
            onChange={(e) =>
              setForm((f) => ({ ...f, contactEmail: e.target.value }))
            }
          />
        </div>
        <button
          onClick={create}
          className="w-full rounded-md bg-black px-4 py-2 text-white md:w-auto"
          disabled={createM.isPending}
        >
          {createM.isPending ? "Adding…" : "Add Influencer"}
        </button>
      </div>

      <div className="mt-6 grid gap-3">
        {list.data?.map((i) => {
          const url = inviteLinks[i.id];
          return (
            <div key={i.id} className="rounded-xl border bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* left: info */}
                <div className="min-w-0">
                  <div className="font-medium truncate">{i.handle}</div>
                  <div className="text-sm text-zinc-600">
                    {i.platform} • {i.followerCount} followers • ER{" "}
                    {fmtPct(i.engagementRate as any)}
                  </div>
                  <div className="text-xs text-zinc-500 break-all">{i.url}</div>
                  <div className="text-xs text-zinc-500">
                    Email: {(i as any).contactEmail || "—"}
                    {i.linkedUserId ? " • linked" : ""}
                  </div>
                </div>

                {/* right: actions */}
                <div className="flex w-full flex-wrap justify-stretch gap-2 md:w-auto md:justify-end">
                  {!url ? (
                    <button
                      onClick={() =>
                        generateLink(i.id, (i as any).contactEmail, i.handle)
                      }
                      className="w-full rounded-md border px-3 py-2 md:w-auto"
                      disabled={createInvite.isPending}
                      title="Generate onboarding link"
                    >
                      {createInvite.isPending ? "Creating…" : "Create link"}
                    </button>
                  ) : (
                    <button
                      onClick={() => copyLink(url)}
                      className="w-full rounded-md border px-3 py-2 md:w-auto"
                      title="Copy invitation link"
                    >
                      Copy link
                    </button>
                  )}
                  <button
                    onClick={() => remove(i.id)}
                    className="w-full rounded-md border px-3 py-2 md:w-auto"
                    disabled={deleteM.isPending}
                  >
                    {deleteM.isPending ? "Removing…" : "Delete"}
                  </button>
                </div>
              </div>

              {/* Show link inline once generated */}
              {url && (
                <div className="mt-3 rounded-md bg-zinc-50 p-3 text-xs text-zinc-700 break-all">
                  {url}
                </div>
              )}
            </div>
          );
        })}

        {!list.data?.length && (
          <p className="text-zinc-600">No influencers yet.</p>
        )}
      </div>
    </div>
  );
}
