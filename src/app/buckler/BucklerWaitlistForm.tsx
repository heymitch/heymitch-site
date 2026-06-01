"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const TRACK_OPTIONS = [
  "Shield",
  "A spreadsheet",
  "Nothing yet",
  "Something else",
];

export default function BucklerWaitlistForm({ id }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [currentTool, setCurrentTool] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const emailId = id ? `${id}-email` : "buckler-email";
  const toolId = id ? `${id}-tool` : "buckler-tool";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/buckler-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentTool }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="w-full max-w-md border p-6"
        style={{ borderColor: "rgba(224,228,234,0.12)", background: "#161a21" }}
        role="status"
        aria-live="polite"
      >
        <p
          className="font-mono text-xs uppercase tracking-[0.25em] mb-3"
          style={{ color: "#facc15" }}
        >
          You&apos;re in
        </p>
        <p className="font-mono text-base leading-relaxed text-ink">
          The build walkthrough is on its way. Watch your inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor={emailId}
          className="font-mono text-[11px] uppercase tracking-[0.25em]"
          style={{ color: "#8b9099" }}
        >
          Email
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          disabled={status === "loading"}
          className="font-mono text-sm px-4 py-3 outline-none text-ink placeholder:text-[#5a606b] focus:border-[#6fb3c9] transition-colors"
          style={{
            background: "#0d1116",
            border: "1px solid rgba(224,228,234,0.12)",
            colorScheme: "dark",
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={toolId}
          className="font-mono text-[11px] uppercase tracking-[0.25em]"
          style={{ color: "#8b9099" }}
        >
          What you track with today
        </label>
        <select
          id={toolId}
          name="currentTool"
          value={currentTool}
          onChange={(e) => setCurrentTool(e.target.value)}
          disabled={status === "loading"}
          className="font-mono text-sm px-4 py-3 outline-none text-ink focus:border-[#6fb3c9] transition-colors"
          style={{
            background: "#0d1116",
            border: "1px solid rgba(224,228,234,0.12)",
            colorScheme: "dark",
          }}
        >
          <option value="">Select one (optional)</option>
          {TRACK_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="buckler-submit font-mono text-sm uppercase tracking-[0.2em] font-bold px-6 py-3.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending..." : "Send me the walkthrough"}
      </button>

      {status === "error" && (
        <p
          className="font-mono text-xs"
          style={{ color: "#dc2625" }}
          role="alert"
        >
          {error}
        </p>
      )}

      <style jsx>{`
        .buckler-submit {
          background: #facc15;
          color: #0d1116;
          border: none;
          cursor: pointer;
        }
        .buckler-submit:hover:not(:disabled) {
          background: #dc2625;
          color: #e0e4ea;
        }
      `}</style>
    </form>
  );
}
