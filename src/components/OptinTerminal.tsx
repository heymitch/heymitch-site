"use client";

import { useState } from "react";

/*
  Email opt-in — live-site metal plate aesthetic (metal-housing + metal-well + mini-crt + red physical button).
  Single line: arming toggles LEFT, email terminal CENTER, covered engine-start button RIGHT.
  Racing "arming" interaction: focus flips the cover up; each typing milestone arms a toggle
  (text -> ACC1, "@" -> ACC2, valid TLD -> ACC3); the red GO button pops live when the email is valid.
  Terminal is email-entry only; course messaging lives elsewhere.
  Submission continues to the live Scaling With Agents subscription page.
*/
export default function OptinTerminal() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);

  const t1 = email.length > 0;
  const t2 = email.includes("@");
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const t3 = valid;
  const coverOpen = focused || t1;
  const armed = valid;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!armed) return;
    window.location.assign(`https://aidispatch.substack.com/subscribe?email=${encodeURIComponent(email)}`);
  }

  const toggles = [
    { on: t1, c: "var(--sig-yellow)", label: "ACC1" },
    { on: t2, c: "var(--sig-teal)", label: "ACC2" },
    { on: t3, c: "var(--sig-green)", label: "ACC3" },
  ];

  return (
    <form onSubmit={submit} className="metal-housing w-full max-w-[600px] p-3">
      <div className="flex items-stretch gap-3">
          {/* arming toggles — LEFT */}
          <div className="metal-well flex items-end gap-3 px-3 py-3">
            {toggles.map((tg) => (
              <div key={tg.label} className="flex flex-col items-center gap-1.5">
                <span className={`tgl ${tg.on ? "on" : ""}`} style={{ ["--tgl-c" as string]: tg.c } as React.CSSProperties}>
                  <span className="pip" />
                  <span className="lever" />
                </span>
                <span className="font-mono text-[8px] tracking-[0.16em] uppercase text-ink/45">{tg.label}</span>
              </div>
            ))}
          </div>

          {/* email terminal — CENTER */}
          <div className="metal-well p-1.5 flex-1 flex items-center">
            <div className="mini-crt px-3 py-3 rounded-md w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase" style={{ color: "#ffb86c", opacity: 0.65 }}>// Email</span>
                <span className="led led-r" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm" style={{ color: "#ffb86c" }}>&gt;</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="you@domain.com"
                  aria-label="Your email"
                  className="flex-1 min-w-0 bg-transparent outline-none font-mono text-sm placeholder:text-[#ffb86c]/30"
                  style={{ color: "#ffb86c" }}
                />
              </div>
            </div>
          </div>

          {/* covered engine-start — RIGHT */}
          <div className="metal-well flex flex-col items-center justify-center gap-1.5 px-3 py-3">
            <div className="cover-wrap relative">
              <button
                type="submit"
                disabled={!armed}
                aria-label="Continue to newsletter subscription"
                className={`physical-btn physical-btn-red optin-go ${armed ? "armed" : ""}`}
              >
                <span className="physical-btn-shadow" />
                <span className="physical-btn-edge" />
                <span className="physical-btn-front font-mono text-[10px] font-bold tracking-[0.1em]">NEXT</span>
              </button>
              <div className={`flip-cover absolute -inset-[10px] ${coverOpen ? "open" : ""}`} />
            </div>
            <span className="font-mono text-[8px] tracking-[0.16em] uppercase text-ink/45">Start</span>
          </div>
      </div>

      <div className="flex items-center justify-between mt-3 px-1">
        <span className="font-mono text-[8px] tracking-[0.16em] uppercase text-ink/35">Scaling With Agents</span>
        <span className="font-mono text-[8px] tracking-[0.16em] uppercase text-ink/35">No spam · unsubscribe</span>
      </div>
    </form>
  );
}
