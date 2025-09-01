"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export default function Home() {
  const [email, setEmail] = useState<string | null>(null);
  const [openGuide, setOpenGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<"manager" | "influencer">(
    "manager"
  );
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  // type-safe easing
  const EASE = [0.21, 0.47, 0.32, 0.99] as const;

  const fadeUp = (delay = 0): Variants => ({
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE, delay },
    },
  });

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
  };

  return (
    <main className="relative isolate overflow-hidden">
      {/* Animated background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-zinc-50" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.25), rgba(99,102,241,0) 60%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
          className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 70% 70%, rgba(20,184,166,0.22), rgba(20,184,166,0) 60%)",
          }}
        />
      </div>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-16 md:grid-cols-2 md:gap-16 md:pb-24 md:pt-24">
        <div className="flex flex-col">
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            animate="show"
            className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs backdrop-blur-sm"
          >
            <span>🚀</span> Faster campaign ops
          </motion.div>

          <motion.h1
            variants={fadeUp(0.05)}
            initial="hidden"
            animate="show"
            className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            Plan, launch, and track your{" "}
            <span className="underline decoration-black underline-offset-4">
              influencer campaigns
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp(0.1)}
            initial="hidden"
            animate="show"
            className="mt-4 max-w-prose text-zinc-600"
          >
            Create campaigns, manage your roster, and assign creators — all in a
            clean, minimal dashboard.
          </motion.p>

          {/* CTA group – aligned */}
          <motion.div
            variants={fadeUp(0.15)}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {!email ? (
              <>
                <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                  <Link
                    href="/register"
                    className="group inline-flex h-11 items-center justify-center rounded-lg bg-black px-5 text-sm font-medium text-white outline-none ring-zinc-900/20 transition focus:ring-4"
                    style={{ color: "#fff" }}
                  >
                    Get started
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center justify-center rounded-lg border bg-white px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Log in
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                <Link
                  href="/campaigns"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-5 text-sm font-medium text-white transition"
                  style={{ color: "#fff" }}
                >
                  Go to dashboard
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* quick benefits */}
          <motion.div
            variants={fadeUp(0.2)}
            initial="hidden"
            animate="show"
            className="mt-6 grid grid-cols-1 gap-3 text-sm text-zinc-700 sm:grid-cols-3"
          >
            {["✅ Campaign CRUD", "✅ Influencer roster", "✅ Assignments"].map(
              (txt) => (
                <div
                  key={txt}
                  className="rounded-lg border bg-white/60 p-3 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  {txt}
                </div>
              )
            )}
          </motion.div>
        </div>

        {/* mock preview card with shimmer */}
        <motion.div
          variants={prefersReducedMotion ? undefined : scaleIn}
          initial="hidden"
          animate="show"
          className="relative"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 border-b bg-zinc-50/60 px-4 py-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <div className="ml-3 h-3 w-24 rounded bg-zinc-200" />
            </div>

            {/* shimmer */}
            <motion.div
              aria-hidden
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "linear" }}
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              style={{ transform: "skewX(-12deg)" }}
            />

            <div className="grid h-full grid-cols-2 gap-3 p-4">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ease: EASE }}
                className="rounded-lg bg-zinc-50 p-3"
              >
                <div className="h-4 w-32 rounded bg-zinc-200" />
                <div className="mt-3 h-24 rounded bg-zinc-100" />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-6 rounded bg-zinc-100" />
                  <div className="h-6 rounded bg-zinc-100" />
                  <div className="h-6 rounded bg-zinc-100" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ease: EASE }}
                className="rounded-lg bg-zinc-50 p-3"
              >
                <div className="h-4 w-24 rounded bg-zinc-200" />
                <div className="mt-3 h-24 rounded bg-zinc-100" />
                <div className="mt-3 h-6 w-1/2 rounded bg-zinc-100" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, ease: EASE }}
                className="col-span-2 rounded-lg border p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="h-5 w-44 rounded bg-zinc-100" />
                  <div className="h-8 w-24 rounded bg-zinc-100" />
                </div>
                <div className="mt-2 h-16 rounded bg-zinc-50" />
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, ease: EASE }}
            className="absolute -bottom-4 left-6 rounded-full border bg-white px-3 py-1 text-xs shadow-sm"
          >
            Live preview
          </motion.div>
        </motion.div>
      </section>

      {/* features strip */}
      <section className="border-t bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-3">
          {[
            {
              title: "Simple by default",
              desc: "Opinionated flows so teams ship campaigns faster.",
            },
            {
              title: "Role-based access",
              desc: "Managers manage. Influencers see their assignments.",
            },
            {
              title: "Built for speed",
              desc: "tRPC + Supabase + Drizzle on Next.js (App Router).",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE }}
              className="group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-16 -z-10 rounded-[3rem] opacity-0 blur-2xl transition duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(40rem 40rem at 20% 0%, rgba(99,102,241,0.12), transparent 60%), radial-gradient(40rem 40rem at 80% 100%, rgba(20,184,166,0.12), transparent 60%)",
                }}
              />
              <div className="text-lg font-semibold">{f.title}</div>
              <p className="mt-1 text-sm text-zinc-600">{f.desc}</p>
              <div className="mt-4 h-1 w-12 origin-left scale-x-0 rounded bg-zinc-900 transition group-hover:scale-x-100" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating Help Button */}
      <motion.button
        onClick={() => setOpenGuide(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-medium text-white shadow-lg outline-none ring-black/20 transition hover:translate-y-[-2px] hover:shadow-xl focus:ring-4"
        aria-haspopup="dialog"
        aria-controls="site-guide"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
          ❔
        </span>
        How to use
      </motion.button>

      {/* Guide Modal */}
      {openGuide && (
        <motion.div
          key="guide-overlay"
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-labelledby="site-guide-title"
          role="dialog"
          aria-modal="true"
          id="site-guide"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpenGuide(false)}
          />
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-x-4 bottom-6 mx-auto max-w-2xl rounded-2xl border bg-white shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:bottom-auto md:right-auto md:w-[720px] md:-translate-x-1/2 md:-translate-y-1/2"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-3">
              <h2 id="site-guide-title" className="text-base font-semibold">
                Getting Started (Website)
              </h2>
              <button
                onClick={() => setOpenGuide(false)}
                className="rounded-md p-2 text-zinc-600 transition hover:bg-zinc-50"
                aria-label="Close guide"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 px-5 pt-3">
              <button
                onClick={() => setActiveTab("manager")}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  activeTab === "manager"
                    ? "bg-zinc-900 text-white"
                    : "border text-zinc-700 hover:bg-zinc-50"
                }`}
                aria-selected={activeTab === "manager"}
                role="tab"
              >
                Campaign Manager
              </button>
              <button
                onClick={() => setActiveTab("influencer")}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  activeTab === "influencer"
                    ? "bg-zinc-900 text-white"
                    : "border text-zinc-700 hover:bg-zinc-50"
                }`}
                aria-selected={activeTab === "influencer"}
                role="tab"
              >
                Influencer
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[65vh] overflow-y-auto px-5 pb-6 pt-3 text-sm leading-6 text-zinc-700 md:max-h-[60vh]">
              {activeTab === "manager" ? (
                <div role="tabpanel" aria-label="Campaign Manager guide">
                  <ol className="list-decimal space-y-3 pl-5">
                    <li>
                      <span className="font-medium text-zinc-900">
                        Register as a manager:
                      </span>{" "}
                      Create your account and log in.
                    </li>
                    <li>
                      <span className="font-medium text-zinc-900">
                        Add influencers to your roster:
                      </span>{" "}
                      Go to{" "}
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5">
                        Influencers
                      </span>{" "}
                      and add creators with their details (platform, handle,
                      follower count, etc.).
                    </li>
                    <li>
                      <span className="font-medium text-zinc-900">
                        Invite influencers to onboard:
                      </span>{" "}
                      Generate an invitation link for each influencer and share
                      it with them. When they complete onboarding, their profile
                      will be linked automatically.
                    </li>
                    <li>
                      <span className="font-medium text-zinc-900">
                        Create campaigns:
                      </span>{" "}
                      Go to{" "}
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5">
                        Campaigns → New
                      </span>{" "}
                      to set up campaigns with title, description, budget, and
                      dates.
                    </li>
                    <li>
                      <span className="font-medium text-zinc-900">
                        Assign influencers to campaigns:
                      </span>{" "}
                      In the campaign details, choose influencers from your
                      roster and assign them directly.
                    </li>
                  </ol>
                  <div className="mt-4 rounded-lg border bg-amber-50 px-3 py-2 text-amber-900">
                    Tip: Use the roster to keep influencer details updated so
                    assignments are easier.
                  </div>
                </div>
              ) : (
                <div role="tabpanel" aria-label="Influencer guide">
                  <ol className="list-decimal space-y-3 pl-5">
                    <li>
                      <span className="font-medium text-zinc-900">
                        Accept your invite:
                      </span>{" "}
                      Use the invitation link your manager shared to complete
                      onboarding and set your password.
                    </li>
                    <li>
                      <span className="font-medium text-zinc-900">Log in:</span>{" "}
                      After onboarding, log in to your account anytime.
                    </li>
                    <li>
                      <span className="font-medium text-zinc-900">
                        View assigned campaigns:
                      </span>{" "}
                      Go to{" "}
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5">
                        My Campaigns
                      </span>{" "}
                      to see campaigns you’ve been added to.
                    </li>
                    <li>
                      <span className="font-medium text-zinc-900">
                        Check campaign details:
                      </span>{" "}
                      Review title, description, budget, and dates set by your
                      manager.
                    </li>
                  </ol>
                  <div className="mt-4 rounded-lg border bg-sky-50 px-3 py-2 text-sky-900">
                    Tip: Stay logged in so you can quickly see new campaigns
                    when they’re assigned to you.
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t px-5 py-3">
              <div className="text-xs text-zinc-500">
                Need help? Check the campaign brief first, then DM your manager.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setActiveTab(
                      activeTab === "manager" ? "influencer" : "manager"
                    )
                  }
                  className="rounded-lg border px-3 py-1.5 text-sm transition hover:bg-zinc-50"
                >
                  {activeTab === "manager"
                    ? "View Influencer steps"
                    : "View Manager steps"}
                </button>
                <button
                  onClick={() => setOpenGuide(false)}
                  className="rounded-lg bg-black px-3 py-1.5 text-sm text-white transition hover:translate-y-[-1px]"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
