// components/InfluencerCard.tsx
"use client";

import * as React from "react";
import Image from "next/image";

export type InfluencerCardData = {
  id: string;
  handle: string;
  platform: "instagram" | "youtube" | "tiktok" | "x" | string;
  followerCount?: number | null;
  engagementRate?: number | null;
  url?: string | null;
  contactEmail?: string | null;
  linkedUserId?: string | null;
  avatarUrl?: string | null;
};

export function fmtPct(n?: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  return `${(n * 100).toFixed(1)}%`;
}

export interface InfluencerCardProps {
  influencer: InfluencerCardData;
  /** Put your action buttons here (Invite/Copy/Delete/Remove/etc.) */
  rightSlot?: React.ReactNode;
  /** Show an invite link block under the card (optional, per item) */
  inviteLink?: string | null;
}

export default function InfluencerCard({
  influencer,
  rightSlot,
  inviteLink,
}: InfluencerCardProps) {
  const {
    handle,
    platform,
    followerCount,
    engagementRate,
    url,
    contactEmail,
    linkedUserId,
    avatarUrl,
  } = influencer;

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        {/* Left: identity */}
        <div className="flex min-w-0 items-start gap-3">
          {avatarUrl ? (
            <Image
              src={avatarUrl ?? "/default-avatar.png"} // fallback if null
              alt={`${handle} avatar`}
              width={40}
              height={40}
              className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-200"
              aria-hidden
            />
          )}

          <div className="min-w-0 space-y-0.5">
            <div className="font-medium truncate">{handle}</div>
            <div className="text-sm text-zinc-600">
              {platform} • {followerCount ?? 0} followers • ER{" "}
              {fmtPct(engagementRate ?? 0)}
            </div>
            {url ? (
              <div className="text-xs text-zinc-500 break-all">{url}</div>
            ) : null}
            <div className="text-xs text-zinc-500">
              Email: {contactEmail || "—"}
              {linkedUserId ? " • linked" : ""}
            </div>
          </div>
        </div>

        {/* Right: actions (responsive) */}
        <div className="w-full md:w-auto">
          <div className="flex w-full flex-wrap justify-stretch gap-2 md:justify-end">
            {rightSlot}
          </div>
        </div>
      </div>

      {/* Inline invite link (optional, wraps nicely on mobile) */}
      {inviteLink ? (
        <div className="mt-3 rounded-md bg-zinc-50 p-3 text-xs text-zinc-700 break-all">
          {inviteLink}
        </div>
      ) : null}
    </div>
  );
}
