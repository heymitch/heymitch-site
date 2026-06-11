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
          color: var(--myr-teal-lt);
          margin-bottom: 10px;
        }
        .myr-snippet-row {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          background: rgba(252, 252, 253, 0.06);
          border: 1px solid rgba(252, 252, 253, 0.15);
          border-radius: 8px;
          padding: 12px 14px;
          cursor: pointer;
          transition: border-color 0.18s ease, background 0.18s ease;
          text-align: left;
        }
        .myr-snippet-row:hover {
          background: rgba(74, 157, 184, 0.1);
          border-color: var(--myr-teal-lt);
        }
        .myr-snippet-prompt {
          color: var(--myr-teal-lt);
          font-size: 13px;
          flex-shrink: 0;
        }
        .myr-snippet-cmd {
          font-size: 13px;
          color: rgba(252, 252, 253, 0.88);
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .myr-snippet-copy {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${copied ? "var(--myr-teal-lt)" : "rgba(252,252,253,0.38)"};
          flex-shrink: 0;
          transition: color 0.18s ease;
        }
        .myr-snippet-foot {
          font-size: 12.5px;
          color: rgba(252, 252, 253, 0.46);
          margin-top: 10px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
