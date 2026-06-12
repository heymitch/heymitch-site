// Starstruck browser-window frame for launch demo clips (live typing,
// editing, agent interactions, multiplayer). Drop a <video>, <iframe>,
// or <img> in as children and it fills the stage; with no children it
// renders a static faux-editor placeholder so the frame reads as alive
// in screenshots.
export default function DemoStage({
  url = "myr.heymitch.ai",
  children,
}: {
  url?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="myr-stage-wrap">
      <figure className="myr-stage">
        <span className="myr-stage-coord font-mono" aria-hidden="true">
          stage 01
        </span>
        <div className="myr-stage-frame">
          <div className="myr-stage-chrome" aria-hidden="true">
            <span className="myr-stage-dot" />
            <span className="myr-stage-dot" />
            <span className="myr-stage-dot" />
            <span className="myr-stage-url">{url}</span>
          </div>
          <div className="myr-stage-body">{children ?? <StagePlaceholder />}</div>
        </div>
      </figure>
      <p className="myr-stage-note">live demo clips land here at launch</p>
    </div>
  );
}

function StagePlaceholder() {
  return (
    <div className="myr-stage-doc" aria-hidden="true">
      <h3 className="myr-stage-h1">Starfall: launch plan</h3>
      <div className="myr-stage-meta">
        <span>
          Edited by <span className="myr-agent-name">✦ wingman</span>
        </span>
        <span className="myr-pip">·</span>
        <span>2 min ago</span>
        <span className="myr-pip">·</span>
        <span>v14</span>
      </div>
      <span className="myr-agent-pill">
        <span>✦</span>ai:wingman
      </span>
      <p>
        Ship the public beta while the iron is hot.{" "}
        <span className="myr-proof-agent">
          Every edit in this doc is signed, human or agent, and you can see
          exactly who wrote what.
        </span>{" "}
        That is the whole reason agents can be trusted in a shared doc at all.
      </p>
      <p>
        <span className="myr-proof-human">
          Love it. Hold the invite email until Thursday, then send.
        </span>
        <span className="myr-stage-caret" />
      </p>
    </div>
  );
}
