"use client";

import { useState } from "react";

const CMD = "npx myrmidocs connect <your-workspace-url>";

export default function AgentSnippet() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="myr-snippet">
      <p className="myr-snippet-label font-mono">
        Teach your agent in one paste.
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="myr-snippet-row font-mono"
        aria-label={copied ? "Copied to clipboard" : "Click to copy connect command"}
      >
        <span className="myr-snippet-prompt" aria-hidden="true">
          $
        </span>
        <span className="myr-snippet-cmd">{CMD}</span>
        <span className="myr-snippet-copy" aria-live="polite">
          {copied ? "copied" : "copy"}
        </span>
      </button>
      <p className="myr-snippet-foot">
        Paste this and your agent learns Myr. Sign in to get its key.
      </p>

      <style jsx>{`
        .myr-snippet {
          margin-top: 32px;
          max-width: 580px;
        }
        .myr-snippet-label {
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--myr-agent-text, #a9cfff);
          margin-bottom: 10px;
        }
        /* iridescent hairline border: the mockup's gradient border-box trick */
        .myr-snippet-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          background:
            linear-gradient(rgba(14, 17, 24, 0.8), rgba(11, 13, 19, 0.8))
              padding-box,
            conic-gradient(
                from 250deg,
                rgba(159, 200, 255, 0.32),
                rgba(255, 255, 255, 0.14) 25%,
                rgba(199, 157, 255, 0.26) 48%,
                rgba(255, 217, 163, 0.22) 70%,
                rgba(159, 200, 255, 0.32)
              )
              border-box;
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 12px 14px;
          cursor: pointer;
          transition: box-shadow 0.18s ease;
          text-align: left;
        }
        .myr-snippet-row:hover {
          box-shadow:
            -6px 0 14px -6px rgba(159, 200, 255, 0.35),
            6px 0 14px -6px rgba(255, 217, 163, 0.3);
        }
        .myr-snippet-prompt {
          color: var(--myr-agent-text, #a9cfff);
          font-size: 13px;
          flex-shrink: 0;
        }
        .myr-snippet-cmd {
          font-size: 13px;
          color: rgba(240, 242, 246, 0.92);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .myr-snippet-copy {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${copied ? "var(--myr-agent-text, #a9cfff)" : "rgba(233,235,239,0.38)"};
          flex-shrink: 0;
          transition: color 0.18s ease;
        }
        .myr-snippet-foot {
          font-size: 12.5px;
          color: rgba(233, 235, 239, 0.5);
          margin-top: 10px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
