"use client";

export default function SubstackEmbed() {
  return (
    <div className="w-full max-w-[480px]">
      <iframe
        src="https://aidispatch.substack.com/embed"
        width="480"
        height="320"
        style={{ border: "1px solid #EEE", background: "white", maxWidth: "100%" }}
        frameBorder={0}
        scrolling="no"
        title="Subscribe to AI Dispatch"
      />
    </div>
  );
}
