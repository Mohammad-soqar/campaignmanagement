"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";

function OnboardingInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";

  const { data, isLoading } = trpc.onboarding.verify.useQuery(
    { token },
    { enabled: !!token }
  );
  const complete = trpc.onboarding.complete.useMutation();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (data?.email) setEmail(data.email);
  }, [data?.email]);

  if (!token) return <div className="p-6">Invalid link.</div>;
  if (isLoading) return <div className="p-6">Checking your link…</div>;
  if (data && !data.valid) {
    return <div className="p-6">This link has expired or is invalid.</div>;
  }

  const onSubmit = async () => {
    await complete.mutateAsync({
      token,
      email,
      password,
      fullName: fullName || undefined,
    });
    alert("Account created. You can now log in.");
    router.replace("/login");
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold">Set your password</h1>
      <p className="mt-1 text-sm text-zinc-600">
        You were invited by your manager. We’ve prefilled your email; just set a
        password.
      </p>
      <div className="mt-4 grid gap-3 rounded-lg border bg-white p-4">
        <input
          className="rounded-md border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />
        <input
          className="rounded-md border p-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Display name (optional)"
        />
        <input
          className="rounded-md border p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6)"
        />
        <button
          onClick={onSubmit}
          className="rounded-md bg-black px-4 py-2 text-white"
          disabled={complete.isPending}
        >
          {complete.isPending ? "Creating…" : "Create account"}
        </button>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <OnboardingInner />
    </Suspense>
  );
}
