"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

// All surfaces are void-black under Starstruck; the variant prop stays
// for call-site compatibility. `glint` gives the submit button the full
// sweeping prismatic flare (hero CTA only; the light passes over the
// chrome, the chrome never moves).
export default function EarlyAccessForm({
  id,
  variant = "dark",
  glint = false,
}: {
  id?: string;
  variant?: "light" | "dark";
  glint?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const emailId = id ? `${id}-email` : "myr-email";

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
        className="myr-form-success w-full rounded-xl px-5 py-5"
        role="status"
        aria-live="polite"
      >
        <p className="myr-form-success-ey font-mono text-[11px] uppercase tracking-[0.28em] mb-2">
          You&apos;re on the list
        </p>
        <p className="myr-form-success-body text-[15px] leading-relaxed">
          We&apos;ll reach out when your seat opens. No spam, just the launch.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-3"
      noValidate
      data-variant={variant}
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
          className="myr-input w-full rounded-lg px-4 py-3 text-[15px] outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className={`myr-cta${glint ? " myr-cta-glint" : ""} px-6 py-3 text-[14px] font-medium tracking-[0.01em] disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {status === "loading" ? "Sending…" : "Get early access"}
      </button>

      <p className="myr-form-note text-[12.5px] leading-relaxed mt-0.5">
        No spam. We&apos;ll email you when your seat is ready.
      </p>

      {status === "error" && (
        <p className="text-[13px]" style={{ color: "#ff9d8a" }} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
