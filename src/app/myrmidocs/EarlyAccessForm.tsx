"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

// Variant tunes the form to its surface. "light" sits on paper sections,
// "dark" sits on the ink hero / footer.
export default function EarlyAccessForm({
  id,
  variant = "light",
}: {
  id?: string;
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const emailId = id ? `${id}-email` : "myr-email";
  const dark = variant === "dark";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/myrmidocs-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, useCase }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div
        className="w-full rounded-xl border px-5 py-5"
        style={{
          borderColor: dark ? "rgba(252,252,253,0.16)" : "var(--myr-hair)",
          background: dark ? "rgba(43,107,138,0.18)" : "var(--myr-paper-2)",
        }}
        role="status"
        aria-live="polite"
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.28em] mb-2"
          style={{ color: dark ? "var(--myr-teal-lt)" : "var(--myr-teal)" }}
        >
          You&apos;re on the list
        </p>
        <p
          className="text-[15px] leading-relaxed"
          style={{ color: dark ? "rgba(252,252,253,0.86)" : "var(--myr-ink)" }}
        >
          We&apos;ll reach out when your seat opens. No spam, just the launch.
        </p>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-lg px-4 py-3 text-[15px] outline-none transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-3"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={emailId} className="sr-only">
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
          placeholder="you@company.com"
          disabled={status === "loading"}
          className={`myr-input ${inputBase}`}
          data-variant={variant}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="myr-cta rounded-lg px-6 py-3 text-[14px] font-medium tracking-[0.01em] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : "Get early access"}
      </button>

      <p
        className="text-[12.5px] leading-relaxed mt-0.5"
        style={{ color: dark ? "rgba(252,252,253,0.5)" : "var(--myr-muted)" }}
      >
        No spam. We&apos;ll email you when your seat is ready.
      </p>

      {status === "error" && (
        <p className="text-[13px]" style={{ color: "#c0492f" }} role="alert">
          {error}
        </p>
      )}

      <style jsx>{`
        .myr-input {
          background: ${dark ? "rgba(252,252,253,0.06)" : "#ffffff"};
          border: 1px solid
            ${dark ? "rgba(252,252,253,0.18)" : "var(--myr-hair)"};
          color: ${dark ? "#FCFCFD" : "var(--myr-ink)"};
          color-scheme: ${dark ? "dark" : "light"};
        }
        .myr-input::placeholder {
          color: ${dark ? "rgba(252,252,253,0.4)" : "var(--myr-faint)"};
        }
        .myr-input:focus {
          border-color: var(--myr-teal-lt);
          box-shadow: 0 0 0 3px rgba(74, 157, 184, 0.18);
        }
        .myr-cta {
          background: var(--myr-teal);
          color: #fcfcfd;
          border: 1px solid var(--myr-teal);
          cursor: pointer;
        }
        .myr-cta:hover:not(:disabled) {
          background: var(--myr-teal-dk);
          border-color: var(--myr-teal-dk);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px -8px rgba(43, 107, 138, 0.6);
        }
        .myr-cta:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </form>
  );
}
