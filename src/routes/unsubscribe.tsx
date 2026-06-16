import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/unsubscribe")({
  component: UnsubscribePage,
  head: () => ({
    meta: [
      { title: "Unsubscribe — muchbetter.world" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type State =
  | { status: "loading" }
  | { status: "valid" }
  | { status: "submitting" }
  | { status: "done" }
  | { status: "already" }
  | { status: "invalid"; message: string };

function UnsubscribePage() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setState({ status: "invalid", message: "Missing unsubscribe token." });
      return;
    }
    setToken(t);
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
          setState({
            status: "invalid",
            message: data.error || "Invalid or expired link.",
          });
          return;
        }
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setState({ status: "already" });
          return;
        }
        setState({ status: "valid" });
      })
      .catch(() =>
        setState({ status: "invalid", message: "Could not verify link." }),
      );
  }, []);

  const confirm = async () => {
    if (!token) return;
    setState({ status: "submitting" });
    try {
      const r = await fetch(`/email/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setState({
          status: "invalid",
          message: data.error || "Unsubscribe failed.",
        });
        return;
      }
      if (data.success === false && data.reason === "already_unsubscribed") {
        setState({ status: "already" });
        return;
      }
      setState({ status: "done" });
    } catch {
      setState({ status: "invalid", message: "Network error." });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Unsubscribe</h1>
        <div className="mt-4 text-sm text-muted-foreground">
          {state.status === "loading" && <p>Checking your link…</p>}
          {state.status === "valid" && (
            <>
              <p>
                Click below to stop receiving emails from muchbetter.world at
                this address.
              </p>
              <button
                onClick={confirm}
                className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Confirm unsubscribe
              </button>
            </>
          )}
          {state.status === "submitting" && <p>Unsubscribing…</p>}
          {state.status === "done" && (
            <p>You've been unsubscribed. You can close this page.</p>
          )}
          {state.status === "already" && (
            <p>This address is already unsubscribed.</p>
          )}
          {state.status === "invalid" && <p>{state.message}</p>}
        </div>
      </div>
    </main>
  );
}
